import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AvailLeave from './components/AvailLeave';
import FormHeader from './components/FormHeader';

function AppLeaveForm({ LeaveRequest, auth }) {
    // check if the data is existing
    // console.log('LeaveRequest:', LeaveRequest);

    const [formData, setFormData] = useState({
        office_unit: '',
        lastName: '',
        firstName: '',
        middleName: '',
        dateOfFiling: '',
        position: '',
        salary: '',
        leaveAvail: '',
        leaveDetails: {},
    });

    // Handler for leave type change from AvailLeave component
    const handleLeaveTypeChange = (leaveType, leaveDetails) => {
        setFormData((prevState) => ({
            ...prevState,
            leaveAvail: leaveType,
            leaveDetails: leaveDetails,
        }));
    };

    // Function to update specific fields in formData
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('Form Submitted! Form Data:', formData);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <form onSubmit={handleSubmit}>
                <div className="border border-black">
                    <div className="p-4">
                        <FormHeader />
                        <span className="flex justify-center text-2xl font-bold">
                            APPLICATION FOR LEAVE
                        </span>
                    </div>
                    <div className="flex justify-between border-t border-black p-2">
                        <span>
                            <label className="mr-2"> 1. OFFICE/DEPARTMENT</label>
                            <input
                                type="text"
                                name="office_unit"
                                value={LeaveRequest.office_unit}
                                className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                readOnly
                            />
                        </span>
                        <span className="flex items-center justify-between">
                            <label>2. NAME:</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="Last Name"
                                autoComplete="off"
                            />
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="First Name"
                                autoComplete="off"
                            />

                            <input
                                type="text"
                                name="middleName"
                                value={formData.middleName}
                                onChange={handleInputChange}
                                placeholder="Middle Name"
                                autoComplete="off"
                            />
                        </span>
                    </div>
                    <div className="flex justify-evenly border-t border-black p-2">
                        <span>
                            <label className="mr-2">3. DATE OF FILING</label>
                            <input
                                type="text"
                                name="office_unit"
                                value={LeaveRequest.request_date}
                                className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                readOnly
                            />
                        </span>
                        <span>
                            <label className="mr-2">4. POSITION</label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                placeholder="position"
                                autoComplete="off"
                            />
                        </span>
                        <span>
                            <label className="mr-2">5. SALARY</label>
                            <input
                                type="text"
                                name="salary"
                                value={formData.salary}
                                onChange={handleInputChange}
                                className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
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
                        onLeaveTypeChange={handleLeaveTypeChange}
                        typeOfLeave={LeaveRequest.leave_type}
                    />
                    <div className="grid grid-cols-2">
                        <div className="border-t border-black p-1">
                            <label>6.C NUMBER OF WORKING DAYS APPLIED FOR</label>
                            <div className="flex flex-col p-4">
                                <input
                                    type="text"
                                    value={LeaveRequest.total_days}
                                    className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                    readOnly
                                />
                                <span>INCLUSIVE DATES</span>
                                <input
                                    type="text"
                                    className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="border-l border-t border-black p-1">
                            <label>6.D COMMUTATION</label>
                            <div className="flex flex-col p-4">
                                <label>
                                    <input
                                        type="radio"
                                        name="commutation"
                                        className="form-radio"
                                        autoComplete="off"
                                    />{' '}
                                    <span className="mx-2">Not Requested</span>
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="commutation"
                                        className="form-radio"
                                        autoComplete="off"
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
                                    <label className="flex items-center">
                                        As{' '}
                                        <input
                                            type="text"
                                            className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
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
                                                <td className="border border-black px-1"></td>
                                                <td className="border border-black px-1"></td>
                                            </tr>
                                            <tr>
                                                <td className="border border-black px-1">
                                                    Less this application
                                                </td>
                                                <td className="border border-black px-1"></td>
                                                <td className="border border-black px-1"></td>
                                            </tr>
                                            <tr>
                                                <td className="border border-black px-1">
                                                    Balance
                                                </td>
                                                <td className="border border-black px-1"></td>
                                                <td className="border border-black px-1"></td>
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
                                            name=""
                                            id=""
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
                                    <input
                                        type="text"
                                        className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                    />{' '}
                                    days with pay
                                </label>
                                <label>
                                    <input
                                        type="text"
                                        className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                    />{' '}
                                    days without pay
                                </label>
                                <label>
                                    <input
                                        type="text"
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
                                    name=""
                                    id=""
                                    className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 flex justify-center font-bold">
                        <span className="border-t border-black px-10">College President</span>
                    </div>
                </div>
                <div className="mt-10 flex justify-center">
                    <button type="submit" className="rounded-md bg-high px-4 py-2 font-bold">
                        Submit Application
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}

export default AppLeaveForm;
