import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Empty, Drawer, Input, Form, message, Tabs, Descriptions, Card, Statistic } from 'antd';
import { Inertia } from '@inertiajs/inertia';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import { Link } from '@inertiajs/react';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

export default function LeaveCredit({ auth, employee }) {
    const [open, setOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('1');

    // Constants for leave policies
    const LEAVE_POLICIES = {
        MAX_VACATION: 15,
        MAX_SICK: 15,
        EARN_RATE: 1.25,
    };

    // Utility function to format leave values
    const formatLeave = (value) => {
        const num = parseFloat(value) || 0;
        return num % 1 === 0 ? num.toString() : num.toFixed(2);
    };

    // Group employees by classification
    const groupedByClassification = employee.reduce((groups, emp) => {
        const classification = emp.classification || 'Unclassified';
        if (!groups[classification]) {
            groups[classification] = [];
        }
        groups[classification].push(emp);
        return groups;
    }, {});

    const showDrawer = (employee) => {
        setSelectedEmployee(employee);
        form.setFieldsValue({
            vacation_leave: '',
            sick_leave: '',
        });
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        setSelectedEmployee(null);
        form.resetFields();
    };

    const validateLeaveInput = (_, value, maxLimit, currentBalance) => {
        if (value === '' || value === null) return Promise.resolve();

        const numValue = parseFloat(value);

        if (isNaN(numValue)) {
            return Promise.reject('Please enter a valid number');
        }

        if (numValue < 0) {
            return Promise.reject('Value must be positive');
        }

        if (currentBalance + numValue > maxLimit) {
            return Promise.reject(`Cannot exceed maximum limit of ${maxLimit} days`);
        }

        return Promise.resolve();
    };

    const calculateEarnedLeaves = (startDate) => {
        const start = new Date(startDate);
        const now = new Date();
        const monthsWorked =
            (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
        return Math.floor(monthsWorked * LEAVE_POLICIES.EARN_RATE);
    };

    const handleSubmit = () => {
        form.validateFields()
            .then((values) => {
                const filteredValues = Object.fromEntries(
                    Object.entries(values).filter(([_, value]) => value !== null && value !== '')
                );

                if (Object.keys(filteredValues).length === 0) {
                    message.warning('No leave credits to update');
                    return;
                }

                // Convert all values to numbers
                const numericValues = {};
                Object.entries(filteredValues).forEach(([key, value]) => {
                    numericValues[key] = parseFloat(value);
                });

                setLoading(true);

                Inertia.post(
                    `/hr/employees/${selectedEmployee.id}/update_leave`,
                    {
                        ...numericValues,
                        added_by: auth.user.id,
                        added_at: new Date().toISOString(),
                    },
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            message.success('Leave credits updated successfully');
                            onClose();
                        },
                        onError: (errors) => {
                            message.error(errors.message || 'Failed to update leave credits');
                        },
                        onFinish: () => setLoading(false),
                    }
                );
            })
            .catch(console.error);
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
                    Leave Credit Management
                </header>
            </div>

            <div className="container mx-auto mt-10 p-4">
                {employee.length > 0 ? (
                    <div className="flex justify-center gap-5">
                        {Object.entries(groupedByClassification).map(
                            ([classification, employees]) => (
                                <div
                                    key={classification}
                                    className="w-[500px] overflow-hidden rounded-lg bg-white shadow"
                                >
                                    <h2 className="mb-4 px-6 pt-4 text-lg font-semibold text-main">
                                        {classification}
                                    </h2>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                        Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                        Vacation
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                        Sick
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                        Total
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {employees.map((emp) => {
                                                    const credits = emp.leave_credits || {};
                                                    const vacation =
                                                        parseFloat(credits.vacation_leave) || 0;
                                                    const sick =
                                                        parseFloat(credits.sick_leave) || 0;
                                                    const totalLeaveBalance = vacation + sick;

                                                    return (
                                                        <tr
                                                            key={emp.id}
                                                            className="cursor-pointer hover:bg-gray-50"
                                                            onClick={() => showDrawer(emp)}
                                                        >
                                                            <td className="whitespace-nowrap px-6 py-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {emp.first_name} {emp.last_name}
                                                                </div>
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                                {formatLeave(vacation)}
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                                {formatLeave(sick)}
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                                                                {formatLeave(totalLeaveBalance)}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No employees available"
                        className="flex flex-col items-center justify-center py-10"
                    />
                )}
            </div>

            <Drawer
                title="Manage Leave Credits"
                placement="right"
                onClose={onClose}
                open={open}
                width={600}
                footer={
                    <div className="flex justify-end space-x-2">
                        <DangerButton onClick={onClose}>Cancel</DangerButton>
                        <PrimaryButton type="primary" onClick={handleSubmit} loading={loading}>
                            Add
                        </PrimaryButton>
                    </div>
                }
            >
                {selectedEmployee && (
                    <div className="space-y-6">
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="Employee Name">
                                {`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}
                            </Descriptions.Item>
                            <Descriptions.Item label="Position">
                                {selectedEmployee.position?.name || 'N/A'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Department">
                                {selectedEmployee.department?.name || 'N/A'}
                            </Descriptions.Item>
                        </Descriptions>

                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <Statistic
                                    title="Vacation Leave"
                                    value={parseFloat(
                                        selectedEmployee.leave_credits?.vacation_leave || 0
                                    )}
                                    precision={2}
                                />
                            </Card>
                            <Card>
                                <Statistic
                                    title="Sick Leave"
                                    value={parseFloat(
                                        selectedEmployee.leave_credits?.sick_leave || 0
                                    )}
                                    precision={2}
                                />
                            </Card>
                            <Card className="col-span-2">
                                <Statistic
                                    title="Total Leave Balance"
                                    value={
                                        parseFloat(
                                            selectedEmployee.leave_credits?.vacation_leave || 0
                                        ) +
                                        parseFloat(selectedEmployee.leave_credits?.sick_leave || 0)
                                    }
                                    precision={2}
                                />
                            </Card>
                        </div>
                        {/*
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">
                                <strong>Note:</strong> Employees earn {LEAVE_POLICIES.EARN_RATE}{' '}
                                days per month worked. Current earned leaves:{' '}
                                {calculateEarnedLeaves(selectedEmployee.start_date)} days
                            </p>
                        </div> */}

                        <Form form={form} layout="vertical">
                            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                                <TabPane tab="Vacation Leave" key="1">
                                    <Form.Item
                                        label="Add Vacation Leave Credits"
                                        name="vacation_leave"
                                        rules={[
                                            {
                                                validator: (_, value) =>
                                                    validateLeaveInput(
                                                        _,
                                                        value,
                                                        LEAVE_POLICIES.MAX_VACATION,
                                                        parseFloat(
                                                            selectedEmployee.leave_credits
                                                                ?.vacation_leave || 0
                                                        )
                                                    ),
                                            },
                                        ]}
                                    >
                                        <Input
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            placeholder="Enter credits to add"
                                        />
                                    </Form.Item>
                                </TabPane>
                                <TabPane tab="Sick Leave" key="2">
                                    <Form.Item
                                        label="Add Sick Leave Credits"
                                        name="sick_leave"
                                        rules={[
                                            {
                                                validator: (_, value) =>
                                                    validateLeaveInput(
                                                        _,
                                                        value,
                                                        LEAVE_POLICIES.MAX_SICK,
                                                        parseFloat(
                                                            selectedEmployee.leave_credits
                                                                ?.sick_leave || 0
                                                        )
                                                    ),
                                            },
                                        ]}
                                    >
                                        <Input
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            placeholder="Enter credits to add"
                                        />
                                    </Form.Item>
                                </TabPane>
                            </Tabs>
                        </Form>
                    </div>
                )}
            </Drawer>
        </AuthenticatedLayout>
    );
}
