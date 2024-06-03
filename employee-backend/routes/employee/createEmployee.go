package employee

import (
	"employee-backend/database"
	"employee-backend/models"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/xuri/excelize/v2"
	"gorm.io/gorm/clause"
)

func CreateEmployee(c *fiber.Ctx) error {
	fileHeader, err := c.FormFile("file")
	if err != nil {
		log.Printf("Error retrieving file: %v", err)
		return c.Status(400).SendString("Error retrieving file")
	}

	file, err := fileHeader.Open()
	if err != nil {
		log.Printf("Error opening file: %v", err)
		return c.Status(500).SendString("Error opening file")
	}
	defer file.Close()

	xlFile, err := excelize.OpenReader(file)
	if err != nil {
		log.Printf("Error reading Excel file: %v", err)
		return c.Status(400).SendString("Error reading Excel file")
	}

	rows, err := xlFile.GetRows(xlFile.GetSheetName(0))
	if err != nil {
		log.Printf("Error getting rows from Excel file: %v", err)
		return c.Status(500).SendString("Error getting rows from Excel file")
	}

	var invalidRows [][]string

	for _, row := range rows {
		if len(row) < 4 {
			invalidRows = append(invalidRows, row)
			continue
		}

		employeeID, err := strconv.Atoi(row[0])
		if err != nil || employeeID <= 0 {
			invalidRows = append(invalidRows, row)
			continue
		}

		yob, err := strconv.Atoi(row[3])
		if err != nil || yob <= 0 {
			invalidRows = append(invalidRows, row)
			continue
		}

		contact := strings.TrimSpace(row[2])
		if len(contact) != 10 {
			invalidRows = append(invalidRows, row)
			continue
		}

		name := strings.TrimSpace(row[1])
		if len(name) > 100 {
			invalidRows = append(invalidRows, row)
			continue
		}

		employee := models.Employee{
			EmployeeID: employeeID,
			Name:       name,
			Contact:    contact,
			YOB:        yob,
		}

		if employee.Name == "" || employee.Contact == "" || employee.YOB == 0 {
			invalidRows = append(invalidRows, row)
			continue
		}

		currentYear := time.Now().Year()
		if employee.YOB > currentYear-18 {
			invalidRows = append(invalidRows, row)
			continue
		}

		if err := database.Database.Db.Clauses(clause.OnConflict{DoNothing: true}).Create(&employee).Error; err != nil {
			if !strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
				invalidRows = append(invalidRows, row)
			}
			continue
		}
	}

	if len(invalidRows) > 0 {
		newFile := excelize.NewFile()
		sheetName := newFile.GetSheetName(0)

		for i, row := range invalidRows {
			for j, cell := range row {
				cellName, _ := excelize.CoordinatesToCellName(j+1, i+1)
				newFile.SetCellValue(sheetName, cellName, cell)
			}
		}

		filePath := "./invalid_rows.xlsx"
		if err := newFile.SaveAs(filePath); err != nil {
			log.Printf("Error saving invalid rows file: %v", err)
			return c.Status(500).SendString("Error saving invalid rows file")
		}

		// return c.Status(201).SendFile(filePath)
	}

	return c.Status(201).SendString("Employees created successfully, no invalid rows found")
}
