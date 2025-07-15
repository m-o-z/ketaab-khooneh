package handlers

import (
	"errors"
	"fmt"
	"ghafaseh-backend/models"
	"net/http"
	"time"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

func CreateBorrowHandler(c *core.RequestEvent) error {
	authRecord := c.Auth
	if authRecord == nil {
		return c.JSON(http.StatusUnauthorized, models.BorrowResponse{
			Status:  "ERR",
			Message: "Unauthenticated.",
		})
	}

	var req models.BorrowRequest
	if err := c.BindBody(&req); err != nil || req.BookID == "" || req.UserID == "" || req.Duration == 0 {
		return c.JSON(http.StatusBadRequest, models.BorrowResponse{
			Status:  "error",
			Message: "Invalid or missing bookId/userId.",
		})
	}

	var borrow *core.Record
	err := c.App.RunInTransaction(func(txApp core.App) error {
		var dbQueryResult models.BorrowDBQuery
		err := txApp.DB().NewQuery("SELECT availableCount, status FROM books WHERE id={:id}").
			Bind(dbx.Params{"id": req.BookID}).
			Row(&dbQueryResult.AvailableCount, &dbQueryResult.Status)

		if err != nil {
			return errors.New("book not found")
		}

		if dbQueryResult.AvailableCount <= 0 {
			return errors.New("no available copies for this book")
		}

		if dbQueryResult.Status == models.StatusUnavailable || dbQueryResult.Status == models.StatusDamaged {
			return errors.New("you can not borrow `Unavailable` book.")
		}

		if dbQueryResult.AvailableCount == 1 {
			_, err = txApp.DB().NewQuery("UPDATE books SET status='UNAVAILABLE' WHERE id={:id}").
				Bind(dbx.Params{"id": req.BookID}).
				Execute()
			if err != nil {
				return errors.New("error while updating book count")
			}
		}

		_, err = txApp.DB().NewQuery("UPDATE books SET availableCount=availableCount-1 WHERE id={:id}").
			Bind(dbx.Params{"id": req.BookID}).
			Execute()
		if err != nil {
			return errors.New("error while updating book count")
		}

		collection, err := c.App.FindCollectionByNameOrId("borrows")
		if err != nil {
			return err
		}

		borrow = core.NewRecord(collection)
		borrow.Set("book", req.BookID)
		borrow.Set("user", req.UserID)
		borrowDate, _ := types.ParseDateTime(time.Now())
		dueDate, _ := types.ParseDateTime(time.Now().AddDate(0, 0, req.Duration))
		borrow.Set("borrowDate", borrowDate.Time().Format(time.RFC3339Nano))
		borrow.Set("dueDate", dueDate.Time().Format(time.RFC3339Nano))
		borrow.Set("status", "ACTIVE")

		if err := txApp.Save(borrow); err != nil {
			return errors.New("could not save borrow record")
		}
		return nil
	})

	if err != nil {
		return c.JSON(http.StatusConflict, models.BorrowResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, models.BorrowResponse{
		Status:  "success",
		Message: "Book borrowed successfully.",
		Data:    borrow,
	})
}

func DeleteBorrowHandler(c *core.RequestEvent) error {
	authRecord := c.Auth
	if authRecord == nil {
		return c.JSON(http.StatusUnauthorized, models.BorrowResponse{
			Status:  "ERR",
			Message: "Unauthenticated.",
		})
	}

	var req models.ReturnBorrowRequest
	if err := c.BindBody(&req); err != nil || req.BorrowId == "" || (req.ShouldPunished == true && req.PunishmentEndAt == "") {
		fmt.Printf("error %s", err)
		return c.JSON(http.StatusBadRequest, models.BorrowResponse{
			Status:  "error",
			Message: "Invalid data provided.",
		})
	}
	fmt.Printf("req : %+v", req)

	targetStatus := "RETURNED"
	if req.ShouldPunished {
		targetStatus = "RETURNED_LATE"
	}

	var borrow *core.Record
	err := c.App.RunInTransaction(func(txApp core.App) error {
		var bookId *string
		var userId *string
		var status *string
		err := txApp.DB().NewQuery("SELECT book, user, status from borrows where id={:id}").
			Bind(dbx.Params{"id": req.BorrowId}).
			Row(&bookId, &userId, &status)
		if err != nil {
			return errors.New("can not get borrowId.")
		}

		if *status == "RETURNED" || *status == "RETURNED_LATE" {
			return errors.New("the book is already is returned state.")
		}

		returnDate := time.Now().Format(time.RFC3339Nano)
		// check due date to now
		result, err := txApp.DB().NewQuery("UPDATE borrows SET status={:status}, returnDate={:returnDate} where id={:id}").
			Bind(dbx.Params{
				"id":         req.BorrowId,
				"status":     targetStatus,
				"returnDate": returnDate,
			}).Execute()

		fmt.Println("result", result)

		if err != nil {
			return errors.New("failed to persist state of borrow")
		}

		_, err = txApp.DB().NewQuery("UPDATE books SET availableCount=availableCount+1, status='AVAILABLE' WHERE id={:id}").
			Bind(dbx.Params{"id": bookId}).
			Execute()
		if err != nil {
			return errors.New("error while updating book count")
		}

		if req.ShouldPunished {
			_, err = txApp.DB().NewQuery("UPDATE users SET isPunished=true, punishmentEndAt={:punishmentEndAt} WHERE id={:id}").
				Bind(dbx.Params{"id": userId, "punishmentEndAt": req.PunishmentEndAt}).
				Execute()
			if err != nil {
				return errors.New("error while updating user punishment state.")
			}

		}

		return nil
	})

	if err != nil {
		return c.JSON(http.StatusConflict, models.BorrowResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, models.BorrowResponse{
		Status:  "success",
		Message: "Book returned successfully.",
		Data:    borrow,
	})
}
