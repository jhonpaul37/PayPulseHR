import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AvailLeave from '../components/AvailLeave';
import FormHeader from '../components/FormHeader';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/inertia-react';
import { Link } from '@inertiajs/react';
import { ArrowLeftOutlined } from '@ant-design/icons';

function AppLeaveForm({ auth, LeaveRequest }) {
    const employee = LeaveRequest?.employee || {};
    const leaveCredits = LeaveRequest?.leave_credits || {};

    const { data, setData, post, processing } = useForm({
        status: 'review',
        // Include other fields you want to submit
    });

    const [formData, setFormData] = useState({
        office_unit: LeaveRequest?.office_unit || '',
        lastName: employee?.last_name || '',
        firstName: employee?.first_name || '',
        middleName: employee?.middle_name || '',
        dateOfFiling: LeaveRequest?.request_date || '',
        position: employee?.position?.name || '',
        salary: employee?.salary_grade?.monthly_salary || '',
        leaveAvail: LeaveRequest?.leave_type || '',
        leaveDetails: LeaveRequest?.leave_details || {},
    });

    console.log('LeaveRequest:', LeaveRequest);

    const handleLeaveTypeChange = (leaveType, leaveDetails) => {
        setFormData((prevState) => ({
            ...prevState,
            leaveAvail: leaveType,
            leaveDetails: leaveDetails,
        }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('leave.updateStatus', LeaveRequest.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Optional success handling
                console.log('Status updated to review');
            },
        });
    };

    // Helper function to safely handle null values
    const safeValue = (value) => (value === null || value === undefined ? '' : value);

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="border-b pb-6">
                <header className="flex items-center text-xl font-bold">
                    <Link
                        href={route('leaveManagement')}
                        className="mr-4 flex items-center text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeftOutlined className="mr-1" />
                    </Link>
                    Application for Leave{' '}
                </header>
            </div>
            <form onSubmit={handleSubmit} className="pt-10">
                <div className="border border-black">
                    <div className="p-4">
                        <FormHeader />
                        <span className="flex justify-center text-2xl font-bold">
                            APPLICATION FOR LEAVE
                        </span>
                    </div>
                    <div className="flex justify-between border-black p-2">
                        <span className="">
                            <label className="mr-2 block"> 1. OFFICE/DEPARTMENT</label>
                            <TextInput
                                type="text"
                                name="office_unit"
                                className="ml-10"
                                value={safeValue(formData.office_unit)}
                                readOnly
                            />
                        </span>
                        <span className="flex">
                            <label className="mr-2">2. NAME:</label>
                            <div className="flex">
                                <div className="flex flex-col items-center">
                                    <span className="mb-1">(last)</span>
                                    <TextInput
                                        type="text"
                                        name="lastName"
                                        value={safeValue(formData.lastName)}
                                        readOnly
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="mb-1">(first)</span>
                                    <TextInput
                                        type="text"
                                        name="lastName"
                                        value={safeValue(formData.firstName)}
                                        readOnly
                                    />
                                </div>

                                <div className="flex flex-col items-center">
                                    <span className="mb-1">(middle)</span>
                                    <TextInput
                                        type="text"
                                        name="lastName"
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
                                name="dateOfFiling"
                                value={safeValue(formData.dateOfFiling)}
                                readOnly
                            />
                        </span>
                        <span>
                            <label className="mr-2">4. POSITION</label>
                            <TextInput
                                type="text"
                                name="position"
                                value={safeValue(formData.position)}
                                readOnly
                            />
                        </span>
                        <span className="">
                            <label className="mr-2">5. SALARY</label>
                            <TextInput
                                type="text"
                                name="salary"
                                value={safeValue(formData.salary)}
                                onChange={handleInputChange}
                                placeholder="salary"
                                autoComplete="off"
                            />
                        </span>
                    </div>
                    <div>
                        <label className="flex justify-center border-b border-t border-black p-1 font-bold">
                            6. DETAILS OF APPLICATION
                        </label>
                    </div>
                    {/* Type of Leave */}

                    <AvailLeave
                        typeOfLeave={LeaveRequest?.leave_type || ''}
                        leaveDetails={LeaveRequest?.leave_details || {}}
                        onLeaveTypeChange={(type, details) => {
                            // Handle the change without causing re-renders
                            // You might want to debounce this if it's causing performance issues
                            console.log('Leave type changed:', type, details);
                        }}
                    />
                    <div className="grid grid-cols-2">
                        <div className="border-t border-black p-1">
                            <label>6.C NUMBER OF WORKING DAYS APPLIED FOR</label>
                            <div className="flex flex-col p-4">
                                <TextInput
                                    type="text"
                                    value={safeValue(LeaveRequest?.total_days)}
                                    className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                    readOnly
                                />
                                <span>INCLUSIVE DATES</span>
                                <TextInput
                                    type="text"
                                    value={
                                        LeaveRequest?.from_date && LeaveRequest?.to_date
                                            ? `${formatDate(LeaveRequest.from_date)} - ${formatDate(LeaveRequest.to_date)}`
                                            : ''
                                    }
                                    className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="border-l border-t border-black p-1">
                            <label>6.D COMMUTATION</label>
                            <div className="flex flex-col p-4">
                                <label>
                                    <TextInput
                                        type="radio"
                                        name="commutation"
                                        // checked={!LeaveRequest?.commutation_requested}
                                        className="form-radio"
                                        autoComplete="off"
                                        readOnly
                                    />{' '}
                                    <span className="mx-2">Not Requested</span>
                                </label>
                                <label>
                                    <TextInput
                                        type="radio"
                                        name="commutation"
                                        // checked={LeaveRequest?.commutation_requested}
                                        className="form-radio"
                                        autoComplete="off"
                                        readOnly
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
                                                {/* <td className="border border-black px-1">
                                                    {safeValue(
                                                        leaveCredits?.employee.leave_credits
                                                            .vacation_leave
                                                    )}
                                                </td> */}
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
                                            value={safeValue(LeaveRequest?.disapproval_reason)}
                                            className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                            readOnly
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
                                        type="text"
                                        value={safeValue(LeaveRequest?.approved_days_with_pay)}
                                        className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                        readOnly
                                    />{' '}
                                    days with pay
                                </label>
                                <label>
                                    <TextInput
                                        type="text"
                                        value={safeValue(LeaveRequest?.approved_days_without_pay)}
                                        className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                        readOnly
                                    />{' '}
                                    days without pay
                                </label>
                                <label>
                                    <TextInput
                                        type="text"
                                        value={safeValue(LeaveRequest?.approved_other)}
                                        className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                        readOnly
                                    />{' '}
                                    others (Specify)
                                </label>
                            </div>
                        </div>
                        <div className="p-1">
                            <label>7.D DISAPPROVED DUE TO:</label>
                            <div className="p-2">
                                <textarea
                                    value={safeValue(LeaveRequest?.disapproval_reason)}
                                    className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                    readOnly
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 flex justify-center font-bold">
                        <span className="border-t border-black px-10">College President</span>
                    </div>
                </div>
                <div className="mt-10 flex justify-center">
                    <button
                        type="submit"
                        className="rounded-md bg-high px-4 py-2 font-bold"
                        disabled={processing}
                    >
                        {processing ? 'Submitting...' : 'Submit Application'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}

export default AppLeaveForm;
