-- +goose Up
-- +goose StatementBegin
CREATE TABLE jobs (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id           UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    title             VARCHAR(255) NOT NULL,
    location          VARCHAR(255),
    employment_type   VARCHAR(50),
    work_arrangement  VARCHAR(50),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at        TIMESTAMPTZ NULL
);

CREATE INDEX idx_jobs_user_id ON jobs (user_id) WHERE deleted_at IS NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS jobs;
-- +goose StatementEnd