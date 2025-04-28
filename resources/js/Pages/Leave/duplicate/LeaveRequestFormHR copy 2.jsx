import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import FormHeader from './components/FormHeader';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Select from 'react-select';

const LeaveRequestForm = ({ auth, employees }) => {
    const [data, setData] = useState({
        requestor_name: '',
        employee_id: '',
        office_unit: '',
        request_date: '',
        leave_type: [],
        other_leave_type: '',
        from_date: '',
        to_date: '',
        total_days: '',
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Transform employees data for react-select
    useEffect(() => {
        if (employees && employees.length > 0) {
            const options = employees.map((employee) => ({
                value: employee.id,
                label: `${employee.first_name} ${employee.middle_name ? employee.middle_name.charAt(0) + '.' : ''} ${employee.last_name}`,
                data: {
                    // Ensure data contains all needed fields
                    ...employee,
                    department: employee.department || '',
                    office_unit: employee.office_unit || '',
                },
            }));
            setEmployeeOptions(options);
        }
    }, [employees]);

    // Handle employee selection
    const handleEmployeeChange = (selectedOption) => {
        setSelectedEmployee(selectedOption);

        if (selectedOption) {
            const employee = selectedOption.data;
            const middleInitial = employee.middle_name ? `${employee.middle_name.charAt(0)}.` : '';
            const requestorName = `${employee.first_name} ${middleInitial} ${employee.last_name}`;

            setData((prevData) => ({
                ...prevData,
                requestor_name: requestorName,
                employee_id: employee.id,
                office_unit: employee.department || employee.office_unit || '',
                request_date: new Date().toISOString().split('T')[0],
            }));
        } else {
            setData((prevData) => ({
                ...prevData,
                requestor_name: '',
                employee_id: '',
                office_unit: '',
                request_date: new Date().toISOString().split('T')[0],
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        if (value !== '') {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                [name]: '',
            }));
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setData((prevData) => ({
            ...prevData,
            leave_type: checked
                ? [...prevData.leave_type, name]
                : prevData.leave_type.filter((type) => type !== name),
        }));
    };

    const calculateTotalDays = (name, value) => {
        const { from_date, to_date } = data;
        const startDate = name === 'from_date' ? new Date(value) : new Date(from_date);
        const endDate = name === 'to_date' ? new Date(value) : new Date(to_date);

        if (startDate && endDate) {
            if (startDate > endDate) {
                setValidationErrors((prev) => ({
                    ...prev,
                    to_date: 'End date must be after start date',
                }));
                setData((prev) => ({ ...prev, total_days: '' }));
                return;
            }

            const timeDifference = endDate - startDate;
            const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1;

            setValidationErrors((prev) => ({
                ...prev,
                to_date: '',
            }));

            setData((prev) => ({
                ...prev,
                total_days: daysDifference.toString(), // Ensure it's a string
            }));
        } else {
            setData((prev) => ({
                ...prev,
                total_days: '',
            }));
        }
    };

    const TypeOfLeave = [
        'Vacation Leave',
        'Sick Leave',
        'Special Privilege Leave',
        'Mandatory/Forced Leave',
        'Maternity Leave',
        'Paternity Leave',
        'Terminal Leave',
        'Rehabilitation Leave',
        'Compensatory Time-Off',
        'Others (please specify)',
    ];

    const validateForm = () => {
        const errors = {};

        if (!data.employee_id) {
            errors.employee_id = 'Employee selection is required.';
        }

        if (!data.office_unit) {
            errors.office_unit = 'Office/Unit is required.';
        }

        if (!data.from_date) {
            errors.from_date = 'From Date is required.';
        }

        if (!data.to_date) {
            errors.to_date = 'To Date is required.';
        }

        if (data.leave_type.length === 0) {
            errors.leave_type = 'At least one leave type must be selected.';
        }

        if (data.leave_type.includes('Others (please specify)') && !data.other_leave_type) {
            errors.other_leave_type = 'Please specify the leave type.';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const submit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        // Ensure leave_type is properly formatted
        const formattedData = {
            ...data,
            leave_type: Array.isArray(data.leave_type) ? data.leave_type : [],
            other_leave_type: data.leave_type.includes('Others (please specify)')
                ? data.other_leave_type
                : null,
        };

        console.log('Submitting data:', formattedData); // Debug before submission

        Inertia.post(route('leave.request.hr.store'), formattedData, {
            onError: (errors) => {
                console.error('Submission errors:', errors); // Log errors
                setValidationErrors(errors);
                setIsSubmitting(false);
            },
            onSuccess: () => {
                setData({
                    requestor_name: '',
                    employee_id: '',
                    office_unit: '',
                    request_date: new Date().toISOString().split('T')[0],
                    leave_type: [],
                    other_leave_type: '',
                    from_date: '',
                    to_date: '',
                    total_days: '',
                });
                setSelectedEmployee(null);
                setIsSubmitting(false);
            },
            onFinish: () => setIsSubmitting(false),
        });
    };
    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="p-4">
                <form onSubmit={submit}>
                    <div className="border-2 border-black p-4">
                        <FormHeader />

                        <div className="mb-5">
                            <label className="flex justify-center border-b-2 border-t-2 border-black p-1 font-bold">
                                LEAVE REQUEST FORM
                            </label>
                        </div>

                        <div className="flex justify-between">
                            <div className="flex flex-col">
                                <div className="mb-4 flex items-center gap-5">
                                    <label className="mb-2 block font-bold">Select Employee:</label>
                                    <Select
                                        options={employeeOptions}
                                        value={selectedEmployee}
                                        onChange={handleEmployeeChange}
                                        placeholder="Search for an employee..."
                                        isClearable
                                        className={`${validationErrors.employee_id ? 'border-red-500' : ''}`}
                                    />
                                    {validationErrors.employee_id && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {validationErrors.employee_id}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-2 hidden">
                                    <TextInput
                                        type="text"
                                        autoComplete="off"
                                        name="requestor_name"
                                        value={data.requestor_name}
                                        onChange={handleInputChange}
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label className="mr-2 font-bold">Office/Unit:</label>
                                    <TextInput
                                        type="text"
                                        autoComplete="off"
                                        name="office_unit"
                                        value={data.office_unit}
                                        onChange={handleInputChange}
                                        className={`focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none ${validationErrors.office_unit ? 'border-red-500' : ''}`}
                                    />
                                    {validationErrors.office_unit && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {validationErrors.office_unit}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="mb-2">
                                    <label className="mr-2 font-bold">Date of Request:</label>
                                    <TextInput
                                        type="date"
                                        autoComplete="off"
                                        name="request_date"
                                        value={data.request_date}
                                        onChange={handleInputChange}
                                        className="focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 border-2 border-black">
                            <div className="border-black bg-blue-100 p-2">
                                <label className="font-bold">TYPE OF LEAVE:</label>
                            </div>
                            <div className="flex flex-col border-t-2 border-black p-2">
                                <div className="grid grid-cols-3">
                                    {TypeOfLeave.map((type, index) => (
                                        <label
                                            key={index}
                                            className={`inline-flex items-center ${
                                                type === 'Others (please specify)'
                                                    ? 'col-span-3'
                                                    : ''
                                            }`}
                                        >
                                            <TextInput
                                                type="checkbox"
                                                name={type}
                                                checked={data.leave_type.includes(type)}
                                                onChange={handleCheckboxChange}
                                                className="form-checkbox"
                                                autoComplete="off"
                                            />
                                            <span className="ml-2">{type}</span>
                                        </label>
                                    ))}
                                </div>
                                {validationErrors.leave_type && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {validationErrors.leave_type}
                                    </p>
                                )}
                                {data.leave_type.includes('Others (please specify)') && (
                                    <div className="mt-2">
                                        <label className="mr-2 font-bold">
                                            Specify Leave Type:
                                        </label>
                                        <TextInput
                                            type="text"
                                            name="other_leave_type"
                                            value={data.other_leave_type}
                                            onChange={handleInputChange}
                                            autoComplete="off"
                                            className={`focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none ${validationErrors.other_leave_type ? 'border-red-500' : ''}`}
                                        />
                                        {validationErrors.other_leave_type && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {validationErrors.other_leave_type}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-5 border-2 border-black">
                            <div className="border-black bg-blue-100 p-2">
                                <label className="font-bold">INCLUSIVE DATES:</label>
                            </div>
                            <div className="flex flex-col border-t-2 border-black p-5">
                                <div className="flex justify-evenly">
                                    <div className="mb-2">
                                        <label className="mr-2 font-bold">From Date:</label>
                                        <TextInput
                                            type="date"
                                            autoComplete="off"
                                            name="from_date"
                                            value={data.from_date}
                                            onChange={(e) => {
                                                handleInputChange(e);
                                                calculateTotalDays(e.target.name, e.target.value);
                                            }}
                                            className={`focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none ${validationErrors.from_date ? 'border-red-500' : ''}`}
                                        />
                                        {validationErrors.from_date && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {validationErrors.from_date}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mr-2 font-bold">To Date:</label>
                                        <TextInput
                                            type="date"
                                            autoComplete="off"
                                            name="to_date"
                                            value={data.to_date}
                                            onChange={(e) => {
                                                handleInputChange(e);
                                                calculateTotalDays(e.target.name, e.target.value);
                                            }}
                                            className={`focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none ${validationErrors.to_date ? 'border-red-500' : ''}`}
                                        />
                                        {validationErrors.to_date && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {validationErrors.to_date}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <label className="mr-2 font-bold">Total Days:</label>
                                    <span>{data.total_days || ''}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center pt-10">
                            <span className="border-t border-black px-16 font-bold">
                                Signature of Requestor
                            </span>
                        </div>
                    </div>
                    <div className="mt-5 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`rounded-md px-4 py-2 font-bold text-white ${isSubmitting ? 'cursor-not-allowed bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center">
                                    <svg
                                        className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Submitting...
                                </span>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default LeaveRequestForm;
