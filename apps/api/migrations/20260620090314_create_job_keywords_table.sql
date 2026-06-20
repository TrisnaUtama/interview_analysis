-- +goose Up
-- +goose StatementBegin
CREATE TABLE job_keywords (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_description_id  UUID NOT NULL REFERENCES job_descriptions (id) ON DELETE CASCADE,
    keyword             VARCHAR(100) NOT NULL,
    category            VARCHAR(50) NULL,
    weight              NUMERIC(3,2) NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_job_keywords_job_description_id ON job_keywords (job_description_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS job_keywords;
-- +goose StatementEnd