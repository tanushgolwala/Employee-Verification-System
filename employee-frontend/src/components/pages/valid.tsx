"use client";
import { useEffect, useState, useMemo } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableRow } from "../ui/table";
import { Progress } from "../ui/progress";
import Link from "next/link";
import { Button } from "../ui/button";
import { ModeToggle } from "../toggle";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import EditDrawer from "../elements/editdrawer";
import CreateDrawer from "../elements/createdrawer";

interface Employee {
    ID: number;
    name: string;
    employee_id: number;
    contact: string;
    yob: number;
}

type SortDirection = 'ascending' | 'descending';

const ITEMS_PER_PAGE = 10;

export default function Valid() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Employee; direction: SortDirection } | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`https://e75a-103-175-52-42.ngrok-free.app/employees`, {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '12345'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setEmployees(data);
            } else {
                console.error("Failed to fetch users data");
            }
        } catch (error) {
            console.error("Error fetching users data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`https://e75a-103-175-52-42.ngrok-free.app/employee/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '12345'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setEmployees(data);
            } else {
                console.error("Failed to delete employee");
            }
        } catch (error) {
            console.error("Error deleting employee:", error);
        }
        fetchEmployees();
    };

    const requestSort = (key: keyof Employee) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedEmployees = useMemo(() => {
        let sortedEmployees = [...employees];
        if (sortConfig !== null) {
            sortedEmployees.sort((a, b) => {
                const key = sortConfig.key;
                if (a[key] < b[key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[key] > b[key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortedEmployees;
    }, [employees, sortConfig]);

    const filteredEmployees = useMemo(() => {
        if (!searchTerm) return sortedEmployees;
        return sortedEmployees.filter(employee =>
            employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.contact.includes(searchTerm)
        );
    }, [sortedEmployees, searchTerm]);

    const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const paginatedEmployees = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredEmployees.slice(startIndex, endIndex);
    }, [filteredEmployees, currentPage]);

    return (
        <div>
            <div className="flex flex-row justify-between w-[98vw] px-[2vw] py-[5vh]">
                <Link href="/">
                    <Button variant="outline">Back</Button>
                </Link>
                <h1 className="text-3xl font-bold">EMPLOYEES</h1>
                <ModeToggle />
            </div>
            <div className="flex justify-end px-4">
                <CreateDrawer />
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 rounded border-gray-300 border focus:outline-none focus:border-indigo-500 mx-[3vw] my-[2vh]"
                />
            </div>
            {loading ? (
                <div className="flex flex-col justify-center items-center h-screen">
                    <h1 className="text-3xl pb-[2vw] font-semibold">Loading...</h1>
                    <div className="flex justify-center items-center w-[50vw]">
                        <Progress value={50} />
                    </div>
                </div>
            ) : (
                <div>
                    <Table>
                        <TableCaption>Employee Data</TableCaption>
                        <TableRow>
                            <TableHead onClick={() => requestSort('employee_id')}>Employee ID</TableHead>
                            <TableHead onClick={() => requestSort('name')}>Name</TableHead>
                            <TableHead onClick={() => requestSort('contact')}>Contact Number</TableHead>
                            <TableHead onClick={() => requestSort('yob')}>Year of Birth</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                        <TableBody>
                            {paginatedEmployees.map((employee) => (
                                <TableRow key={employee.ID}>
                                    <TableCell>{employee.employee_id}</TableCell>
                                    <TableCell>{employee.name}</TableCell>
                                    <TableCell>{employee.contact}</TableCell>
                                    <TableCell>{employee.yob}</TableCell>
                                    <TableCell className="justify-evenly space-x-4">
                                        {/* <Button variant="outline">Edit</Button> */}
                                        <EditDrawer gormid={employee.ID} />
                                        <AlertDialog>
                                            <AlertDialogTrigger>
                                                <Button variant="destructive">Delete</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete your account
                                                        and remove your data from our servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(employee.ID)}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex justify-center mt-4">
                        {Array.from(Array(totalPages).keys()).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page + 1)}
                                className={`px-3 py-1 mx-1 ${currentPage === page + 1 ? "bg-gray-500 text-white" : "bg-transparent text-gray-500"
                                    }`}
                            >
                                {page + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )
            }
        </div >
    )
}
