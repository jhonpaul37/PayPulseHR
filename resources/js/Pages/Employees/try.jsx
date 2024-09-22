import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';

export default function EmployeeInfoEdit({ employee, auth }) {
    const [isEditing, setIsEditing] = useState(false);
    const [showTerminationForm, setShowTerminationForm] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [employeeData, setEmployeeData] = useState({
        first_name: employee.first_name,
        middle_name: employee.middle_name,
        last_name: employee.last_name,
        birthdate: employee.birthdate,
        sex: employee.sex,
        civil_status: employee.civil_status,
        nationality: employee.nationality,
        address: employee.address,
        email: employee.email,
        phone: employee.phone,
        position: employee.position,
        department: employee.department,
        employment_type: employee.employment_type,
        start_date: employee.start_date,
        salary: employee.salary,
    });
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

    const handleChange = (e) => {
        setEmployeeData({
            ...employeeData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.put(`/employees/${employee.id}`, employeeData, {
            onFinish: () => setIsEditing(false),
        });
    };

    const handleTerminationChange = (e) => {
        setTerminationData({
            ...terminationData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmitTermination = (e) => {
        e.preventDefault();
        setShowConfirmation(true);
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
                        {isEditing ? (
                            <>
                                <TextInput
                                    type="text"
                                    name="first_name"
                                    value={employeeData.first_name}
                                    onChange={handleChange}
                                    className="mb-2 block w-full rounded border px-2 py-1"
                                />
                                <TextInput
                                    type="text"
                                    name="middle_name"
                                    value={employeeData.middle_name}
                                    onChange={handleChange}
                                    className="mb-2 block w-full rounded border px-2 py-1"
                                />
                                <TextInput
                                    type="text"
                                    name="last_name"
                                    value={employeeData.last_name}
                                    onChange={handleChange}
                                    className="mb-2 block w-full rounded border px-2 py-1"
                                />
                            </>
                        ) : (
                            <div className="mb-2">
                                <span className="text-lg font-bold text-main">
                                    {employee.first_name} {employee.middle_name}{' '}
                                    {employee.last_name}
                                </span>
                                <div className="text-sm text-gray-600">{employee.position}</div>
                                <div className="text-sm text-gray-600">{employee.department}</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="m-4 my-10 grid grid-cols-2">
                    {/* Personal Background */}
                    <div>
                        <label className="font-bold">Personal Background</label>
                        <div>
                            {isEditing ? (
                                <>
                                    <label className="text-gray-400">Date of Birth: </label>
                                    <TextInput
                                        type="date"
                                        name="birthdate"
                                        value={employeeData.birthdate}
                                        onChange={handleChange}
                                        className="mb-2 block w-full rounded border px-2 py-1"
                                    />
                                    <TextInput
                                        type="text"
                                        name="sex"
                                        value={employeeData.sex}
                                        onChange={handleChange}
                                        className="mb-2 block w-full rounded border px-2 py-1"
                                    />
                                    {/* Additional personal fields */}
                                </>
                            ) : (
                                <>
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
                                </>
                            )}
                        </div>
                    </div>

                    {/* Company info/ Status */}
                    <div>
                        <label className="font-bold">Status</label>
                        {isEditing ? (
                            <>
                                <TextInput
                                    type="text"
                                    name="position"
                                    value={employeeData.position}
                                    onChange={handleChange}
                                    className="mb-2 block w-full rounded border px-2 py-1"
                                />
                                <TextInput
                                    type="text"
                                    name="department"
                                    value={employeeData.department}
                                    onChange={handleChange}
                                    className="mb-2 block w-full rounded border px-2 py-1"
                                />
                                <TextInput
                                    type="number"
                                    name="salary"
                                    value={employeeData.salary}
                                    onChange={handleChange}
                                    className="mb-2 block w-full rounded border px-2 py-1"
                                />
                                {/* Additional company fields */}
                            </>
                        ) : (
                            <>
                                <div>
                                    <span className="text-gray-400">Position: </span>
                                    <span>{employee.position}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Salary: </span>
                                    <span>{formatCurrency(employee.salary)}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="my-4 flex justify-center">
                    {isEditing ? (
                        <button
                            onClick={handleSubmit}
                            className="rounded bg-blue-500 px-4 py-2 text-white"
                        >
                            Save
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="rounded bg-green-500 px-4 py-2 text-white"
                        >
                            Edit Employee
                        </button>
                    )}
                </div>

                {/* Termination Button */}
                {!isEditing && (
                    <div className="my-4 flex justify-center">
                        <button
                            onClick={() => setShowTerminationForm(true)}
                            className="rounded bg-red-500 px-4 py-2 text-white"
                        >
                            Terminate Employee
                        </button>
                    </div>
                )}

                {/* Termination Form */}
                {showTerminationForm && !showConfirmation && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                        <div className="rounded bg-white p-6 shadow-lg">
                            <h2 className="mb-4 text-xl font-bold">Terminate Employee</h2>
                            <form onSubmit={handleSubmitTermination}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Termination Date</label>
                                    <TextInput
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
