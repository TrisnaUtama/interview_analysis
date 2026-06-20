-- +goose Up
-- +goose StatementBegin
CREATE TABLE scoring_criteria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    interview_type interview_type_enum NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    weight NUMERIC(3, 2) NOT NULL DEFAULT 1.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scoring_criteria_interview_type ON scoring_criteria (interview_type);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS scoring_criteria;
-- +goose StatementEnd