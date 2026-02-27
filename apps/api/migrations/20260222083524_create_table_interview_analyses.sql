-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS interview_analyses (
    id                      UUID                        PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id            UUID                        NOT NULL UNIQUE REFERENCES interviews(id) ON DELETE CASCADE,
    avg_technical_score     FLOAT                       NULL,
    avg_communication_score FLOAT                       NULL,
    avg_confidence_score    FLOAT                       NULL,
    avg_relevance_score     FLOAT                       NULL,
    overall_score           FLOAT                       NULL,
    hiring_recommendation   hiring_recommendation_enum  NULL,
    summary                 TEXT                        NULL,
    improvement_suggestions TEXT                        NULL,
    red_flags               TEXT                        NULL,
    strengths               TEXT                        NULL,
    created_at              TIMESTAMPTZ                 NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ                 NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMPTZ                 NULL
);

CREATE INDEX idx_interview_analyses_hiring_recommendation ON interview_analyses (hiring_recommendation);
CREATE INDEX idx_interview_analyses_overall_score         ON interview_analyses (overall_score);
CREATE INDEX idx_interview_analyses_deleted_at            ON interview_analyses (deleted_at);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_interview_analyses_deleted_at;
DROP INDEX IF EXISTS idx_interview_analyses_overall_score;
DROP INDEX IF EXISTS idx_interview_analyses_hiring_recommendation;
DROP TABLE IF EXISTS interview_analyses;
-- +goose StatementEnd