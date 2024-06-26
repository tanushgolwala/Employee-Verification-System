package main

import (
	"employee-backend/database"
	"employee-backend/routes/employee"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func SetupRoutes(app *fiber.App) {
	app.Use(cors.New())

	app.Post("/bulk", employee.BulkCreate)
	app.Post("/employee", employee.CreateEmployee)
	app.Get("/employees", employee.GetEmployees)
	app.Delete("/employee/:id", employee.DeleteEmployee)
	app.Put("/employee/:id", employee.UpdateEmployee)
}

func main() {
	app := fiber.New()

	database.ConnectToDB()

	SetupRoutes(app)

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World 👋!")
	})
	log.Fatal(app.Listen(":8000"))
}
