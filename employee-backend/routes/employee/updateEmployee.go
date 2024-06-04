package employee

import (
	"employee-backend/database"
	"employee-backend/models"
	"log"

	"github.com/gofiber/fiber/v2"
)

func UpdateEmployee(c *fiber.Ctx) error {
	var updatedEmployee models.Employee
	id := c.Params("id")
	log.Printf("%v", updatedEmployee)

	if err := c.BodyParser(&updatedEmployee); err != nil {
		return c.Status(400).SendString("Error parsing updated employee")
	}

	result := database.Database.Db.Model(&models.Employee{}).Where("id = ?", id).Updates(updatedEmployee)

	if result.Error != nil {

		return c.Status(500).SendString("Error updating employee")
	}

	if result.RowsAffected == 0 {
		return c.Status(404).SendString("Employee not found")
	}

	log.Printf("Employee with id %v updated", updatedEmployee.ID)
	return c.Status(200).SendString("Employee updated successfully")

}
