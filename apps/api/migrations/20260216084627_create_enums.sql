-- +goose Up
-- +goose StatementBegin
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE auth_provider_enum AS ENUM ('google');
CREATE TYPE user_role_enum AS ENUM ('user', 'admin');
CREATE TYPE interview_type_enum AS ENUM ('HR', 'USER');
CREATE TYPE interview_status_enum AS ENUM ('draft', 'active', 'evaluating', 'completed');
CREATE TYPE job_analysis_status_enum AS ENUM ('pending', 'scraping', 'analyzing', 'completed', 'failed');
CREATE TYPE job_source_type_enum AS ENUM ('manual', 'url');
CREATE TYPE question_source_enum AS ENUM ('BANK', 'GENERATED');
CREATE TYPE hiring_recommendation_enum AS ENUM ('reject', 'consider', 'strong_yes');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TYPE IF EXISTS hiring_recommendation_enum;
DROP TYPE IF EXISTS question_source_enum;
DROP TYPE IF EXISTS job_source_type_enum;
DROP TYPE IF EXISTS job_analysis_status_enum;
DROP TYPE IF EXISTS interview_status_enum;
DROP TYPE IF EXISTS interview_type_enum;
DROP TYPE IF EXISTS user_role_enum;
DROP TYPE IF EXISTS auth_provider_enum;
DROP EXTENSION IF EXISTS "uuid-ossp";
-- +goose StatementEnd
