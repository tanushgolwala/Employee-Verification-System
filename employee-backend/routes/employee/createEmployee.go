package employee

import (
	"employee-backend/database"
	"employee-backend/models"
	"log"

	"github.com/gofiber/fiber/v2"
)

// CreateEmployee creates a new employee in the database
func CreateEmployee(c *fiber.Ctx) error {
	var employee models.Employee

	if err := c.BodyParser(&employee); err != nil {
		log.Printf("Error parsing employee: %v", err)
		return c.Status(400).SendString("Error parsing employee")
	}

	if err := database.Database.Db.Create(&employee).Error; err != nil {
		log.Printf("Error creating employee: %v", err)
		return c.Status(500).SendString("Error creating employee")
	}

	return c.Status(201).JSON(employee)
}
