import React, { useState } from 'react';
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
    message,
    Divider,
} from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';

const { Grid } = Card;

// Helper function to determine grid style based on the number of items
const getGridStyle = (totalItems) => {
    const gridWidth = totalItems > 0 ? `${100 / Math.min(totalItems, 4)}%` : '25%';
    return {
        width: gridWidth,
        textAlign: 'center',
        cursor: 'pointer',
    };
};

const BenefitsDashboard = ({ auth, employees, benefits, employeeBenefits }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBenefitModalOpen, setIsBenefitModalOpen] = useState(false);
    const [editingBenefit, setEditingBenefit] = useState(null); // Track if a benefit is being edited
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
                message.success('Benefit updated successfully');
            } else {
                await Inertia.post(route('benefits.store'), values);
                message.success('Benefit created successfully');
            }
            benefitForm.resetFields();
            setEditingBenefit(null);
            setIsBenefitModalOpen(false);
        } catch (error) {
            message.error('Failed to save benefit');
        }
    };

    const handleSubmit = (values) => {
        Inertia.post(route('employee_benefits.store'), values, {
            onSuccess: () => form.resetFields(),
        });
        setIsModalOpen(false);
    };

    const handleEditBenefit = (benefit) => {
        benefitForm.setFieldsValue(benefit); // Prefill the form with benefit details
        setEditingBenefit(benefit);
        setIsBenefitModalOpen(true);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            {/* Display available benefits using Card */}
            <h2 className="mb-5 text-lg font-semibold">Available Benefits</h2>
            {/* <div className="mb-5 flex items-center">
                <PrimaryButton type="default" onClick={showBenefitModal}>
                    Create Benefit
                </PrimaryButton>
            </div> */}
            {benefits && benefits.length > 0 ? (
                <Card title="Benefits" className="mb-6">
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

            <Divider style={{ borderColor: '#F0C519' }} className="pt-5">
                {/* <span className="text-xl font-bold">Loan Types</span> */}
            </Divider>

            <div className="mb-6">
                <PrimaryButton type="primary" onClick={showModal}>
                    Add Benefit
                </PrimaryButton>
            </div>

            <Table dataSource={employeeBenefits} rowKey="id" className="mt-4">
                <Table.Column
                    title="Employee"
                    key="employee"
                    render={(text, record) => (
                        <span>
                            {record.employee.first_name} {record.employee.last_name}
                        </span>
                    )}
                />
                <Table.Column title="Benefit" dataIndex={['benefit', 'name']} key="benefit" />
                <Table.Column title="Amount" dataIndex="amount" key="amount" />
            </Table>

            {/* Modal for assigning employee benefit */}
            <Modal
                title="Assign Benefit to Employee"
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
                    <Form.Item name="employee_id" label="Employee" rules={[{ required: true }]}>
                        <Select placeholder="Select Employee">
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

            {/* Modal for creating/editing a benefit */}
            <Modal
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
                    <Form.Item name="name" label="Benefit Name" rules={[{ required: true }]}>
                        <Input className="w-full" placeholder="Enter Benefit Name" />
                    </Form.Item>
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
                    {/* <Form.Item name="amount" label="Benefit Amount" rules={[{ required: true }]}>
                        <InputNumber className="w-full" placeholder="Enter Amount" />
                    </Form.Item> */}
                </Form>
            </Modal>
        </AuthenticatedLayout>
    );
};

export default BenefitsDashboard;
