package middlewares

import (
	"ai-interview-api/pkg/jwt"
	"ai-interview-api/pkg/response"
	"net/http"
)

func VerifyUser(role string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			claims, ok := r.Context().Value(ClaimsKey).(*jwt.Claims)
			if !ok || claims == nil {
				response.Error(w, r, http.StatusUnauthorized, "error.unauthorized")
				return
			}

			if claims.Role != role {
				response.Error(w, r, http.StatusForbidden, "error.forbidden")
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
