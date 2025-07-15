package handlers

import (
	"fmt"
	"net/http"
	"net/mail"
	"os"
	"sync"
	"time"

	"ghafaseh-backend/models"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/mailer"
	"github.com/pocketbase/pocketbase/tools/template"
)

func NotifyBookRelease(c *core.RequestEvent) error {
	registry := template.NewRegistry()

	data := new(models.BookReleaseRequest)
	if err := c.BindBody(&data); err != nil {
		return c.BadRequestError("Failed to read request data", err)
	}

	if len(data.UserEmails) == 0 || data.BookTitle == "" || data.BookId == "" {
		return c.BadRequestError("Missing required fields", nil)
	}

	domain := os.Getenv("APP_DOMAIN")
	if domain == "" {
		domain = "https://ketab.echa.ir"
	}

	_domain := c.App.Settings().Meta.AppURL
	fmt.Println("_domain", _domain)

	html, err := registry.LoadFiles(
		"views/book_release_email.html",
	).Render(map[string]any{
		"bookTitle": data.BookTitle,
		"bookId":    data.BookId,
		"domain":    domain,
	})
	if err != nil {
		return c.InternalServerError("Failed to render email template", err)
	}

	// Rate limit: 2 requests per second (500ms per request)
	const rateLimitDelay = 500 * time.Millisecond
	const maxConcurrency = 2 // Align with rate limit
	sem := make(chan struct{}, maxConcurrency)
	var wg sync.WaitGroup
	var mu sync.Mutex
	var errors []error

	for _, email := range data.UserEmails {
		sem <- struct{}{} // Acquire semaphore
		wg.Add(1)
		go func(email string) {
			defer wg.Done()
			defer func() { <-sem }() // Release semaphore

			message := &mailer.Message{
				From: mail.Address{
					Address: c.App.Settings().Meta.SenderAddress,
					Name:    c.App.Settings().Meta.SenderName,
				},
				To:      []mail.Address{{Address: email}},
				Subject: "Book Available to Borrow Now!",
				HTML:    html,
			}

			if err := c.App.NewMailClient().Send(message); err != nil {
				mu.Lock()
				errors = append(errors, fmt.Errorf("failed to send email to %s: %w", email, err))
				mu.Unlock()
			}

			// Enforce rate limit delay
			time.Sleep(rateLimitDelay)
		}(email)
	}

	wg.Wait()

	if len(errors) > 0 {
		for _, err := range errors {
			fmt.Println("Email error:", err)
		}
		return c.InternalServerError("Some emails failed to send", errors[0])
	}

	return c.JSON(http.StatusOK, map[string]bool{"success": true})
}
