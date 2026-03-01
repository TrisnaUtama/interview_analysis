package entities

import "time"

type Users struct {
	ID           string
	Email        string
	Name         *string
	AvatarURL    *string
	Provider     AuthProvider
	ProviderID   string
	PasswordHash *string
	Role         UserRole
	CreatedAt    time.Time
	UpdatedAt    time.Time
	DeletedAt    *time.Time
}
