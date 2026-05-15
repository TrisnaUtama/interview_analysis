-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS interview_criteria_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    interview_analysis_id UUID NOT NULL REFERENCES interview_analyses (id) ON DELETE CASCADE,
    scoring_criteria_id UUID NOT NULL REFERENCES scoring_criteria (id) ON DELETE CASCADE,
    score FLOAT NOT NULL CHECK (
        score >= 0
        AND score <= 10
    ),
    notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_analysis_criteria UNIQUE (
        interview_analysis_id,
        scoring_criteria_id
    )
);

CREATE INDEX IF NOT EXISTS idx_criteria_scores_analysis_id ON interview_criteria_scores (interview_analysis_id);
CREATE INDEX IF NOT EXISTS idx_criteria_scores_criteria_id ON interview_criteria_scores (scoring_criteria_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_criteria_scores_criteria_id;
DROP INDEX IF EXISTS idx_criteria_scores_analysis_id;
DROP TABLE IF EXISTS interview_criteria_scores;
-- +goose StatementEnd