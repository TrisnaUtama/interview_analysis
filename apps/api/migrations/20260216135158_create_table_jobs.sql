-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS jobs(
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    position        VARCHAR(255) NULL,
    company_name    VARCHAR(255) NOT NULL,
    created_by      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ NULL
);

CREATE INDEX idx_jobs_created_by ON jobs(created_by);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_jobs_created_by;
DROP TABLE IF EXISTS jobs
-- +goose StatementEnd
