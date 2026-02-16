package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"ai-interview-api/internal/configs"
	postgres "ai-interview-api/internal/database"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	cfg, err := configs.NewSetting()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	db, err := postgres.NewPostgresConn(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to DB: %v", err)
	}
	defer db.Close()

	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Welcome to AI Interview API"))
	})

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
		defer cancel()

		if err := db.HealthCheck(ctx); err != nil {
			log.Printf("Health check failed: %v", err)
			w.WriteHeader(http.StatusServiceUnavailable)
			w.Write([]byte(" Database is down"))
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status": "healthy", "database": "connected"}`))
	})

	serverAddr := fmt.Sprintf(":%d", cfg.App.Port)
	log.Printf("Server is running on http://localhost%s", serverAddr)
	log.Printf("Environment: %s", cfg.App.Env)

	err = http.ListenAndServe(serverAddr, r)
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
