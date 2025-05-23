import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Empty, Drawer } from 'antd';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import { ArrowLeftOutlined } from '@ant-design/icons'; // Import the back arrow icon

const ForReview = ({ auth, ReviewLeave }) => {
    const [open, setOpen] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const showDrawer = (leave) => {
        setSelectedLeave(leave);
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        setSelectedLeave(null);
    };

    const updateLeaveStatus = (leaveId, status) => {
        Inertia.post(
            route('leave.updateStatus', leaveId),
            { status },
            {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                },
                onError: (errors) => {},
            }
        );
    };

    const renderPagination = () => {
        if (!ReviewLeave.links?.length) return null;

        return (
            <div className="mt-4 flex flex-wrap justify-center gap-1">
                {ReviewLeave.links.map((link, index) =>
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
                    For Review
                </header>
            </div>
            <div className="container mx-auto mt-10 p-4">
                {ReviewLeave.data?.length > 0 ? (
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
                                                Office/Department
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Leave Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Dates
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {ReviewLeave.data.map((leave) => (
                                            <tr
                                                key={leave.id}
                                                className="cursor-pointer hover:bg-gray-50"
                                                onClick={() => showDrawer(leave)}
                                            >
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {leave.requestor_name || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {leave.office_unit || 'N/A'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {Array.isArray(leave.leave_type)
                                                        ? leave.leave_type.join(', ')
                                                        : leave.leave_type || 'N/A'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {/* {leave.from_date} to {leave.to_date} */}
                                                    {formatDate(leave.from_date)} to{' '}
                                                    {formatDate(leave.to_date)}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {leave.status || 'N/A'}
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
                        description="No leave requests for review"
                        className="flex flex-col items-center justify-center py-10"
                    />
                )}

                <Drawer
                    title="Leave Request Details"
                    placement="right"
                    onClose={onClose}
                    open={open}
                    width={500}
                    footer={
                        selectedLeave && selectedLeave.status !== 'Approved' ? (
                            <div className="flex justify-end gap-4">
                                <DangerButton
                                    onClick={() => {
                                        updateLeaveStatus(selectedLeave.id, 'rejected');
                                        onClose();
                                    }}
                                >
                                    Reject
                                </DangerButton>
                                <PrimaryButton
                                    onClick={() => {
                                        updateLeaveStatus(selectedLeave.id, 'Approved');
                                        onClose();
                                    }}
                                >
                                    Approve
                                </PrimaryButton>
                            </div>
                        ) : null
                    }
                >
                    {selectedLeave && (
                        <div className="flex h-full flex-col">
                            <div className="flex-grow space-y-4">
                                <div>
                                    <h3 className="font-semibold">Employee</h3>
                                    <p>{selectedLeave.requestor_name}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Office/Department</h3>
                                    <p>{selectedLeave.office_unit}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Leave Type</h3>
                                    <p>
                                        {Array.isArray(selectedLeave.leave_type)
                                            ? selectedLeave.leave_type.join(', ')
                                            : selectedLeave.leave_type}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Dates</h3>
                                    <p>
                                        {formatDate(selectedLeave.from_date)} to{' '}
                                        {formatDate(selectedLeave.to_date)}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Total Days</h3>
                                    <p>{selectedLeave.total_days}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Status</h3>
                                    <p>{selectedLeave.status}</p>
                                </div>
                            </div>

                            {/* <div className="mb-10 flex justify-center gap-4">
                                <button
                                    type="button"
                                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                                    onClick={() => {
                                        Inertia.get(route('Appleave', selectedLeave.id));
                                    }}
                                >
                                    Edit
                                </button>
                                <PrimaryButton onClick={() => updateStatus('approved')}>
                                    Approve
                                </PrimaryButton>
                                <DangerButton onClick={onClose}>Close</DangerButton>
                            </div> */}
                        </div>
                    )}
                </Drawer>
            </div>
        </AuthenticatedLayout>
    );
};

export default ForReview;
