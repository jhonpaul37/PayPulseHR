import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Divider, Card, Button, Empty, message, Modal, Form, Input, Select, Table } from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const { Option } = Select;

export default function ContributionsIndex({
    employees,
    contributions,
    auth,
    employeeContribution,
}) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAmountDisabled, setIsAmountDisabled] = useState(false); // Control amount field editability
    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setIsAmountDisabled(false);
    };

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                // Calculate the final amount to send
                const calculatedAmount = form.getFieldValue('amount');
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
                            setIsAmountDisabled(false);
                        },
                    }
                );
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleFieldChange = () => {
        const { employee_id, contribution_id } = form.getFieldsValue();
        const selectedContribution = contributions.find((c) => c.id === contribution_id);
        const employee = employees.find((e) => e.id === employee_id);

        if (selectedContribution && employee) {
            const monthlySalary = employee.salary_grade?.monthly_salary || 0;

            // Determine if the contribution requires auto-calculation
            if (selectedContribution.name === 'GSIS PREM') {
                const calculatedAmount = (monthlySalary * 0.09).toFixed(2);
                form.setFieldsValue({ amount: calculatedAmount });
                setIsAmountDisabled(true); // Disable the amount field
            } else if (selectedContribution.name === 'HDMF PREM1') {
                const calculatedAmount = (monthlySalary * 0.02).toFixed(2);
                form.setFieldsValue({ amount: calculatedAmount });
                setIsAmountDisabled(true); // Disable the amount field
            } else {
                form.setFieldsValue({ amount: '' });
                setIsAmountDisabled(false); // Enable the amount field for manual input
            }
        } else {
            form.setFieldsValue({ amount: '' });
            setIsAmountDisabled(false); // Default to editable if no auto-calculation applies
        }
    };

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

    return (
        <AuthenticatedLayout user={auth.user}>
            <div>
                <Button type="primary" onClick={showModal} style={{ marginBottom: '16px' }}>
                    Add Deduction
                </Button>
                <Modal
                    title="Add Deduction"
                    open={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Save"
                    cancelText="Cancel"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        name="add_contribution_form"
                        onValuesChange={handleFieldChange} // Trigger calculation on field change
                    >
                        <Form.Item
                            name="employee_id"
                            label="Employee"
                            rules={[{ required: true, message: 'Please select an employee!' }]}
                        >
                            <Select placeholder="Select an employee">
                                {employees.map((employee) => (
                                    <Option key={employee.id} value={employee.id}>
                                        {employee.first_name} {employee.last_name}
                                    </Option>
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
                        {/* {console.log(employees.map((employee) => employee.salary_grade_id))} */}
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

                                        if (
                                            selectedContribution &&
                                            ['GSIS PREM', 'HDMF PREM1'].includes(
                                                selectedContribution.name
                                            )
                                        ) {
                                            return Promise.resolve(); // Auto-calculated, no validation needed
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
                            <Input
                                type="number"
                                placeholder="Enter amount"
                                disabled={isAmountDisabled} // Dynamically disable field
                            />
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Contribution lists */}
                {contributions && contributions.length > 0 ? (
                    <Card title="Deduction" className="mb-6">
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
                <Divider style={{ borderColor: '#F0C519' }}> Employee Deduction</Divider>

                {/* Employee Contribution list */}
                {employeeContribution && employeeContribution.length > 0 ? (
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
