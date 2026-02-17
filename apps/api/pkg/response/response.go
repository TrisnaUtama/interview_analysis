package response

import (
	"encoding/json"
	"net/http"

	"ai-interview-api/pkg/i18n"
)

type Response struct {
	Success bool   `json:"success"`
	Message string `json:"message,omitempty"`
	Data    any    `json:"data,omitempty"`
	Error   string `json:"error,omitempty"`
}

func JSON(w http.ResponseWriter, statusCode int, payload Response) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(payload)
}

func Success(w http.ResponseWriter, r *http.Request, statusCode int, msgKey string, data any) {
	locale := i18n.GetLocale(r.Header.Get("Accept-Language"))
	JSON(w, statusCode, Response{
		Success: true,
		Message: i18n.T(locale, msgKey),
		Data:    data,
	})
}

func Error(w http.ResponseWriter, r *http.Request, statusCode int, msgKey string) {
	locale := i18n.GetLocale(r.Header.Get("Accept-Language"))
	JSON(w, statusCode, Response{
		Success: false,
		Error:   i18n.T(locale, msgKey),
	})
}

func ValidationError(w http.ResponseWriter, r *http.Request, errors map[string]string) {
	locale := i18n.GetLocale(r.Header.Get("Accept-Language"))
	JSON(w, http.StatusUnprocessableEntity, Response{
		Success: false,
		Error:   i18n.T(locale, "error.invalid_request"),
		Data:    errors,
	})
}

type PaginationMeta struct {
	Page       int `json:"page"`
	Limit      int `json:"limit"`
	TotalItems int `json:"total_items"`
	TotalPages int `json:"total_pages"`
}

type PaginatedResponse struct {
	Items any            `json:"items"`
	Meta  PaginationMeta `json:"meta"`
}

func Paginated(w http.ResponseWriter, r *http.Request, statusCode int, msgKey string, items any, meta PaginationMeta) {
	Success(w, r, statusCode, msgKey, PaginatedResponse{
		Items: items,
		Meta:  meta,
	})
}
