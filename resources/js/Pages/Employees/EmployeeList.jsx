import React from 'react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function EmployeeList({ employees, auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="border-b pb-6">
                <header className="flex justify-center text-xl font-bold">Employees List</header>
            </div>
            <div className="m-4 my-10">
                <Link
                    href={route('employees.create')}
                    className="rounded-md bg-high px-4 py-2 font-bold"
                >
                    Create New Employee
                </Link>
                <div className="flex flex-wrap justify-center">
                    {employees.map((employee) => (
                        <div
                            key={employee.id}
                            className="m-4 flex w-80 flex-col items-center rounded-lg bg-white p-6 shadow-md"
                        >
                            {/* Photo Section */}
                            <div className="mb-4">
                                <img
                                    src={employee.photoUrl || 'default-photo-url.jpg'} // Replace with the actual photo URL
                                    alt={`${employee.first_name}'s photo`}
                                    className="h-24 w-24 rounded-full object-cover"
                                />
                            </div>

                            {/* Name and Position */}
                            <div className="mb-2 text-center">
                                <span className="text-lg font-bold text-main">
                                    {employee.first_name} {employee.middle_name}{' '}
                                    {employee.last_name}
                                </span>
                                <div className="text-sm text-gray-600">{employee.position}</div>
                            </div>

                            {/* Additional Details */}
                            <div className="w-full">
                                <div className="mb-4 flex flex-row justify-between text-sm text-gray-600">
                                    <div className="flex flex-1 flex-col text-center">
                                        <span className="text-gray-400">Department</span>
                                        <span>{employee.department}</span>
                                    </div>
                                    <div className="flex flex-1 flex-col text-center">
                                        <span className="text-gray-400">Date Hired</span>
                                        <span>{employee.start_date}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span>{employee.email}</span>
                                    <span>{employee.phone}</span>
                                </div>
                            </div>

                            {/* Link (Optional) */}
                            <div className="mt-4">
                                <Link
                                    href={route('employees.show', employee.id)}
                                    className="btn btn-info rounded bg-high px-4 py-2"
                                >
                                    View
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* <table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Position</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.id}>
                                <td>{employee.first_name}</td>
                                <td>{employee.last_name}</td>
                                <td>{employee.position}</td>
                                <td>
                                    <Link
                                        href={route('employees.edit', employee.id)}
                                        className="btn btn-warning"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        href={route('employees.show', employee.id)}
                                        className="btn btn-info"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table> */}
            </div>
        </AuthenticatedLayout>
    );
}
