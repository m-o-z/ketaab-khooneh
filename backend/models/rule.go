package models

import (
	"errors"
	"strings"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

var _ core.RecordProxy = (*Rule)(nil)

type Rule struct {
	core.BaseRecordProxy
}

func NewRule(
	name string,
	opts ...func(*Rule),
) (*Rule, error) {
	if strings.TrimSpace(name) == "" {
		return nil, errors.New("name required")
	}
	r := &Rule{}
	r.SetName(name)
	for _, opt := range opts {
		opt(r)
	}
	return r, nil
}

func WithRuleDescription(s string) func(*Rule) { return func(r *Rule) { r.SetDescription(s) } }

func (r *Rule) LoadFromRecord(rec *core.Record) *Rule { r.SetProxyRecord(rec); return r }
func (r *Rule) Name() string                          { return r.GetString("name") }
func (r *Rule) SetName(s string)                      { r.Set("name", s) }
func (r *Rule) Description() string                   { return r.GetString("description") }
func (r *Rule) SetDescription(s string)               { r.Set("description", s) }
func (r *Rule) Created() types.DateTime               { return r.GetDateTime("created") }
func (r *Rule) Updated() types.DateTime               { return r.GetDateTime("updated") }
