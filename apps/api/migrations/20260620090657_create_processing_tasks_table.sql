-- +goose Up
-- +goose StatementBegin
CREATE TABLE processing_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    task_type processing_task_type_enum NOT NULL,
    reference_table VARCHAR(50) NOT NULL,
    reference_id UUID NOT NULL,
    status processing_task_status_enum NOT NULL DEFAULT 'queued',
    attempts INT NOT NULL DEFAULT 0,
    max_attempts INT NOT NULL DEFAULT 3,
    error_message TEXT NULL,
    payload JSONB NULL,
    result JSONB NULL,
    started_at TIMESTAMPTZ NULL,
    finished_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_processing_tasks_reference ON processing_tasks (reference_table, reference_id);

CREATE INDEX idx_processing_tasks_status ON processing_tasks (status);

CREATE INDEX idx_processing_tasks_type ON processing_tasks (task_type);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS processing_tasks;
-- +goose StatementEnd