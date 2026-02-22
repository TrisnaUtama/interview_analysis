-- +goose Up
-- +goose StatementBegin
ALTER TABLE job_keywords
ADD COLUMN type VARCHAR(100);
-- +goose StatementEnd


-- +goose Down
-- +goose StatementBegin
ALTER TABLE job_keywords
DROP COLUMN IF EXISTS type;
-- +goose StatementEnd