-- +goose Up
-- +goose StatementBegin
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    structured_data JSONB,
    analysis_status job_analysis_status_enum NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE INDEX idx_resumes_user_id ON resumes (user_id)
WHERE
    deleted_at IS NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS resumes;
-- +goose StatementEnd