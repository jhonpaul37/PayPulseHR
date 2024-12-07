import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import PrimaryButton from '@/Components/PrimaryButton';
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

            // Auto-calculate specific contributions
            if (selectedContribution.name === 'GSIS PREM') {
                const calculatedAmount = (monthlySalary * 0.09).toFixed(2);
                form.setFieldsValue({ amount: calculatedAmount });
                setIsAmountDisabled(true); // Disable amount field
            } else if (selectedContribution.name === 'HDMF PREM1') {
                const calculatedAmount = (monthlySalary * 0.02).toFixed(2);
                form.setFieldsValue({ amount: calculatedAmount });
                setIsAmountDisabled(true); // Disable amount field
            } else if (selectedContribution.name === 'PHIC') {
                const netBasic = monthlySalary; // Assuming net basic is monthly salary for this calculation
                const calculatedAmount = (netBasic * 0.025).toFixed(2);
                form.setFieldsValue({ amount: calculatedAmount });
                setIsAmountDisabled(true); // Disable amount field
            } else {
                // Allow manual entry
                setIsAmountDisabled(false);
            }
        } else {
            // Reset when no valid employee or contribution is selected
            setIsAmountDisabled(false);
            form.setFieldsValue({ amount: '' });
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
                <Modal
                    title="Add Deduction"
                    open={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Save"
                    cancelText="Cancel"
                    footer={[
                        <Button key="cancel" onClick={handleCancel} style={{ marginRight: '8px' }}>
                            Cancel
                        </Button>,
                        <PrimaryButton
                            key="save"
                            type="primary"
                            onClick={handleOk}
                            style={{ marginLeft: '8px' }}
                        >
                            Save
                        </PrimaryButton>,
                    ]}
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

                                        // Skip validation for auto-calculated contributions
                                        if (
                                            selectedContribution &&
                                            ['GSIS PREM', 'HDMF PREM1'].includes(
                                                selectedContribution.name
                                            )
                                        ) {
                                            return Promise.resolve(); // Auto-calculated, no manual validation needed
                                        }

                                        // For manual input, ensure a value is provided
                                        if (!value && !isAmountDisabled) {
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
                                disabled={isAmountDisabled} // Dynamically disable the field
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
                <PrimaryButton type="primary" onClick={showModal} style={{ marginBottom: '16px' }}>
                    Add Deduction
                </PrimaryButton>

                {/* Employee Dedcution/Contribution list */}
                {employeeContribution && employeeContribution.length > 0 ? (
                    <Table
                        dataSource={employees.map((employee) => {
                            // deduction employee
                            const contributionsForEmployee = employeeContribution.filter(
                                (item) => item.employee.id === employee.id
                            );

                            // contributions are grouped by name
                            const contributionsByName = {};
                            contributionsForEmployee.forEach((item) => {
                                contributionsByName[item.contribution.name] =
                                    `₱${parseFloat(item.amount).toFixed(2)}`;
                            });

                            return {
                                key: employee.id,
                                employee_name: `${employee.first_name} ${employee.last_name}`,
                                ...contributionsByName,
                            };
                        })}
                        columns={[
                            {
                                title: 'Employee',
                                dataIndex: 'employee_name',
                                key: 'employee_name',
                                fixed: 'left',
                            },
                            // columns for each Deduction
                            ...contributions.map((contribution) => ({
                                title: contribution.name,
                                dataIndex: contribution.name,
                                key: contribution.name,
                                render: (amount) => amount || '----', // Default
                            })),
                        ]}
                        pagination={false}
                        scroll={{ x: 'max-content' }}
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
