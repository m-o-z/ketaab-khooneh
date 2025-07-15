package models

type Status string

const (
	StatusAvailable   Status = "AVAILABLE"
	StatusUnavailable Status = "UNAVAILABLE"
	StatusDamaged     Status = "DAMAGED"
)

type BorrowDBQuery struct {
	AvailableCount int    `json:"availableCount"`
	Status         Status `json:"status"`
}

type BorrowRequest struct {
	BookID   string `json:"bookId"`
	UserID   string `json:"userId"`
	Duration int    `json:"duration"`
}

type ReturnBorrowRequest struct {
	BorrowId        string `json:"borrowId"`
	ShouldPunished  bool   `json:"shouldPunished"`
	PunishmentEndAt string `json:"punishmentEndAt"`
}
