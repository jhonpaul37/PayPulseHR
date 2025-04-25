import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Empty, Drawer, Input, Button, Form, message, Tabs } from 'antd';
import { Inertia } from '@inertiajs/inertia';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';

const { TabPane } = Tabs;

export default function LeaveManagement({ auth, employee }) {
    const [open, setOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('1');

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

        // Fix the typo in variable name
        const leaveCredits = employee.leave_credits || {
            vacation_leave: 0,
            sick_leave: 0,
            special_privilege_leave: 0,
        };

        form.setFieldsValue({
            vacation_leave: leaveCredits.vacation_leave,
            sick_leave: leaveCredits.sick_leave,
            special_privilege_leave: leaveCredits.special_privilege_leave,
        });
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        setSelectedEmployee(null);
        form.resetFields();
    };

    const handleSubmit = () => {
        form.validateFields()
            .then((values) => {
                console.log('Submitting values:', values); // Add this
                console.log('Employee ID:', selectedEmployee.id); // Add this
                setLoading(true);
                Inertia.post(`/employees/${selectedEmployee.id}/update-leave`, values, {
                    preserveScroll: true,
                    onSuccess: () => {
                        console.log('Success!'); // Add this
                        message.success('Leave credits updated successfully');
                        onClose();
                    },
                    onError: (errors) => {
                        console.log('Errors:', errors); // Add this
                        message.error(errors.message || 'Failed to update leave credits');
                    },
                    onFinish: () => {
                        console.log('Finished'); // Add this
                        setLoading(false);
                    },
                });
            })
            .catch((error) => {
                console.error('Validation error:', error); // Add this
                message.error('Form validation failed');
            });
    };
    console.log(employee);

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="border-b pb-6">
                <header className="flex text-xl font-bold">Leave Credit</header>
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
                                                        Special Privilege
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {employees.map((emp) => {
                                                    const credits = emp.leave_credits || {};
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
                                                                {credits.vacation_leave || 0}
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                                {credits.sick_leave || 0}
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                                {credits.special_privilege_leave ||
                                                                    0}
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
                title={`${selectedEmployee?.first_name} ${selectedEmployee?.last_name}`}
                placement="right"
                onClose={onClose}
                open={open}
                width={600}
                footer={
                    <div className="flex justify-end space-x-2">
                        <DangerButton onClick={onClose}>Cancel</DangerButton>
                        <PrimaryButton type="primary" onClick={handleSubmit} loading={loading}>
                            Save
                        </PrimaryButton>
                    </div>
                }
            >
                {selectedEmployee && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold">Employee ID</h3>
                                <p>{selectedEmployee.employee_id}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Position</h3>
                                <p>{selectedEmployee.position?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Department</h3>
                                <p>{selectedEmployee.department?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Start Date</h3>
                                <p>{selectedEmployee.start_date}</p>
                            </div>
                        </div>
                        <Form form={form} layout="vertical">
                            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                                <TabPane tab="Vacation Leave" key="1">
                                    <Form.Item
                                        label="Vacation Leave Balance"
                                        name="vacation_leave"
                                        rules={[{ required: true }]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </TabPane>
                                <TabPane tab="Sick Leave" key="2">
                                    <Form.Item
                                        label="Sick Leave Balance"
                                        name="sick_leave"
                                        rules={[{ required: true }]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </TabPane>
                                <TabPane tab="Special Privilege Leave" key="3">
                                    <Form.Item
                                        label="Special Privilege Leave Balance"
                                        name="special_privilege_leave"
                                        rules={[{ required: true }]}
                                    >
                                        <Input type="number" />
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
