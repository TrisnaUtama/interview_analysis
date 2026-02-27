package resumes

import (
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"ai-interview-api/internal/configs"
)

func Init(r chi.Router, db *pgxpool.Pool, cfg *configs.Setting) {
	repo    := NewRepository(db)
	service := NewService(repo, cfg)
	handler := NewHandler(service)

	r.Route("/resumes", func(r chi.Router) {
		_ = handler
	})
}
