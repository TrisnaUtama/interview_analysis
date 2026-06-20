-- +goose Up
-- +goose StatementBegin
CREATE TABLE interview_stage_logs (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id     UUID NOT NULL REFERENCES interviews (id) ON DELETE CASCADE,
    stage            interview_stage_enum NOT NULL,
    entered_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    exited_at        TIMESTAMPTZ NULL,
    decision_reason  TEXT NULL
);

CREATE INDEX idx_interview_stage_logs_interview_id ON interview_stage_logs (interview_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS interview_stage_logs;
-- +goose StatementEnd