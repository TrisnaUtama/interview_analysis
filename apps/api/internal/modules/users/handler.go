package users

import "net/http"

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

// Example:
// func (h *Handler) List(w http.ResponseWriter, r *http.Request) {}

 var _ *http.Request // prevent unused import
