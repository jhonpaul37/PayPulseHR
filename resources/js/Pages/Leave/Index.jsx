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
                    <div className='border p-2'>
                        <label className='font-bold border-b border-black bg-high'>TYPE OF LEAVE:</label>
                        <div className='flex flex-col'>
                                {['Vacation Leave', 'Sick Leave', 'Special Previlege Leave','Mandatory/Forced Leave','Materbity Leave','Paternity Leave','Terminal Leave','Rehabiition Leave','Compensatory Time-Off'].map(
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
