package entities

import "time"

type Users struct {
	ID           string
	Email        string
	Name         *string
	AvatarURL    *string
	Provider     string
	ProviderID   string
	PasswordHash *string
	Role         string
	CreatedAt    time.Time
	UpdatedAt    time.Time
	DeletedAt    *time.Time
}
