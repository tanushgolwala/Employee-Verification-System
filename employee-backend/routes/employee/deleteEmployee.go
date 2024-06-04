package employee

import (
	"employee-backend/database"
	"employee-backend/models"
	"log"

	"github.com/gofiber/fiber/v2"
)

func DeleteEmployee(c *fiber.Ctx) error {
	id := c.Params("id")

	result := database.Database.Db.Delete(&models.Employee{}, id)
	if result.Error != nil {
		return c.Status(500).SendString("Error deleting employee")
	}

	if result.RowsAffected == 0 {
		return c.Status(404).SendString("Employee not found")
	}

	if result.Error != nil {
		log.Printf("Error deleting user: %v\n", result.Error)
		return c.Status(500).SendString("Could not delete user - Internal Server Error")
	}

	log.Printf("Employee with id %v deleted", id)

	return c.Status(200).SendString("Employee deleted successfully")
}
