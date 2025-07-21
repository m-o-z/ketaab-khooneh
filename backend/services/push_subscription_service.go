package services

import (
	"encoding/json"
	"fmt"
	"ghafaseh-backend/util"
	"log"
	"net/http"
	"os"
	"sync"

	"github.com/SherClockHolmes/webpush-go"
	"github.com/pocketbase/pocketbase/core"
)

const (
	VAPID_PUBLIC_KEY_PATH  = "VAPID_PUBLIC_KEY"
	VAPID_PRIVATE_KEY_PATH = "VAPID_PRIVATE_KEY"
)

// PushSubscription represents the structure of a record in the 'push_subscriptions' collection.
type PushSubscription struct {
	core.Record
	User     string `db:"user" json:"user"`
	Endpoint string `db:"endpoint" json:"endpoint"`
	P256dh   string `db:"p256dh" json:"p256dh"`
	Auth     string `db:"auth" json:"auth"`
}

// NotificationPayload defines the content of a push notification.
type NotificationPayload struct {
	Title string `json:"title"`
	Body  string `json:"body"`
	URL   string `json:"url,omitempty"`
}

// --- Service Implementation ---

var (
	pushServiceInstance *PushSubscriptionService
	once                sync.Once
)

// PushSubscriptionService manages push notification logic.
type PushSubscriptionService struct {
	app                 core.App
	isWebPushConfigured bool
}

// GetInstance returns a singleton instance of the PushSubscriptionService.
func GetInstance(app core.App) *PushSubscriptionService {
	once.Do(func() {
		pushServiceInstance = &PushSubscriptionService{
			app: app,
		}
		pushServiceInstance.configureWebPush()
	})
	return pushServiceInstance
}

// configureWebPush initializes the web-push library with VAPID keys.
func (s *PushSubscriptionService) configureWebPush() {
	vapidPublicKey := os.Getenv(VAPID_PUBLIC_KEY_PATH)
	vapidPrivateKey := os.Getenv(VAPID_PRIVATE_KEY_PATH)

	if vapidPublicKey == "" || vapidPrivateKey == "" {
		log.Println("WARNING: VAPID keys are not configured. Push notifications are disabled.")
		s.isWebPushConfigured = false
		return
	}
	s.isWebPushConfigured = true
}

// CreatePushSubscription creates or updates a push subscription in the database.
func (s *PushSubscriptionService) CreatePushSubscription(userId string, endpoint string, p256dh string, auth string) (*PushSubscription, error) {
	collection, err := s.app.FindCollectionByNameOrId("push_subscriptions")
	if err != nil {
		return nil, fmt.Errorf("failed to find 'push_subscriptions' collection: %w", err)
	}

	// Check for existing subscription to avoid duplicates
	existingRecord, _ := s.app.FindFirstRecordByFilter(
		"push_subscriptions",
		"endpoint = {:endpoint}",
		map[string]any{"endpoint": endpoint},
	)

	// If subscription exists, check if the user needs to be updated
	if existingRecord != nil {
		if existingRecord.GetString("user") != userId {
			existingRecord.Set("user", userId)
			if err := s.app.Save(existingRecord); err != nil {
				return nil, fmt.Errorf("failed to update existing subscription: %w", err)
			}
		}
		return recordToPushSubscription(existingRecord), nil
	}

	// Create a new record if it doesn't exist
	record := core.NewRecord(collection)
	record.Set("user", userId)
	record.Set("endpoint", endpoint)
	record.Set("p256dh", p256dh)
	record.Set("auth", auth)

	if err := s.app.Save(record); err != nil {
		return nil, fmt.Errorf("failed to create push subscription: %w", err)
	}

	return recordToPushSubscription(record), nil
}

// SendPushNotification sends a notification to a single user.
func (s *PushSubscriptionService) SendPushNotification(userId string, payload NotificationPayload) error {
	if !s.isWebPushConfigured {
		return fmt.Errorf("web-push is not configured")
	}
	log.Println("HERE 000")

	records, err := s.app.FindRecordsByFilter(
		"push_subscriptions",
		"user = {:userId}",
		"-created",
		0,
		0,
		map[string]any{"userId": userId},
	)
	if err != nil {
		return fmt.Errorf("failed to fetch subscriptions for user %s: %w", userId, err)
	}
	log.Println("HERE 001", records, userId)

	return s.sendNotificationsToRecords(records, payload)
}

// SendBatchPushNotification sends a notification to multiple users.
func (s *PushSubscriptionService) SendBatchPushNotification(userIds []string, payload NotificationPayload) error {
	if !s.isWebPushConfigured || len(userIds) == 0 {
		return fmt.Errorf("web-push not configured or no users provided")
	}

	// Build filter expression: user = 'id1' || user = 'id2' ...
	params := map[string]any{}
	filter := ""
	for i, id := range userIds {
		key := fmt.Sprintf("userId%d", i)
		params[key] = id
		if i > 0 {
			filter += " || "
		}
		filter += fmt.Sprintf("user = {:%s}", key)
	}

	records, err := s.app.FindRecordsByFilter("push_subscriptions", filter, "-created", 0, 0, params)
	log.Println("records count", len(records))
	if err != nil {
		return fmt.Errorf("failed to fetch subscriptions for batch: %w", err)
	}

	return s.sendNotificationsToRecords(records, payload)
}

// sendNotificationsToRecords is a helper to send notifications and handle expired ones.
func (s *PushSubscriptionService) sendNotificationsToRecords(records []*core.Record, payload NotificationPayload) error {
	vapidPrivateKey := os.Getenv(VAPID_PRIVATE_KEY_PATH)
	vapidPublicKey := os.Getenv(VAPID_PUBLIC_KEY_PATH)
	log.Println("HERE 002", records)

	for _, record := range records {
		sub := &webpush.Subscription{
			Endpoint: record.GetString("endpoint"),
			Keys: webpush.Keys{
				P256dh: record.GetString("p256dh"),
				Auth:   record.GetString("auth"),
			},
		}

		fmt.Printf("vaplid key : %s, vapid private key : %s, sub: %+v\n", vapidPublicKey, vapidPrivateKey, sub)

		body, err := json.Marshal(payload)
		if err != nil {
			log.Println("json marshaling failed")
		}
		// The web-push-go library expects the payload as a byte slice.
		resp, err := webpush.SendNotification(body, sub, &webpush.Options{
			Subscriber:      "mailto: <hossein.nasiri.sovari@gmail.com>",
			VAPIDPublicKey:  vapidPublicKey,
			VAPIDPrivateKey: vapidPrivateKey,
			TTL:             30,
		})

		util.LogResponse(resp)
		if err != nil {
			log.Printf("ERROR sending notification to %s: %v\n", sub.Endpoint, err)
		}
		defer resp.Body.Close()

		// If a subscription is expired, the push service returns a 410 Gone status.
		if resp.StatusCode == http.StatusGone {
			log.Printf("Subscription %s is expired. Deleting.\n", record.Id)
			if err := s.app.Delete(record); err != nil {
				log.Printf("ERROR deleting expired subscription %s: %v\n", record.Id, err)
			}
		}
	}
	return nil
}

// Helper to convert a PocketBase record to our PushSubscription struct
func recordToPushSubscription(record *core.Record) *PushSubscription {
	sub := &PushSubscription{}
	sub.Load(record.PublicExport()) // Load common fields
	sub.User = record.GetString("user")
	sub.Endpoint = record.GetString("endpoint")
	sub.P256dh = record.GetString("p256dh")
	sub.Auth = record.GetString("auth")
	return sub
}
