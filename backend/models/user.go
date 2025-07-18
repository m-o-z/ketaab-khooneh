package models

import (
	"errors"
	"strings"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

// User matches PocketBase _pb_users_auth_ collection. Central canonical User model for all codebase.
type User struct {
	core.BaseRecordProxy
	expanded map[string]any
}

// NewUser returns a validated User instance; required fields must be provided.
func NewUser(id, password, tokenKey, email string, opts ...func(*User)) (*User, error) {
	if len(id) != 15 || !isAlnumLower(id) {
		return nil, errors.New("invalid id: must be 15 lowercase letters and digits")
	}
	if len(password) < 8 {
		return nil, errors.New("password must be at least 8 characters")
	}
	if len(tokenKey) < 30 || len(tokenKey) > 60 {
		return nil, errors.New("tokenKey must be 30 to 60 chars")
	}
	if !strings.Contains(email, "@") {
		return nil, errors.New("invalid email address")
	}
	u := &User{}
	u.SetId(id)
	u.SetPassword(password)
	u.SetTokenKey(tokenKey)
	u.SetEmail(email)
	for _, opt := range opts {
		opt(u)
	}
	return u, nil
}

// -- Optionals: Use only as functional options in NewUser.
func withEmailVisibility(v bool) func(*User) { return func(u *User) { u.SetEmailVisibility(v) } }
func withVerified(v bool) func(*User)        { return func(u *User) { u.SetVerified(v) } }
func withAvatar(filename string) func(*User) { return func(u *User) { u.SetAvatar(filename) } }
func withFirstName(fn string) func(*User)    { return func(u *User) { u.SetFirstName(fn) } }
func withLastName(ln string) func(*User)     { return func(u *User) { u.SetLastName(ln) } }
func withIsPunished(v bool) func(*User)      { return func(u *User) { u.SetIsPunished(v) } }
func withPunishmentEndAt(dt types.DateTime) func(*User) {
	return func(u *User) { u.SetPunishmentEndAt(dt) }
}
func withIsProfileCompleted(v bool) func(*User) { return func(u *User) { u.SetIsProfileCompleted(v) } }

// LoadFromRecord populates the User fields from a PocketBase Record.
func (u *User) LoadFromRecord(rec *core.Record) *User {
	u.SetProxyRecord(rec)
	return u
}

// ID returns the user id.
func (u *User) Id() string { return u.GetString("id") }

// SetId sets the user id.
func (u *User) SetId(id string) { u.Set("id", id) }

// Password returns the user password hash.
func (u *User) Password() string { return u.GetString("password") }

// SetPassword sets the password hash.
func (u *User) SetPassword(v string) { u.Set("password", v) }

// TokenKey returns the user tokenKey.
func (u *User) TokenKey() string { return u.GetString("tokenKey") }

// SetTokenKey sets the tokenKey.
func (u *User) SetTokenKey(v string) { u.Set("tokenKey", v) }

// Email returns the user email.
func (u *User) Email() string { return u.GetString("email") }

// SetEmail sets the user email.
func (u *User) SetEmail(v string) { u.Set("email", v) }

// EmailVisibility returns the emailVisibility flag.
func (u *User) EmailVisibility() bool { return u.GetBool("emailVisibility") }

// SetEmailVisibility sets emailVisibility.
func (u *User) SetEmailVisibility(v bool) { u.Set("emailVisibility", v) }

// Verified returns whether the user is verified.
func (u *User) Verified() bool { return u.GetBool("verified") }

// SetVerified sets the verified flag.
func (u *User) SetVerified(v bool) { u.Set("verified", v) }

// Avatar returns the avatar filename.
func (u *User) Avatar() string { return u.GetString("avatar") }

// SetAvatar sets the avatar filename.
func (u *User) SetAvatar(fn string) { u.Set("avatar", fn) }

// FirstName returns user's first name.
func (u *User) FirstName() string { return u.GetString("firstName") }

// SetFirstName sets the first name.
func (u *User) SetFirstName(v string) { u.Set("firstName", v) }

// LastName returns user's last name.
func (u *User) LastName() string { return u.GetString("lastName") }

// SetLastName sets the last name.
func (u *User) SetLastName(v string) { u.Set("lastName", v) }

// IsPunished returns the punishment status.
func (u *User) IsPunished() bool { return u.GetBool("isPunished") }

// SetIsPunished sets the punishment status.
func (u *User) SetIsPunished(v bool) { u.Set("isPunished", v) }

// PunishmentEndAt returns the punishment end time.
func (u *User) PunishmentEndAt() types.DateTime { return u.GetDateTime("punishmentEndAt") }

// SetPunishmentEndAt sets the punishment end time.
func (u *User) SetPunishmentEndAt(dt types.DateTime) { u.Set("punishmentEndAt", dt) }

// IsProfileCompleted returns true if profile is completed.
func (u *User) IsProfileCompleted() bool { return u.GetBool("isProfileCompleted") }

// SetIsProfileCompleted sets the profile completion flag.
func (u *User) SetIsProfileCompleted(v bool) { u.Set("isProfileCompleted", v) }

// Created returns created time.
func (u *User) Created() types.DateTime { return u.GetDateTime("created") }

// Updated returns updated time.
func (u *User) Updated() types.DateTime { return u.GetDateTime("updated") }

// HasExpanded checks if expanded field is present.
func (u *User) HasExpanded(field string) bool {
	if u.expanded == nil {
		return false
	}
	_, ok := u.expanded[field]
	return ok
}

// isAlnumLower returns true if id is exactly 15 chars a-z0-9.
func isAlnumLower(id string) bool {
	if len(id) != 15 {
		return false
	}
	for _, ch := range id {
		if (ch < 'a' || ch > 'z') && (ch < '0' || ch > '9') {
			return false
		}
	}
	return true
}
