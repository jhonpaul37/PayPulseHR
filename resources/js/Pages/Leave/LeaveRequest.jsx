import React from 'react';
import { Link } from '@inertiajs/react';
import { useRoute } from '@ziggy';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import LeaveCard from './components/LeaveCard';
import { Empty } from 'antd';

export default function LeaveRequest({ LeaveRequest, auth }) {
    const route = useRoute();

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="border-b pb-6">
                <header className="flex justify-center text-xl font-bold">
                    Leave Request List
                </header>
            </div>

            {/* Display recent requests */}
            <div className="m-4 my-10">
                <div className="flex justify-between">
                    <div className="mb-2 text-lg font-bold">Recent</div>
                    {/* Pagination recent */}
                    <div>
                        {LeaveRequest.links && LeaveRequest.links.length > 0 ? (
                            LeaveRequest.links.map((link) =>
                                link.url ? (
                                    <Link
                                        key={link.label}
                                        href={link.url}
                                        className={`${link.active ? 'bg-high font-bold' : ''} m-2 rounded-md border px-3 py-2`}
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    </Link>
                                ) : (
                                    <span
                                        key={link.label}
                                        className="m-1 p-1 text-slate-300"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            )
                        ) : (
                            <div>No pagination available.</div>
                        )}
                    </div>
                </div>

                {/* Conditional rendering for leave requests */}
                {LeaveRequest.data && LeaveRequest.data.length > 0 ? (
                    <LeaveCard leaveRequests={LeaveRequest.data} />
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No leave requests available"
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
