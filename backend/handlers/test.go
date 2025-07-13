package handlers

import (
	"github.com/pocketbase/pocketbase/core"
)

func TestHandler(c *core.RequestEvent) error {
	return c.JSON(200, "Hello")
}
