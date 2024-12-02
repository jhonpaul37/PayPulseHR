import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import {
    Button,
    Table,
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Card,
    Empty,
    message as antdMessage,
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
    const [form] = Form.useForm();
    const [benefitForm] = Form.useForm();

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    const showBenefitModal = () => setIsBenefitModalOpen(true);
    const handleBenefitCancel = () => {
        setEditingBenefit(null);
        setIsBenefitModalOpen(false);
    };

    const handleBenefitSubmit = async (values) => {
        try {
            if (editingBenefit) {
                await Inertia.put(`/benefits/${editingBenefit.id}`, values);
                antdMessage.success('Benefit updated successfully');
            } else {
                await Inertia.post(route('benefits.store'), values);
                antdMessage.success('Benefit created successfully');
            }
            benefitForm.resetFields();
            setEditingBenefit(null);
            setIsBenefitModalOpen(false);
        } catch (error) {
            antdMessage.error('Failed to save benefit');
        }
    };

    const handleSubmit = (values) => {
        Inertia.post(route('employee_benefits.store'), values, {
            onSuccess: () => form.resetFields(),
        });
        setIsModalOpen(false);
    };

    const handleEditBenefit = (benefit) => {
        benefitForm.setFieldsValue(benefit);
        setEditingBenefit(benefit);
        setIsBenefitModalOpen(true);
    };

    const [editedBenefits, setEditedBenefits] = useState([]);

    // LWOP-PERA change value
    const handleLWOPChange = (employeeId, value) => {
        setEditedBenefits((prev) => {
            const updated = [...prev];
            const index = updated.findIndex((item) => item.employee_id === employeeId);
            if (index > -1) {
                updated[index].lwop_pera = value;
            } else {
                updated.push({ employee_id: employeeId, lwop_pera: value });
            }
            return updated;
        });
    };

    useEffect(() => {
        if (customMessage) {
            antdMessage.success(customMessage);
        }
    }, [customMessage]);

    // Submit LWOP-PERA changes to the server
    const submitLWOPChanges = () => {
        Inertia.post(
            route('update_lwop_pera'),
            { changes: editedBenefits },
            {
                onSuccess: () => {
                    antdMessage.success('LWOP-PERA updated successfully!');
                    setEditedBenefits([]);
                },
                onError: () => {
                    antdMessage.error('Failed to update LWOP-PERA.');
                },
            }
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            {/* available benefits */}

            {benefits && benefits.length > 0 ? (
                <Card title="Gross earings" className="mb-6">
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

            {/* editing benefit description */}
            {/* <Modal
                title={editingBenefit ? 'Edit Benefit' : 'Create New Benefit'}
                open={isBenefitModalOpen}
                onCancel={handleBenefitCancel}
                footer={[
                    <Button key="cancel" onClick={handleBenefitCancel} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>,
                    <PrimaryButton key="submit" type="primary" onClick={() => benefitForm.submit()}>
                        {editingBenefit ? 'Update' : 'Create'}
                    </PrimaryButton>,
                ]}
            >
                <Form form={benefitForm} layout="vertical" onFinish={handleBenefitSubmit}>
                    {editingBenefit ? (
                        <Form.Item label="Benefit Name">
                            <Input className="w-full" value={editingBenefit.name} disabled />
                        </Form.Item>
                    ) : (
                        <Form.Item name="name" label="Benefit Name" rules={[{ required: true }]}>
                            <Input className="w-full" placeholder="Enter Benefit Name" />
                        </Form.Item>
                    )}
                    <Form.Item
                        name="description"
                        label="Benefit Description"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea
                            className="w-full"
                            placeholder="Enter Benefit Description"
                        />
                    </Form.Item>
                </Form>
            </Modal> */}

            <Divider style={{ borderColor: '#F0C519' }} className="pt-5">
                {/* <span className="text-xl font-bold">Loan Types</span> */}
            </Divider>

            <div className="mb-6">
                <PrimaryButton type="primary" onClick={showModal}>
                    Add Benefit
                </PrimaryButton>
            </div>

            <div>
                <h2 className="mb-5 text-lg font-semibold">Gross Earnings Management</h2>
                <Table
                    dataSource={employees} // Data is based on employees
                    rowKey="id"
                    className="mt-4"
                    pagination={{ pageSize: 10 }}
                >
                    {/* Employee Column */}
                    <Table.Column
                        title="Employee"
                        render={(text, record) => (
                            <span>
                                {record.first_name} {record.last_name}
                            </span>
                        )}
                    />

                    {/* Dynamically Generate Benefit Columns */}
                    {benefits.map((benefit) => (
                        <Table.Column
                            key={benefit.id}
                            title={benefit.name}
                            render={(text, record) => {
                                const employeeBenefit = employeeBenefits.find(
                                    (eb) =>
                                        eb.employee_id === record.id && eb.benefit_id === benefit.id
                                );

                                return <span>{employeeBenefit?.amount || '—'}</span>;
                            }}
                        />
                    ))}

                    {/* LWOP-PERA Column */}
                    <Table.Column
                        title="LWOP-PERA"
                        render={(text, record) => (
                            <InputNumber
                                defaultValue={record.lwop_pera || 0}
                                onChange={(value) => handleLWOPChange(record.id, value)}
                            />
                        )}
                    />
                </Table>

                {/* Submit Button for LWOP-PERA Changes */}
                <div className="mt-6 flex justify-end">
                    <PrimaryButton type="primary" onClick={submitLWOPChanges}>
                        Submit LWOP-PERA Changes
                    </PrimaryButton>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default BenefitsDashboard;
