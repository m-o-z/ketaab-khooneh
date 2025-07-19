package hooks

import (
	"fmt"
	"ghafaseh-backend/models"
	"net/mail"
	"os"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/mailer"
	"github.com/pocketbase/pocketbase/tools/template"
)

const (
	APP_FRONTEND_URL = "APP_FRONTEND_URL"
)

func SendEmailOfSuccessNotificationOfBook(re *core.RecordEvent, user *models.User, book *models.Book) error {
	registry := template.NewRegistry()

	domain := os.Getenv(APP_FRONTEND_URL)
	appName := re.App.Settings().Meta.AppName

	html, err := registry.LoadFiles(
		"views/book_available_email.html",
	).Render(map[string]any{
		"bookTitle": book.ExpandedBookWork().Title(),
		"bookId":    book.Id,
		"domain":    domain,
		"appName":   appName,
	})

	if err != nil {
		return fmt.Errorf("Failed to render email template", err)
	}
	message := &mailer.Message{
		From: mail.Address{
			Address: re.App.Settings().Meta.SenderAddress,
			Name:    re.App.Settings().Meta.SenderName,
		},
		To:      []mail.Address{{Address: user.Email()}},
		Subject: "Book Available to Borrow Now!",
		HTML:    html,
	}

	if err := re.App.NewMailClient().Send(message); err != nil {
		return fmt.Errorf("failed to send email to %s: %w", user.Email(), err)
	}

	return nil
}
