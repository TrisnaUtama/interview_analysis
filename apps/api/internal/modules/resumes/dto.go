package resumes

import (
	"ai-interview-api/internal/entities"
	"encoding/json"
	"time"
)

type ResumeResponse struct {
	ID             string     `json:"id"`
	UserID         string     `json:"user_id"`
	FileURL        *string    `json:"file_url"`
	RawText        *string    `json:"raw_text"`
	ParsedData     *string    `json:"parsed_data"`
	AnalysisStatus string     `json:"analysis_status"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
	DeletedAt      *time.Time `json:"deleted_at"`
}

type UpdateResumeRequest struct {
	FileURL        string                     `json:"file_url"`
	RawText        string                     `json:"raw_text"`
	ParsedData     string                     `json:"parsed_data"`
	AnalysisStatus entities.JobAnalysisStatus `json:"analysis_status"`
}

type CallbackResumeRequest struct {
	RawText    string          `json:"raw_text"`
	ParsedData json.RawMessage `json:"parsed_data"`
	Status     string          `json:"status"`
	Error      string          `json:"error"`
}

func toResumeResponse(r *entities.Resumes) ResumeResponse {
	return ResumeResponse{
		ID:             r.ID,
		UserID:         r.UserId,
		FileURL:        r.FileUrl,
		RawText:        r.RawText,
		ParsedData:     r.ParsedData,
		AnalysisStatus: string(r.AnalysisStatus),
		CreatedAt:      r.CreatedAt,
		UpdatedAt:      r.UpdatedAt,
		DeletedAt:      r.DeletedAt,
	}
}
