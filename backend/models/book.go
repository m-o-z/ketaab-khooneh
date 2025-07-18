package models

import (
	"errors"
	"log"
	"strings"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

// Book model with expand support
type Book struct {
	core.BaseRecordProxy
	expanded map[string]interface{} // stores PB expanded relations at runtime (not persisted)
}

// --- Constructor with required+optional fields ---
func NewBook(
	bookWorkId string,
	opts ...func(*Book),
) (*Book, error) {
	if strings.TrimSpace(bookWorkId) == "" {
		return nil, errors.New("bookWorkId required")
	}
	b := &Book{
		expanded: make(map[string]interface{}),
	}

	b.SetBookWorkId(bookWorkId)
	for _, opt := range opts {
		opt(b)
	}
	return b, nil
}

// --- Functional option helpers for optional fields ---
func WithBookISBN(isbn string) func(*Book)      { return func(b *Book) { b.SetISBN(isbn) } }
func WithBookCategoryId(cid string) func(*Book) { return func(b *Book) { b.SetCategoryId(cid) } }
func WithBookAvailable(avail bool) func(*Book)  { return func(b *Book) { b.SetAvailable(avail) } }

// --- Load record (and expands if any) ---
func (b *Book) LoadFromRecord(rec *core.Record) *Book {
	b.SetProxyRecord(rec)
	// Defensive: always ensure expanded is usable
	if b.expanded == nil {
		b.expanded = make(map[string]interface{})
	}
	if result := rec.ExpandedOne("bookWork"); result != nil {
		log.Println("result", result)
		b.expanded["bookWork"] = result
	}
	return b
}

// --- Field Getters/Setters ---
func (b *Book) BookWorkId() string      { return b.GetString("bookWork") }
func (b *Book) SetBookWorkId(s string)  { b.Set("bookWork", s) }
func (b *Book) ISBN() string            { return b.GetString("isbn") }
func (b *Book) SetISBN(s string)        { b.Set("isbn", s) }
func (b *Book) CategoryId() string      { return b.GetString("categoryId") }
func (b *Book) SetCategoryId(s string)  { b.Set("categoryId", s) }
func (b *Book) Available() bool         { return b.GetBool("available") }
func (b *Book) SetAvailable(v bool)     { b.Set("available", v) }
func (b *Book) Created() types.DateTime { return b.GetDateTime("created") }
func (b *Book) Updated() types.DateTime { return b.GetDateTime("updated") }

// --- Expand helpers ---
// HasExpanded checks if specified relation was expanded and present
func (b *Book) HasExpanded(field string) bool {
	if b.expanded == nil {
		return false
	}
	_, ok := b.expanded[field]
	return ok
}

// ExpandedBookWork returns the expanded BookWork model if present, or nil
func (b *Book) ExpandedBookWork() *BookWork {
	if b.expanded == nil {
		return nil
	}
	raw, ok := b.expanded["bookWork"] // fixed key: use "bookWork"
	if !ok || raw == nil {
		return nil
	}
	rec, ok := raw.(*core.Record)
	if !ok || rec == nil {
		return nil
	}
	return new(BookWork).LoadFromRecord(rec)
}

// Generic helper for any expanded *single* relation
func (b *Book) ExpandedRecord(field string) *core.Record {
	if b.expanded == nil {
		return nil
	}
	raw, ok := b.expanded[field]
	if !ok {
		return nil
	}
	rec, ok := raw.(*core.Record)
	if !ok {
		return nil
	}
	return rec
}
