package middlewares

import (
	"ai-interview-api/pkg/response"
	"net/http"
)

func InternalOnly(secret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			incoming := r.Header.Get("X-Internal-Secret")
			if incoming == "" || incoming != secret {
				response.Error(w, r, http.StatusUnauthorized, "error.unauthorized")
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
