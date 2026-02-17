package jobs

import (
	"ai-interview-api/internal/configs"
	"ai-interview-api/pkg/logger"
	"ai-interview-api/pkg/response"
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"
)

type Service interface {
	InsertJob(ctx context.Context, req CreateJobRequest, created_by string) (*JobResponse, error)
	GetOneJob(ctx context.Context, id string) (*JobResponse, error)
	GetJobs(ctx context.Context, page, limit int) ([]*JobResponse, *response.PaginationMeta, error)
	DeleteJob(ctx context.Context, id string) error
}

type service struct {
	repo Repository
	cfg  *configs.Setting
}

func NewService(repo Repository, cfg *configs.Setting) Service {
	return &service{repo: repo, cfg: cfg}
}

func (s *service) InsertJob(ctx context.Context, req CreateJobRequest, createdBy string) (*JobResponse, error) {
	if req.SourceType == "manual" && (req.RawText == nil || *req.RawText == "") {
		return nil, fmt.Errorf("raw_text is required for manual source")
	}
	if req.SourceType == "url" && (req.SourceURL == nil || *req.SourceURL == "") {
		return nil, fmt.Errorf("source_url is required for url source")
	}

	job, err := s.repo.InsertJob(ctx, req.CompanyName, req.Position, createdBy)
	if err != nil {
		logger.Error("failed to insert job", zap.Error(err))
		return nil, err
	}

	jd, err := s.repo.InsertJobDescription(ctx, job.ID, req.SourceType, req.SourceURL, req.RawText)
	if err != nil {
		logger.Error("failed to insert job description", zap.Error(err))
		return nil, err
	}

	return &JobResponse{
		ID:          job.ID,
		CompanyName: job.CompanyName,
		Position:    *job.Position,
		CreatedAt:   job.CreatedAt,
		Description: &JobDescriptionResponse{
			ID:             jd.ID,
			SourceType:     jd.SourceType,
			SourceURL:      jd.SourceURL,
			RawText:        jd.RawText,
			AnalysisStatus: jd.AnalysisStatus,
		},
		Keywords: []JobKeywordResponse{},
	}, nil
}

func (s *service) GetOneJob(ctx context.Context, id string) (*JobResponse, error) {
	job, err := s.repo.GetOneJob(ctx, id)
	if err != nil {
		logger.Error("failed to get job", zap.Error(err))
		return nil, err
	}
	if job == nil {
		return nil, nil
	}
	return job, nil
}

func (s *service) GetJobs(ctx context.Context, page, limit int) ([]*JobResponse, *response.PaginationMeta, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	offset := (page - 1) * limit

	jobs, total, err := s.repo.GetJobs(ctx, limit, offset)
	if err != nil {
		logger.Error("failed to get jobs", zap.Error(err))
		return nil, nil, err
	}

	totalPages := (total + limit - 1) / limit

	meta := &response.PaginationMeta{
		Page:       page,
		Limit:      limit,
		TotalItems: total,
		TotalPages: totalPages,
	}

	return jobs, meta, nil
}

func (s *service) DeleteJob(ctx context.Context, id string) error {
	err := s.repo.DeleteJob(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return pgx.ErrNoRows
		}
		logger.Error("failed to delete job", zap.Error(err))
		return err
	}
	return nil
}
