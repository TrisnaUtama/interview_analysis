package resumes

import (
	"ai-interview-api/internal/configs"
	"ai-interview-api/internal/entities"
	httpclient "ai-interview-api/pkg/http"
	"ai-interview-api/pkg/logger"
	"ai-interview-api/pkg/minio"
	"context"
	"fmt"
	"mime/multipart"
	"time"

	"go.uber.org/zap"
)

type Service interface {
	Upload(ctx context.Context, userID string, file multipart.File, header *multipart.FileHeader) (*entities.Resumes, error)
	HandleCallback(ctx context.Context, id string, payload CallbackResumeRequest) error
	GetByID(ctx context.Context, id string) (*entities.Resumes, error)
	GetByUserID(ctx context.Context, userID string, limit, offset int) ([]*entities.Resumes, int, error)
	Delete(ctx context.Context, id string) error
}

type service struct {
	repo     Repository
	cfg      *configs.Setting
	minio    *minio.MinioClient
	resumeClient *httpclient.ResumeClient
}

func NewService(repo Repository, cfg *configs.Setting, minio *minio.MinioClient, resumeClient *httpclient.ResumeClient) Service {
	return &service{
		repo:     repo,
		cfg:      cfg,
		minio:    minio,
		resumeClient: resumeClient,
	}
}

func (s *service) Upload(ctx context.Context, userID string, file multipart.File, header *multipart.FileHeader) (*entities.Resumes, error) {
	resume := &entities.Resumes{
		UserId:         userID,
		AnalysisStatus: entities.JobAnalysisStatusPending,
	}
	if err := s.repo.Insert(ctx, resume); err != nil {
		return nil, fmt.Errorf("failed to create resume record: %w", err)
	}

	go s.processResume(resume.ID, userID, file, header)
	return resume, nil
}

func (s *service) processResume(resumeID, userID string, file multipart.File, header *multipart.FileHeader) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	result, err := s.minio.UploadResume(ctx, file, header, userID)
	if err != nil {
		logger.Error("failed to upload resume to minio",
			zap.String("resume_id", resumeID),
			zap.Error(err),
		)
		s.repo.Update(ctx, resumeID, UpdateResumeRequest{
			AnalysisStatus: entities.JobAnalysisStatusFailed,
		})
		return
	}

	if err := s.repo.Update(ctx, resumeID, UpdateResumeRequest{
		FileURL:        result.Filename,
		AnalysisStatus: entities.JobAnalysisStatusAnalyzing,
	}); err != nil {
		logger.Error("failed to update resume file_url",
			zap.String("resume_id", resumeID),
			zap.Error(err),
		)
		return
	}

	if err := s.resumeClient.AnalyzeResume(ctx, resumeID, result.Filename); err != nil {
		logger.Error("failed to send resume to AI service",
			zap.String("resume_id", resumeID),
			zap.Error(err),
		)
		s.repo.Update(ctx, resumeID, UpdateResumeRequest{
			AnalysisStatus: entities.JobAnalysisStatusFailed,
		})
		return
	}

	logger.Info("resume sent to AI service, waiting for callback",
		zap.String("resume_id", resumeID),
		zap.String("filename", result.Filename),
	)
}

func (s *service) HandleCallback(ctx context.Context, id string, payload CallbackResumeRequest) error {
	logger.Info("received callback from AI service",
		zap.String("resume_id", id),
		zap.String("status", payload.Status),
	)

	if payload.Status == "failed" {
		logger.Error("AI service failed to process resume",
			zap.String("resume_id", id),
			zap.String("error", payload.Error),
		)
		return s.repo.Update(ctx, id, UpdateResumeRequest{
			AnalysisStatus: entities.JobAnalysisStatusFailed,
		})
	}

	return s.repo.Update(ctx, id, UpdateResumeRequest{
		RawText:        payload.RawText,
		ParsedData:     string(payload.ParsedData),
		AnalysisStatus: entities.JobAnalysisStatusCompleted,
	})
}

func (s *service) GetByID(ctx context.Context, id string) (*entities.Resumes, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *service) GetByUserID(ctx context.Context, userID string, limit, offset int) ([]*entities.Resumes, int, error) {
	return s.repo.GetByUserID(ctx, userID, limit, offset)
}

func (s *service) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
