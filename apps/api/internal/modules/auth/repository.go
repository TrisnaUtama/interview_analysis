package auth

import (
	"ai-interview-api/internal/entities"
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	UpsertUser(ctx context.Context, email, name, avatarURL, provider, providerID string) (*entities.Users, error)
	SaveRefreshToken(ctx context.Context, userID, token string, expiresAt time.Time) error
	GetRefreshToken(ctx context.Context, token string) (*entities.Refresh_tokens, error)
	DeleteRefreshToken(ctx context.Context, token string) error
	GetOne(ctx context.Context, id string) (*entities.Users, error)
}

type repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) Repository {
	return &repository{db: db}
}

func (r *repository) GetOne(ctx context.Context, id string) (*entities.Users, error) {
	var u entities.Users
	query := `
		SELECT id, name, email, provider, role, created_at FROM users WHERE id=$1`

	err := r.db.QueryRow(ctx, query, id).Scan(&u.ID, &u.Name, &u.Email, &u.Provider, &u.Role, &u.CreatedAt)

	if err != nil {
		return nil, err
	}

	return &u, nil
}

func (r *repository) DeleteRefreshToken(ctx context.Context, token string) error {
	_, err := r.db.Exec(ctx, `DELETE FROM refresh_tokens WHERE token = $1`, token)
	return err
}

// GetRefreshToken implements [Repository].
func (r *repository) GetRefreshToken(ctx context.Context, token string) (*entities.Refresh_tokens, error) {
	var rt entities.Refresh_tokens
	query := `
		SELECT id, user_id, token, expires_at, created_at
		FROM refresh_tokens
		WHERE token= $1
		AND expires_at > NOW()
		AND deleted_at IS NULL`

	err := r.db.QueryRow(ctx, query, token).Scan(&rt.ID, &rt.UserID, &rt.Token,
		&rt.ExpiresAt, &rt.CreatedAt)

	if err != nil {
		return nil, err
	}

	return &rt, nil
}

// SaveRefreshToken implements [Repository].
func (r *repository) SaveRefreshToken(ctx context.Context, userID string, token string, expiresAt time.Time) error {
	query := `
		INSERT INTO refresh_tokens (user_id, token, expires_at)
		VALUES ($1, $2, $3)`
	_, err := r.db.Exec(ctx, query, userID, token, expiresAt)
	if err != nil {
		return err
	}

	return nil
}

// UpsertUser implements [Repository].
func (r *repository) UpsertUser(ctx context.Context, email string, name string, avatarURL string, provider string, providerID string) (*entities.Users, error) {
	var u entities.Users

	query := `
		INSERT INTO users (email, name, avatar_url, provider, provider_id)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (provider, provider_id) DO UPDATE SET
			name = EXCLUDED.name,
			avatar_url = EXCLUDED.avatar_url,
			updated_at = NOW()
		RETURNING id, email, name, avatar_url, provider, provider_id, role, created_at, updated_at`

	err := r.db.QueryRow(ctx, query, email, name, avatarURL, provider, providerID).Scan(
		&u.ID, &u.Email, &u.Name, &u.AvatarURL,
		&u.Provider, &u.ProviderID, &u.Role,
		&u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &u, nil
}
