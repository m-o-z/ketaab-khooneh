package main

import (
	"ghafaseh-backend/cron"
	"ghafaseh-backend/hooks"
	"ghafaseh-backend/routes"
	"log"

	"github.com/joho/godotenv"
	"github.com/pocketbase/pocketbase"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println(".env file not found — skipping...")
	}

	app := pocketbase.New()

	routes.RegisterRoutes(app)
	hooks.RegisterHooks(app)
	cron.RegisterCustomCron(app)

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
