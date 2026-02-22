package question_banks

import "time"

type CreateQuestionBankRequest struct {
	Type           string   `json:"type"             validate:"required,oneof=HR USER"`
	Category       *string  `json:"category"`
	Difficulty     *string  `json:"difficulty"       validate:"omitempty,oneof=easy medium hard"`
	QuestionTextId string   `json:"question_text_id" validate:"required"`
	QuestionTextEn string   `json:"question_text_en" validate:"required"`
	Tags           []string `json:"tags"`
}

type UpdateQuestionBankRequest struct {
	Category       *string  `json:"category"`
	Difficulty     *string  `json:"difficulty"       validate:"omitempty,oneof=easy medium hard"`
	QuestionTextId *string  `json:"question_text_id"`
	QuestionTextEn *string  `json:"question_text_en"`
	Tags           []string `json:"tags"`
}

type QuestionBankResponse struct {
	ID                  string    `json:"id"`
	Type                string    `json:"type"`
	Source              string    `json:"source"`
	Category            *string   `json:"category"`
	Difficulty          *string   `json:"difficulty"`
	QuestionTextId      string    `json:"question_text_id"`
	QuestionTextEn      string    `json:"question_text_en"`
	Tags                []string  `json:"tags"`
	IsOpeningQuestion   bool      `json:"is_opening_question"`
	RelevanceScore      *float64  `json:"relevance_score,omitempty"`
	GenerationReasoning *string   `json:"generation_reasoning,omitempty"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}
