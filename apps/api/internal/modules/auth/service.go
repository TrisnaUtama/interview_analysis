package auth

import (
	"ai-interview-api/internal/configs"
	"ai-interview-api/internal/entities"
	"ai-interview-api/pkg/jwt"
	"ai-interview-api/pkg/logger"
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"time"

	"go.uber.org/zap"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type Service interface {
	GetGoogleAuthURL(state string) string
	HandleGoogleCallback(ctx context.Context, code string) (*entities.Users, string, string, error)
	RefreshAccessToken(ctx context.Context, refreshToken string) (string, error)
	Logout(ctx context.Context, refreshToken string) error
	GetMe(ctx context.Context, id string) (*entities.Users, error)
	GetFrontendURL() string    
}

type service struct {
	repo        Repository
	oauthConfig *oauth2.Config
	cfg         *configs.Setting
}

func NewService(repo Repository, cfg *configs.Setting) Service {
	oauthConfig := &oauth2.Config{
		ClientID:     cfg.OAUTH.ClientId,
		ClientSecret: cfg.OAUTH.ClientSecret,
		RedirectURL:  cfg.OAUTH.RedirectUrl,
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}

	return &service{
		repo:        repo,
		oauthConfig: oauthConfig,
		cfg:         cfg,
	}
}

func (s *service) GetMe(ctx context.Context, id string) (*entities.Users, error){
	u, err := s.repo.GetOne(ctx, id)
	if err != nil {
		return nil, err
	}

	return u, err
}

// GetGoogleAuthURL implements [Service].
func (s *service) GetGoogleAuthURL(state string) string {
	return s.oauthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)
}

func (s *service) GetFrontendURL() string {
	return s.cfg.App.FrontEndUrl
}

// HandleGoogleCallback implements [Service].
func (s *service) HandleGoogleCallback(ctx context.Context, code string) (*entities.Users, string, string, error) {
	googleToken, err := s.oauthConfig.Exchange(ctx, code)
	if err != nil {
		logger.Error("failed to exchange google code", zap.Error(err))
		return nil, "", "", err
	}
	client := s.oauthConfig.Client(ctx, googleToken)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		logger.Error("failed to get google user info", zap.Error(err))
		return nil, "", "", err
	}
	defer resp.Body.Close()

	var googleUser struct {
		ID      string `json:"id"`
		Email   string `json:"email"`
		Name    string `json:"name"`
		Picture string `json:"picture"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&googleUser); err != nil {
		logger.Error("failed to decode google user", zap.Error(err))
		return nil, "", "", err
	}

	user, err := s.repo.UpsertUser(ctx,
		googleUser.Email,
		googleUser.Name,
		googleUser.Picture,
		"google",
		googleUser.ID,
	)
	if err != nil {
		logger.Error("failed to upsert user", zap.Error(err))
		return nil, "", "", err
	}

	accessToken, err := jwt.GenerateAccessToken(
		user.ID,
		user.Email,
		string(user.Role),
		s.cfg.App.Key,
	)
	if err != nil {
		logger.Error("failed to generate access token", zap.Error(err))
		return nil, "", "", err
	}

	refreshToken, err := generateRefreshToken()
	if err != nil {
		logger.Error("failed to generate refresh token", zap.Error(err))
		return nil, "", "", err
	}

	expiresAt := time.Now().Add(7 * 24 * time.Hour)
	if err := s.repo.SaveRefreshToken(ctx, user.ID, refreshToken, expiresAt); err != nil {
		logger.Error("failed to save refresh token", zap.Error(err))
		return nil, "", "", err
	}

	logger.Info("user logged in via google",
		zap.String("user_id", user.ID),
		zap.String("email", user.Email),
	)

	return user, accessToken, refreshToken, nil
}

// Logout implements [Service].
func (s *service) Logout(ctx context.Context, refreshToken string) error {
	return s.repo.DeleteRefreshToken(ctx, refreshToken)

}

// RefreshAccessToken implements [Service].
func (s *service) RefreshAccessToken(ctx context.Context, refreshToken string) (string, error) {
	rt, err := s.repo.GetRefreshToken(ctx, refreshToken)
	if err != nil {
		return "", fmt.Errorf("invalid refresh token")
	}

	accessToken, err := jwt.GenerateAccessToken(
		rt.UserID,
		"",
		"",
		s.cfg.App.Key,
	)
	if err != nil {
		return "", err
	}

	return accessToken, nil
}

func generateRefreshToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}
