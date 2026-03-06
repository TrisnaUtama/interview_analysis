-- +goose Up
-- +goose StatementBegin
DO $$
BEGIN
    CREATE TYPE interview_type_enum AS ENUM (
        'hr',
        'technical',
        'behavioral'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END
$$;
-- +goose StatementEnd

-- +goose StatementBegin
DO $$
BEGIN
    CREATE TYPE interview_stage_enum AS ENUM (
        'opening',
        'warmup',
        'core',
        'deep_dive',
        'scenario',
        'closing',
        'completed'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END
$$;
-- +goose StatementEnd

-- +goose StatementBegin
DO $$
BEGIN
    ALTER TYPE interview_type_enum RENAME VALUE 'HR' TO 'hr';
EXCEPTION
    WHEN invalid_parameter_value THEN NULL;
END
$$;
-- +goose StatementEnd

-- +goose StatementBegin
DO $$
BEGIN
    ALTER TYPE interview_type_enum RENAME VALUE 'USER' TO 'technical';
EXCEPTION
    WHEN invalid_parameter_value THEN NULL;
END
$$;
-- +goose StatementEnd

-- +goose StatementBegin
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum
        JOIN pg_type ON pg_enum.enumtypid = pg_type.oid
        WHERE pg_type.typname = 'interview_type_enum'
        AND pg_enum.enumlabel = 'behavioral'
    ) THEN
        ALTER TYPE interview_type_enum ADD VALUE 'behavioral';
    END IF;
END
$$;
-- +goose StatementEnd

-- +goose StatementBegin
ALTER TABLE interviews
ALTER COLUMN interview_type
SET DEFAULT 'hr',
ADD COLUMN IF NOT EXISTS current_stage interview_stage_enum NOT NULL DEFAULT 'opening',
ADD COLUMN IF NOT EXISTS stage_question_counts JSONB NOT NULL DEFAULT '{}';
-- +goose StatementEnd

-- +goose StatementBegin
CREATE INDEX IF NOT EXISTS idx_interviews_current_stage ON interviews (current_stage);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_interviews_current_stage;
-- +goose StatementEnd

-- +goose StatementBegin
ALTER TABLE interviews
ALTER COLUMN interview_type
SET DEFAULT 'HR',
DROP COLUMN IF EXISTS current_stage,
DROP COLUMN IF EXISTS stage_question_counts;
-- +goose StatementEnd

-- +goose StatementBegin
DO $$
BEGIN
    ALTER TYPE interview_type_enum RENAME VALUE 'hr' TO 'HR';
EXCEPTION
    WHEN invalid_parameter_value THEN NULL;
END
$$;
-- +goose StatementEnd

-- +goose StatementBegin
DO $$
BEGIN
    ALTER TYPE interview_type_enum RENAME VALUE 'technical' TO 'USER';
EXCEPTION
    WHEN invalid_parameter_value THEN NULL;
END
$$;
-- +goose StatementEnd

-- +goose StatementBegin
DROP TYPE IF EXISTS interview_stage_enum;
-- +goose StatementEnd