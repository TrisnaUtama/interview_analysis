package jobs

import "time"

type CreateJobRequest struct {
	CompanyName string  `json:"company_name"`
	Position    string  `json:"position"`
	SourceType  string  `json:"source_type"`
	RawText     *string `json:"raw_text"`
	SourceURL   *string `json:"source_url"`
}

type JobKeywordResponse struct {
	ID      string   `json:"id"`
	Keyword string   `json:"keyword"`
	Weight  *float64 `json:"weight,omitempty"`
	Type    string   `json:"type"`
}

type KeywordPayload struct {
	Keyword string  `json:"keyword"`
	Weight  float64 `json:"weight"`
	Type    string  `json:"type"`
}

type JobDescriptionResponse struct {
	ID             string  `json:"id"`
	SourceType     string  `json:"source_type"`
	SourceURL      *string `json:"source_url,omitempty"`
	RawText        *string `json:"raw_text,omitempty"`
	ParsedText     *string `json:"parsed_text,omitempty"`
	AnalysisStatus string  `json:"analysis_status"`
}

type JobResponse struct {
	ID          string                  `json:"id"`
	CompanyName string                  `json:"company_name"`
	Position    string                  `json:"position"`
	CreatedAt   time.Time               `json:"created_at"`
	Description *JobDescriptionResponse `json:"description,omitempty"`
	Keywords    []JobKeywordResponse    `json:"keywords"`
}

type AnalysisCallbackRequest struct {
	JobDescriptionID string           `json:"job_description_id"`
	RawText          string           `json:"raw_text"`
	ParsedText       string           `json:"parsed_text"`
	Keywords         []KeywordPayload `json:"keywords"`
	Summary          *string          `json:"summary,omitempty"`
	Status           string           `json:"status"`
	Error            *string          `json:"error,omitempty"`
}

type aiProcessPayload struct {
	JobDescriptionID string  `json:"job_description_id"`
	JobID            string  `json:"job_id"`
	SourceType       string  `json:"source_type"`
	SourceURL        *string `json:"source_url,omitempty"`
	RawText          *string `json:"raw_text,omitempty"`
}
