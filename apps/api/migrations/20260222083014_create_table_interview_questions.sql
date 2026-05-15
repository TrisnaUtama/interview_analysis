-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS interview_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    interview_id UUID NOT NULL REFERENCES interviews (id) ON DELETE CASCADE,
    parent_question_id UUID NULL REFERENCES interview_questions (id) ON DELETE SET NULL,
    question_text TEXT NOT NULL,
    order_number INT NOT NULL,
    asked_at TIMESTAMPTZ NULL,
    ai_reasoning TEXT NULL,
    generation_context JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE INDEX idx_interview_questions_interview_id ON interview_questions (interview_id);
CREATE INDEX idx_interview_questions_parent_question ON interview_questions (parent_question_id);
CREATE INDEX idx_interview_questions_deleted_at ON interview_questions (deleted_at);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_interview_questions_deleted_at;
DROP INDEX IF EXISTS idx_interview_questions_parent_question;
DROP INDEX IF EXISTS idx_interview_questions_interview_id;
DROP TABLE IF EXISTS interview_questions;
-- +goose StatementEnd