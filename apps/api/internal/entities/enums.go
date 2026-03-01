package entities

type AuthProvider string
type UserRole string
type JobAnalysisStatus string
type JobSourceType string
type InterviewType string
type InterviewStatus string
type HiringRecommendation string

const (
	// AuthProvider
	AuthProviderGoogle AuthProvider = "google"

	// UserRole
	UserRoleUser  UserRole = "user"
	UserRoleAdmin UserRole = "admin"

	// JobAnalysisStatus
	JobAnalysisStatusPending   JobAnalysisStatus = "pending"
	JobAnalysisStatusScraping  JobAnalysisStatus = "scraping"
	JobAnalysisStatusAnalyzing JobAnalysisStatus = "analyzing"
	JobAnalysisStatusCompleted JobAnalysisStatus = "completed"
	JobAnalysisStatusFailed    JobAnalysisStatus = "failed"

	// JobSourceType
	JobSourceTypeManual JobSourceType = "manual"
	JobSourceTypeURL    JobSourceType = "url"

	// InterviewType
	InterviewTypeHR   InterviewType = "HR"
	InterviewTypeUser InterviewType = "USER"

	// InterviewStatus
	InterviewStatusDraft      InterviewStatus = "draft"
	InterviewStatusActive     InterviewStatus = "active"
	InterviewStatusEvaluating InterviewStatus = "evaluating"
	InterviewStatusCompleted  InterviewStatus = "completed"

	// HiringRecommendation
	HiringRecommendationReject    HiringRecommendation = "reject"
	HiringRecommendationConsider  HiringRecommendation = "consider"
	HiringRecommendationStrongYes HiringRecommendation = "strong_yes"
)
