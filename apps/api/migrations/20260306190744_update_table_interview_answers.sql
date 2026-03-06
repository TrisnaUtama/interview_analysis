-- +goose Up
-- +goose StatementBegin
DO $$
BEGIN
    CREATE TYPE answer_depth_enum AS ENUM (
        'too_brief',
        'adequate',
        'detailed'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END
$$;
-- +goose StatementEnd

-- +goose StatementBegin
ALTER TABLE interview_answers
    ADD COLUMN IF NOT EXISTS extracted_signals JSONB             NULL,
    ADD COLUMN IF NOT EXISTS follow_up_topics  TEXT[]            NULL,
    ADD COLUMN IF NOT EXISTS answer_depth      answer_depth_enum NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE interview_answers
DROP COLUMN IF EXISTS extracted_signals,
DROP COLUMN IF EXISTS follow_up_topics,
DROP COLUMN IF EXISTS answer_depth;
-- +goose StatementEnd

-- +goose StatementBegin
DROP TYPE IF EXISTS answer_depth_enum;
-- +goose StatementEnd