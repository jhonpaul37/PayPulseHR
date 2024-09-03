import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import { usePage } from '@inertiajs/react';

const Index = ({ auth }) => {

    return (
        <AuthenticatedLayout user={auth.user}>
            <div>
                <div>
                    <div className='mb-5'>
                        <label className='font-bold flex justify-center border-t-2 border-b-2 border-black p-1'>LEAVE REQUEST FORM</label>
                    </div>
                    <div className='flex justify-between '>
                        <div className='flex flex-col'>
                            <label className='font-bold'>Name of Requestor:</label>
                            <label className='font-bold'>Office/Unit:</label>
                        </div>
                        <div>
                            <label className='font-bold'>Date of Request:</label>
                        </div>
                        <div></div>
                    </div>
                    <div className=' mt-5 '>
                        <div className='border-t-2 border-l-2 border-r-2 border-black p-2 bg-blue-100'><label className='font-bold  '>TYPE OF LEAVE:</label></div>
                        <div className='border-2 border-black p-2 flex flex-col'>
                                {['Vacation Leave', 'Sick Leave', 'Special Previlege Leave','Mandatory/Forced Leave','Materbity Leave','Paternity Leave','Terminal Leave','Rehabiition Leave','Compensatory Time-Off','Others (please specify)'].map(
                                    (mode) => (
                                        <label
                                            key={mode}
                                            className="inline-flex items-center"
                                        >
                                            <input
                                                type="checkbox"
                                                className="form-checkbox"
                                                autoComplete="off"
                                            />

                                            <span className="ml-2">{mode}</span>
                                        </label>
                                    )
                                )}
                        </div>
                    </div>
                    <div className='border-2 mt-5  border-black'>
                        <label className='font-bold '>INCLUSIVE DATES:</label>
                        <div>
                            <div>From:</div>
                            <div>TO:</div>
                            <div>TOTAL NO. OF DAYS:</div>
                        </div>
                    </div>
                    <div className='flex justify-center font-bold mt-10'>
                        <span className='border-t-2 border-black px-10 '>Signature of Requestor</span>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
