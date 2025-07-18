package models

import (
	"errors"
	"strings"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

var _ core.RecordProxy = (*Borrow)(nil)

type Borrow struct {
	core.BaseRecordProxy
}

func NewBorrow(
	bookId, userId string,
	opts ...func(*Borrow),
) (*Borrow, error) {
	if strings.TrimSpace(bookId) == "" || strings.TrimSpace(userId) == "" {
		return nil, errors.New("bookId and userId required")
	}
	b := &Borrow{}
	b.SetBookId(bookId)
	b.SetUserId(userId)
	for _, opt := range opts {
		opt(b)
	}
	return b, nil
}

func WithBorrowDueAt(dt types.DateTime) func(*Borrow) { return func(b *Borrow) { b.SetDueAt(dt) } }
func WithBorrowReturned(val bool) func(*Borrow)       { return func(b *Borrow) { b.SetReturned(val) } }
func WithBorrowBorrowedAt(dt types.DateTime) func(*Borrow) {
	return func(b *Borrow) { b.SetBorrowedAt(dt) }
}

func (b *Borrow) LoadFromRecord(rec *core.Record) *Borrow { b.SetProxyRecord(rec); return b }
func (b *Borrow) BookId() string                          { return b.GetString("bookId") }
func (b *Borrow) SetBookId(s string)                      { b.Set("bookId", s) }
func (b *Borrow) UserId() string                          { return b.GetString("userId") }
func (b *Borrow) SetUserId(s string)                      { b.Set("userId", s) }
func (b *Borrow) DueAt() types.DateTime                   { return b.GetDateTime("dueAt") }
func (b *Borrow) SetDueAt(dt types.DateTime)              { b.Set("dueAt", dt) }
func (b *Borrow) Returned() bool                          { return b.GetBool("returned") }
func (b *Borrow) SetReturned(val bool)                    { b.Set("returned", val) }
func (b *Borrow) BorrowedAt() types.DateTime              { return b.GetDateTime("borrowedAt") }
func (b *Borrow) SetBorrowedAt(dt types.DateTime)         { b.Set("borrowedAt", dt) }
func (b *Borrow) Created() types.DateTime                 { return b.GetDateTime("created") }
func (b *Borrow) Updated() types.DateTime                 { return b.GetDateTime("updated") }
