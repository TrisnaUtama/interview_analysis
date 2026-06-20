-- +goose Up
-- +goose StatementBegin
CREATE TABLE interview_criteria_scores (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_analysis_id   UUID NOT NULL REFERENCES interview_analyses (id) ON DELETE CASCADE,
    scoring_criteria_id     UUID NOT NULL REFERENCES scoring_criteria (id) ON DELETE CASCADE,
    score                   NUMERIC(4,2) NOT NULL,
    notes                   TEXT NULL,
    UNIQUE (interview_analysis_id, scoring_criteria_id)
);

CREATE INDEX idx_interview_criteria_scores_analysis_id ON interview_criteria_scores (interview_analysis_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS interview_criteria_scores;
-- +goose StatementEnd