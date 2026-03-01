package minio

import (
	"context"
	"fmt"
	"mime/multipart"
	"path/filepath"
	"time"

	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type MinioClient struct {
	client          *minio.Client
	bucketInterview string
}

func NewMinioClient(endpoint, accessKey, secretKey, bucketInterview string, ssl bool) (*MinioClient, error) {
	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: ssl,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create minio client: %w", err)
	}

	return &MinioClient{
		client:          client,
		bucketInterview: bucketInterview,
	}, nil
}

type UploadResult struct {
	Filename string
	Size     int64
}

func (m *MinioClient) UploadResume(ctx context.Context, file multipart.File, header *multipart.FileHeader, userID string) (*UploadResult, error) {
	ext := filepath.Ext(header.Filename)
	filename := fmt.Sprintf("resumes/%s/%s%s", userID, uuid.New().String(), ext)
	info, err := m.client.PutObject(ctx, m.bucketInterview, filename, file, header.Size, minio.PutObjectOptions{
		ContentType: header.Header.Get("Content-Type"),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to upload resume: %w", err)
	}

	return &UploadResult{
		Filename: filename,
		Size:     info.Size,
	}, nil
}

func (m *MinioClient) UploadAudio(ctx context.Context, file multipart.File, header *multipart.FileHeader, interviewID string) (*UploadResult, error) {
	ext := filepath.Ext(header.Filename)
	filename := fmt.Sprintf("audio/%s/%s%s", interviewID, uuid.New().String(), ext)
	info, err := m.client.PutObject(ctx, m.bucketInterview, filename, file, header.Size, minio.PutObjectOptions{
		ContentType: header.Header.Get("Content-Type"),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to upload audio: %w", err)
	}

	return &UploadResult{
		Filename: filename,
		Size:     info.Size,
	}, nil
}

func (m *MinioClient) GetPresignedURL(ctx context.Context, filename string, expiry time.Duration) (string, error) {
	url, err := m.client.PresignedGetObject(ctx, m.bucketInterview, filename, expiry, nil)
	if err != nil {
		return "", fmt.Errorf("failed to generate presigned url: %w", err)
	}

	return url.String(), nil
}

func (m *MinioClient) Delete(ctx context.Context, filename string) error {
	err := m.client.RemoveObject(ctx, m.bucketInterview, filename, minio.RemoveObjectOptions{})
	if err != nil {
		return fmt.Errorf("failed to delete object: %w", err)
	}

	return nil
}
