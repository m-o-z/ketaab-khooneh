package hooks

import (
	"ghafaseh-backend/models"
	"ghafaseh-backend/services"
	"log"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func RegisterHooks(app *pocketbase.PocketBase) error {

	app.OnRecordUpdateExecute("books").BindFunc(func(e *core.RecordEvent) error {
		e.App.ExpandRecord(e.Record, []string{"bookWork"}, nil)
		book := new(models.Book).LoadFromRecord(e.Record)
		subscriptionService := services.NewSubscriptionService(e.App)
		subscriptions, err := subscriptionService.FindSubscriptions("books", book.Id, "GOT_AVAILABLE")
		if err != nil {
			log.Println("can not fetch subscriptions for this book.")
			return nil
		}

		for _, subscription := range subscriptions {
			user := subscription.ExpandedUser()
			userModel := models.User{}
			userModel.LoadFromRecord(user)
			SendEmailOfSuccessNotificationOfBook(e, &userModel, book)
		}

		return e.Next()
	})
	return nil
}
