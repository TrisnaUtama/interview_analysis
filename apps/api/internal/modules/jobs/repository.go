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
	UpsertJobDescriptionAnalysis(ctx context.Context, jobDescriptionID, raw_text, parsedText, status string) error
	UpsertJobKeywords(ctx context.Context, jobID string, keywords []KeywordPayload) error
	GetJobIDByDescriptionID(ctx context.Context, jobDescriptionID string) (string, error)
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

	rt := ""
	if rawText != nil {
		rt = *rawText
	}

	query := `
		INSERT INTO job_descriptions (job_id, source_type, source_url, raw_text, analysis_status)
		VALUES ($1, $2, $3, $4, 'pending')
		RETURNING id, job_id, source_type, source_url, raw_text, analysis_status, created_at
	`

	err := r.db.QueryRow(ctx, query, jobID, sourceType, sourceURL, rt).Scan(
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

func (r *repository) UpsertJobDescriptionAnalysis(ctx context.Context, jobDescriptionID, raw_text, parsedText, status string) error {
	query := ` 
		UPDATE job_descriptions
		SET raw_text = $1, parsed_text = $2, analysis_status = $3, updated_at = NOW()
		WHERE id = $4 AND deleted_at IS NULL
	`

	cmd, err := r.db.Exec(ctx, query, raw_text, parsedText, status, jobDescriptionID)
	if err != nil {
		return err
	}

	if cmd.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}

	return nil
}

func (r *repository) UpsertJobKeywords(ctx context.Context, jobID string, keywords []KeywordPayload) error {
	_, err := r.db.Exec(ctx, `DELETE FROM job_keywords WHERE job_id = $1`, jobID)
	if err != nil {
		return err
	}

	if len(keywords) == 0 {
		return nil
	}

	query := `INSERT INTO job_keywords (job_id, keyword, weight, type) VALUES ($1, $2, $3, $4)`
	for _, kw := range keywords {
		if _, err := r.db.Exec(ctx, query, jobID, kw.Keyword, kw.Weight, kw.Type); err != nil {
			return err
		}
	}

	return nil
}

func (r *repository) GetJobIDByDescriptionID(ctx context.Context, jobDescriptionID string) (string, error) {
	var jobID string

	err := r.db.QueryRow(ctx,
		`SELECT job_id FROM job_descriptions WHERE id = $1 AND deleted_at IS NULL`,
		jobDescriptionID,
	).Scan(&jobID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return "", pgx.ErrNoRows
		}
		return "", err
	}

	return jobID, nil
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
						'weight', k.weight,
						'type', k.type
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
	query := `
		SELECT 
			j.id,
			j.company_name,
			j.position,
			j.created_at,
			COUNT(*) OVER() as total_count,
			jd.id,
			jd.analysis_status
		FROM jobs j
		LEFT JOIN LATERAL (
			SELECT id, analysis_status
			FROM job_descriptions
			WHERE job_id = j.id AND deleted_at IS NULL
			ORDER BY created_at DESC
			LIMIT 1
		) jd ON true
		WHERE j.deleted_at IS NULL
		ORDER BY j.created_at DESC
		LIMIT $1 OFFSET $2
	`

	rows, err := r.db.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	jobs := make([]*JobResponse, 0, limit)
	var total int

	for rows.Next() {
		var j JobResponse
		var descID *string
		var analysisStatus *string

		if err := rows.Scan(
			&j.ID,
			&j.CompanyName,
			&j.Position,
			&j.CreatedAt,
			&total,
			&descID,
			&analysisStatus,
		); err != nil {
			return nil, 0, err
		}

		if descID != nil {
			j.Description = &JobDescriptionResponse{
				ID:             *descID,
				AnalysisStatus: *analysisStatus,
			}
		}

		j.Keywords = []JobKeywordResponse{}
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
