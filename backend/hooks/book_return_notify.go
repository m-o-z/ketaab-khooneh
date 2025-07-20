package hooks

import (
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

func SendEmailOfSuccessNotificationOfBook(re *core.RecordEvent, payload SendEmailPayload) {
	logger := re.App.Logger()
	logger.Info("starting to send email", "email", payload.UserEmail)

	domain := os.Getenv(APP_FRONTEND_URL)
	appName := re.App.Settings().Meta.AppName

	html, err := payload.TemplateRenderer.Render(map[string]any{
		"bookTitle": payload.BookTitle,
		"bookId":    payload.BookId,
		"domain":    domain,
		"appName":   appName,
	})

	if err != nil {
		logger.Error("Failed to render email template,", "err", err)
		return
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
		logger.Error("failed to send email", "email", payload.UserEmail, "err", err)
	}

	logger.Info("successfully send email", "email", payload.UserEmail)

	return
}
