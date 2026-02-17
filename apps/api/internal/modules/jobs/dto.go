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
