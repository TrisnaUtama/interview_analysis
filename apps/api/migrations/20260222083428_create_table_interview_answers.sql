-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS interview_answers (
    id                      UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_question_id   UUID        NOT NULL REFERENCES interview_questions(id) ON DELETE CASCADE,
    answer_text             TEXT        NULL,
    answer_audio_url        TEXT        NULL,
    evaluation_result       JSONB       NULL,
    evaluated_at            TIMESTAMPTZ NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMPTZ NULL
);

CREATE INDEX idx_interview_answers_interview_question_id ON interview_answers (interview_question_id);
CREATE INDEX idx_interview_answers_evaluated_at          ON interview_answers (evaluated_at);
CREATE INDEX idx_interview_answers_deleted_at            ON interview_answers (deleted_at);
CREATE INDEX idx_interview_answers_evaluation_result     ON interview_answers USING GIN (evaluation_result);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_interview_answers_evaluation_result;
DROP INDEX IF EXISTS idx_interview_answers_deleted_at;
DROP INDEX IF EXISTS idx_interview_answers_evaluated_at;
DROP INDEX IF EXISTS idx_interview_answers_interview_question_id;
DROP TABLE IF EXISTS interview_answers;
-- +goose StatementEnd
