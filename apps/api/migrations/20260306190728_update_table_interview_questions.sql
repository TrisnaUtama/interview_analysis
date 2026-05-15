-- +goose Up
-- +goose StatementBegin
DO $$
BEGIN
    CREATE TYPE question_type_enum AS ENUM (
        'behavioral',
        'technical',
        'situational',
        'clarifying',
        'ice_breaker',
        'closing'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END
$$;
-- +goose StatementEnd

-- +goose StatementBegin
ALTER TABLE interview_questions
ADD COLUMN IF NOT EXISTS stage interview_stage_enum NOT NULL DEFAULT 'opening',
ADD COLUMN IF NOT EXISTS question_type question_type_enum NOT NULL DEFAULT 'behavioral',
ADD COLUMN IF NOT EXISTS is_follow_up BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS is_fallback BOOLEAN NOT NULL DEFAULT false;
-- +goose StatementEnd

-- +goose StatementBegin
CREATE INDEX IF NOT EXISTS idx_interview_questions_stage ON interview_questions (stage);

CREATE INDEX IF NOT EXISTS idx_interview_questions_question_type ON interview_questions (question_type);

CREATE INDEX IF NOT EXISTS idx_interview_questions_is_follow_up ON interview_questions (is_follow_up);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_interview_questions_is_follow_up;

DROP INDEX IF EXISTS idx_interview_questions_question_type;

DROP INDEX IF EXISTS idx_interview_questions_stage;
-- +goose StatementEnd

-- +goose StatementBegin
ALTER TABLE interview_questions
DROP COLUMN IF EXISTS stage,
DROP COLUMN IF EXISTS question_type,
DROP COLUMN IF EXISTS is_follow_up,
DROP COLUMN IF EXISTS is_fallback;
-- +goose StatementEnd

-- +goose StatementBegin
DROP TYPE IF EXISTS question_type_enum;
-- +goose StatementEnd