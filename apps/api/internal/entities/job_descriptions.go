package entities

import "time"

type JobDescriptions struct {
	ID             string
	JobID          string
	SourceType     string
	SourceURL      *string
	RawText        *string
	ParsedText     *string
	AnalysisStatus string
	CreatedAt      time.Time
	UpdatedAt      time.Time
	DeletedAt      *time.Time
}
