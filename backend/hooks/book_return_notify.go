package hooks

import (
	"fmt"
	"ghafaseh-backend/models"
	"log"
	"os"

	"github.com/pocketbase/pocketbase/core"
)

func SendEmailOfSuccessNotificationOfBook(re *core.RecordEvent, userId string, book *models.Book) error {
	res := book.ExpandedBookWork()
	log.Println("res", res)

	// registry := template.NewRegistry()

	domain := os.Getenv("APP_DOMAIN")
	if domain == "" {
		domain = "https://ketab.echa.ir"
	}

	_domain := re.App.Settings().Meta.AppURL
	fmt.Println("_domain", _domain)

	// html, err := registry.LoadFiles(
	// 	"views/book_release_email.html",
	// ).Render(map[string]any{
	// 	"bookTitle": data.BookTitle,
	// 	"bookId":    data.BookId,
	// 	"domain":    domain,
	// })

	// if err != nil {
	// 	return req.InternalServerError("Failed to render email template", err)
	// }

	return nil
}
