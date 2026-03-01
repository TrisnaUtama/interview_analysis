package httpclient

import (
	"context"
	"time"
)

type AIClient struct {
	client *Client
}

func NewAIClient(baseURL, apiKey string) *AIClient {
	return &AIClient{
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

func (a *AIClient) AnalyzeResume(ctx context.Context, resumeID, filePath string) error {
	var result map[string]any

	_, err := a.client.Post(ctx, "resumes/analyze", AnalyzeResumeRequest{
		ResumeID: resumeID,
		FilePath: filePath,
	}, &result)

	return err
}
