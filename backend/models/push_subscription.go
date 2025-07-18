package models

import (
	"errors"
	"net/url"
	"regexp"
	"strings"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

// Ensure interface compliance
var _ core.RecordProxy = (*PushSubscription)(nil)

type PushSubscription struct {
	core.BaseRecordProxy
}

// --- Constructor ---
func NewPushSubscription(
	id string,
	endpoint string,
	user string,
	auth string,
	p256dh string,
	opts ...func(*PushSubscription),
) (*PushSubscription, error) {
	// id: required, 15 chars, a-z0-9 only
	if len(id) != 15 || !regexp.MustCompile(`^[a-z0-9]{15}$`).MatchString(id) {
		return nil, errors.New("id must be 15 chars of lowercase letters or digits")
	}
	// endpoint: required, valid URL
	if endpoint == "" {
		return nil, errors.New("endpoint is required")
	}
	if _, err := url.ParseRequestURI(endpoint); err != nil {
		return nil, errors.New("endpoint must be a valid URL")
	}
	// user: required, non-empty
	if strings.TrimSpace(user) == "" {
		return nil, errors.New("user is required")
	}
	// auth: required, non-empty
	if strings.TrimSpace(auth) == "" {
		return nil, errors.New("auth is required")
	}
	// p256dh: required, non-empty
	if strings.TrimSpace(p256dh) == "" {
		return nil, errors.New("p256dh is required")
	}

	ps := &PushSubscription{}
	ps.SetID(id)
	ps.SetEndpoint(endpoint)
	ps.SetUser(user)
	ps.SetAuth(auth)
	ps.SetP256dh(p256dh)

	for _, opt := range opts {
		opt(ps)
	}
	return ps, nil
}

// --- Functional Option for expirationTime ---
func WithExpirationTime(exp types.DateTime) func(*PushSubscription) {
	return func(ps *PushSubscription) {
		ps.SetExpirationTime(exp)
	}
}

// --- Load from PocketBase Record ---
func (ps *PushSubscription) LoadFromRecord(rec *core.Record) *PushSubscription {
	ps.SetProxyRecord(rec)
	return ps
}

// --- Typed Getters/Setters ---
func (ps *PushSubscription) ID() string                     { return ps.GetString("id") }
func (ps *PushSubscription) SetID(val string)               { ps.Set("id", val) }
func (ps *PushSubscription) Endpoint() string               { return ps.GetString("endpoint") }
func (ps *PushSubscription) SetEndpoint(val string)         { ps.Set("endpoint", val) }
func (ps *PushSubscription) User() string                   { return ps.GetString("user") }
func (ps *PushSubscription) SetUser(val string)             { ps.Set("user", val) }
func (ps *PushSubscription) Auth() string                   { return ps.GetString("auth") }
func (ps *PushSubscription) SetAuth(val string)             { ps.Set("auth", val) }
func (ps *PushSubscription) P256dh() string                 { return ps.GetString("p256dh") }
func (ps *PushSubscription) SetP256dh(val string)           { ps.Set("p256dh", val) }
func (ps *PushSubscription) ExpirationTime() types.DateTime { return ps.GetDateTime("expirationTime") }
func (ps *PushSubscription) SetExpirationTime(val types.DateTime) {
	ps.Set("expirationTime", val)
}
func (ps *PushSubscription) Created() types.DateTime { return ps.GetDateTime("created") }
func (ps *PushSubscription) Updated() types.DateTime { return ps.GetDateTime("updated") }
