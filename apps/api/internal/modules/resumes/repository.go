package resumes

import (
	"ai-interview-api/internal/entities"
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	Insert(ctx context.Context, resume *entities.Resumes) error
	Update(ctx context.Context, id string, payload UpdateResumeRequest) error
	GetByID(ctx context.Context, id string) (*entities.Resumes, error)
	GetByUserID(ctx context.Context, userID string, limit, offset int) ([]*entities.Resumes, int, error)
	Delete(ctx context.Context, id string) error
}

type repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) Repository {
	return &repository{db: db}
}

func (r *repository) Insert(ctx context.Context, resume *entities.Resumes) error {
	query := `
		INSERT INTO resumes (id, user_id, file_url, raw_text, parsed_data, analysis_status, created_at, updated_at)
		VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, NOW(), NOW())
		RETURNING id, created_at, updated_at
	`

	return r.db.QueryRow(ctx, query,
		resume.UserId,
		resume.FileUrl,
		resume.RawText,
		resume.ParsedData,
		resume.AnalysisStatus,
	).Scan(
		&resume.ID,
		&resume.CreatedAt,
		&resume.UpdatedAt,
	)
}

func (r *repository) GetByID(ctx context.Context, id string) (*entities.Resumes, error) {
	query := `
		SELECT id, user_id, file_url, raw_text, parsed_data, analysis_status, created_at, updated_at, deleted_at
		FROM resumes
		WHERE id = $1 AND deleted_at IS NULL
	`

	resume := &entities.Resumes{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&resume.ID,
		&resume.UserId,
		&resume.FileUrl,
		&resume.RawText,
		&resume.ParsedData,
		&resume.AnalysisStatus,
		&resume.CreatedAt,
		&resume.UpdatedAt,
		&resume.DeletedAt,
	)
	if err != nil {
		return nil, err
	}

	return resume, nil
}

func (r *repository) GetByUserID(ctx context.Context, userID string, limit, offset int) ([]*entities.Resumes, int, error) {
	query := `
		SELECT id, user_id, file_url, raw_text, parsed_data, analysis_status, created_at, updated_at, deleted_at
		FROM resumes
		WHERE user_id = $1 AND deleted_at IS NULL
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3
	`

	countQuery := `
		SELECT COUNT(*) FROM resumes
		WHERE user_id = $1 AND deleted_at IS NULL
	`

	var total int
	err := r.db.QueryRow(ctx, countQuery, userID).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	rows, err := r.db.Query(ctx, query, userID, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var resumes []*entities.Resumes
	for rows.Next() {
		resume := &entities.Resumes{}
		err := rows.Scan(
			&resume.ID,
			&resume.UserId,
			&resume.FileUrl,
			&resume.RawText,
			&resume.ParsedData,
			&resume.AnalysisStatus,
			&resume.CreatedAt,
			&resume.UpdatedAt,
			&resume.DeletedAt,
		)
		if err != nil {
			return nil, 0, err
		}
		resumes = append(resumes, resume)
	}

	return resumes, total, nil
}

func (r *repository) Update(ctx context.Context, id string, payload UpdateResumeRequest) error {
	query := `
		UPDATE resumes
		SET
			file_url = COALESCE(NULLIF($1, ''), file_url),
			raw_text = COALESCE(NULLIF($2, ''), raw_text),
			parsed_data = CASE WHEN $3::text IS NOT NULL AND $3::text != '' THEN $3::jsonb ELSE parsed_data END,
			analysis_status = $4,
			updated_at = NOW()
		WHERE id = $5 AND deleted_at IS NULL
	`

	_, err := r.db.Exec(ctx, query,
		payload.FileURL,
		payload.RawText,
		payload.ParsedData,
		payload.AnalysisStatus,
		id,
	)
	return err
}

func (r *repository) Delete(ctx context.Context, id string) error {
	query := `
		UPDATE resumes SET deleted_at = $1 WHERE id = $2 AND deleted_at IS NULL
	`

	_, err := r.db.Exec(ctx, query, time.Now(), id)
	return err
}
