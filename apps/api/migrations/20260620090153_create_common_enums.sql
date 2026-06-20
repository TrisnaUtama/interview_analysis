-- +goose Up
-- +goose StatementBegin
CREATE TYPE language_enum AS ENUM ('en', 'id');

CREATE TYPE interview_type_enum AS ENUM ('hr', 'user');

CREATE TYPE interview_status_enum AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

CREATE TYPE interview_stage_enum AS ENUM (
    'opening', 'warmup', 'core', 'deep_dive', 'scenario', 'closing', 'completed'
);

CREATE TYPE job_analysis_status_enum AS ENUM (
    'pending', 'scraping', 'analyzing', 'completed', 'failed'
);

CREATE TYPE answer_source_enum AS ENUM ('voice', 'manual_text');

CREATE TYPE processing_task_type_enum AS ENUM (
    'job_scrape', 'job_description_parse', 'resume_parse',
    'question_generation', 'question_tts',
    'answer_stt', 'answer_evaluation', 'interview_analysis'
);

CREATE TYPE processing_task_status_enum AS ENUM (
    'queued', 'processing', 'completed', 'failed', 'retrying'
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TYPE IF EXISTS processing_task_status_enum;
DROP TYPE IF EXISTS processing_task_type_enum;
DROP TYPE IF EXISTS answer_source_enum;
DROP TYPE IF EXISTS job_analysis_status_enum;
DROP TYPE IF EXISTS interview_stage_enum;
DROP TYPE IF EXISTS interview_status_enum;
DROP TYPE IF EXISTS interview_type_enum;
DROP TYPE IF EXISTS language_enum;
-- +goose StatementEnd