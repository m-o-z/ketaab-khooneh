package hooks

import (
	"ghafaseh-backend/models"
	"ghafaseh-backend/services"
	"log"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/template"
)

func RegisterHooks(app *pocketbase.PocketBase) error {

	app.OnRecordUpdateExecute("books").BindFunc(func(e *core.RecordEvent) error {

		e.App.ExpandRecord(e.Record, []string{"bookWork"}, nil)

		book := new(models.Book).LoadFromRecord(e.Record)
		bookPrevStatus := e.Record.Original().GetString("status")
		bookStatus := book.Status()

		if bookStatus != "AVAILABLE" || bookStatus == bookPrevStatus {
			return e.Next()
		}

		subscriptionService := services.NewSubscriptionService(e.App)

		subscriptions, err := subscriptionService.FindSubscriptions("books", book.Id, "GOT_AVAILABLE")

		if err != nil {
			log.Println("can not fetch subscriptions for this book.")
			return nil
		}

		registry := template.NewRegistry()

		templateRenderer := registry.LoadFiles(
			"views/book_available_email.html",
		)

		for _, subscription := range subscriptions {
			user := subscription.ExpandedUser()
			userModel := models.User{}
			userModel.LoadFromRecord(user)

			payload := SendEmailPayload{
				BookId:           book.Id,
				BookTitle:        book.ExpandedBookWork().Title(),
				UserEmail:        user.Email(),
				TemplateRenderer: *templateRenderer,
			}

			clonedRequest := *e

			go SendEmailOfSuccessNotificationOfBook(&clonedRequest, payload)
			e.App.Delete(subscription)
		}

		return e.Next()
	})
	return nil
}
