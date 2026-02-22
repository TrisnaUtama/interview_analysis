package question_banks

import (
	"ai-interview-api/internal/configs"
	"ai-interview-api/pkg/response"
	"context"
	"math"
)

type Service interface {
	InsertQuestion(ctx context.Context, payload CreateQuestionBankRequest) (*QuestionBankResponse, error)
	UpdateQuestion(ctx context.Context, id string, payload UpdateQuestionBankRequest) (*QuestionBankResponse, error)
	GetQuestions(ctx context.Context, page, limit int) ([]*QuestionBankResponse, response.PaginationMeta, error)
	GetQuestion(ctx context.Context, id string) (*QuestionBankResponse, error)
	DeleteQuestion(ctx context.Context, id string) error
}

type service struct {
	repo Repository
	cfg  *configs.Setting
}

func NewService(repo Repository, cfg *configs.Setting) Service {
	return &service{repo: repo, cfg: cfg}
}

func (s *service) InsertQuestion(ctx context.Context, payload CreateQuestionBankRequest) (*QuestionBankResponse, error) {
	return s.repo.InsertQuestion(ctx, payload)
}

func (s *service) UpdateQuestion(ctx context.Context, id string, payload UpdateQuestionBankRequest) (*QuestionBankResponse, error) {
	return s.repo.UpdateQuestion(ctx, id, payload)
}

func (s *service) GetQuestions(ctx context.Context, page, limit int) ([]*QuestionBankResponse, response.PaginationMeta, error) {
	offset := (page - 1) * limit

	questions, total, err := s.repo.GetQuestions(ctx, limit, offset)
	if err != nil {
		return nil, response.PaginationMeta{}, err
	}

	meta := response.PaginationMeta{
		Page:       page,
		Limit:      limit,
		TotalItems: total,
		TotalPages: int(math.Ceil(float64(total) / float64(limit))),
	}

	return questions, meta, nil
}

func (s *service) GetQuestion(ctx context.Context, id string) (*QuestionBankResponse, error) {
	return s.repo.GetQuestion(ctx, id)
}

func (s *service) DeleteQuestion(ctx context.Context, id string) error {
	return s.repo.DeleteQuestion(ctx, id)
}
