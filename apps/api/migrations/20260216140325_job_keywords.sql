-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS job_keywords (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id      UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    keyword     VARCHAR(255) NOT NULL,
    weight      FLOAT
);

CREATE INDEX job_keywords_job_id ON job_keywords(job_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS job_keywords_job_id;
DROP TABLE IF EXISTS job_keywords;
-- +goose StatementEnd
