package auth

import (
	"ai-interview-api/internal/configs"

	authMiddleware "ai-interview-api/internal/middlewares"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Init(r chi.Router, db *pgxpool.Pool, cfg *configs.Setting) {
	repo := NewRepository(db)
	service := NewService(repo, cfg)
	handler := NewHandler(service)

	r.Route("/auth", func(r chi.Router) {
		r.Get("/google", handler.GoogleLogin)
		r.Get("/google/callback", handler.GoogleCallback)
		r.Post("/refresh", handler.RefreshToken)
		r.Post("/logout", handler.Logout)
		r.Group(func(r chi.Router) {
			r.Use(authMiddleware.JWTAuth(cfg))
			r.Get("/me", handler.Me)
		})
	})

}
