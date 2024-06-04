"use client";
import React, { useState } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTrigger } from "../ui/drawer";
import { Button } from "../ui/button";

interface FormData {
    employee_id: string;
    name: string;
    contact: string;
    yob: string;
}

export default function CreateDrawer() {
    const [formData, setFormData] = useState<FormData>({
        employee_id: "",
        name: "",
        contact: "",
        yob: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { employee_id, contact, yob } = formData;

        // Validation
        if (!employee_id) {
            alert("Employee ID is required");
            return;
        }

        if (contact.length !== 10) {
            alert("Contact number must be 10 digits");
            return;
        }

        const currentYear = new Date().getFullYear();
        const age = currentYear - parseInt(yob);

        if (age < 18) {
            alert("The employee must be at least 18 years old");
            return;
        }

        try {
            const formDataWithIntId = {
                ...formData,
                employee_id: parseInt(employee_id, 10),
                yob: parseInt(yob, 10),
            };
            const response = await fetch(`http://127.0.0.1:8000/employee`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '12345'
                },
                body: JSON.stringify(formDataWithIntId),
            });

            if (response.ok) {
                alert("Employee data submitted successfully");
                setFormData({
                    employee_id: "",
                    name: "",
                    contact: "",
                    yob: "",
                });
                window.location.reload();
            } else {
                alert("Failed to submit employee data");
            }
        } catch (error) {
            alert("An error occurred while submitting employee data");
            console.error(error);
        }
    };

    return (
        <Drawer>
            <DrawerTrigger>
                <Button variant="outline">Create</Button>
            </DrawerTrigger>
            <DrawerContent>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4 min-w-[50vw] self-center">
                    <DrawerHeader>Create Employee</DrawerHeader>
                    <DrawerDescription>Enter Details</DrawerDescription>
                    <div className="flex flex-col space-y-4">
                        <input
                            type="text"
                            placeholder="Employee ID"
                            name="employee_id"
                            value={formData.employee_id}
                            onChange={handleChange}
                            className="px-4 py-2 rounded border-gray-300 border focus:outline-none focus:border-indigo-500"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="px-4 py-2 rounded border-gray-300 border focus:outline-none focus:border-indigo-500"
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Contact Number"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            className="px-4 py-2 rounded border-gray-300 border focus:outline-none focus:border-indigo-500"
                            required
                            pattern="[0-9]{10}"
                        />
                        <input
                            type="number"
                            placeholder="Year of Birth"
                            name="yob"
                            value={formData.yob}
                            onChange={handleChange}
                            className="px-4 py-2 rounded border-gray-300 border focus:outline-none focus:border-indigo-500"
                            required
                            min="1900"
                            max={new Date().getFullYear()}
                        />
                    </div>
                    <DrawerFooter>
                        <Button type="submit">Submit</Button>
                        <DrawerClose asChild>
                            <Button
                                variant="outline"
                                type="reset"
                                onClick={() =>
                                    setFormData({
                                        employee_id: "",
                                        name: "",
                                        contact: "",
                                        yob: "",
                                    })
                                }
                            >
                                Cancel
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
}