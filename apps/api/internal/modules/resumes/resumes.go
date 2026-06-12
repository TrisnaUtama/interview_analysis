package resumes

import (
	"ai-interview-api/internal/configs"
	"ai-interview-api/internal/middlewares"
	httpclient "ai-interview-api/pkg/http"
	"ai-interview-api/pkg/minio"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Init(r chi.Router, db *pgxpool.Pool, cfg *configs.Setting, minio *minio.MinioClient, aiClient *httpclient.ResumeClient) {
	repo := NewRepository(db)
	service := NewService(repo, cfg, minio, aiClient)
	handler := NewHandler(service, cfg)

	r.Route("/internal/resumes", func(r chi.Router) {
		r.Use(middlewares.InternalOnly(cfg.App.Key))
		r.Post("/{id}/callback", handler.Callback)
	})
	r.Route("/resumes", func(r chi.Router) {
		r.Use(middlewares.JWTAuth(cfg))
		r.Post("/", handler.Upload)
		r.Get("/", handler.GetByUserID)
		r.Get("/{id}", handler.GetByID)
		r.Get("/{id}/stream", handler.StatusStream)
		r.Delete("/{id}", handler.Delete)
	})
}
