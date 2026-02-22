-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS scoring_criteria (
    id              UUID                    PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_type  interview_type_enum     NOT NULL,
    criteria_name   VARCHAR(100)            NOT NULL,
    weight          FLOAT                   NOT NULL DEFAULT 1.0,
    created_at      TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMPTZ NULL,
    UNIQUE (interview_type, criteria_name)
);
CREATE INDEX idx_scoring_criteria_interview_type ON scoring_criteria (interview_type);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_scoring_criteria_interview_type;
DROP TABLE IF EXISTS scoring_criteria;
-- +goose StatementEnd
