package job_descriptions

import "ai-interview-api/internal/configs"

type Service interface{}

type service struct {
	repo Repository
	cfg  *configs.Setting
}

func NewService(repo Repository, cfg *configs.Setting) Service {
	return &service{repo: repo, cfg: cfg}
}
