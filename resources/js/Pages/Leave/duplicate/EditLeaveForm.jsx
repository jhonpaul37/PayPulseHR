import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AvailLeave from '../components/AvailLeave';
import FormHeader from '../components/FormHeader';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/inertia-react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';

function EditLeaveForm({ auth, LeaveRequest }) {
    const employee = LeaveRequest?.employee || {};
    const leaveCredits = LeaveRequest?.leave_credits || {};

    const { data, setData, put, processing, errors } = useForm({
        office_unit: LeaveRequest?.office_unit || '',
        leave_type: LeaveRequest?.leave_type || '',
        leave_details: LeaveRequest?.leave_details || {},
        from_date: LeaveRequest?.from_date || '',
        to_date: LeaveRequest?.to_date || '',
        total_days: LeaveRequest?.total_days || '',
        commutation_requested: LeaveRequest?.commutation_requested || false,
        disapproval_reason: LeaveRequest?.disapproval_reason || '',
        approved_days_with_pay: LeaveRequest?.approved_days_with_pay || '',
        approved_days_without_pay: LeaveRequest?.approved_days_without_pay || '',
        approved_other: LeaveRequest?.approved_other || '',
    });

    const [formData, setFormData] = useState({
        lastName: employee?.last_name || '',
        firstName: employee?.first_name || '',
        middleName: employee?.middle_name || '',
        dateOfFiling: LeaveRequest?.request_date || '',
        position: employee?.position?.name || '',
        salary: employee?.salary_grade?.monthly_salary || '',
    });

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD for input[type="date"]
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setData(name, checked);
    };

    const handleLeaveTypeChange = (leaveType, leaveDetails) => {
        setData({
            ...data,
            leave_type: leaveType,
            leave_details: leaveDetails,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('leave.update', LeaveRequest.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Optional success handling
                console.log('Leave request updated');
            },
        });
    };

    // Helper function to safely handle null values
    const safeValue = (value) => (value === null || value === undefined ? '' : value);

    const displayDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <form onSubmit={handleSubmit}>
                <div className="border border-black">
                    <div className="p-4">
                        <FormHeader />
                        <span className="flex justify-center text-2xl font-bold">
                            EDIT LEAVE APPLICATION
                        </span>
                    </div>
                    <div className="flex justify-between border-t border-black p-2">
                        <span className="">
                            <label className="mr-2 block"> 1. OFFICE/DEPARTMENT</label>
                            <TextInput
                                type="text"
                                name="office_unit"
                                className="ml-10"
                                value={safeValue(data.office_unit)}
                                onChange={handleInputChange}
                            />
                        </span>
                        <span className="flex">
                            <label className="mr-2">2. NAME:</label>
                            <div className="flex">
                                <div className="flex flex-col items-center">
                                    <span className="mb-1">(last)</span>
                                    <TextInput
                                        type="text"
                                        value={safeValue(formData.lastName)}
                                        readOnly
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="mb-1">(first)</span>
                                    <TextInput
                                        type="text"
                                        value={safeValue(formData.firstName)}
                                        readOnly
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="mb-1">(middle)</span>
                                    <TextInput
                                        type="text"
                                        value={safeValue(formData.middleName)}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </span>
                    </div>
                    <div className="flex justify-evenly border-t border-black p-2">
                        <span>
                            <label className="mr-2">3. DATE OF FILING</label>
                            <TextInput
                                type="text"
                                value={safeValue(formData.dateOfFiling)}
                                readOnly
                            />
                        </span>
                        <span>
                            <label className="mr-2">4. POSITION</label>
                            <TextInput type="text" value={safeValue(formData.position)} readOnly />
                        </span>
                        <span className="">
                            <label className="mr-2">5. SALARY</label>
                            <TextInput type="text" value={safeValue(formData.salary)} readOnly />
                        </span>
                    </div>
                    <div>
                        <label className="flex justify-center border-b border-t border-black p-1 font-bold">
                            6. DETAILS OF APPLICATION
                        </label>
                    </div>

                    {/* Editable Leave Type Section */}
                    <AvailLeave
                        typeOfLeave={data.leave_type}
                        leaveDetails={data.leave_details}
                        onLeaveTypeChange={handleLeaveTypeChange}
                        editable={true}
                    />

                    <div className="grid grid-cols-2">
                        <div className="border-t border-black p-1">
                            <label>6.C NUMBER OF WORKING DAYS APPLIED FOR</label>
                            <div className="flex flex-col p-4">
                                <TextInput
                                    type="number"
                                    name="total_days"
                                    value={safeValue(data.total_days)}
                                    onChange={handleInputChange}
                                    className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                />
                                <span>INCLUSIVE DATES</span>
                                <div className="flex gap-2">
                                    <TextInput
                                        type="date"
                                        name="from_date"
                                        value={formatDate(data.from_date)}
                                        onChange={handleInputChange}
                                        className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                    />
                                    <span>to</span>
                                    <TextInput
                                        type="date"
                                        name="to_date"
                                        value={formatDate(data.to_date)}
                                        onChange={handleInputChange}
                                        className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="border-l border-t border-black p-1">
                            <label>6.D COMMUTATION</label>
                            <div className="flex flex-col p-4">
                                <label>
                                    <input
                                        type="radio"
                                        name="commutation_requested"
                                        checked={!data.commutation_requested}
                                        onChange={() => setData('commutation_requested', false)}
                                        className="form-radio"
                                    />{' '}
                                    <span className="mx-2">Not Requested</span>
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="commutation_requested"
                                        checked={data.commutation_requested}
                                        onChange={() => setData('commutation_requested', true)}
                                        className="form-radio"
                                    />{' '}
                                    <span className="mx-2">Requested</span>
                                </label>
                                <label className="mt-10 border-t border-black">
                                    <span className="flex justify-center">
                                        (Signature of Applicant)
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="flex justify-center border-b border-t border-black font-bold">
                            7. DETAILS OF ACTION ON APPLICATION
                        </label>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="p-1">
                            <label className=""> 7.A CERTIFICATION OF LEAVE CREDITS</label>
                            <div className="p-2">
                                <div className="flex justify-center">
                                    <label className="flex">
                                        As of{' '}
                                        <TextInput
                                            type="text"
                                            value={new Date().toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none"
                                            readOnly
                                        />
                                    </label>
                                </div>
                                <div className="overflow-x-auto px-10 pt-5">
                                    <table className="min-w-full border border-gray-200 bg-white">
                                        <thead>
                                            <tr className="bg-gray-200 text-gray-700">
                                                <th className="border border-black px-1"></th>
                                                <th className="border border-black px-1">
                                                    Vacation Leave
                                                </th>
                                                <th className="border border-black px-1">
                                                    Sick Leave
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-black px-1">
                                                    Total Earned
                                                </td>
                                                <td className="border border-black px-1">
                                                    {safeValue(
                                                        LeaveRequest?.employee?.leave_credits
                                                            ?.vacation_leave
                                                    )}
                                                </td>
                                                <td className="border border-black px-1">
                                                    {safeValue(
                                                        LeaveRequest?.employee?.leave_credits
                                                            ?.sick_leave
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-black px-1">
                                                    Less this application
                                                </td>
                                                <td className="border border-black px-1">
                                                    {safeValue(leaveCredits?.vacation_leave_used)}
                                                </td>
                                                <td className="border border-black px-1">
                                                    {safeValue(leaveCredits?.sick_leave_used)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-black px-1">
                                                    Balance
                                                </td>
                                                <td className="border border-black px-1">
                                                    {safeValue(
                                                        leaveCredits?.vacation_leave_balance
                                                    )}
                                                </td>
                                                <td className="border border-black px-1">
                                                    {safeValue(leaveCredits?.sick_leave_balance)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="mt-10 flex justify-center">
                                <span className="border-t border-black px-10">
                                    {' '}
                                    Name & Signature of Authorized Official
                                </span>
                            </div>
                        </div>
                        <div className="border-l border-black p-1">
                            <label className=""> 7.B RECOMMENDATION</label>
                            <div className="p-2">
                                <div className="flex flex-col">
                                    <label htmlFor=""> For approval</label>
                                    <div className="flex flex-col">
                                        <label htmlFor=""> For disapproval due to</label>
                                        <textarea
                                            name="disapproval_reason"
                                            value={safeValue(data.disapproval_reason)}
                                            onChange={handleInputChange}
                                            className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-10 flex justify-center">
                                <span className="border-t border-black px-10">
                                    {' '}
                                    Name & Signature of Authorized Official
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 border-t border-black">
                        <div className="p-1">
                            <label> 7.C APPROVED FOR:</label>
                            <div className="flex flex-col p-2">
                                <label>
                                    <TextInput
                                        type="number"
                                        name="approved_days_with_pay"
                                        value={safeValue(data.approved_days_with_pay)}
                                        onChange={handleInputChange}
                                        className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                    />{' '}
                                    days with pay
                                </label>
                                <label>
                                    <TextInput
                                        type="number"
                                        name="approved_days_without_pay"
                                        value={safeValue(data.approved_days_without_pay)}
                                        onChange={handleInputChange}
                                        className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                    />{' '}
                                    days without pay
                                </label>
                                <label>
                                    <TextInput
                                        type="text"
                                        name="approved_other"
                                        value={safeValue(data.approved_other)}
                                        onChange={handleInputChange}
                                        className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                    />{' '}
                                    others (Specify)
                                </label>
                            </div>
                        </div>
                        <div className="p-1">
                            <label>7.D DISAPPROVED DUE TO:</label>
                            <div className="p-2">
                                <textarea
                                    name="disapproval_reason"
                                    value={safeValue(data.disapproval_reason)}
                                    onChange={handleInputChange}
                                    className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 flex justify-center font-bold">
                        <span className="border-t border-black px-10">College President</span>
                    </div>
                </div>
                <div className="mt-10 flex justify-center gap-4">
                    <PrimaryButton type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save Changes'}
                    </PrimaryButton>
                    <DangerButton type="button" onClick={() => window.history.back()}>
                        Cancel
                    </DangerButton>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}

export default EditLeaveForm;
