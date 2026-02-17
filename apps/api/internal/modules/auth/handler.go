package auth

import (
	"net/http"

	"ai-interview-api/internal/middlewares"
	"ai-interview-api/pkg/logger"
	"ai-interview-api/pkg/response"

	"go.uber.org/zap"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

// Get /api/v1/auth/me
func (h *Handler) Me(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok || userID == "" {
		response.Error(w, r, http.StatusUnauthorized, "error.unauthorized")
		return
	}

	user, err := h.service.GetMe(r.Context(), userID)
	if err != nil {
		logger.Error("get me failed", zap.Error(err))
		response.Error(w, r, http.StatusNotFound, "error.not_found")
		return
	}

	response.Success(w, r, http.StatusOK, "auth.me", toUserResponse(user))
}

// GET /api/v1/auth/google
func (h *Handler) GoogleLogin(w http.ResponseWriter, r *http.Request) {
	state := "random-state"
	url := h.service.GetGoogleAuthURL(state)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

// GET /api/v1/auth/google/callback
func (h *Handler) GoogleCallback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	if code == "" {
		response.Error(w, r, http.StatusBadRequest, "error.invalid_request")
		return
	}

	_, accessToken, refreshToken, err := h.service.HandleGoogleCallback(r.Context(), code)
	if err != nil {
		logger.Error("google callback failed", zap.Error(err))
		response.Error(w, r, http.StatusInternalServerError, "error.internal")
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
		MaxAge:   15 * 60,
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		Path:     "/api/v1/auth/refresh",
		MaxAge:   7 * 24 * 60 * 60,
	})

	http.Redirect(w, r, h.service.GetFrontendURL()+"/dashboard", http.StatusTemporaryRedirect)
}

// POST /api/v1/auth/refresh
func (h *Handler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	refreshCookie, err := r.Cookie("refresh_token")
	if err != nil {
		response.Error(w, r, http.StatusUnauthorized, "error.unauthorized")
		return
	}

	accessToken, err := h.service.RefreshAccessToken(r.Context(), refreshCookie.Value)
	if err != nil {
		logger.Error("refresh token failed", zap.Error(err))
		response.Error(w, r, http.StatusUnauthorized, "auth.invalid_token")
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
		MaxAge:   15 * 60,
	})

	response.Success(w, r, http.StatusOK, "auth.token_refreshed", nil)
}

// POST /api/v1/auth/logout
func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	refreshCookie, err := r.Cookie("refresh_token")
	if err == nil {
		if err := h.service.Logout(r.Context(), refreshCookie.Value); err != nil {
			logger.Error("logout failed", zap.Error(err))
		}
	}

	http.SetCookie(w, &http.Cookie{
		Name:   "access_token",
		Value:  "",
		MaxAge: -1,
		Path:   "/",
	})
	http.SetCookie(w, &http.Cookie{
		Name:   "refresh_token",
		Value:  "",
		MaxAge: -1,
		Path:   "/api/v1/auth/refresh",
	})

	response.Success(w, r, http.StatusOK, "auth.logout_success", nil)
}
