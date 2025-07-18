package models

import (
	"errors"
	"strings"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

type Subscription struct {
	core.BaseRecordProxy
	expanded map[string]interface{} // stores PB expanded relations at runtime (not persisted)
}

func NewSubscription(
	userId string,
	targetCollection string,
	recordId string,
	event string,
	opts ...func(*Subscription),
) (*Subscription, error) {
	if strings.TrimSpace(userId) == "" {
		return nil, errors.New("userId is required")
	}
	if strings.TrimSpace(targetCollection) == "" {
		return nil, errors.New("targetCollection is required")
	}
	if strings.TrimSpace(recordId) == "" {
		return nil, errors.New("recordId is required")
	}
	if strings.TrimSpace(event) == "" {
		return nil, errors.New("event is required")
	}

	s := &Subscription{
		expanded: make(map[string]interface{}),
	}

	s.SetUserId(userId)
	s.SetTargetCollection(targetCollection)
	s.SetRecordId(recordId)
	s.SetEvent(event)

	// Apply any optional configurations
	for _, opt := range opts {
		opt(s)
	}

	return s, nil
}

// --- Functional option helpers for optional fields ---

// WithSubscriptionActor sets the optional actor for the subscription.
func WithSubscriptionActor(actorId string) func(*Subscription) {
	return func(s *Subscription) { s.SetActorId(actorId) }
}

// --- Load record (and expands if any) ---

// LoadFromRecord populates the Subscription model from a PocketBase Record.
// It also handles loading any expanded relations.
func (s *Subscription) LoadFromRecord(rec *core.Record) *Subscription {
	s.SetProxyRecord(rec)
	// Defensive: always ensure expanded map is usable
	if s.expanded == nil {
		s.expanded = make(map[string]interface{})
	}
	// Load expanded 'user' relation
	if result := rec.ExpandedOne("user"); result != nil {
		s.expanded["user"] = result
	}
	// Load expanded 'actor' relation
	if result := rec.ExpandedOne("actor"); result != nil {
		s.expanded["actor"] = result
	}
	return s
}

// --- Field Getters/Setters ---

func (s *Subscription) UserId() string      { return s.GetString("user") }
func (s *Subscription) SetUserId(id string) { s.Set("user", id) }

func (s *Subscription) TargetCollection() string        { return s.GetString("targetCollection") }
func (s *Subscription) SetTargetCollection(name string) { s.Set("targetCollection", name) }

func (s *Subscription) RecordId() string      { return s.GetString("recordId") }
func (s *Subscription) SetRecordId(id string) { s.Set("recordId", id) }

func (s *Subscription) Event() string         { return s.GetString("event") }
func (s *Subscription) SetEvent(event string) { s.Set("event", event) }

func (s *Subscription) ActorId() string      { return s.GetString("actor") }
func (s *Subscription) SetActorId(id string) { s.Set("actor", id) }

func (s *Subscription) Created() types.DateTime { return s.GetDateTime("created") }
func (s *Subscription) Updated() types.DateTime { return s.GetDateTime("updated") }

// --- Expand helpers ---

// HasExpanded checks if a specified relation was expanded and is present.
func (s *Subscription) HasExpanded(field string) bool {
	if s.expanded == nil {
		return false
	}
	_, ok := s.expanded[field]
	return ok
}

// ExpandedUser returns the expanded user Record if present, otherwise nil.
func (s *Subscription) ExpandedUser() *core.Record {
	return s.ExpandedRecord("user")
}

// ExpandedActor returns the expanded actor Record if present, otherwise nil.
func (s *Subscription) ExpandedActor() *core.Record {
	return s.ExpandedRecord("actor")
}

// ExpandedRecord is a generic helper for retrieving any expanded single relation.
func (s *Subscription) ExpandedRecord(field string) *core.Record {
	if s.expanded == nil {
		return nil
	}
	raw, ok := s.expanded[field]
	if !ok || raw == nil {
		return nil
	}
	rec, ok := raw.(*core.Record)
	if !ok {
		return nil
	}
	return rec
}
