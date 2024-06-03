package models

import "gorm.io/gorm"

type Employee struct {
	gorm.Model
	Name       string `gorm:"type:varchar(100);not null" json:"name"`
	EmployeeID int    `gorm:"type:int;unique;not null" json:"employee_id"`
	Contact    string `gorm:"type:varchar(10);unique;not null" json:"contact"`
	YOB        int    `gorm:"type:int;not null" json:"yob"`
}
