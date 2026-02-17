package entities

import "time"

type Jobs struct {
	ID          string
	CompanyName string
	Position    *string
	CreatedBy   string
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   *time.Time
}
