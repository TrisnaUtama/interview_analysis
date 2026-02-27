package auth

import (
	"ai-interview-api/internal/entities"
	"time"
)

type UserResponse struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	AvatarURL string    `json:"avatar_url"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
}

type TokenResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresAt   int    `json:"expires_at"`
}

type AuthResponse struct {
	User  UserResponse  `json:"user"`
	Token TokenResponse `json:"token"`
}

type googleUserInfo struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}

func toUserResponse(u *entities.Users) UserResponse {
	var name, avatarURL string

	if u.Name != nil {
		name = *u.Name
	}
	if u.AvatarURL != nil {
		avatarURL = *u.AvatarURL
	}

	return UserResponse{
		ID:        u.ID,
		Email:     u.Email,
		Name:      name,
		AvatarURL: avatarURL,
		Role:      string(u.Role),
		CreatedAt: u.CreatedAt,
	}
}
