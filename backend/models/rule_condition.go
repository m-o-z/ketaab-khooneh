package models

import (
	"errors"
	"strings"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

var _ core.RecordProxy = (*RuleCondition)(nil)

type RuleCondition struct {
	core.BaseRecordProxy
}

func NewRuleCondition(
	ruleId string,
	opts ...func(*RuleCondition),
) (*RuleCondition, error) {
	if strings.TrimSpace(ruleId) == "" {
		return nil, errors.New("ruleId required")
	}
	r := &RuleCondition{}
	r.SetRuleId(ruleId)
	for _, opt := range opts {
		opt(r)
	}
	return r, nil
}

func WithRuleConditionParamKey(k string) func(*RuleCondition) {
	return func(r *RuleCondition) { r.SetParamKey(k) }
}
func WithRuleConditionParamValue(v string) func(*RuleCondition) {
	return func(r *RuleCondition) { r.SetParamValue(v) }
}

func (r *RuleCondition) LoadFromRecord(rec *core.Record) *RuleCondition {
	r.SetProxyRecord(rec)
	return r
}
func (r *RuleCondition) RuleId() string          { return r.GetString("ruleId") }
func (r *RuleCondition) SetRuleId(s string)      { r.Set("ruleId", s) }
func (r *RuleCondition) ParamKey() string        { return r.GetString("paramKey") }
func (r *RuleCondition) SetParamKey(s string)    { r.Set("paramKey", s) }
func (r *RuleCondition) ParamValue() string      { return r.GetString("paramValue") }
func (r *RuleCondition) SetParamValue(s string)  { r.Set("paramValue", s) }
func (r *RuleCondition) Created() types.DateTime { return r.GetDateTime("created") }
func (r *RuleCondition) Updated() types.DateTime { return r.GetDateTime("updated") }
