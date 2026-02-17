package main

import (
	"fmt"
	"log"
	"net/http"

	"ai-interview-api/internal/configs"
	postgres "ai-interview-api/internal/database"
	"ai-interview-api/internal/server"
	"ai-interview-api/pkg/i18n"
	"ai-interview-api/pkg/logger"

	"go.uber.org/zap"
)

func main() {
	cfg, err := configs.NewSetting()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	logger.Init(cfg.App.Env)
	defer logger.Log.Sync()

	if err := i18n.Init("pkg/i18n/locales", "en"); err != nil {
		logger.Fatal("failed to init i18n", zap.Error(err))
	}

	db, err := postgres.NewPostgresConn(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to DB: %v", err)
	}
	defer db.Close()

	srv := server.New(cfg, db)

	serverAddr := fmt.Sprintf(":%d", cfg.App.Port)
	log.Printf("Server is running on http://localhost%s", serverAddr)
	log.Printf("Docs available on http://localhost%s/docs", serverAddr)
	log.Printf("Environment: %s", cfg.App.Env)

	err = http.ListenAndServe(serverAddr, srv.Handler())
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
