import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import BSCLogo from '../../../assets/BSC_LOGO.png';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Leave = ({ auth }) => {
    const [formData, setFormData] = useState({
        requestor_name: '',
        office_unit: '',
        request_date: '',
        leave_type: [],
        other_leave_type: '', // State for "Others (please specify)"
        from_date: '',
        to_date: '',
        total_days: '',
    });

    useEffect(() => {
        const currentDate = (() => {
            const date = new Date();
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        })();

        setFormData((prevData) => ({
            ...prevData,
            request_date: currentDate,
        }));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;

        if (checked) {
            setFormData((prevData) => ({
                ...prevData,
                leave_type: [...prevData.leave_type, name],
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                leave_type: prevData.leave_type.filter((type) => type !== name),
            }));
        }
    };

    const calculateTotalDays = (name, value) => {
        const { from_date, to_date } = formData;

        const startDate = name === 'from_date' ? new Date(value) : new Date(from_date);
        const endDate = name === 'to_date' ? new Date(value) : new Date(to_date);

        if (startDate && endDate && startDate <= endDate) {
            const timeDifference = endDate - startDate;
            const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1;
            setFormData((prevData) => ({
                ...prevData,
                total_days: daysDifference,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                total_days: '',
            }));
        }
    };

    const submit = (e) => {
        e.preventDefault();

        const formattedData = {
            ...formData,
            other_leave_type: formData.leave_type.includes('Others (please specify)')
                ? formData.other_leave_type
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
                        <div className="relative mb-5 flex items-center justify-center">
                            <img
                                src={BSCLogo}
                                alt="Batanes State College Logo"
                                className="mr-4 h-20 w-20"
                            />
                            <div className="flex flex-col items-center">
                                <span className="font-oldenglish">Republic of the Philippines</span>
                                <span className="font-copperplate text-2xl tracking-wide">
                                    BATANES STATE COLLEGE
                                </span>
                                <span className="font-times">San Antonio, Basco, Batanes</span>
                                <div className="">
                                    <span className="mr-2">www.bscbatanes.edu.ph</span>
                                    <span className="mr-2">batanes_bsat@yahoo.com</span>
                                    <span>09057867863</span>
                                </div>
                            </div>
                            <div className="absolute right-0 top-0 flex flex-col text-end">
                                <span>BSC-FORM-HRP-001</span>
                                <span>REF#: ________________________</span>
                            </div>
                        </div>

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
                                        value={formData.requestor_name}
                                        onChange={handleInputChange}
                                        className={`focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none`}
                                    />
                                </div>
                                <div>
                                    <label className="mr-2 font-bold">Office/Unit:</label>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        name="office_unit"
                                        value={formData.office_unit}
                                        onChange={handleInputChange}
                                        className={`focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none`}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="mb-2">
                                    <label className="mr-2 font-bold">Date of Request:</label>
                                    <input
                                        type="date"
                                        autoComplete="off"
                                        name="request_date"
                                        value={formData.request_date}
                                        onChange={handleInputChange}
                                        className={`focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none`}
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
                                    {[
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
                                    ].map((mode) => (
                                        <label
                                            key={mode}
                                            className={`inline-flex items-center ${
                                                mode === 'Others (please specify)'
                                                    ? 'col-span-3'
                                                    : ''
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                name={mode}
                                                checked={formData.leave_type.includes(mode)}
                                                onChange={handleCheckboxChange}
                                                className="form-checkbox"
                                                autoComplete="off"
                                            />
                                            <span className="ml-2">{mode}</span>
                                        </label>
                                    ))}
                                </div>
                                {formData.leave_type.includes('Others (please specify)') && (
                                    <div className="mt-2">
                                        <label className="mr-2 font-bold">
                                            Specify Leave Type:
                                        </label>
                                        <input
                                            type="text"
                                            name="other_leave_type"
                                            value={formData.other_leave_type}
                                            onChange={handleInputChange}
                                            className="focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-5">
                            <div className="flex flex-col">
                                <div className="flex justify-evenly">
                                    <div className="mb-2">
                                        <label className="mr-2 font-bold">From Date:</label>
                                        <input
                                            type="date"
                                            autoComplete="off"
                                            name="from_date"
                                            value={formData.from_date}
                                            onChange={(e) => {
                                                handleInputChange(e);
                                                calculateTotalDays(e.target.name, e.target.value);
                                            }}
                                            className="focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mr-2 font-bold">To Date:</label>
                                        <input
                                            type="date"
                                            autoComplete="off"
                                            name="to_date"
                                            value={formData.to_date}
                                            onChange={(e) => {
                                                handleInputChange(e);
                                                calculateTotalDays(e.target.name, e.target.value);
                                            }}
                                            className="focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <div className="mb-2">
                                        <label className="mr-2 font-bold">Total Days:</label>
                                        <input
                                            type="text"
                                            readOnly
                                            name="total_days"
                                            value={formData.total_days}
                                            className="focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 flex justify-end">
                        <button type="submit" className="rounded bg-high px-4 py-2 font-bold">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Leave;
