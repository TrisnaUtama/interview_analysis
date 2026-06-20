-- +goose Up
-- +goose StatementBegin
CREATE TABLE job_descriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    job_id UUID NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
    source_url TEXT NULL,
    raw_text TEXT,
    structured_data JSONB,
    analysis_status job_analysis_status_enum NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_job_descriptions_job_id ON job_descriptions (job_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS job_descriptions;
-- +goose StatementEnd