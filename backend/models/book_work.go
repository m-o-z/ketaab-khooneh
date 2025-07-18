package models

import (
	"errors"
	"strings"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

var _ core.RecordProxy = (*BookWork)(nil)

type BookWork struct {
	core.BaseRecordProxy
}

func NewBookWork(
	title, authorId string,
	opts ...func(*BookWork),
) (*BookWork, error) {
	if strings.TrimSpace(title) == "" {
		return nil, errors.New("title required")
	}
	if strings.TrimSpace(authorId) == "" {
		return nil, errors.New("authorId required")
	}
	b := &BookWork{}
	b.SetTitle(title)
	b.SetAuthorId(authorId)
	for _, opt := range opts {
		opt(b)
	}
	return b, nil
}

func WithBookWorkDescription(s string) func(*BookWork) {
	return func(b *BookWork) { b.SetDescription(s) }
}
func WithBookWorkCovers(covers []string) func(*BookWork) {
	return func(b *BookWork) { b.SetCovers(covers) }
}

func (b *BookWork) LoadFromRecord(rec *core.Record) *BookWork {
	b.SetProxyRecord(rec)
	return b
}
func (b *BookWork) Title() string           { return b.GetString("title") }
func (b *BookWork) SetTitle(s string)       { b.Set("title", s) }
func (b *BookWork) AuthorId() string        { return b.GetString("authorId") }
func (b *BookWork) SetAuthorId(s string)    { b.Set("authorId", s) }
func (b *BookWork) Description() string     { return b.GetString("description") }
func (b *BookWork) SetDescription(s string) { b.Set("description", s) }
func (b *BookWork) Covers() []string        { return b.GetStringSlice("covers") }
func (b *BookWork) SetCovers(v []string)    { b.Set("covers", v) }
func (b *BookWork) Created() types.DateTime { return b.GetDateTime("created") }
func (b *BookWork) Updated() types.DateTime { return b.GetDateTime("updated") }
