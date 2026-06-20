-- +goose Up
-- +goose StatementBegin
CREATE TABLE interview_analyses (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id    UUID NOT NULL UNIQUE REFERENCES interviews (id) ON DELETE CASCADE,
    overall_score   NUMERIC(5,2) NULL,
    recommendation  VARCHAR(50) NULL,
    strengths       JSONB NULL,
    red_flags       JSONB NULL,
    summary         TEXT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS interview_analyses;
-- +goose StatementEnd