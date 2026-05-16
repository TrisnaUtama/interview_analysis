package resumes

import (
	"ai-interview-api/internal/configs"
	"ai-interview-api/internal/middlewares"
	"ai-interview-api/pkg/response"
	"encoding/json"
	"net/http"
	"path/filepath"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type Handler struct {
	service Service
	cfg     *configs.Setting
}

func NewHandler(service Service, cfg *configs.Setting) *Handler {
	return &Handler{service: service, cfg: cfg}
}

func (h *Handler) Upload(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middlewares.UserIDKey).(string)

	if err := r.ParseMultipartForm(10 << 20); err != nil {
		response.Error(w, r, http.StatusBadRequest, "error.file_too_large")
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		response.Error(w, r, http.StatusBadRequest, "error.file_required")
		return
	}
	defer file.Close()

	if !isAllowedFile(header.Filename) {
		response.Error(w, r, http.StatusBadRequest, "error.file_type_not_allowed")
		return
	}

	resume, err := h.service.Upload(r.Context(), userID, file, header)
	if err != nil {
		response.Error(w, r, http.StatusInternalServerError, "error.upload_failed")
		return
	}

	response.Success(w, r, http.StatusAccepted, "success.resume_processing", toResumeResponse(resume))
}

func (h *Handler) Callback(w http.ResponseWriter, r *http.Request) {
	secret := r.Header.Get("X-Internal-Secret")
	if secret != h.cfg.App.Key {
		response.Error(w, r, http.StatusUnauthorized, "error.unauthorized")
		return
	}

	id := chi.URLParam(r, "id")

	var payload CallbackResumeRequest
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		response.Error(w, r, http.StatusBadRequest, "error.invalid_request")
		return
	}

	if err := h.service.HandleCallback(r.Context(), id, payload); err != nil {
		response.Error(w, r, http.StatusInternalServerError, "error.callback_failed")
		return
	}

	response.Success(w, r, http.StatusOK, "success.callback_processed", nil)
}

func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	resume, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		response.Error(w, r, http.StatusNotFound, "error.resume_not_found")
		return
	}

	response.Success(w, r, http.StatusOK, "success.resume_found", toResumeResponse(resume))
}

func (h *Handler) GetByUserID(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middlewares.UserIDKey).(string)

	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 10
	}

	offset := (page - 1) * limit

	resumes, total, err := h.service.GetByUserID(r.Context(), userID, limit, offset)
	if err != nil {
		response.Error(w, r, http.StatusInternalServerError, "error.internal")
		return
	}

	items := make([]ResumeResponse, 0, len(resumes))
	for _, resume := range resumes {
		items = append(items, toResumeResponse(resume))
	}

	totalPages := total / limit
	if total%limit != 0 {
		totalPages++
	}

	response.Paginated(w, r, http.StatusOK, "success.resume_list", items, response.PaginationMeta{
		Page:       page,
		Limit:      limit,
		TotalItems: total,
		TotalPages: totalPages,
	})
}

func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	if err := h.service.Delete(r.Context(), id); err != nil {
		response.Error(w, r, http.StatusInternalServerError, "error.internal")
		return
	}

	response.Success(w, r, http.StatusOK, "success.resume_deleted", nil)
}

func isAllowedFile(filename string) bool {
	allowed := map[string]bool{
		".pdf":  true,
		".doc":  true,
		".docx": true,
	}
	return allowed[filepath.Ext(filename)]
}
