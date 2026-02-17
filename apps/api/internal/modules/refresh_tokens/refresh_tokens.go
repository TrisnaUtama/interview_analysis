package refresh_tokens

import (
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"ai-interview-api/internal/configs"
)

func Init(r chi.Router, db *pgxpool.Pool, cfg *configs.Setting) {
	repo    := NewRepository(db)
	service := NewService(repo, cfg)
	handler := NewHandler(service)

	r.Route("/refresh_tokens", func(r chi.Router) {
		_ = handler
	})
}
