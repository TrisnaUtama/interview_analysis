package httpclient

import (
	"context"
	"time"
)

type ResumeClient struct {
	client *Client
}

func NewResumeClient(baseURL, apiKey string) *ResumeClient {
	return &ResumeClient{
		client: NewClient(baseURL,
			WithHeader("X-Internal-Secret", apiKey),
			WithTimeout(2*time.Minute),
		),
	}
}

type AnalyzeResumeRequest struct {
	ResumeID string `json:"resume_id"`
	FilePath string `json:"file_path"`
}

func (a *ResumeClient) AnalyzeResume(ctx context.Context, resumeID, filePath string) error {
	var result map[string]any

	_, err := a.client.Post(ctx, "resumes/analyze", AnalyzeResumeRequest{
		ResumeID: resumeID,
		FilePath: filePath,
	}, &result)

	return err
}
