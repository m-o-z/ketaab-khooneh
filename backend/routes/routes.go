package routes

import (
	"ghafaseh-backend/handlers"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func RegisterRoutes(app *pocketbase.PocketBase) {
	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		se.Router.GET("/api/test", handlers.TestHandler)
		se.Router.POST("/api/borrows", handlers.CreateBorrowHandler).Bind(apis.RequireSuperuserAuth())
		se.Router.DELETE("/api/borrows/{borrowID}", handlers.DeleteBorrowHandler).Bind(apis.RequireSuperuserAuth())
		se.Router.POST("/api/notify/book-release", handlers.NotifyBookRelease) /* .Bind(apis.RequireSuperuserAuth()) */
		return se.Next()
	})
}
