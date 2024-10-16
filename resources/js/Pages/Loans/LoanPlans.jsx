import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Modal, Button, Input, Select, Form } from 'antd';
import PrimaryButton from '@/Components/PrimaryButton';
import CancelButton from '@/Components/CancelButton';

const { Option } = Select;

export default function LoanPlans({ auth, loanPlans = [], loanTypes = [] }) {
    const [formData, setFormData] = useState({
        loan_type_id: '',
        months: '',
        interest_rate: '',
        penalty_rate: '',
    });
    const [editing, setEditing] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditing(null);
        resetForm();
    };

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        if (editing) {
            Inertia.patch(`/loanPlans/${editing}`, formData, {
                onSuccess: () => {
                    setIsModalVisible(false);
                    setEditing(null);
                },
            });
        } else {
            Inertia.post('/loanPlans', formData, {
                onSuccess: () => setIsModalVisible(false),
            });
        }
    };

    const handleEdit = (loanPlan) => {
        setEditing(loanPlan.id);
        setFormData({
            loan_type_id: loanPlan.loan_type_id,
            months: loanPlan.months,
            interest_rate: loanPlan.interest_rate,
            penalty_rate: loanPlan.penalty_rate,
        });
        setIsModalVisible(true);
    };

    const resetForm = () => {
        setFormData({
            loan_type_id: '',
            months: '',
            interest_rate: '',
            penalty_rate: '',
        });
    };
    // console.log('Loan Plans:', loanPlans);

    return (
        <div>
            {/* Ant Design Modal */}
            <Modal
                title={editing ? 'Edit Loan Plan' : 'Add Loan Plan'}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={
                    <div className="flex justify-end space-x-4">
                        <CancelButton key="cancel" onClick={handleCancel}>
                            Cancel
                        </CancelButton>
                        <PrimaryButton key="submit" onClick={handleSubmit}>
                            {editing ? 'Update' : 'Add'}
                        </PrimaryButton>
                    </div>
                }
            >
                <Form layout="vertical">
                    <Form.Item label="Loan Type">
                        <Select
                            value={formData.loan_type_id}
                            onChange={(value) => handleChange('loan_type_id', value)}
                            placeholder="Select Loan Type"
                        >
                            {loanTypes.map((loanType) => (
                                <Option key={loanType.id} value={loanType.id}>
                                    {loanType.type}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Months">
                        <Input
                            type="number"
                            value={formData.months}
                            onChange={(e) => handleChange('months', e.target.value)}
                            placeholder="Duration (months)"
                        />
                    </Form.Item>

                    <Form.Item label="Interest Rate">
                        <Input
                            type="number"
                            value={formData.interest_rate}
                            onChange={(e) => handleChange('interest_rate', e.target.value)}
                            placeholder="Interest Rate (%)"
                            step="0.01"
                        />
                    </Form.Item>

                    <Form.Item label="Penalty Rate">
                        <Input
                            type="number"
                            value={formData.penalty_rate}
                            onChange={(e) => handleChange('penalty_rate', e.target.value)}
                            placeholder="Penalty Rate (%)"
                            step="0.01"
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Display loan plans */}
            {loanPlans.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Loan Type</th>
                            <th>Months</th>
                            <th>Interest Rate</th>
                            <th>Penalty Rate</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loanPlans.map((loanPlan) => (
                            <tr key={loanPlan.id}>
                                <td>{loanPlan.loan_type_id}</td>
                                <td>{loanPlan.months}</td>
                                <td>{loanPlan.interest_rate}%</td>
                                <td>{loanPlan.penalty_rate}%</td>
                                <td>
                                    <Button onClick={() => handleEdit(loanPlan)}>Edit</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No loan plans available.</p>
            )}

            {/* Button to trigger modal */}
            <PrimaryButton type="primary" onClick={showModal}>
                Add Loan Plan
            </PrimaryButton>
        </div>
    );
}
