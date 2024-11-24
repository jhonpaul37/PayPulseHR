import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Card, Button, Empty, message, Modal, Form, Input, Select, Table } from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const { Option } = Select;

export default function ContributionsIndex({
    employees,
    contributions,
    auth,
    employeeContribution,
}) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    // Handle modal visibility
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                const selectedContribution = contributions.find(
                    (contribution) => contribution.id === values.contribution_id
                );

                const employee = employees.find((emp) => emp.id === values.employee_id);
                const monthlySalary = employee.salaryGrade?.monthly_salary || 0;

                // Apply calculation for GSIS PREM or HDMF PREM1
                let calculatedAmount = values.amount; // Default to manual input
                if (['GSIS PREM', 'HDMF PREM1'].includes(selectedContribution.name)) {
                    if (selectedContribution.name === 'GSIS PREM') {
                        calculatedAmount = monthlySalary * 0.09;
                    } else if (selectedContribution.name === 'HDMF PREM1') {
                        calculatedAmount = monthlySalary * 0.02;
                    }
                }

                // Send the single payload to the server
                Inertia.post(
                    route('contributions.store'),
                    {
                        employee_id: values.employee_id,
                        contribution_id: values.contribution_id,
                        amount: calculatedAmount,
                    },
                    {
                        onSuccess: () => {
                            message.success('Contribution added successfully');
                            setIsModalVisible(false);
                            form.resetFields();
                        },
                    }
                );
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    // Define columns for the employee contribution table
    const columns = [
        {
            title: 'Employee',
            dataIndex: 'employee_name',
            key: 'employee_name',
        },
        {
            title: 'Contribution',
            dataIndex: 'contribution_name',
            key: 'contribution_name',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => `₱${parseFloat(amount).toFixed(2)}`,
        },
    ];
    console.log(employees.salary_grade_id);

    return (
        <AuthenticatedLayout user={auth.user}>
            <div>
                <Button type="primary" onClick={showModal} style={{ marginBottom: '16px' }}>
                    Add Contribution
                </Button>

                <Modal
                    title="Add Contribution"
                    open={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Save"
                    cancelText="Cancel"
                >
                    <Form form={form} layout="vertical" name="add_contribution_form">
                        <Form.Item
                            name="employee_id"
                            label="Employee"
                            rules={[{ required: true, message: 'Please select an employee!' }]}
                        >
                            <Select placeholder="Select an employee">
                                {employees.map((employee) => (
                                    <Select.Option key={employee.id} value={employee.id}>
                                        {employee.first_name} {employee.last_name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="contribution_id"
                            label="Contribution"
                            rules={[{ required: true, message: 'Please select a contribution!' }]}
                        >
                            <Select placeholder="Select contribution">
                                {contributions.map((contribution) => (
                                    <Option key={contribution.id} value={contribution.id}>
                                        {contribution.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="amount"
                            label="Amount"
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const contributionId = getFieldValue('contribution_id');
                                        const selectedContribution = contributions.find(
                                            (contribution) => contribution.id === contributionId
                                        );

                                        // Make amount optional if it's GSIS PREM or HDMF PREM1
                                        if (
                                            selectedContribution &&
                                            ['GSIS PREM', 'HDMF PREM1'].includes(
                                                selectedContribution.name
                                            )
                                        ) {
                                            return Promise.resolve();
                                        }

                                        if (!value) {
                                            return Promise.reject(
                                                new Error('Please input the amount!')
                                            );
                                        }

                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <Input type="number" placeholder="Enter amount" disabled={false} />
                        </Form.Item>
                    </Form>
                </Modal>

                {contributions && contributions.length > 0 ? (
                    <Card title="Contributions" className="mb-6">
                        {contributions.map((contribution) => (
                            <Card.Grid
                                key={contribution.id}
                                style={{ width: '33%', textAlign: 'center' }}
                            >
                                <div className="text-lg font-bold">{contribution.name}</div>
                                <div className="text-sm text-gray-500">
                                    {contribution.description}
                                </div>
                            </Card.Grid>
                        ))}
                    </Card>
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No contributions available"
                        className="mb-6"
                    />
                )}

                {employeeContribution && employeeContribution.length > 0 ? (
                    <Card title="Employee Contributions" className="mt-6">
                        <Table
                            dataSource={employeeContribution.map((item) => ({
                                key: item.id,
                                employee_name: `${item.employee.first_name} ${item.employee.last_name}`,
                                contribution_name: item.contribution.name,
                                amount: item.amount,
                            }))}
                            columns={columns}
                            pagination={false}
                        />
                    </Card>
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No employee contributions available"
                        className="mt-6"
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
