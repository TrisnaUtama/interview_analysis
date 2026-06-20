-- +goose Up
-- +goose StatementBegin
CREATE TABLE interview_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    question_id UUID NOT NULL REFERENCES interview_questions (id) ON DELETE CASCADE,
    answer_text TEXT NULL,
    raw_transcript TEXT NULL,
    answer_audio_url TEXT NULL,
    audio_duration_sec NUMERIC(6, 2) NULL,
    stt_confidence NUMERIC(4, 3) NULL,
    transcribed_at TIMESTAMPTZ NULL,
    retake_count INT NOT NULL DEFAULT 0,
    answer_source answer_source_enum NOT NULL DEFAULT 'voice',
    evaluation_score NUMERIC(4, 2) NULL,
    evaluation_feedback JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX uq_interview_answers_question_id ON interview_answers (question_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS interview_answers;
-- +goose StatementEnd