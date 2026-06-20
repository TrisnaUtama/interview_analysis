-- +goose Up
-- +goose StatementBegin
CREATE TABLE interviews (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id           UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    job_id            UUID NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
    resume_id         UUID NULL REFERENCES resumes (id) ON DELETE SET NULL,
    interview_type    interview_type_enum NOT NULL DEFAULT 'hr',
    language          language_enum NOT NULL DEFAULT 'id',
    status            interview_status_enum NOT NULL DEFAULT 'pending',
    current_stage     interview_stage_enum NOT NULL DEFAULT 'opening',
    duration_minutes  INT NULL,
    started_at        TIMESTAMPTZ NULL,
    completed_at      TIMESTAMPTZ NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at        TIMESTAMPTZ NULL,
    CONSTRAINT chk_duration_positive CHECK (duration_minutes IS NULL OR duration_minutes > 0)
);

CREATE INDEX idx_interviews_user_id ON interviews (user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_interviews_job_id  ON interviews (job_id);
CREATE INDEX idx_interviews_status  ON interviews (status);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS interviews;
-- +goose StatementEnd