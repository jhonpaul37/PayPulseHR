import React, { useState } from 'react';
import { Modal, Input, Select, Form, Card, Empty, message } from 'antd';
import PrimaryButton from '@/Components/PrimaryButton';
import CancelButton from '@/Components/CancelButton';
import { useForm } from '@inertiajs/react';

const { Option } = Select;

const LoanTypes = ({ loanPrograms = [], loanTypes = [] }) => {
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedLoanType, setSelectedLoanType] = useState(null);

    const { data, setData, post, put, errors, reset } = useForm({
        loan_program_id: '',
        type: '',
        description: '',
    });

    // Group loan types by loan program
    const loanTypesByProgram = loanPrograms.map((program) => ({
        ...program,
        loanTypes: loanTypes.filter((loanType) => loanType.loan_program_id === program.id),
    }));

    const showCreateModal = () => {
        reset();
        setIsCreateModalVisible(true);
    };

    const showEditModal = (loanType) => {
        setSelectedLoanType(loanType);
        setData({
            loan_program_id: loanType.loan_program_id || '',
            type: loanType.type,
            description: loanType.description || '',
        });
        setIsEditModalVisible(true);
    };

    const handleCreateSubmit = async () => {
        try {
            await post(route('loanTypes.store'), {
                onSuccess: () => {
                    setIsCreateModalVisible(false);
                    message.success('Loan Type added successfully!'); // Success message
                },
                onError: () => {
                    message.error('Failed to add Loan Type.'); // Error message
                },
            });
        } catch (error) {
            message.error('An error occurred while adding Loan Type.'); // General error message
        }
    };

    const handleEditSubmit = async () => {
        try {
            await put(route('loanTypes.update', selectedLoanType.id), {
                onSuccess: () => {
                    setIsEditModalVisible(false);
                    message.success('Loan Type updated successfully!'); // Success message
                },
                onError: () => {
                    message.error('Failed to update Loan Type.'); // Error message
                },
            });
        } catch (error) {
            message.error('An error occurred while updating Loan Type.'); // General error message
        }
    };

    const handleCancel = () => {
        setIsEditModalVisible(false);
    };

    const getGridStyle = (count) => ({
        width: count > 4 ? '20%' : '25%',
        textAlign: 'center',
    });

    return (
        <div>
            <div className="flex justify-end pb-5">
                <PrimaryButton type="primary" onClick={showCreateModal}>
                    Add Loan Type
                </PrimaryButton>
            </div>

            {loanTypesByProgram.length > 0 ? (
                loanTypesByProgram.some((program) => program.loanTypes.length > 0) ? (
                    loanTypesByProgram.map((program) => (
                        <div key={program.id} className="mb-4">
                            {program.loanTypes.length > 0 ? (
                                <Card title={program.name} className="">
                                    {program.loanTypes.map((loanType) => (
                                        <Card.Grid
                                            key={loanType.id}
                                            style={getGridStyle(program.loanTypes.length)}
                                            onClick={() => showEditModal(loanType)}
                                            className="flex flex-col justify-center"
                                        >
                                            <div className="text-lg font-bold">{loanType.type}</div>
                                            <div className="text-gray-400">
                                                {loanType.description}
                                            </div>
                                        </Card.Grid>
                                    ))}
                                </Card>
                            ) : null}
                        </div>
                    ))
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No loan types available"
                    />
                )
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No loan programs available"
                />
            )}

            {/* Create Loan Type Modal */}
            <Modal
                title="Add Loan Type"
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                footer={
                    <div className="flex justify-end space-x-4">
                        <CancelButton key="cancel" onClick={() => setIsCreateModalVisible(false)}>
                            Cancel
                        </CancelButton>
                        <PrimaryButton key="submit" type="primary" onClick={handleCreateSubmit}>
                            Add
                        </PrimaryButton>
                    </div>
                }
            >
                <Form layout="vertical">
                    <Form.Item label="Loan Program">
                        <Select
                            value={data.loan_program_id}
                            onChange={(value) => setData('loan_program_id', value)}
                            className="w-full"
                        >
                            <Option value="">Select Loan Program</Option>
                            {loanPrograms.map((program) => (
                                <Option key={program.id} value={program.id}>
                                    {program.name}
                                </Option>
                            ))}
                        </Select>
                        {errors.loan_program_id && (
                            <div className="text-red-500">{errors.loan_program_id}</div>
                        )}
                    </Form.Item>

                    <Form.Item label="Type">
                        <Input
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className="w-full"
                        />
                        {errors.type && <div className="text-red-500">{errors.type}</div>}
                    </Form.Item>

                    <Form.Item label="Description">
                        <Input.TextArea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full"
                        />
                        {errors.description && (
                            <div className="text-red-500">{errors.description}</div>
                        )}
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Loan Type Modal */}
            <Modal
                title="Edit Loan Type"
                open={isEditModalVisible}
                onCancel={handleCancel}
                footer={
                    <div className="flex justify-end space-x-4">
                        <CancelButton key="cancel" onClick={handleCancel}>
                            Cancel
                        </CancelButton>
                        <PrimaryButton key="submit" type="primary" onClick={handleEditSubmit}>
                            Update
                        </PrimaryButton>
                    </div>
                }
            >
                <Form layout="vertical">
                    <Form.Item label="Loan Program">
                        <Select
                            value={data.loan_program_id}
                            onChange={(value) => setData('loan_program_id', value)}
                            className="w-full"
                        >
                            <Option value="">Select Loan Program</Option>
                            {loanPrograms.map((program) => (
                                <Option key={program.id} value={program.id}>
                                    {program.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Type">
                        <Input
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className="w-full"
                        />
                    </Form.Item>

                    <Form.Item label="Description">
                        <Input.TextArea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default LoanTypes;
