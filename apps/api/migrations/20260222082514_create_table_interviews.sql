-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    interview_type interview_type_enum NOT NULL DEFAULT 'HR',
    status interview_status_enum    NOT NULL DEFAULT 'draft',
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ NULL
);

CREATE INDEX idx_interviews_user_id        ON interviews (user_id);
CREATE INDEX idx_interviews_job_id         ON interviews (job_id);
CREATE INDEX idx_interviews_interview_type ON interviews (interview_type);
CREATE INDEX idx_interviews_status         ON interviews (status);
CREATE INDEX idx_interviews_deleted_at     ON interviews (deleted_at);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_interviews_deleted_at;
DROP INDEX IF EXISTS idx_interviews_status;
DROP INDEX IF EXISTS idx_interviews_interview_type;
DROP INDEX IF EXISTS idx_interviews_job_id;
DROP INDEX IF EXISTS idx_interviews_user_id;
DROP TABLE IF EXISTS interviews;
-- +goose StatementEnd
