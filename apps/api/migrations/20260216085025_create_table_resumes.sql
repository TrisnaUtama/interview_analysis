-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS resumes (
    id  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_url TEXT,
    raw_text TEXT,
    parsed_data JSONB NULL,
    analysis_status job_analysis_status_enum NOT NULL DEFAULT 'pending',
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW(),
    deleted_at    TIMESTAMPTZ NULL
);

CREATE INDEX idx_resumes_user_id         ON resumes (user_id);
CREATE INDEX idx_resumes_analysis_status ON resumes (analysis_status);
CREATE INDEX idx_resumes_deleted_at      ON resumes (deleted_at);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_resumes_deleted_at;
DROP INDEX IF EXISTS idx_resumes_analysis_status;
DROP INDEX IF EXISTS idx_resumes_user_id;
DROP TABLE IF EXISTS resumes;
-- +goose StatementEnd
