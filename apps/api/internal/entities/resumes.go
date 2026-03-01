package entities

import "time"

type Resumes struct {
	ID             string
	UserId         string
	FileUrl        *string
	RawText        *string
	ParsedData     *string
	AnalysisStatus JobAnalysisStatus
	CreatedAt      time.Time
	UpdatedAt      time.Time
	DeletedAt      *time.Time
}
