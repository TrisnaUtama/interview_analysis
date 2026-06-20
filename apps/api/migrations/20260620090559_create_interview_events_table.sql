-- +goose Up
-- +goose StatementBegin
CREATE TABLE interview_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    interview_id UUID NOT NULL REFERENCES interviews (id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_interview_events_interview_id ON interview_events (interview_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS interview_events;
-- +goose StatementEnd