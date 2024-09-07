import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import FormHeader from './FormHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Leave = ({ auth }) => {
    const [data, setData] = useState({
        requestor_name: '',
        office_unit: '',
        request_date: '',
        leave_type: [],
        other_leave_type: '',
        from_date: '',
        to_date: '',
        total_days: '',
    });

    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        const currentDate = (() => {
            const date = new Date();
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        })();

        setData((prevData) => ({
            ...prevData,
            request_date: currentDate,
        }));
    }, []);
    //data for the type of leave
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Clear validation error if input have value
        if (value !== '') {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                [name]: '',
            }));
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;

        if (checked) {
            setData((prevData) => ({
                ...prevData,
                leave_type: [...prevData.leave_type, name],
            }));
        } else {
            setData((prevData) => ({
                ...prevData,
                leave_type: prevData.leave_type.filter((type) => type !== name),
            }));
        }
    };
    // auto calculate the total days
    const calculateTotalDays = (name, value) => {
        const { from_date, to_date } = data;

        const startDate = name === 'from_date' ? new Date(value) : new Date(from_date);
        const endDate = name === 'to_date' ? new Date(value) : new Date(to_date);

        if (startDate && endDate && startDate <= endDate) {
            const timeDifference = endDate - startDate;
            const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1;
            setData((prevData) => ({
                ...prevData,
                total_days: daysDifference,
            }));
        } else {
            setData((prevData) => ({
                ...prevData,
                total_days: '',
            }));
        }
    };
    //error validation code
    const validateForm = () => {
        const errors = {};

        if (!data.requestor_name) {
            errors.requestor_name = 'Name of requestor is required.';
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

        setValidationErrors(errors);

        return Object.keys(errors).length === 0;
    };
    //submit button
    const submit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formattedData = {
            ...data,
            other_leave_type: data.leave_type.includes('Others (please specify)')
                ? data.other_leave_type
                : '',
        };

        Inertia.post('/leave', formattedData);
        console.log('Submitted Data:', formattedData);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div>
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
                                <div className="mb-2">
                                    <label className="mr-2 font-bold">Name of Requestor:</label>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        name="requestor_name"
                                        value={data.requestor_name}
                                        onChange={handleInputChange}
                                        className={`focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none ${validationErrors.requestor_name ? 'border-red-500' : ''}`}
                                    />
                                    {validationErrors.requestor_name && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {validationErrors.requestor_name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mr-2 font-bold">Office/Unit:</label>
                                    <input
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
                                    <input
                                        type="date"
                                        autoComplete="off"
                                        name="request_date"
                                        value={data.request_date}
                                        onChange={handleInputChange}
                                        className="focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div></div>
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
                                            <input
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
                                {data.leave_type.includes('Others (please specify)') && (
                                    <div className="mt-2">
                                        <label className="mr-2 font-bold">
                                            Specify Leave Type:
                                        </label>
                                        <input
                                            type="text"
                                            name="other_leave_type"
                                            value={data.other_leave_type}
                                            onChange={handleInputChange}
                                            autoComplete="off"
                                            className="focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none"
                                        />
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
                                        <input
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
                                        <input
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
                                    <span>{data.total_days}</span>
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
                        <button type="submit" className="rounded-md bg-high px-4 py-2 font-bold">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Leave;
