package jobs

import (
	"ai-interview-api/internal/configs"
	"ai-interview-api/internal/middlewares"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Init(r chi.Router, db *pgxpool.Pool, cfg *configs.Setting) {
	repo := NewRepository(db)
	service := NewService(repo, cfg)
	handler := NewHandler(service)

	r.Route("/jobs", func(r chi.Router) {
		r.Use(middlewares.JWTAuth(cfg))
		r.Get("/", handler.GetJobs)
		r.Post("/", handler.InsertJob)
		r.Get("/{id}", handler.GetOneJob)
		r.Delete("/{id}", handler.DeleteJob)
	})
}
