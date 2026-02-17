// middlewares/jwt.go
package middlewares

import (
	"ai-interview-api/internal/configs"
	"ai-interview-api/pkg/jwt"
	"ai-interview-api/pkg/response"
	"context"
	"net/http"
)

type contextKey string

const UserIDKey contextKey = "UserId"

func JWTAuth(cfg *configs.Setting) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			cookie, err := r.Cookie("access_token")
			if err != nil {
				response.Error(w, r, http.StatusUnauthorized, "error.unauthorized")
				return
			}

			claims, err := jwt.ValidateToken(cookie.Value, cfg.App.Key)
			if err != nil {
				response.Error(w, r, http.StatusUnauthorized, "error.unauthorized")
				return
			}

			ctx := context.WithValue(r.Context(), UserIDKey, claims.UserID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
