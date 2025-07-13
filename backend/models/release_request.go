package models

type BookReleaseRequest struct {
	UserEmails []string `json:"emails" form:"emails"`
	BookTitle  string   `json:"title" form:"title"`
	BookId     string   `json:"bookId" form:"bookId"`
}
