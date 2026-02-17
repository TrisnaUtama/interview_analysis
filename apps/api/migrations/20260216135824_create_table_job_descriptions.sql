-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS job_descriptions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id          UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    source_type     job_source_type_enum NOT NULL DEFAULT 'manual',
    source_url      TEXT NULL,
    raw_text        TEXT NOT NULL,
    parsed_text     TEXT NULL,
    analysis_status job_analysis_status_enum NOT NULL DEFAULT 'pending',
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW(),
    deleted_at    TIMESTAMPTZ NULL
);

CREATE INDEX idx_job_descriptions_job_id ON job_descriptions(job_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_job_descriptions_job_id;
DROP TABLE IF EXISTS job_descriptions;
-- +goose StatementEnd
