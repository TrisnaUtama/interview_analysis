package configs

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	_ "github.com/joho/godotenv/autoload"
)

type Setting struct {
	App struct {
		Env         string
		Port        int
		Url         string
		Key         string
		FrontEndUrl string
	}
	Database struct {
		Host     string
		Port     int
		User     string
		Password string
		Name     string
		Schema   string
		ConnStr  string
	}
	Cors struct {
		AllowedOrigins []string
	}
	OAUTH struct {
		ClientId     string
		ClientSecret string
		RedirectUrl  string
	}
	AI struct {
		AiUrl  string
		ApiKey string
	}
	MINIO struct {
		Endpoint        string
		AccessKey       string
		SecretKey       string
		SSL             bool
		BucketInterview string
	}
}

func NewSetting() (*Setting, error) {
	s := &Setting{}

	// app
	s.App.Env = os.Getenv("ENV")
	s.App.Url = os.Getenv("BASE_URL")
	s.App.Key = os.Getenv("APP_KEY")
	s.App.FrontEndUrl = os.Getenv("FRONT_END_URL")

	cors := os.Getenv("CORS_ALLOWED_ORIGINS")

	if cors != "" {
		s.Cors.AllowedOrigins = strings.Split(cors, ",")
	}

	port, _ := strconv.Atoi(os.Getenv("PORT"))
	if port == 0 {
		port = 8080
	}
	s.App.Port = port

	// db
	s.Database.Host = os.Getenv("DB_HOST")
	s.Database.Name = os.Getenv("DB_NAME")
	s.Database.User = os.Getenv("DB_USER")
	s.Database.Password = os.Getenv("DB_PASS")
	s.Database.Schema = os.Getenv("DB_SCHEMA")

	dbPort, _ := strconv.Atoi(os.Getenv("DB_PORT"))
	if dbPort == 0 {
		dbPort = 5432
	}
	s.Database.Port = dbPort

	s.Database.ConnStr = fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%d sslmode=disable TimeZone=UTC",
		s.Database.Host, s.Database.User, s.Database.Password, s.Database.Name, s.Database.Port,
	)

	// oauth
	s.OAUTH.ClientId = os.Getenv("CLIENT_ID")
	s.OAUTH.ClientSecret = os.Getenv("CLIENT_SECRET")
	s.OAUTH.RedirectUrl = os.Getenv("GOOGLE_REDIRECT_URI")

	// ai
	s.AI.AiUrl = os.Getenv("AI_BASE_URL")
	s.AI.ApiKey = os.Getenv("AI_API_KEY")

	// minio
	s.MINIO.Endpoint = os.Getenv("MINIO_ENDPOINT")
	s.MINIO.AccessKey = os.Getenv("MINIO_ACCESS_KEY")
	s.MINIO.SecretKey = os.Getenv("MINIO_SECRET_KEY")
	s.MINIO.BucketInterview = os.Getenv("MINIO_BUCKET_INTERVIEW")
	return s, nil
}
