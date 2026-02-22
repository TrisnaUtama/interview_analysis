package question_banks

import (
	"ai-interview-api/pkg/logger"
	"ai-interview-api/pkg/response"
	"ai-interview-api/pkg/validator"
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

// POST /api/v1/question-banks
func (h *Handler) CreateQuestion(w http.ResponseWriter, r *http.Request) {
	var req CreateQuestionBankRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, http.StatusBadRequest, "error.invalid_request")
		return
	}

	if errs := validator.Validate(req); errs != nil {
		response.ValidationError(w, r, errs)
		return
	}

	result, err := h.service.InsertQuestion(r.Context(), req)
	if err != nil {
		logger.Error("create question failed", zap.Error(err))
		response.Error(w, r, http.StatusInternalServerError, "error.internal")
		return
	}

	response.Success(w, r, http.StatusCreated, "question_banks.created", result)
}

// PATCH /api/v1/question-banks/{id}
func (h *Handler) UpdateQuestion(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		response.Error(w, r, http.StatusBadRequest, "error.invalid_request")
		return
	}

	var req UpdateQuestionBankRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, http.StatusBadRequest, "error.invalid_request")
		return
	}

	if errs := validator.Validate(req); errs != nil {
		response.ValidationError(w, r, errs)
		return
	}

	result, err := h.service.UpdateQuestion(r.Context(), id, req)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			response.Error(w, r, http.StatusNotFound, "error.not_found")
			return
		}
		logger.Error("update question failed", zap.Error(err))
		response.Error(w, r, http.StatusInternalServerError, "error.internal")
		return
	}

	response.Success(w, r, http.StatusOK, "question_banks.updated", result)
}

// GET /api/v1/question-banks
func (h *Handler) GetQuestions(w http.ResponseWriter, r *http.Request) {
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 10
	}

	questions, meta, err := h.service.GetQuestions(r.Context(), page, limit)
	if err != nil {
		logger.Error("get questions failed", zap.Error(err))
		response.Error(w, r, http.StatusInternalServerError, "error.internal")
		return
	}

	response.Paginated(w, r, http.StatusOK, "question_banks.list", questions, meta)
}

// GET /api/v1/question-banks/{id}
func (h *Handler) GetQuestion(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		response.Error(w, r, http.StatusBadRequest, "error.invalid_request")
		return
	}

	result, err := h.service.GetQuestion(r.Context(), id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			response.Error(w, r, http.StatusNotFound, "error.not_found")
			return
		}
		logger.Error("get question failed", zap.Error(err))
		response.Error(w, r, http.StatusInternalServerError, "error.internal")
		return
	}

	response.Success(w, r, http.StatusOK, "question_banks.detail", result)
}

// DELETE /api/v1/question-banks/{id}
func (h *Handler) DeleteQuestion(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		response.Error(w, r, http.StatusBadRequest, "error.invalid_request")
		return
	}

	err := h.service.DeleteQuestion(r.Context(), id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			response.Error(w, r, http.StatusNotFound, "error.not_found")
			return
		}
		logger.Error("delete question failed", zap.Error(err))
		response.Error(w, r, http.StatusInternalServerError, "error.internal")
		return
	}

	response.Success(w, r, http.StatusOK, "question_banks.deleted", nil)
}
