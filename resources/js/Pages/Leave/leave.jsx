import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import { usePage } from '@inertiajs/react';

const leave = ({ auth }) => {
    return (
        <AuthenticatedLayout user={auth.user}>
            <div>
                <div className="border-2 border-black p-4">
                    <div className="mb-5 flex flex-col items-center justify-center">
                        <span className="font-oldenglish">Republic of the Philippines</span>
                        <span className="font-copperplate text-2xl tracking-wide">
                            BATANES STATE COLLEGE
                        </span>
                        <span className="font-times">San Antonio, Basco, Batanes</span>
                        <div>
                            <span>www.bscbatanes.edu.ph</span>
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
                                    className={`focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none`}
                                />
                            </div>
                            <div>
                                <label className="mr-2 font-bold">Office/Unit:</label>
                                <input
                                    type="text"
                                    className={`focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none`}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mr-2 font-bold">Date of Request:</label>
                            <input
                                type="text"
                                className={`focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none`}
                            />
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
                                    'Special Previlege Leave',
                                    'Mandatory/Forced Leave',
                                    'Maternity Leave',
                                    'Paternity Leave',
                                    'Terminal Leave',
                                    'Rehabilitation Leave',
                                    'Compensatory Time-Off',
                                    'Others (please specify) __________________',
                                ].map((mode) => (
                                    <label
                                        key={mode}
                                        className={`inline-flex items-center ${
                                            mode === 'Others (please specify)' ? 'col-span-3' : ''
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="form-checkbox"
                                            autoComplete="off"
                                        />
                                        <span className="ml-2">{mode}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 border-2 border-black">
                        <div className="bg-blue-100 p-2">
                            <label className="font-bold">INCLUSIVE DATES:</label>
                        </div>
                        <div className="border-t-2 border-black p-2">
                            <div className="mt-2 flex justify-evenly">
                                <div>
                                    <label className="mr-2 font-bold">From:</label>
                                    <input
                                        type="text"
                                        className={`focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none`}
                                    />
                                </div>
                                <div>
                                    <label className="mr-2 font-bold">TO:</label>
                                    <input
                                        type="text"
                                        className={`focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none`}
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-center">
                                <label className="mr-2 font-bold">TOTAL NO. OF DAYS:</label>
                                <input
                                    type="text"
                                    className={`focus:shadow-outline appearance-none rounded px-3 py-2 leading-tight shadow focus:outline-none`}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 flex justify-center font-bold">
                        <span className="border-t-2 border-black px-10">
                            Signature of Requestor
                        </span>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default leave;
