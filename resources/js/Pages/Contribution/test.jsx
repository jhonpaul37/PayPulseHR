import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import PrimaryButton from '@/Components/PrimaryButton';
import { Table, Modal, Form, Input, Select, message } from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const { Option } = Select;

export default function ContributionsIndex({ employees, lwopPera, employeeBenefits, auth }) {
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
    const [isLwopPeraModalVisible, setLwopPeraModalVisible] = useState(false);
    const [form] = Form.useForm();

    // Handle employee selection for bulk update
    const onSelectChange = (selectedRowKeys) => {
        setSelectedEmployeeIds(selectedRowKeys);
    };

    // Show modal for LWOP-PERA update
    const showLwopPeraModal = () => {
        setLwopPeraModalVisible(true);
    };

    // Cancel LWOP-PERA modal
    const handleLwopPeraCancel = () => {
        setLwopPeraModalVisible(false);
        form.resetFields();
    };

    // Handle bulk update of LWOP-PERA
    const handleLwopPeraOk = () => {
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

    // Columns configuration
    const columns = [
        {
            title: 'Employee',
            dataIndex: 'employee_name',
            key: 'employee_name',
        },
        {
            title: 'LWOP-PERA',
            dataIndex: 'lwopPera',
            key: 'lwopPera',
            render: (amount) => (amount ? `₱${parseFloat(amount).toFixed(2)}` : '----'),
        },
    ];

    // Data to display in the table
    const data = employees.map((employee) => {
        const lwopPeraAmount = employeeBenefits.find(
            (item) => item.employee_id === employee.id && item.benefit.name === 'LWOP-PERA'
        )?.amount;

        return {
            key: employee.id,
            employee_name: `${employee.first_name} ${employee.last_name}`,
            lwopPera: lwopPeraAmount,
        };
    });

    return (
        <AuthenticatedLayout user={auth.user}>
            <div>
                {/* LWOP-PERA Modal */}
                <Modal
                    title="Update LWOP-PERA"
                    visible={isLwopPeraModalVisible}
                    onOk={handleLwopPeraOk}
                    onCancel={handleLwopPeraCancel}
                    okText="Save"
                    cancelText="Cancel"
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

                {/* Bulk Update Button */}
                <PrimaryButton type="primary" onClick={showLwopPeraModal}>
                    Update LWOP-PERA for Selected Employees
                </PrimaryButton>

                {/* Table with checkbox selection */}
                <Table
                    rowSelection={{
                        type: 'checkbox',
                        onChange: onSelectChange,
                    }}
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                />
            </div>
        </AuthenticatedLayout>
    );
}
