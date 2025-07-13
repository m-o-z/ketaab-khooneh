package main

import (
	"ghafaseh-backend/routes"
	"log"

	"github.com/pocketbase/pocketbase"
)

func main() {
	app := pocketbase.New()

	routes.RegisterRoutes(app)

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
