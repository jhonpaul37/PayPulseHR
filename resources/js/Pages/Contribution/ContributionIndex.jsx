import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import {
    Divider,
    Card,
    Button,
    Empty,
    message,
    Modal,
    Form,
    Input,
    Select,
    Table,
    AutoComplete,
} from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const { Option } = Select;

export default function ContributionsIndex({
    employees,
    contributions,
    lwopPera,
    auth,
    employeeContribution,
    employeeBenefits,
}) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAmountDisabled, setIsAmountDisabled] = useState(false); // Control amount field editability
    const [lwopPeraModalVisible, setLwopPeraModalVisible] = useState(false); // Control LWOP-PERA modal visibility
    const [form] = Form.useForm();
    const [isLwopPeraModalVisible, setLwopPeraModalEditVisible] = useState(false);
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

    const onSelectChange = (selectedRowKeys) => {
        setSelectedEmployeeIds(selectedRowKeys);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const showLwopPeraModal = () => {
        setLwopPeraModalVisible(true);
    };

    // Show modal for LWOP-PERA update
    const showLwopPeraEditModal = () => {
        setLwopPeraModalEditVisible(true);
    };

    // Cancel LWOP-PERA modal
    const handleLwopPeraEditCancel = () => {
        setLwopPeraModalEditVisible(false);
        form.resetFields();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setIsAmountDisabled(false);
    };

    const handleLwopPeraCancel = () => {
        setLwopPeraModalVisible(false);
        form.resetFields();
    };

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                const isLwopPera = values.contribution_id === lwopPera?.id;
                const employeeIds = [values.employee_id]; // Ensure it's an array

                const calculatedAmount = form.getFieldValue('amount');
                Inertia.post(
                    route('employee_benefits.store'),
                    {
                        employee_ids: employeeIds, // Pass array of employee_ids
                        benefit_id: lwopPera.id, // Assuming this is how the benefit is set
                        amount: calculatedAmount,
                    },
                    {
                        onSuccess: () => {
                            message.success('Benefit added successfully');
                            setLwopPeraModalVisible(false);
                            form.resetFields();
                        },
                    }
                );
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };
    const handleLwopPeraEditOk = () => {
        form.validateFields()
            .then((values) => {
                if (selectedEmployeeIds.length === 0) {
                    message.error('Please select at least one employee!');
                    return;
                }

                Inertia.post(
                    route('employee_benefits.bulkUpdate'), // Assuming the bulkUpdate route
                    {
                        changes: selectedEmployeeIds.map((employee_id) => ({
                            employee_id,
                            benefit_id: lwopPera.id,
                            amount: values.amount,
                        })),
                    },
                    {
                        onSuccess: () => {
                            message.success('Bulk LWOP-PERA updated successfully!');
                            setLwopPeraModalVisible(false);
                            form.resetFields();
                        },
                    }
                );
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleLwopPeraOk = () => {
        form.validateFields()
            .then((values) => {
                const employeeIds = values.employee_ids || []; // Fallback to an empty array

                if (employeeIds.length === 0) {
                    message.error('Please select at least one employee!');
                    return;
                }

                Inertia.post(
                    route('employee_benefits.store'),
                    {
                        employee_ids: employeeIds,
                        benefit_id: lwopPera.id,
                        amount: values.amount,
                    },
                    {
                        onSuccess: () => {
                            message.success('LWOP-PERA added successfully');
                            setLwopPeraModalVisible(false);
                            form.resetFields();
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
    const data = employeeBenefits.map((item) => {
        const lwopPeraAmount = item.benefit.name === 'LWOP-PERA' ? item.amount : null;

        return {
            key: item.id,
            employee_name: `${item.employee.first_name} ${item.employee.last_name}`,
            lwopPera: lwopPeraAmount ? `₱${parseFloat(lwopPeraAmount).toFixed(2)}` : '----',
        };
    });
    return (
        <AuthenticatedLayout user={auth.user}>
            <div>
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

                        {/* Display LWAP-PERA */}
                        {lwopPera && (
                            <Card.Grid key="lwopPera" style={{ width: '33%', textAlign: 'center' }}>
                                <div className="text-lg font-bold">{lwopPera.name}</div>
                                <div className="text-sm text-gray-500">{lwopPera.description}</div>
                            </Card.Grid>
                        )}
                    </Card>
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No contributions available"
                        className="mb-6"
                    />
                )}

                <Divider style={{ borderColor: '#F0C519' }} className="pt-5" />

                <div className="flex gap-5">
                    {/* Add Deduction */}
                    <PrimaryButton
                        type="primary"
                        onClick={showModal}
                        style={{ marginBottom: '16px' }}
                    >
                        Add Deduction
                    </PrimaryButton>

                    {/* <Modal
                        title="Add Deduction"
                        open={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        okText="Save"
                        cancelText="Cancel"
                    > */}

                    <Modal
                        title="Add Deduction"
                        open={isModalVisible}
                        onCancel={handleCancel}
                        footer={[
                            <DangerButton
                                key="cancel"
                                onClick={handleCancel}
                                style={{ marginRight: '8px' }}
                            >
                                Cancel
                            </DangerButton>,
                            <PrimaryButton key="submit" type="primary" onClick={handleOk}>
                                Save
                            </PrimaryButton>,
                        ]}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            name="add_contribution_form"
                            onValuesChange={handleFieldChange}
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
                                rules={[
                                    { required: true, message: 'Please select a contribution!' },
                                ]}
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
                                    {
                                        required: !isAmountDisabled,
                                        message: 'Please input the amount!',
                                    },
                                ]}
                            >
                                <Input
                                    type="number"
                                    placeholder="Enter amount"
                                    disabled={isAmountDisabled}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>

                    {/* Add LWOP-PERA Modal */}

                    {/* <PrimaryButton
                        type="primary"
                        onClick={showLwopPeraModal}
                        style={{ marginBottom: '16px' }}
                    >
                        Add LWOP
                    </PrimaryButton>
                    <Modal
                        title="Add LWOP-PERA"
                        open={lwopPeraModalVisible}
                        onOk={handleLwopPeraOk}
                        onCancel={handleLwopPeraCancel}
                        okText="Save"
                        cancelText="Cancel"
                    >
                        <Form form={form} layout="vertical" name="add_lwop_pera_form">
                            <Form.Item
                                name="employee_ids"
                                label="Employees"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select at least one employee!',
                                    },
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Select employees"
                                    defaultValue={[]}
                                >
                                    {employees.map((employee) => (
                                        <Option key={employee.id} value={employee.id}>
                                            {employee.first_name} {employee.last_name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="amount"
                                label="Amount"
                                rules={[{ required: true, message: 'Please enter the amount!' }]}
                            >
                                <Input type="number" placeholder="Enter amount" />
                            </Form.Item>
                        </Form>
                    </Modal> */}

                    {/* Bulk Edit */}
                    <PrimaryButton
                        type="primary"
                        onClick={showLwopPeraEditModal}
                        style={{ marginBottom: '16px' }}
                    >
                        Edit LWOP
                    </PrimaryButton>

                    <Modal
                        title="Add Deduction"
                        open={isLwopPeraModalVisible}
                        onCancel={handleLwopPeraEditCancel}
                        footer={[
                            <DangerButton
                                key="cancel"
                                onClick={handleLwopPeraEditCancel}
                                style={{ marginRight: '8px' }}
                            >
                                Cancel
                            </DangerButton>,
                            <PrimaryButton
                                key="submit"
                                type="primary"
                                onClick={handleLwopPeraEditOk}
                            >
                                Save
                            </PrimaryButton>,
                        ]}
                    >
                        <Form form={form} layout="vertical" name="lwop_pera_form">
                            <Form.Item
                                name="amount"
                                label="Amount"
                                rules={[{ required: true, message: 'Please enter the amount!' }]}
                            >
                                <Input type="number" placeholder="Enter amount" />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>

                {/* Employee Deduction list */}
                {employeeBenefits.length > 0 || employeeContribution.length > 0 ? (
                    <Table
                        rowSelection={{
                            type: 'checkbox',
                            onChange: onSelectChange,
                        }}
                        dataSource={employees.map((employee) => {
                            // Find LWOP-PERA amount from employeeBenefits
                            const lwopPeraAmount =
                                employeeBenefits
                                    .filter(
                                        (item) =>
                                            item.benefit.name === 'LWOP-PERA' &&
                                            item.employee.id === employee.id
                                    )
                                    .map((item) => item.amount)[0] || '----'; // Default to '----' if not found

                            // Map contributions for the employee
                            const contributionsForEmployee = employeeContribution.filter(
                                (item) => item.employee.id === employee.id
                            );

                            const contributionsByName = {};
                            contributionsForEmployee.forEach((item) => {
                                contributionsByName[item.contribution.name] =
                                    `₱${parseFloat(item.amount).toFixed(2)}`;
                            });

                            return {
                                key: employee.id,
                                employee_name: `${employee.first_name} ${employee.last_name}`,
                                ...contributionsByName, // Add contributions dynamically
                                lwopPera:
                                    lwopPeraAmount === '----'
                                        ? lwopPeraAmount
                                        : `₱${parseFloat(lwopPeraAmount).toFixed(2)}`,
                            };
                        })}
                        columns={[
                            {
                                title: 'Employee',
                                dataIndex: 'employee_name',
                                key: 'employee_name',
                                fixed: 'left',
                            },
                            // Dynamically add columns for each contribution
                            ...contributions.map((contribution) => ({
                                title: contribution.name,
                                dataIndex: contribution.name,
                                key: contribution.name,
                                render: (amount) => amount || '----',
                            })),
                            {
                                title: 'LWOP-PERA', // New column for LWOP-PERA
                                dataIndex: 'lwopPera',
                                key: 'lwopPera',
                                render: (amount) => amount || '----', // Display lwopPera amount
                            },
                        ]}
                        pagination={false}
                        scroll={{ x: 'max-content' }}
                    />
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No employee benefits or contributions available"
                        className="mt-6"
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
