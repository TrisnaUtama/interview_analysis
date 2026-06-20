-- +goose Up
-- +goose StatementBegin
CREATE TABLE user_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID NULL REFERENCES users (id) ON DELETE SET NULL,
    session_id UUID NOT NULL,
    source VARCHAR(20) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(50) NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'info',
    message TEXT NULL,
    stack_trace TEXT NULL,
    url TEXT NULL,
    metadata JSONB NULL,
    ip_address INET NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_activity_log_source CHECK (
        source IN ('frontend', 'backend')
    ),
    CONSTRAINT chk_activity_log_severity CHECK (
        severity IN (
            'debug',
            'info',
            'warning',
            'error',
            'critical'
        )
    )
);

-- Query paling umum: "tarik semua aktivitas 1 user" dan "tarik semua aktivitas 1 session"
CREATE INDEX idx_user_activity_logs_user_id ON user_activity_logs (user_id, created_at DESC);

CREATE INDEX idx_user_activity_logs_session_id ON user_activity_logs (session_id, created_at DESC);

CREATE INDEX idx_user_activity_logs_event_type ON user_activity_logs (event_type);

-- Partial index khusus error/critical 
CREATE INDEX idx_user_activity_logs_errors ON user_activity_logs (created_at DESC)
WHERE
    severity IN ('error', 'critical');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS user_activity_logs;
-- +goose StatementEnd