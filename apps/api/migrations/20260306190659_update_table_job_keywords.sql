-- +goose Up
-- +goose StatementBegin
ALTER TABLE job_keywords
    ADD COLUMN IF NOT EXISTS type          VARCHAR(50) NULL,
    ADD COLUMN IF NOT EXISTS is_must_cover BOOLEAN     NOT NULL DEFAULT false;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE job_keywords
    DROP COLUMN IF EXISTS type,
    DROP COLUMN IF EXISTS is_must_cover;
-- +goose StatementEnd