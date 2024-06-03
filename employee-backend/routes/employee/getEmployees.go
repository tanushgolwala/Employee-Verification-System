package employee

import (
	"employee-backend/database"
	"employee-backend/models"
	"log"

	"github.com/gofiber/fiber/v2"
)

// GetEmployees retrieves all employees from the database
func GetEmployees(c *fiber.Ctx) error {
	var employees []models.Employee

	if err := database.Database.Db.Find(&employees).Error; err != nil {
		log.Printf("Error retrieving employees: %v", err)
		return c.Status(500).SendString("Error retrieving employees")
	}

	return c.JSON(employees)

}
