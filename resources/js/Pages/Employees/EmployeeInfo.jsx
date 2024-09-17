import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia'; // Import Inertia for handling form submission
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function EmployeeInfo({ employee, auth }) {
    const [showTerminationForm, setShowTerminationForm] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [terminationData, setTerminationData] = useState({
        termination_date: '',
        termination_reason: '',
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        }).format(date);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    const handleTerminationChange = (e) => {
        setTerminationData({
            ...terminationData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmitTermination = (e) => {
        e.preventDefault();
        setShowConfirmation(true); // Show confirmation dialog before submitting
    };

    const handleConfirmTermination = () => {
        Inertia.post(`/employees/${employee.id}/terminate`, terminationData, {
            onFinish: () => {
                setShowConfirmation(false);
                setShowTerminationForm(false);
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div key={employee.id}>
                <div className="pb-6">
                    <header className="flex justify-center text-xl font-bold">
                        Employee Details
                    </header>
                </div>
                {/* Photo Section */}
                <div className="flex items-center justify-evenly border-b border-t py-5">
                    <img
                        src={
                            employee.photo_url
                                ? `/storage/${employee.photo_url}`
                                : 'default-photo-url.jpg'
                        }
                        alt={`${employee.first_name}'s photo`}
                        className="h-24 w-24 rounded-full border object-cover shadow-md"
                    />
                    <div>
                        {/* Name and Position */}
                        <div className="mb-2">
                            <span className="text-lg font-bold text-main">
                                {employee.first_name} {employee.middle_name} {employee.last_name}
                            </span>
                            <div className="text-sm text-gray-600">{employee.position}</div>
                            <div className="text-sm text-gray-600">{employee.department}</div>
                        </div>
                    </div>
                    <div>
                        {/* Leave remaining */}
                        <div className="mb-2">
                            <span className="text-lg font-bold text-main">
                                Leave Remaining: {employee.leave_balance}
                            </span>
                            <div className="text-sm text-gray-600">
                                Vacation: {employee.vacation_days}
                            </div>
                            <div className="text-sm text-gray-600">Sick: {employee.sick_days}</div>
                        </div>
                    </div>
                </div>

                <div className="m-4 my-10 grid grid-cols-2">
                    {/* Personal Background */}
                    <div>
                        <label className="font-bold">Personal Background</label>
                        <div>
                            <div>
                                <label className="text-gray-400">Full name: </label>
                                <span>
                                    {employee.first_name} {employee.middle_name}{' '}
                                    {employee.last_name}
                                </span>
                            </div>
                            <div>
                                <label className="text-gray-400">Date of Birth: </label>
                                <span>{formatDate(employee.birthdate)}</span>
                            </div>
                            <div>
                                <label className="text-gray-400">Sex: </label>
                                <span>{employee.sex}</span>
                            </div>
                            <div>
                                <label className="text-gray-400">Civil Status: </label>
                                <span>{employee.civil_status}</span>
                            </div>
                            <div>
                                <label className="text-gray-400">Nationality: </label>
                                <span>{employee.nationality}</span>
                            </div>
                            <div>
                                <label className="text-gray-400">Address: </label>
                                <span>{employee.address}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Email: </span>
                                <span>{employee.email}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Phone Number: </span>
                                <span>{employee.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Company info/ Status */}
                    <div>
                        <label className="font-bold">Status</label>
                        <div>
                            <span className="text-gray-400">ID No.: </span>
                            <span>{employee.company_id}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Employment Type: </span>
                            <span>{employee.employment_type}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Date Hired: </span>
                            <span>{formatDate(employee.start_date)}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Salary: </span>
                            <span>{formatCurrency(employee.salary)}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Position: </span>
                            <span>{employee.position}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Department: </span>
                            <span>{employee.department}</span>
                        </div>
                    </div>
                </div>

                {/* Termination Button */}
                <div className="my-4 flex justify-center">
                    <button
                        onClick={() => setShowTerminationForm(true)}
                        className="rounded bg-red-500 px-4 py-2 text-white"
                    >
                        Terminate Employee
                    </button>
                </div>

                {/* Termination Form */}
                {showTerminationForm && !showConfirmation && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                        <div className="rounded bg-white p-6 shadow-lg">
                            <h2 className="mb-4 text-xl font-bold">Terminate Employee</h2>
                            <form onSubmit={handleSubmitTermination}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Termination Date</label>
                                    <input
                                        type="date"
                                        name="termination_date"
                                        value={terminationData.termination_date}
                                        onChange={handleTerminationChange}
                                        className="w-full rounded border px-3 py-2"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Reason</label>
                                    <textarea
                                        name="termination_reason"
                                        value={terminationData.termination_reason}
                                        onChange={handleTerminationChange}
                                        className="w-full rounded border px-3 py-2"
                                        rows="4"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowTerminationForm(false)}
                                        className="mr-2 rounded bg-gray-500 px-4 py-2 text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded bg-red-500 px-4 py-2 text-white"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Confirmation Dialog */}
                {showConfirmation && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                        <div className="rounded bg-white p-6 shadow-lg">
                            <h2 className="mb-4 text-xl font-bold">Confirm Termination</h2>
                            <p className="mb-4">
                                Are you sure you want to terminate this employee? 😢
                            </p>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmation(false)}
                                    className="mr-2 rounded bg-gray-500 px-4 py-2 text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmTermination}
                                    className="rounded bg-red-500 px-4 py-2 text-white"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
