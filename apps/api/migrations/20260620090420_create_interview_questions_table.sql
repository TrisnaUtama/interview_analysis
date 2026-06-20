-- +goose Up
-- +goose StatementBegin
CREATE TABLE interview_questions (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id         UUID NOT NULL REFERENCES interviews (id) ON DELETE CASCADE,
    parent_question_id   UUID NULL REFERENCES interview_questions (id) ON DELETE CASCADE,
    stage                interview_stage_enum NOT NULL,
    order_number         INT NOT NULL,
    is_follow_up         BOOLEAN NOT NULL DEFAULT false,
    question_text        TEXT NOT NULL,
    question_audio_url   TEXT NULL,
    audio_language       language_enum NULL,
    generation_context   JSONB NULL,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_interview_questions_interview_id ON interview_questions (interview_id);

-- Hanya pertanyaan utama (bukan follow-up) yang wajib unik order_number per interview.
CREATE UNIQUE INDEX uq_interview_question_order
    ON interview_questions (interview_id, order_number)
    WHERE is_follow_up = false;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS interview_questions;
-- +goose StatementEnd