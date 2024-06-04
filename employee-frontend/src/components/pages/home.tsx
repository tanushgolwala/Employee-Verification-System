"use client";
import Link from "next/link";
import React, { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "../toggle";
import { Button } from "../ui/button";

export default function HomePage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const router = useRouter();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        setSelectedFile(file || null);
    };

    const handleView = () => {
        router.push("/valid");
    }

    const handleUpload = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append("file", selectedFile);

            return fetch("http://127.0.0.1:8000/bulk", {
                method: "POST",
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        console.log("File uploaded successfully");
                        // Reset selected file after upload
                        setSelectedFile(null);
                        router.push("/valid ");
                    } else {
                        console.error("Failed to upload file");
                    }
                })
                .catch(error => {
                    console.error("Error occurred while uploading file:", error);
                });
        } else {
            console.log("Please select a file.");
        }
    };

    return (
        <div className="text-center">
            <div className="flex flex-row justify-between w-[50vw] mx-[5vw] my-[5vh]">
                <Link href="/">
                    <ModeToggle />
                </Link>
                <h1 className="text-5xl font-bold">EMPLOYEE</h1>
            </div>
            <div className="my-[10vh] mx-auto">
                <input type="file" onChange={handleFileChange} />
            </div>
            <div className="flex flex-row justify-evenly my-[10vh] max-w-[40vw] mx-auto">
                <Button variant="outline" onClick={handleUpload}>Upload</Button>
                <Button variant="outline" onClick={handleView}>View List</Button>
            </div>
        </div>
    );
}
