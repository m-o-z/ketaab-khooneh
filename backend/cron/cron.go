package cron

import (
	"errors"
	"fmt"
	"ghafaseh-backend/services"
	"log"
	"math"
	"time"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func RegisterCustomCron(app *pocketbase.PocketBase) error {

	app.Cron().MustAdd("Notify Borrower Due Date", "0 21 * * *", func() {
		handleComingDueDateNotifications(app)
		handlePassedDueDateNotifications(app)
	})
	return nil
}

func handleComingDueDateNotifications(app *pocketbase.PocketBase) {
	// Verify the collection exists
	_, err := app.FindCollectionByNameOrId("borrows")
	if err != nil {
		_err := fmt.Errorf("failed to find borrows collection: %w", err)
		log.Println("_err", _err, "  err:", err)
		return
	}

	params := dbx.Params{}
	params["dueDate"] = time.Now().Format(time.RFC3339Nano)
	params["dateSpan"] = time.Now().Add(3 * 24 * time.Hour).Format(time.RFC3339Nano)
	filter := "(dueDate >= {:dueDate} && dueDate <= {:dateSpan} ) && (status = 'ACTIVE' || status = 'EXTENDED')"
	log.Println("filter", filter, " params", params)
	records, err := app.FindRecordsByFilter("borrows", filter, "-created", 0, 0, params)
	if err != nil {
		_err := errors.New("can not fetch collection")
		log.Println("_err", _err, "  err:", err)
		return
	}

	sendDueDateNotifications(&app.App, records)
}

func handlePassedDueDateNotifications(app *pocketbase.PocketBase) {
	// Verify the collection exists
	_, err := app.FindCollectionByNameOrId("borrows")

	if err != nil {
		_err := fmt.Errorf("failed to find borrows collection: %w", err)
		log.Println("_err", _err, "  err:", err)
		return
	}

	params := dbx.Params{}
	params["dueDate"] = time.Now().Format(time.RFC3339Nano)
	filter := "dueDate <= {:dueDate}  && (status = 'ACTIVE' || status = 'EXTENDED')"
	log.Println("filter", filter, " params", params)
	records, err := app.FindRecordsByFilter("borrows", filter, "-created", 0, 0, params)
	if err != nil {
		_err := errors.New("can not fetch collection")
		log.Println("_err", _err, "  err:", err)
		return
	}

	sendPassedDueDateNotifications(&app.App, records)
}

func sendDueDateNotifications(app *core.App, records []*core.Record) error {
	for _, record := range records {
		userId := record.GetString("user")
		diffInDays := calcDueDateDiffInDay(record)
		text := fmt.Sprintf("You book should be returned in %d days \n", diffInDays)
		fmt.Printf("userId %s, diffDays: %d,\t text: %s\n", userId, diffInDays, text)
		services.GetInstance(*app).SendPushNotification(userId, services.NotificationPayload{
			Title: "Remaining days to return borrowed book",
			Body:  text,
		})
	}

	return nil
}

func sendPassedDueDateNotifications(app *core.App, records []*core.Record) error {
	for _, record := range records {
		userId := record.GetString("user")
		diffInDays := calcDueDateDiffInDay(record)
		text := fmt.Sprintf("You missed due date for %d days", diffInDays)
		fmt.Printf("userId %s, diffDays: %d,\t text: %s\n", userId, diffInDays, text)
		services.GetInstance(*app).SendPushNotification(userId, services.NotificationPayload{
			Title: "You missed to return your borrowed book",
			Body:  text,
		})
	}

	return nil
}

func calcDueDateDiffInDay(record *core.Record) int {
	dueDate := record.GetDateTime("dueDate")
	now := time.Now()

	diff := now.Sub(dueDate.Time())

	if diff > 0 {
		return int(math.Abs(diff.Hours())) / 24
	}

	return 0
}
