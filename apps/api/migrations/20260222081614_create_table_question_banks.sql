-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS question_banks (
    id                      UUID                    PRIMARY KEY DEFAULT uuid_generate_v4(),
    type                    interview_type_enum     NOT NULL DEFAULT 'HR',
    source                  question_source_enum    NOT NULL DEFAULT 'BANK',
    category                VARCHAR(100)            NULL,
    difficulty              VARCHAR(50)             NULL,
    question_text_id        TEXT                    NOT NULL,
    question_text_en        TEXT                    NOT NULL,
    tags                    TEXT[]                  NULL,
    is_opening_question     BOOLEAN                 NOT NULL DEFAULT FALSE,
    relevance_score         FLOAT                   NULL,
    generation_reasoning    TEXT                    NULL,
    created_at              TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMPTZ             NULL
);

CREATE INDEX idx_question_banks_type                ON question_banks (type);
CREATE INDEX idx_question_banks_source              ON question_banks (source);
CREATE INDEX idx_question_banks_difficulty          ON question_banks (difficulty);
CREATE INDEX idx_question_banks_category            ON question_banks (category);
CREATE INDEX idx_question_banks_is_opening_question ON question_banks (is_opening_question);
CREATE INDEX idx_question_banks_deleted_at          ON question_banks (deleted_at);
CREATE INDEX idx_question_banks_tags                ON question_banks USING GIN (tags);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_question_banks_tags;
DROP INDEX IF EXISTS idx_question_banks_deleted_at;
DROP INDEX IF EXISTS idx_question_banks_is_opening_question;
DROP INDEX IF EXISTS idx_question_banks_category;
DROP INDEX IF EXISTS idx_question_banks_difficulty;
DROP INDEX IF EXISTS idx_question_banks_source;
DROP INDEX IF EXISTS idx_question_banks_type;
DROP TABLE IF EXISTS question_banks;
-- +goose StatementEnd