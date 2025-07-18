package models

import (
	"errors"
	"strings"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

var _ core.RecordProxy = (*Category)(nil)

type Category struct {
	core.BaseRecordProxy
}

func NewCategory(
	title string,
	opts ...func(*Category),
) (*Category, error) {
	if strings.TrimSpace(title) == "" {
		return nil, errors.New("title required")
	}
	c := &Category{}
	c.SetTitle(title)
	for _, opt := range opts {
		opt(c)
	}
	return c, nil
}

func WithCategoryParentId(pid string) func(*Category) {
	return func(c *Category) { c.SetParentId(pid) }
}

func (c *Category) LoadFromRecord(rec *core.Record) *Category { c.SetProxyRecord(rec); return c }
func (c *Category) Title() string                             { return c.GetString("title") }
func (c *Category) SetTitle(s string)                         { c.Set("title", s) }
func (c *Category) ParentId() string                          { return c.GetString("parentId") }
func (c *Category) SetParentId(s string)                      { c.Set("parentId", s) }
func (c *Category) Created() types.DateTime                   { return c.GetDateTime("created") }
func (c *Category) Updated() types.DateTime                   { return c.GetDateTime("updated") }
