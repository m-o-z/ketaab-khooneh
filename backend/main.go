package main

import (
	"log"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func main() {
	// Create a new PocketBase instance
	app := pocketbase.New()

	// Add a custom route
	// app.OnServe().Add(func(e *core.ServeEvent) error {
	// 	e.Router.AddRoute(http.MethodGet, "/hello", func(c echo.Context) error {
	// 		return c.String(http.StatusOK, "Hello, from your custom Go route!")
	// 	})
	// 	return nil
	// })

	type Response struct {
		Status  string `json:"status"`
		Message string `json:"message"`
	}

	app.OnServe().BindFunc(func(e *core.ServeEvent) error {
		e.Router.GET("/api/hello", func(e *core.RequestEvent) error {

			response := Response{
				Status:  "OK",
				Message: "Hello",
			}

			return e.JSON(200, response)
		})

		return e.Next()
	})

	// Start the PocketBase server
	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
