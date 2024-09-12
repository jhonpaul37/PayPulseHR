import { Link } from '@inertiajs/react';
import { useRoute } from '@ziggy';
import FormHeader from './components/FormHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const LeaveRequestShow = ({ LeaveRequest, auth }) => {
    console.log('LeaveRequest:', LeaveRequest);
    const route = useRoute();

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
    return (
        <AuthenticatedLayout user={auth.user}>
            <div>
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
                                    value={LeaveRequest.requestor_name}
                                    name="office_unit"
                                    className={`focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none`}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="mr-2 font-bold">Office/Unit:</label>
                                <input
                                    type="text"
                                    value={LeaveRequest.office_unit}
                                    name="office_unit"
                                    className={`focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none`}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="mb-2">
                                <label className="mr-2 font-bold">Date of Request:</label>
                                <input
                                    type="text"
                                    value={LeaveRequest.request_date}
                                    name="office_unit"
                                    className={`focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none`}
                                    readOnly
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
                                            type === 'Others (please specify)' ? 'col-span-3' : ''
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            name={type}
                                            className="form-checkbox"
                                            checked={LeaveRequest.leave_type.includes(type)}
                                            readOnly
                                        />
                                        <span className="ml-2">{type}</span>
                                    </label>
                                ))}
                            </div>
                            {LeaveRequest.leave_type.includes('Others (please specify)') && (
                                <div className="mt-2">
                                    <label className="mr-2 font-bold">Specify Leave Type:</label>
                                    <input
                                        type="text"
                                        name="other_leave_type"
                                        value={LeaveRequest.other_leave_type || ''}
                                        autoComplete="off"
                                        className="focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none"
                                        readOnly
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
                                        value={LeaveRequest.from_date || ''}
                                        name="from_date"
                                        className={`focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none`}
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label className="mr-2 font-bold">To Date:</label>
                                    <input
                                        type="date"
                                        value={LeaveRequest.to_date || ''}
                                        name="to_date"
                                        className={`focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none`}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <label className="mr-2 font-bold">Total Days:</label>
                                <span>{LeaveRequest.total_days}</span>
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
                    <Link
                        href={route(`Appleave`, LeaveRequest.id)}
                        className="rounded-md bg-high px-4 py-2 font-bold"
                    >
                        Process Request
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default LeaveRequestShow;
