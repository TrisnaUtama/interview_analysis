-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS interview_questions (
    id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id        UUID        NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    question_bank_id    UUID        NOT NULL REFERENCES question_banks(id) ON DELETE RESTRICT,
    parent_question_id  UUID        NULL REFERENCES interview_questions(id) ON DELETE SET NULL,
    question_text       TEXT        NOT NULL,
    order_number        INT         NOT NULL,
    is_opening_question BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ NULL
);

CREATE INDEX idx_interview_questions_interview_id     ON interview_questions (interview_id);
CREATE INDEX idx_interview_questions_question_bank_id ON interview_questions (question_bank_id);
CREATE INDEX idx_interview_questions_parent_question  ON interview_questions (parent_question_id);
CREATE INDEX idx_interview_questions_deleted_at       ON interview_questions (deleted_at);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_interview_questions_deleted_at;
DROP INDEX IF EXISTS idx_interview_questions_parent_question;
DROP INDEX IF EXISTS idx_interview_questions_question_bank_id;
DROP INDEX IF EXISTS idx_interview_questions_interview_id;
DROP TABLE IF EXISTS interview_questions;
-- +goose StatementEnd