import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import {
    Button,
    Table,
    Modal,
    Form,
    InputNumber,
    Select,
    Card,
    Empty,
    message,
    Divider,
} from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';

const { Grid } = Card;

const getGridStyle = (totalItems) => {
    const gridWidth = totalItems > 0 ? `${100 / Math.min(totalItems, 4)}%` : '25%';
    return {
        width: gridWidth,
        textAlign: 'center',
        cursor: 'pointer',
    };
};

const BenefitsDashboard = ({ auth, employees, benefits, employeeBenefits, customMessage }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBenefitModalOpen, setIsBenefitModalOpen] = useState(false);
    const [editingBenefit, setEditingBenefit] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
    const [editedBenefits, setEditedBenefits] = useState([]); // Track changes during edit mode
    const [form] = Form.useForm();
    const [benefitForm] = Form.useForm();

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    const handleEditBenefit = (benefit) => {
        benefitForm.setFieldsValue(benefit);
        setEditingBenefit(benefit);
        setIsBenefitModalOpen(true);
    };

    // LWOP-PERA change value
    const handleLWOPChange = (employeeId, benefitId, value) => {
        setEditedBenefits((prev) => {
            const updated = [...prev];
            const index = updated.findIndex(
                (item) => item.employee_id === employeeId && item.benefit_id === benefitId
            );
            if (index > -1) {
                updated[index].amount = value;
            } else {
                updated.push({ employee_id: employeeId, benefit_id: benefitId, amount: value });
            }
            return updated;
        });
    };

    const handleSubmit = (values) => {
        Inertia.post(route('employee_benefits.store'), values, {
            onSuccess: (page) => {
                if (page.props.flash.warning) {
                    message.warning(page.props.flash.warning); // Display warning message if exists
                }
                if (page.props.flash.success) {
                    message.success(page.props.flash.success); // Display success message if exists
                }
                form.resetFields();
            },
            onError: () => {
                message.error('Failed to assign benefits.'); // Display error message on failure
            },
        });
        setIsModalOpen(false);
    };

    const handleSave = () => {
        const flatChanges = editedBenefits;

        Inertia.post(
            route('employee_benefits.bulkUpdate'),
            { changes: flatChanges },
            {
                onSuccess: () => {
                    message.success('Bulk benefits updated successfully!'); // Success notification
                    setEditedBenefits([]);
                    setIsEditing(false); // Exit edit mode
                },
                onError: () => {
                    message.error('Failed to update benefits.'); // Error notification
                },
            }
        );
    };

    const handleCancelEdit = () => {
        setEditedBenefits([]); // Discard changes
        setIsEditing(false); // Exit edit mode
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            {/* available benefits */}

            {benefits && benefits.length > 0 ? (
                <Card title="Gross Earings" className="mb-6">
                    {benefits.map((benefit) => (
                        <Grid
                            key={benefit.id}
                            style={getGridStyle(benefits.length)}
                            onClick={() => handleEditBenefit(benefit)}
                        >
                            <div className="text-lg font-bold">{benefit.name}</div>
                        </Grid>
                    ))}
                </Card>
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No benefits available"
                    className="mb-6"
                />
            )}

            {/* assigning employee benefit */}
            <Modal
                title="Assign Benefit to Employees"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>,
                    <PrimaryButton key="submit" type="primary" onClick={() => form.submit()}>
                        Submit
                    </PrimaryButton>,
                ]}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="employee_ids"
                        label="Employees"
                        rules={[
                            { required: true, message: 'Please select at least one employee.' },
                        ]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select Employees"
                            allowClear
                            optionFilterProp="children"
                        >
                            {employees.map((employee) => (
                                <Select.Option key={employee.id} value={employee.id}>
                                    {employee.first_name} {employee.last_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="benefit_id" label="Benefit" rules={[{ required: true }]}>
                        <Select placeholder="Select Benefit">
                            {benefits.map((benefit) => (
                                <Select.Option key={benefit.id} value={benefit.id}>
                                    {benefit.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
                        <InputNumber className="w-full" placeholder="Amount" />
                    </Form.Item>
                </Form>
            </Modal>

            <div className="mb-6 flex">
                <PrimaryButton type="primary" onClick={showModal}>
                    Add
                </PrimaryButton>
            </div>
            <Divider style={{ borderColor: '#F0C519' }} className="pt-5" />

            <div>
                <h2 className="mb-5 text-lg font-semibold">Gross Earnings Management</h2>
                <div className="mt-6 flex gap-2">
                    {isEditing ? (
                        <>
                            <PrimaryButton type="primary" onClick={handleSave}>
                                Save
                            </PrimaryButton>
                            <Button onClick={handleCancelEdit}>Cancel</Button>
                        </>
                    ) : (
                        <PrimaryButton type="primary" onClick={() => setIsEditing(true)}>
                            Edit
                        </PrimaryButton>
                    )}
                </div>
                <Table
                    dataSource={employees}
                    rowKey="id"
                    className="mt-4"
                    pagination={{ pageSize: 10 }}
                >
                    <Table.Column
                        title="Employee"
                        render={(text, record) => (
                            <span>
                                {record.first_name} {record.last_name}
                            </span>
                        )}
                    />
                    {benefits.map((benefit) => (
                        <Table.Column
                            key={benefit.id}
                            title={benefit.name}
                            render={(text, record) => {
                                const employeeBenefit = employeeBenefits.find(
                                    (eb) =>
                                        eb.employee_id === record.id && eb.benefit_id === benefit.id
                                );

                                return isEditing ? (
                                    <InputNumber
                                        defaultValue={employeeBenefit?.amount || 0}
                                        onChange={(value) =>
                                            handleLWOPChange(record.id, benefit.id, value)
                                        }
                                    />
                                ) : (
                                    <span>{employeeBenefit?.amount || 0}</span>
                                );
                            }}
                        />
                    ))}
                </Table>
            </div>
        </AuthenticatedLayout>
    );
};

export default BenefitsDashboard;
