package httpclient

import (
	"ai-interview-api/pkg/logger"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"go.uber.org/zap"
)

type Client struct {
	baseURL    string
	httpClient *http.Client
	headers    map[string]string
}

type Option func(*Client)

func WithTimeout(timeout time.Duration) Option {
	return func(c *Client) {
		c.httpClient.Timeout = timeout
	}
}

func WithHeader(key, value string) Option {
	return func(c *Client) {
		c.headers[key] = value
	}
}

func WithAPIKey(apiKey string) Option {
	return func(c *Client) {
		c.headers["X-API-Key"] = apiKey
	}
}

func NewClient(baseURL string, opts ...Option) *Client {
	c := &Client{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
		headers: map[string]string{
			"Content-Type": "application/json",
		},
	}

	for _, opt := range opts {
		opt(c)
	}

	return c
}

type Response[T any] struct {
	Data       T
	StatusCode int
}

func (c *Client) Get(ctx context.Context, path string, result any) (*Response[any], error) {
	return c.do(ctx, http.MethodGet, path, nil, result)
}

func (c *Client) Post(ctx context.Context, path string, body any, result any) (*Response[any], error) {
	return c.do(ctx, http.MethodPost, path, body, result)
}

func (c *Client) Put(ctx context.Context, path string, body any, result any) (*Response[any], error) {
	return c.do(ctx, http.MethodPut, path, body, result)
}

func (c *Client) Delete(ctx context.Context, path string, result any) (*Response[any], error) {
	return c.do(ctx, http.MethodDelete, path, nil, result)
}

func (c *Client) do(ctx context.Context, method, path string, body any, result any) (*Response[any], error) {
	var bodyReader io.Reader
	fullURL := c.baseURL + path

	if body != nil {
		b, err := json.Marshal(body)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal request body: %w", err)
		}
		bodyReader = bytes.NewBuffer(b)
	}

	req, err := http.NewRequestWithContext(ctx, method, fullURL, bodyReader)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	for k, v := range c.headers {
		req.Header.Set(k, v)
	}

	logger.Info("outgoing request",
		zap.String("method", method),
		zap.String("url", fullURL),
	)

	start := time.Now()
	resp, err := c.httpClient.Do(req)
	elapsed := time.Since(start)

	if err != nil {
		logger.Error("request failed",
			zap.String("method", method),
			zap.String("url", fullURL),
			zap.Duration("elapsed", elapsed),
			zap.Error(err),
		)
		return nil, fmt.Errorf("failed to do request: %w", err)
	}
	defer resp.Body.Close()

	logger.Info("response received",
		zap.String("method", method),
		zap.String("url", fullURL),
		zap.Int("status", resp.StatusCode),
		zap.Duration("elapsed", elapsed),
	)

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("request failed with status: %d", resp.StatusCode)
	}

	if result != nil {
		if err := json.NewDecoder(resp.Body).Decode(result); err != nil {
			return nil, fmt.Errorf("failed to decode response: %w", err)
		}
	}

	return &Response[any]{
		Data:       result,
		StatusCode: resp.StatusCode,
	}, nil
}
