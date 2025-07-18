package hooks

import (
	"ghafaseh-backend/models"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func RegisterHooks(app *pocketbase.PocketBase) error {

	app.OnRecordUpdateExecute("books").BindFunc(func(e *core.RecordEvent) error {
		e.App.ExpandRecord(e.Record, []string{"bookWork"}, nil)
		book := new(models.Book).LoadFromRecord(e.Record)
		SendEmailOfSuccessNotificationOfBook(e, "0", book)

		return e.Next()
	})
	return nil
}
