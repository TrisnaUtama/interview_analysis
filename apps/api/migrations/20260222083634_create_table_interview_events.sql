-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS interview_events (
    id           UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id UUID         NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    event_type   VARCHAR(100) NOT NULL,
    metadata     JSONB        NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_interview_events_interview_id ON interview_events (interview_id);
CREATE INDEX idx_interview_events_created_at   ON interview_events (created_at);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_interview_events_created_at;
DROP INDEX IF EXISTS idx_interview_events_interview_id;
DROP TABLE IF EXISTS interview_events;
-- +goose StatementEnd