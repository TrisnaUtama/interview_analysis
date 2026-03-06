-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS interview_stage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    interview_id UUID NOT NULL REFERENCES interviews (id) ON DELETE CASCADE,
    stage interview_stage_enum NOT NULL,
    entered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    exited_at TIMESTAMPTZ NULL,
    question_count INT NOT NULL DEFAULT 0,
    transition_reason VARCHAR(50) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stage_logs_interview_id ON interview_stage_logs (interview_id);

CREATE INDEX IF NOT EXISTS idx_stage_logs_stage ON interview_stage_logs (stage);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_stage_logs_stage;

DROP INDEX IF EXISTS idx_stage_logs_interview_id;

DROP TABLE IF EXISTS interview_stage_logs;
-- +goose StatementEnd