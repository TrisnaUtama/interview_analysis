package jobs

import (
	"ai-interview-api/internal/middlewares"
	"ai-interview-api/pkg/logger"
	"ai-interview-api/pkg/response"
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

// POST /api/v1/jobs
func (h *Handler) InsertJob(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok || userID == "" {
		response.Error(w, r, http.StatusUnauthorized, "error.unauthorized")
		return
	}

	var req CreateJobRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, http.StatusBadRequest, "error.invalid_request")
		return
	}

	if req.CompanyName == "" || req.Position == "" || req.SourceType == "" {
		response.Error(w, r, http.StatusBadRequest, "error.invalid_request")
		return
	}

	if req.SourceType != "manual" && req.SourceType != "url" {
		response.Error(w, r, http.StatusBadRequest, "error.invalid_request")
		return
	}

	job, err := h.service.InsertJob(r.Context(), req, userID)
	if err != nil {
		if err.Error() == "raw_text is required for manual source" ||
			err.Error() == "source_url is required for url source" {
			response.Error(w, r, http.StatusBadRequest, "error.invalid_request")
			return
		}
		logger.Error("insert job failed", zap.Error(err))
		response.Error(w, r, http.StatusInternalServerError, "error.internal")
		return
	}

	response.Success(w, r, http.StatusCreated, "jobs.created", job)
}

// GET /api/v1/jobs
func (h *Handler) GetJobs(w http.ResponseWriter, r *http.Request) {
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

	jobs, meta, err := h.service.GetJobs(r.Context(), page, limit)
	if err != nil {
		logger.Error("get jobs failed", zap.Error(err))
		response.Error(w, r, http.StatusInternalServerError, "error.internal")
		return
	}

	response.Paginated(w, r, http.StatusOK, "jobs.list", jobs, *meta)
}

// GET /api/v1/jobs/{id}
func (h *Handler) GetOneJob(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		response.Error(w, r, http.StatusBadRequest, "error.invalid_request")
		return
	}

	job, err := h.service.GetOneJob(r.Context(), id)
	if err != nil {
		logger.Error("get one job failed", zap.Error(err))
		response.Error(w, r, http.StatusInternalServerError, "error.internal")
		return
	}
	if job == nil {
		response.Error(w, r, http.StatusNotFound, "error.not_found")
		return
	}

	response.Success(w, r, http.StatusOK, "jobs.detail", job)
}

// DELETE /api/v1/jobs/{id}
func (h *Handler) DeleteJob(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		response.Error(w, r, http.StatusBadRequest, "error.invalid_request")
		return
	}

	err := h.service.DeleteJob(r.Context(), id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			response.Error(w, r, http.StatusNotFound, "error.not_found")
			return
		}
		logger.Error("delete job failed", zap.Error(err))
		response.Error(w, r, http.StatusInternalServerError, "error.internal")
		return
	}

	response.Success(w, r, http.StatusOK, "jobs.deleted", nil)
}

// PATCH /internal/jobs/{id}/analysis
func (h *Handler) InternalAnalysisCallback(w http.ResponseWriter, r *http.Request) {
	jobDescriptionID := chi.URLParam(r, "id")
	if jobDescriptionID == "" {
		response.Error(w, r, http.StatusBadRequest, "error.invalid_request")
		return
	}

	var req AnalysisCallbackRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, http.StatusBadRequest, "error.invalid_request")
		return
	}

	req.JobDescriptionID = jobDescriptionID

	if err := h.service.HandleAnalysisCallback(r.Context(), req); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			response.Error(w, r, http.StatusNotFound, "error.not_found")
			return
		}
		logger.Error("analysis callback failed", zap.Error(err))
		response.Error(w, r, http.StatusInternalServerError, "error.internal")
		return
	}

	response.Success(w, r, http.StatusOK, "jobs.analysis_updated", nil)
}
