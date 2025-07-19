package services

import (
	"fmt"
	"ghafaseh-backend/models"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
)

type SubscriptionService struct {
	app core.App
}

// NewSubscriptionService Creates new Subscription service
func NewSubscriptionService(app core.App) *SubscriptionService {
	return &SubscriptionService{app: app}
}

// CreateSubscription creates and persists a new subscription record.
// It returns a strongly-typed Subscription model instance on success.
// The actorId is optional; if provided, the first value will be used.
func (s *SubscriptionService) CreateSubscription(userId, targetCollection, recordId, eventType string, actorId ...string) (*models.Subscription, error) {
	collection, err := s.app.FindCollectionByNameOrId("subscriptions")
	if err != nil {
		return nil, fmt.Errorf("failed to find 'subscriptions' collection: %w", err)
	}

	record := core.NewRecord(collection)

	record.Set("user", userId)
	record.Set("targetCollection", targetCollection)
	record.Set("recordId", recordId)
	record.Set("type", eventType)

	if len(actorId) > 0 && actorId[0] != "" {
		record.Set("actor", actorId[0])
	}

	if err := s.app.Save(record); err != nil {
		return nil, fmt.Errorf("failed to create subscription record: %w", err)
	}

	subscriptionModel := new(models.Subscription).LoadFromRecord(record)

	return subscriptionModel, nil
}

// FindSubscriptions retrieves a list of subscriptions matching the specified criteria.
// It automatically expands the 'user' and 'actor' relations for easy access to related data.
// This function is compatible with PocketBase v0.23.0+.
func (s *SubscriptionService) FindSubscriptions(targetCollection, recordId, eventType string) ([]*models.Subscription, error) {
	records, err := s.app.FindRecordsByFilter(
		"subscriptions",
		"targetCollection = {:cn} && recordId = {:ri} && type = {:ev}",
		"+created", // Sort by creation date, oldest first
		0,          // No limit, get all matches
		0,          // No offset
		dbx.Params{
			"cn": targetCollection,
			"ri": recordId,
			"ev": eventType,
		},
	)

	if err != nil {
		return nil, err
	}

	if len(records) == 0 {
		return []*models.Subscription{}, nil
	}

	_ = s.app.ExpandRecords(records, []string{"user", "actor"}, nil)

	subscriptions := make([]*models.Subscription, len(records))
	for i, rec := range records {
		subscriptions[i] = new(models.Subscription).LoadFromRecord(rec)
	}

	return subscriptions, nil
}
