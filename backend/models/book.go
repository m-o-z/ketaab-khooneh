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
	totalCount int,
	availableCount float64,
	edition string,
	releaseYear types.DateTime,
	status string,
	isbn float64,
	opts ...func(*Book),
) (*Book, error) {
	if strings.TrimSpace(bookWorkId) == "" {
		return nil, errors.New("bookWorkId required")
	}
	if totalCount < 1 || totalCount > 9999 {
		return nil, errors.New("totalCount must be between 1 and 9999")
	}
	if availableCount < 0 || availableCount > 10 {
		return nil, errors.New("availableCount must be between 0 and 10")
	}
	if len(edition) < 1 || len(edition) > 10 {
		return nil, errors.New("edition must be between 1 and 10 characters")
	}
	if status != "AVAILABLE" && status != "DAMAGED" && status != "UNAVAILABLE" {
		return nil, errors.New("status must be AVAILABLE, DAMAGED, or UNAVAILABLE")
	}

	b := &Book{
		expanded: make(map[string]interface{}),
	}
	b.SetBookWorkId(bookWorkId)
	b.SetTotalCount(totalCount)
	b.SetAvailableCount(availableCount)
	b.SetEdition(edition)
	b.SetReleaseYear(releaseYear)
	b.SetStatus(status)
	b.SetISBN(isbn)

	for _, opt := range opts {
		opt(b)
	}
	return b, nil
}

// --- Functional option helpers for optional fields ---
func WithBookSubTitle(subTitle string) func(*Book) { return func(b *Book) { b.SetSubTitle(subTitle) } }
func WithBookShortDescription(desc string) func(*Book) {
	return func(b *Book) { b.SetShortDescription(desc) }
}
func WithBookDescription(desc string) func(*Book) { return func(b *Book) { b.SetDescription(desc) } }
func WithBookCoverImage(img []string) func(*Book) { return func(b *Book) { b.SetCoverImage(img) } }
func WithBookLanguage(lang string) func(*Book)    { return func(b *Book) { b.SetLanguage(lang) } }

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

// Required fields
func (b *Book) BookWorkId() string     { return b.GetString("bookWork") }
func (b *Book) SetBookWorkId(s string) { b.Set("bookWork", s) }

func (b *Book) TotalCount() int     { return b.GetInt("totalCount") }
func (b *Book) SetTotalCount(v int) { b.Set("totalCount", v) }

func (b *Book) AvailableCount() float64     { return b.GetFloat("availableCount") }
func (b *Book) SetAvailableCount(v float64) { b.Set("availableCount", v) }

func (b *Book) Edition() string     { return b.GetString("edition") }
func (b *Book) SetEdition(s string) { b.Set("edition", s) }

func (b *Book) ReleaseYear() types.DateTime     { return b.GetDateTime("releaseYear") }
func (b *Book) SetReleaseYear(d types.DateTime) { b.Set("releaseYear", d) }

func (b *Book) Status() string     { return b.GetString("status") }
func (b *Book) SetStatus(s string) { b.Set("status", s) }

func (b *Book) ISBN() float64     { return b.GetFloat("isbn") }
func (b *Book) SetISBN(v float64) { b.Set("isbn", v) }

// Optional fields
func (b *Book) SubTitle() string     { return b.GetString("subTitle") }
func (b *Book) SetSubTitle(s string) { b.Set("subTitle", s) }

func (b *Book) ShortDescription() string     { return b.GetString("shortDescription") }
func (b *Book) SetShortDescription(s string) { b.Set("shortDescription", s) }

func (b *Book) Description() string     { return b.GetString("description") }
func (b *Book) SetDescription(s string) { b.Set("description", s) }

func (b *Book) CoverImage() []string         { return b.GetStringSlice("coverImage") }
func (b *Book) SetCoverImage(files []string) { b.Set("coverImage", files) }

func (b *Book) Language() string     { return b.GetString("language") }
func (b *Book) SetLanguage(s string) { b.Set("language", s) }

// System fields
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
	raw, ok := b.expanded["bookWork"]
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
