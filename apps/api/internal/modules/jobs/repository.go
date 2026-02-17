package jobs

import (
	"ai-interview-api/internal/entities"
	"context"
	"encoding/json"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	InsertJob(ctx context.Context, companyName, position, created_by string) (*entities.Jobs, error)
	InsertJobDescription(ctx context.Context, jobID, sourceType string, sourceURL, rawText *string) (*entities.JobDescriptions, error)
	GetOneJob(ctx context.Context, id string) (*JobResponse, error)
	GetJobs(ctx context.Context, limit, offset int) ([]*JobResponse, int, error)
	DeleteJob(ctx context.Context, id string) error
}

type repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) Repository {
	return &repository{db: db}
}

func (r *repository) InsertJob(ctx context.Context, companyName, position, created_by string) (*entities.Jobs, error) {
	var j entities.Jobs

	query := `
		INSERT INTO jobs (company_name, position, created_by)
		VALUES ($1, $2, $3)
		RETURNING id, company_name, position, created_by, created_at, updated_at
	`

	err := r.db.QueryRow(ctx, query, companyName, position, created_by).
		Scan(&j.ID, &j.CompanyName, &j.Position, &j.CreatedBy, &j.CreatedAt, &j.UpdatedAt)
	if err != nil {
		return nil, err
	}

	return &j, nil
}

func (r *repository) InsertJobDescription(ctx context.Context, jobID, sourceType string, sourceURL, rawText *string) (*entities.JobDescriptions, error) {
	var jd entities.JobDescriptions

	query := `
		INSERT INTO job_descriptions (job_id, source_type, source_url, raw_text, analysis_status)
		VALUES ($1, $2, $3, $4, 'pending')
		RETURNING id, job_id, source_type, source_url, raw_text, analysis_status, created_at
	`

	err := r.db.QueryRow(ctx, query, jobID, sourceType, sourceURL, rawText).Scan(
		&jd.ID,
		&jd.JobID,
		&jd.SourceType,
		&jd.SourceURL,
		&jd.RawText,
		&jd.AnalysisStatus,
		&jd.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &jd, nil
}

func (r *repository) GetOneJob(ctx context.Context, id string) (*JobResponse, error) {
	query := `
		SELECT 
			j.id,
			j.company_name,
			j.position,
			j.created_at,
			(
				SELECT row_to_json(d)
				FROM (
					SELECT id, source_type, source_url, raw_text, parsed_text, analysis_status
					FROM job_descriptions
					WHERE job_id = j.id AND deleted_at IS NULL
					ORDER BY created_at DESC
					LIMIT 1
				) d
			) as description,
			COALESCE(
				(
					SELECT json_agg(jsonb_build_object(
						'id', k.id,
						'keyword', k.keyword,
						'weight', k.weight
					))
					FROM job_keywords k
					WHERE k.job_id = j.id
				),
				'[]'
			) as keywords
		FROM jobs j
		WHERE j.id = $1 AND j.deleted_at IS NULL
	`

	var j JobResponse
	var descJSON []byte
	var keywordsJSON []byte

	err := r.db.QueryRow(ctx, query, id).Scan(
		&j.ID,
		&j.CompanyName,
		&j.Position,
		&j.CreatedAt,
		&descJSON,
		&keywordsJSON,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	if descJSON != nil {
		var desc JobDescriptionResponse
		if err := json.Unmarshal(descJSON, &desc); err != nil {
			return nil, err
		}
		j.Description = &desc
	}

	if keywordsJSON != nil {
		if err := json.Unmarshal(keywordsJSON, &j.Keywords); err != nil {
			return nil, err
		}
	}

	return &j, nil
}

func (r *repository) GetJobs(ctx context.Context, limit, offset int) ([]*JobResponse, int, error) {
	var total int

	err := r.db.QueryRow(ctx,
		`SELECT COUNT(*) FROM jobs WHERE deleted_at IS NULL`,
	).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	query := `
		SELECT 
			j.id,
			j.company_name,
			j.position,
			j.created_at,
			(
				SELECT row_to_json(d)
				FROM (
					SELECT id, source_type, source_url, raw_text, parsed_text, analysis_status
					FROM job_descriptions
					WHERE job_id = j.id AND deleted_at IS NULL
					ORDER BY created_at DESC
					LIMIT 1
				) d
			) as description,
			COALESCE(
				(
					SELECT json_agg(jsonb_build_object(
						'id', k.id,
						'keyword', k.keyword,
						'weight', k.weight
					))
					FROM job_keywords k
					WHERE k.job_id = j.id
				),
				'[]'
			) as keywords
		FROM jobs j
		WHERE j.deleted_at IS NULL
		ORDER BY j.created_at DESC
		LIMIT $1 OFFSET $2
	`

	rows, err := r.db.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var jobs []*JobResponse

	for rows.Next() {
		var j JobResponse
		var descJSON []byte
		var keywordsJSON []byte

		if err := rows.Scan(
			&j.ID,
			&j.CompanyName,
			&j.Position,
			&j.CreatedAt,
			&descJSON,
			&keywordsJSON,
		); err != nil {
			return nil, 0, err
		}

		if descJSON != nil {
			var desc JobDescriptionResponse
			if err := json.Unmarshal(descJSON, &desc); err != nil {
				return nil, 0, err
			}
			j.Description = &desc
		}

		if keywordsJSON != nil {
			if err := json.Unmarshal(keywordsJSON, &j.Keywords); err != nil {
				return nil, 0, err
			}
		}

		jobs = append(jobs, &j)
	}

	return jobs, total, nil
}

func (r *repository) DeleteJob(ctx context.Context, id string) error {
	cmd, err := r.db.Exec(ctx,
		`UPDATE jobs SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`,
		id,
	)
	if err != nil {
		return err
	}

	if cmd.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}

	return nil
}
