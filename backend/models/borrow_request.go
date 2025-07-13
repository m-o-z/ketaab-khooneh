package models

type BorrowRequest struct {
	BookID   string `json:"bookId"`
	UserID   string `json:"userId"`
	Duration int    `json:"duration"`
}
