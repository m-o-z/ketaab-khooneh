package models

import (
	"errors"
	"strings"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

var _ core.RecordProxy = (*Author)(nil)

type Author struct {
	core.BaseRecordProxy
}

func NewAuthor(
	name string,
	opts ...func(*Author),
) (*Author, error) {
	if strings.TrimSpace(name) == "" {
		return nil, errors.New("name is required")
	}
	a := &Author{}
	a.SetName(name)
	for _, opt := range opts {
		opt(a)
	}
	return a, nil
}

func WithAuthorBio(b string) func(*Author)     { return func(a *Author) { a.SetBio(b) } }
func WithAuthorAvatar(av string) func(*Author) { return func(a *Author) { a.SetAvatar(av) } }

func (a *Author) LoadFromRecord(rec *core.Record) *Author {
	a.SetProxyRecord(rec)
	return a
}

func (a *Author) Name() string            { return a.GetString("name") }
func (a *Author) SetName(s string)        { a.Set("name", s) }
func (a *Author) Bio() string             { return a.GetString("bio") }
func (a *Author) SetBio(s string)         { a.Set("bio", s) }
func (a *Author) Avatar() string          { return a.GetString("avatar") }
func (a *Author) SetAvatar(s string)      { a.Set("avatar", s) }
func (a *Author) Created() types.DateTime { return a.GetDateTime("created") }
func (a *Author) Updated() types.DateTime { return a.GetDateTime("updated") }
