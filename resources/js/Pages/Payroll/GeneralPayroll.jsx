import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const GeneralPayroll = ({ auth }) => {
    return (
        <AuthenticatedLayout user={auth.user}>
            <div>
                <header className="text-center text-xl font-bold">GENERAL PAYROLL</header>
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">EMPLOYEE NO.</th>
                            <th className="border px-4 py-2">EMPLOYEE NAME</th>
                            <th className="border px-4 py-2">SG-STEP</th>
                            <th className="border px-4 py-2">POSITION</th>
                            <th className="border px-4 py-2">BASIC PAY</th>
                            <th className="border px-4 py-2">Position</th>
                            <th className="border px-4 py-2">Position</th>
                            <th className="border px-4 py-2">Position</th>
                            <th className="border px-4 py-2">Position</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2"></td>
                            <td className="border px-4 py-2"></td>
                            <td className="border px-4 py-2"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
};

export default GeneralPayroll;
