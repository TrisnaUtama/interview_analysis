-- +goose Up
-- +goose StatementBegin
CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email               VARCHAR(255) NOT NULL UNIQUE,
    full_name           VARCHAR(255),
    google_id           VARCHAR(255) UNIQUE,
    avatar_url          TEXT,
    preferred_language  language_enum NOT NULL DEFAULT 'id',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ NULL
);

CREATE INDEX idx_users_email ON users (email) WHERE deleted_at IS NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS users;
-- +goose StatementEnd