import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/react';
import { useRoute } from '@ziggy';
import { Empty, Drawer } from 'antd';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';

export default function LeaveStatus({ auth, LeaveRequest }) {
    console.log(LeaveRequest);

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="border-b pb-6">
                <header className="flex text-xl font-bold">Approved Leaves</header>
            </div>

            {/* You can now map LeaveRequest.data */}
            <div className="mt-4">
                {LeaveRequest.data.length > 0 ? (
                    LeaveRequest.data.map((leave) => (
                        <div key={leave.id} className="mb-2 border p-4">
                            <div>Requestor: {leave.requestor_name}</div>
                            <div>Office: {leave.office_unit}</div>
                            <div>
                                Dates: {leave.from_date} to {leave.to_date}
                            </div>
                            <div>Status: {leave.status}</div>
                        </div>
                    ))
                ) : (
                    <div>No approved leaves found.</div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
