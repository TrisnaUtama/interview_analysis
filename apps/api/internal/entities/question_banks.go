package entities

import "time"

type QuestionBank struct {
	ID                  string
	Type                string
	Source              string
	Category            *string
	Difficulty          *string
	QuestionTextId      string
	QuestionTextEn      string
	Tags                []string
	IsOpeningQuestion   bool
	RelevanceScore      *float64
	GenerationReasoning *string
	CreatedAt           time.Time
	UpdatedAt           time.Time
	DeletedAt           *time.Time
}
