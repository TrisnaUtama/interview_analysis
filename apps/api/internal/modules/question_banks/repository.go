package question_banks

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	InsertQuestion(ctx context.Context, payload CreateQuestionBankRequest) (*QuestionBankResponse, error)
	UpdateQuestion(ctx context.Context, id string, payload UpdateQuestionBankRequest) (*QuestionBankResponse, error)
	GetQuestions(ctx context.Context, limit, offset int) ([]*QuestionBankResponse, int, error)
	GetQuestion(ctx context.Context, id string) (*QuestionBankResponse, error)
	DeleteQuestion(ctx context.Context, id string) error
}

type repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) Repository {
	return &repository{db: db}
}

func (r *repository) InsertQuestion(ctx context.Context, payload CreateQuestionBankRequest) (*QuestionBankResponse, error) {
	var qb QuestionBankResponse

	query := `
		INSERT INTO question_banks (type, source, category, difficulty, question_text_id, question_text_en, tags)
		VALUES ($1, 'BANK', $2, $3, $4, $5, $6)
		RETURNING id, type, source, category, difficulty, question_text_id, question_text_en, tags, created_at, updated_at`

	err := r.db.QueryRow(ctx, query,
		payload.Type,
		payload.Category,
		payload.Difficulty,
		payload.QuestionTextId,
		payload.QuestionTextEn,
		payload.Tags,
	).Scan(
		&qb.ID,
		&qb.Type,
		&qb.Source,
		&qb.Category,
		&qb.Difficulty,
		&qb.QuestionTextId,
		&qb.QuestionTextEn,
		&qb.Tags,
		&qb.CreatedAt,
		&qb.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &qb, nil
}

func (r *repository) UpdateQuestion(ctx context.Context, id string, payload UpdateQuestionBankRequest) (*QuestionBankResponse, error) {
	var qb QuestionBankResponse

	query := `
		UPDATE question_banks
		SET 
			category        = COALESCE($1, category),
			difficulty      = COALESCE($2, difficulty),
			question_text_id = COALESCE($3, question_text_id),
			question_text_en = COALESCE($4, question_text_en),
			tags            = COALESCE($5, tags),
			updated_at      = NOW()
		WHERE id = $6 AND deleted_at IS NULL
		RETURNING id, type, source, category, difficulty, question_text_id, question_text_en, tags, created_at, updated_at`

	err := r.db.QueryRow(ctx, query,
		payload.Category,
		payload.Difficulty,
		payload.QuestionTextId,
		payload.QuestionTextEn,
		payload.Tags,
		id,
	).Scan(
		&qb.ID,
		&qb.Type,
		&qb.Source,
		&qb.Category,
		&qb.Difficulty,
		&qb.QuestionTextId,
		&qb.QuestionTextEn,
		&qb.Tags,
		&qb.CreatedAt,
		&qb.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &qb, nil
}

func (r *repository) GetQuestions(ctx context.Context, limit, offset int) ([]*QuestionBankResponse, int, error) {
	query := `
		SELECT 
			id,
			type,
			source,
			category,
			difficulty,
			question_text_id,
			question_text_en,
			tags,
			is_opening_question,
			relevance_score,
			generation_reasoning,
			created_at,
			updated_at,
			COUNT(*) OVER() as total_count
		FROM question_banks
		WHERE deleted_at IS NULL
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2`

	rows, err := r.db.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	questions := make([]*QuestionBankResponse, 0, limit)
	var total int

	for rows.Next() {
		var qb QuestionBankResponse

		if err := rows.Scan(
			&qb.ID,
			&qb.Type,
			&qb.Source,
			&qb.Category,
			&qb.Difficulty,
			&qb.QuestionTextId,
			&qb.QuestionTextEn,
			&qb.Tags,
			&qb.IsOpeningQuestion,
			&qb.RelevanceScore,
			&qb.GenerationReasoning,
			&qb.CreatedAt,
			&qb.UpdatedAt,
			&total,
		); err != nil {
			return nil, 0, err
		}

		questions = append(questions, &qb)
	}

	return questions, total, nil
}

func (r *repository) GetQuestion(ctx context.Context, id string) (*QuestionBankResponse, error) {
	var qb QuestionBankResponse
	query := `
		SELECT 
			id,
			type,
			source,
			category,
			difficulty,
			question_text_id,
			question_text_en,
			tags,
			is_opening_question,
			relevance_score,
			generation_reasoning,
			created_at,
			updated_at
		FROM question_banks
		WHERE id = $1 
		AND deleted_at IS NULL`

	err := r.db.QueryRow(ctx, query, id).Scan(
		&qb.ID,
		&qb.Type,
		&qb.Source,
		&qb.Category,
		&qb.Difficulty,
		&qb.QuestionTextId,
		&qb.QuestionTextEn,
		&qb.Tags,
		&qb.IsOpeningQuestion,
		&qb.RelevanceScore,
		&qb.GenerationReasoning,
		&qb.CreatedAt,
		&qb.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &qb, nil
}

func (r *repository) DeleteQuestion(ctx context.Context, id string) error {
	cmd, err := r.db.Exec(ctx,
		`UPDATE question_banks SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`,
		id)

	if err != nil {
		return err
	}

	if cmd.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}

	return nil
}
