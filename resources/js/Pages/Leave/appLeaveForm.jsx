import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AvailLeave from './components/AvailLeave';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/inertia-react';
import { Link } from '@inertiajs/react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import PrimaryButton from '@/Components/PrimaryButton';

function AppLeaveForm({ auth, LeaveRequest }) {
    const employee = LeaveRequest?.employee || {};
    const leaveCredits = LeaveRequest?.employee?.leave_credits || {};

    const { data, setData, post, processing } = useForm({
        status: 'review',
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

    const [credits, setCredits] = useState({
        vacation_leave: leaveCredits?.vacation_leave || 0,
        sick_leave: leaveCredits?.sick_leave || 0,
        vacation_leave_used: leaveCredits?.vacation_leave_used || 0,
        sick_leave_used: leaveCredits?.sick_leave_used || 0,
    });

    useEffect(() => {
        setCredits((prev) => ({
            ...prev,
            vacation_leave_balance: prev.vacation_leave - prev.vacation_leave_used,
            sick_leave_balance: prev.sick_leave - prev.sick_leave_used,
        }));
    }, [credits.vacation_leave_used, credits.sick_leave_used]);

    const handleCreditChange = (e) => {
        const { name, value } = e.target;
        setCredits((prev) => ({
            ...prev,
            [name]: parseFloat(value) || 0,
        }));
    };

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
            ...data,
            leave_credits: credits,
            preserveScroll: true,
        });
    };

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
                    Application for Leave
                </header>
            </div>
            <div className="mx-auto max-w-6xl px-4">
                <form onSubmit={handleSubmit} className="pt-10">
                    <div className="border border-black">
                        {/* Section 1-2 */}
                        <div className="flex justify-between border-b border-black p-2">
                            <div className="w-1/2">
                                <label className="mr-2 block">1. OFFICE/DEPARTMENT</label>
                                <TextInput
                                    type="text"
                                    name="office_unit"
                                    className="ml-10 w-full max-w-xs"
                                    value={safeValue(formData.office_unit)}
                                    readOnly
                                />
                            </div>
                            <div className="flex w-1/2 items-center">
                                <label className="mr-2 whitespace-nowrap">2. NAME:</label>
                                <div className="flex w-full space-x-2">
                                    <div className="flex flex-col">
                                        <span className="mb-1 text-center text-xs">(last)</span>
                                        <TextInput
                                            type="text"
                                            name="lastName"
                                            value={safeValue(formData.lastName)}
                                            readOnly
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="mb-1 text-center text-xs">(first)</span>
                                        <TextInput
                                            type="text"
                                            name="firstName"
                                            value={safeValue(formData.firstName)}
                                            readOnly
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="mb-1 text-center text-xs">(middle)</span>
                                        <TextInput
                                            type="text"
                                            name="middleName"
                                            value={safeValue(formData.middleName)}
                                            readOnly
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3-5 */}
                        <div className="flex justify-between gap-5 border-b border-black p-2">
                            <div className="w-1/3">
                                <label className="mr-2">3. DATE OF FILING</label>
                                <TextInput
                                    type="text"
                                    name="dateOfFiling"
                                    value={formatDate(safeValue(formData.dateOfFiling))}
                                    readOnly
                                    className="w-full"
                                />
                            </div>
                            <div className="w-1/3">
                                <label className="mr-2">4. POSITION</label>
                                <TextInput
                                    type="text"
                                    name="position"
                                    value={safeValue(formData.position)}
                                    readOnly
                                    className="w-full"
                                />
                            </div>
                            <div className="w-1/3">
                                <label className="mr-2">5. SALARY</label>
                                <TextInput
                                    type="text"
                                    name="salary"
                                    value={safeValue(formData.salary)}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Section 6 */}
                        <div>
                            <label className="flex justify-center border-b border-t border-black p-1 font-bold">
                                6. DETAILS OF APPLICATION
                            </label>
                            <AvailLeave
                                typeOfLeave={LeaveRequest?.leave_type || ''}
                                leaveDetails={LeaveRequest?.leave_details || {}}
                                onLeaveTypeChange={handleLeaveTypeChange}
                            />
                        </div>

                        {/* Section 6.C and 6.D */}
                        <div className="grid grid-cols-2 border-t border-black">
                            <div className="border-r border-black p-2">
                                <label>6.C NUMBER OF WORKING DAYS APPLIED FOR</label>
                                <div className="p-2">
                                    <TextInput
                                        type="text"
                                        value={safeValue(LeaveRequest?.total_days)}
                                        className="w-full"
                                        readOnly
                                    />
                                    <span className="block pt-2">INCLUSIVE DATES</span>
                                    <TextInput
                                        type="text"
                                        value={
                                            LeaveRequest?.from_date && LeaveRequest?.to_date
                                                ? `${formatDate(LeaveRequest.from_date)} - ${formatDate(LeaveRequest.to_date)}`
                                                : ''
                                        }
                                        className="w-full"
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="p-2">
                                <label>6.D COMMUTATION</label>
                                <div className="p-2">
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="commutation"
                                                className="mr-2"
                                                readOnly
                                            />
                                            <span>Not Requested</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="commutation"
                                                className="mr-2"
                                                readOnly
                                            />
                                            <span>Requested</span>
                                        </label>
                                    </div>
                                    {/* <div className="mt-8 border-t border-black pt-2 text-center">
                                        (Signature of Applicant)
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        {/* Section 7 */}
                        <div>
                            <label className="flex justify-center border-b border-t border-black p-1 font-bold">
                                7. DETAILS OF ACTION ON APPLICATION
                            </label>
                        </div>

                        {/* Section 7.A and 7.B */}
                        <div className="grid grid-cols-2 border-t border-black">
                            <div className="border-r border-black p-2">
                                <label>7.A CERTIFICATION OF LEAVE CREDITS</label>
                                <div className="p-2">
                                    <div className="flex justify-center">
                                        <label className="flex items-center">
                                            As of{' '}
                                            <TextInput
                                                type="text"
                                                value={new Date().toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                                className="ml-2 w-48"
                                                readOnly
                                            />
                                        </label>
                                    </div>
                                    <div className="overflow-x-auto px-4 pt-4">
                                        <table className="w-full border border-gray-200 bg-white">
                                            <thead>
                                                <tr className="bg-gray-200 text-gray-700">
                                                    <th className="border border-black px-2 py-1"></th>
                                                    <th className="border border-black px-2 py-1">
                                                        Vacation Leave
                                                    </th>
                                                    <th className="border border-black px-2 py-1">
                                                        Sick Leave
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="border border-black px-2 py-1">
                                                        Total Earned
                                                    </td>
                                                    <td className="border border-black px-2 py-1">
                                                        {safeValue(credits.vacation_leave)}
                                                    </td>
                                                    <td className="border border-black px-2 py-1">
                                                        {safeValue(credits.sick_leave)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-black px-2 py-1">
                                                        Less this application
                                                    </td>
                                                    <td className="border border-black px-2 py-1">
                                                        <TextInput
                                                            type="number"
                                                            name="vacation_leave_used"
                                                            value={safeValue(
                                                                credits.vacation_leave_used
                                                            )}
                                                            onChange={handleCreditChange}
                                                            className="w-full"
                                                            step="0.5"
                                                            min="0"
                                                        />
                                                    </td>
                                                    <td className="border border-black px-2 py-1">
                                                        <TextInput
                                                            type="number"
                                                            name="sick_leave_used"
                                                            value={safeValue(
                                                                credits.sick_leave_used
                                                            )}
                                                            onChange={handleCreditChange}
                                                            className="w-full"
                                                            step="0.5"
                                                            min="0"
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-black px-2 py-1">
                                                        Balance
                                                    </td>
                                                    <td className="border border-black px-2 py-1">
                                                        {safeValue(credits.vacation_leave_balance)}
                                                    </td>
                                                    <td className="border border-black px-2 py-1">
                                                        {safeValue(credits.sick_leave_balance)}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* <div className="mt-8 border-t border-black pt-2 text-center">
                                        Name & Signature of Authorized Official
                                    </div> */}
                                </div>
                            </div>
                            <div className="p-2">
                                <label>7.B RECOMMENDATION</label>
                                <div className="p-2">
                                    <div className="space-y-2">
                                        <label className="block">For approval</label>
                                        <label className="block">For disapproval due to</label>
                                        <textarea
                                            value={safeValue(LeaveRequest?.disapproval_reason)}
                                            className="w-full border p-1"
                                            readOnly
                                            rows={3}
                                        ></textarea>
                                    </div>
                                    {/* <div className="mt-8 border-t border-black pt-2 text-center">
                                        Name & Signature of Authorized Official
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        {/* Section 7.C and 7.D */}
                        <div className="grid grid-cols-2 border-t border-black">
                            <div className="border-r border-black p-2">
                                <label>7.C APPROVED FOR:</label>
                                <div className="space-y-2 p-2">
                                    <div className="flex items-center">
                                        <TextInput
                                            type="text"
                                            value={safeValue(LeaveRequest?.approved_days_with_pay)}
                                            className="w-16"
                                            readOnly
                                        />
                                        <span className="ml-2">days with pay</span>
                                    </div>
                                    <div className="flex items-center">
                                        <TextInput
                                            type="text"
                                            value={safeValue(
                                                LeaveRequest?.approved_days_without_pay
                                            )}
                                            className="w-16"
                                            readOnly
                                        />
                                        <span className="ml-2">days without pay</span>
                                    </div>
                                    <div className="flex items-center">
                                        <TextInput
                                            type="text"
                                            value={safeValue(LeaveRequest?.approved_other)}
                                            className="w-16"
                                            readOnly
                                        />
                                        <span className="ml-2">others (Specify)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-2">
                                <label>7.D DISAPPROVED DUE TO:</label>
                                <div className="p-2">
                                    <textarea
                                        value={safeValue(LeaveRequest?.disapproval_reason)}
                                        className="w-full border p-1"
                                        readOnly
                                        rows={3}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 flex justify-center">
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? 'Submitting...' : 'Submit Application'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

export default AppLeaveForm;
