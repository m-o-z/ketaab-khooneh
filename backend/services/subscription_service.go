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

func NewSubscriptionService(app core.App) *SubscriptionService {
	return &SubscriptionService{app: app}
}

// CreateSubscription creates and persists a new subscription record.
// It returns a strongly-typed Subscription model instance on success.
// The actorId is optional; if provided, the first value will be used.
func (s *SubscriptionService) CreateSubscription(userId, targetCollection, recordId, event string, actorId ...string) (*models.Subscription, error) {
	// Find the 'subscriptions' collection definition to create a new record.
	collection, err := s.app.FindCollectionByNameOrId("subscriptions")
	if err != nil {
		return nil, fmt.Errorf("failed to find 'subscriptions' collection: %w", err)
	}

	// Create a new record instance for the collection.
	record := core.NewRecord(collection)

	// Set the required fields on the record.
	record.Set("user", userId)
	record.Set("targetCollection", targetCollection)
	record.Set("recordId", recordId)
	record.Set("event", event)

	// Set the optional actorId if it was provided.
	if len(actorId) > 0 && actorId[0] != "" {
		record.Set("actor", actorId[0])
	}

	// Save the record to the database. app.Save() also runs validations.
	if err := s.app.Save(record); err != nil {
		return nil, fmt.Errorf("failed to create subscription record: %w", err)
	}

	// Create a new model instance and load the persisted record data into it.
	subscriptionModel := new(models.Subscription).LoadFromRecord(record)

	return subscriptionModel, nil
}

// FindSubscriptions retrieves a list of subscriptions matching the specified criteria.
// It automatically expands the 'user' and 'actor' relations for easy access to related data.
// This function is compatible with PocketBase v0.23.0+.
func (s *SubscriptionService) FindSubscriptions(targetCollection, recordId, event string) ([]*models.Subscription, error) {
	// 1. Find the raw records from the 'subscriptions' collection using a filter.
	// In v0.23+, FindRecordsByFilter is called directly on the app instance.
	records, err := s.app.FindRecordsByFilter(
		"subscriptions",
		"targetCollection = {:cn} && recordId = {:ri} && event = {:ev}",
		"+created", // Sort by creation date, oldest first
		0,          // No limit, get all matches
		0,          // No offset
		dbx.Params{
			"cn": targetCollection,
			"ri": recordId,
			"ev": event,
		},
	)
	if err != nil {
		// Return an error if the database query fails.
		return nil, err
	}

	// If no records are found, return an empty slice and no error.
	if len(records) == 0 {
		return []*models.Subscription{}, nil
	}

	// 2. Expand the relations for the found records in a single, efficient query.
	// In v0.23+, Expand is called directly on the app instance.
	_ = s.app.ExpandRecords(records, []string{"user", "actor"}, nil)

	// 3. Map the raw PocketBase records to your strongly-typed Subscription model.
	subscriptions := make([]*models.Subscription, len(records))
	for i, rec := range records {
		// Create a new Subscription instance and populate it from the record.
		// The LoadFromRecord method also handles the expanded data.
		subscriptions[i] = new(models.Subscription).LoadFromRecord(rec)
	}

	return subscriptions, nil
}
