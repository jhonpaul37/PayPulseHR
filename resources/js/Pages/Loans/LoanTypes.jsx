import React, { useState } from 'react';
import { Modal, Input, Select, Form, Empty, message, Divider } from 'antd';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
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
                    message.success('Loan Type added successfully!');
                },
                onError: () => {
                    message.error('Failed to add Loan Type.');
                },
            });
        } catch (error) {
            message.error('An error occurred while adding Loan Type.');
        }
    };

    const handleEditSubmit = async () => {
        try {
            await put(route('loanTypes.update', selectedLoanType.id), {
                onSuccess: () => {
                    setIsEditModalVisible(false);
                    message.success('Loan Type updated successfully!');
                },
                onError: () => {
                    message.error('Failed to update Loan Type.');
                },
            });
        } catch (error) {
            message.error('An error occurred while updating Loan Type.');
        }
    };

    const handleCancel = () => {
        setIsEditModalVisible(false);
    };

    return (
        <div>
            <div className="flex justify-end pb-5">
                <PrimaryButton type="primary" onClick={showCreateModal}>
                    Add Loan Type
                </PrimaryButton>
            </div>

            {loanTypesByProgram.length > 0 ? (
                loanTypesByProgram.some((program) => program.loanTypes.length > 0) ? (
                    <div className="grid gap-6">
                        {loanTypesByProgram.map((program) => (
                            <div key={program.id}>
                                {program.loanTypes.length > 0 && (
                                    <>
                                        <h2 className="mb-2 text-lg font-semibold">
                                            <div className="mb-2 flex items-center gap-4">
                                                <span className="text-base font-semibold text-gray-800">
                                                    {program.name}
                                                </span>
                                                <div className="flex-1 border-t border-gray-300"></div>
                                            </div>
                                        </h2>
                                        <div className="ml-6 columns-1 gap-4 space-y-4 sm:columns-2 md:columns-3 lg:columns-4">
                                            {program.loanTypes.map((loanType) => (
                                                <div
                                                    key={loanType.id}
                                                    className="cursor-pointer break-inside-avoid rounded bg-white p-4 shadow transition hover:shadow-md"
                                                    onClick={() => showEditModal(loanType)}
                                                >
                                                    <div className="text-sm font-semibold">
                                                        {loanType.type}
                                                    </div>
                                                    {loanType.description && (
                                                        <div className="mt-1 text-xs text-gray-500">
                                                            {loanType.description}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
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
                        <DangerButton onClick={() => setIsCreateModalVisible(false)}>
                            Cancel
                        </DangerButton>
                        <PrimaryButton onClick={handleCreateSubmit}>Add</PrimaryButton>
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
                        <DangerButton onClick={handleCancel}>Cancel</DangerButton>
                        <PrimaryButton onClick={handleEditSubmit}>Update</PrimaryButton>
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
