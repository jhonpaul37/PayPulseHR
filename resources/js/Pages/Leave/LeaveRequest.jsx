import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/react';
import { useRoute } from '@ziggy';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Empty, Drawer } from 'antd';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import { ArrowLeftOutlined } from '@ant-design/icons';

export default function LeaveRequest({ LeaveRequest, auth }) {
    const route = useRoute();
    const [open, setOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

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
            <div className="mt-4 flex flex-wrap justify-center gap-1">
                {LeaveRequest.links.map((link, index) =>
                    link.url ? (
                        <Link
                            key={`${index}-${link.label}`}
                            href={link.url}
                            className={`rounded px-3 py-1 text-sm ${
                                link.active ? 'bg-high text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <span
                            key={index}
                            className="rounded px-3 py-1 text-sm text-gray-400"
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
                <header className="flex items-center text-xl font-bold">
                    <Link
                        href={route('leaveManagement')}
                        className="mr-4 flex items-center text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeftOutlined className="mr-1" />
                    </Link>
                    Leave Request List
                </header>
            </div>
            <div className="container mx-auto mt-10 p-4">
                {LeaveRequest.data?.length > 0 ? (
                    <>
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
                                                    {formatDate(request.request_date)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {renderPagination()}
                    </>
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
                    footer={null}
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
                                    <p>{formatDate(selectedRequest.request_date)}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Days</h3>
                                    <p>{selectedRequest.total_days}</p>
                                </div>
                                {selectedRequest.from_date && selectedRequest.to_date && (
                                    <div>
                                        <h3 className="font-semibold">Leave Period</h3>
                                        <p>
                                            {formatDate(selectedRequest.from_date)} to{' '}
                                            {formatDate(selectedRequest.to_date)}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mb-10 flex justify-center gap-4">
                                <PrimaryButton
                                    className="flex w-full items-center justify-center py-3 text-lg"
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
                                    className="flex w-full items-center justify-center py-3 text-lg"
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
