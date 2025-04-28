import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/react';
import { useRoute } from '@ziggy';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Empty, Drawer } from 'antd';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';

export default function LeaveRequest({ LeaveRequest, auth }) {
    const route = useRoute();
    const [open, setOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const showDrawer = (request) => {
        setSelectedRequest(request);
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        setSelectedRequest(null);
    };

    const renderPagination = () => {
        if (!LeaveRequest.links?.length) return null;

        return (
            <div className="mt-4 flex justify-center">
                {LeaveRequest.links.map((link) =>
                    link.url ? (
                        <Link
                            key={link.label}
                            href={link.url}
                            className={`mx-1 rounded px-3 py-1 ${
                                link.active ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            }`}
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Link>
                    ) : (
                        <span
                            key={link.label}
                            className="mx-1 px-3 py-1 text-gray-400"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )
                )}
            </div>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="border-b pb-6">
                <header className="flex text-xl font-bold">Leave Request List</header>
            </div>
            <div className="container mx-auto mt-10 p-4">
                {LeaveRequest.data?.length > 0 ? (
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Employee
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Type of Leave
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Request Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Days
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {LeaveRequest.data.map((request) => (
                                        <tr
                                            key={request.id}
                                            className="cursor-pointer hover:bg-gray-50"
                                            onClick={() => showDrawer(request)}
                                        >
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {request.requestor_name || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {request.leave_type || 'N/A'}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {request.request_date || 'N/A'}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {request.total_days || 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No leave requests available"
                        className="flex flex-col items-center justify-center py-10"
                    />
                )}

                <Drawer
                    title="Leave Request Details"
                    placement="right"
                    onClose={onClose}
                    open={open}
                    width={500}
                    footer={null} // Remove footer since we're adding buttons inside the content
                >
                    {selectedRequest && (
                        <div className="flex h-full flex-col">
                            <div className="flex-grow space-y-4">
                                <div>
                                    <h3 className="font-semibold">Employee</h3>
                                    <p>{selectedRequest.requestor_name}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Leave Type</h3>
                                    <p>{selectedRequest.leave_type}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Request Date</h3>
                                    <p>{selectedRequest.request_date}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Days</h3>
                                    <p>{selectedRequest.total_days}</p>
                                </div>
                            </div>

                            <div className="mb-10 flex justify-center gap-4">
                                <PrimaryButton
                                    className="flex w-full items-center justify-center py-3 text-lg" // Added flex centering
                                    onClick={() => {
                                        if (selectedRequest) {
                                            Inertia.visit(
                                                route('LeaveRequest.show', selectedRequest)
                                            );
                                        }
                                    }}
                                >
                                    View
                                </PrimaryButton>

                                <DangerButton
                                    className="flex w-full items-center justify-center py-3 text-lg" // Added flex centering
                                    onClick={onClose}
                                >
                                    Close
                                </DangerButton>
                            </div>
                        </div>
                    )}
                </Drawer>
            </div>
        </AuthenticatedLayout>
    );
}
