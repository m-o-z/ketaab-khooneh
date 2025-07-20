package hooks

import (
	"fmt"
	"log"
	"net/mail"
	"os"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/mailer"
	"github.com/pocketbase/pocketbase/tools/template"
)

const (
	APP_FRONTEND_URL = "APP_FRONTEND_URL"
)

type SendEmailPayload struct {
	BookId           string
	BookTitle        string
	UserEmail        string
	TemplateRenderer template.Renderer
}

func SendEmailOfSuccessNotificationOfBook(re *core.RecordEvent, payload SendEmailPayload) error {

	domain := os.Getenv(APP_FRONTEND_URL)
	appName := re.App.Settings().Meta.AppName

	html, err := payload.TemplateRenderer.Render(map[string]any{
		"bookTitle": payload.BookTitle,
		"bookId":    payload.BookId,
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
		To:      []mail.Address{{Address: payload.UserEmail}},
		Subject: "Book Available to Borrow Now!",
		HTML:    html,
	}

	if err := re.App.NewMailClient().Send(message); err != nil {
		return fmt.Errorf("failed to send email to %s: %w", payload.UserEmail, err)
	}

	log.Printf("successfully send email to %s", payload.UserEmail)

	return nil
}
