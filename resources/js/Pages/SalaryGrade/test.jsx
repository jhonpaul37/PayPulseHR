import React, { useState } from 'react';
import { Table, InputNumber, Button, Modal, Row, Col, Input, message } from 'antd';
import { Inertia } from '@inertiajs/inertia';

const SalaryGradeManager = ({ salaryGrades, auth }) => {
    const [isAddModalVisible, setIsAddModalVisible] = useState(false); // Modal visibility
    const [newGrade, setNewGrade] = useState(''); // Grade for new salary grade
    const [steps, setSteps] = useState(
        Array.from({ length: 8 }, (_, i) => ({ step: i + 1, monthly_salary: '' })) // Default 8 steps
    );

    // Handle salary input changes
    const handleSalaryChange = (step, value) => {
        setSteps((prev) =>
            prev.map((row) => (row.step === step ? { ...row, monthly_salary: value } : row))
        );
    };

    // Add a new row for an additional step
    const addRow = () => {
        const newStep = steps.length + 1;
        setSteps([...steps, { step: newStep, monthly_salary: '' }]);
    };

    // Remove a row (step)
    const removeRow = (step) => {
        setSteps(steps.filter((row) => row.step !== step));
    };

    // Validate grade uniqueness and submit data
    const handleSave = () => {
        if (!newGrade) {
            message.error('Please enter a salary grade.');
            return;
        }

        const data = { grade: newGrade, steps };

        Inertia.post('/salary_grades/check_and_add', data, {
            onSuccess: () => {
                message.success('Salary grade added successfully!');
                setIsAddModalVisible(false);
                setSteps(
                    Array.from({ length: 8 }, (_, i) => ({ step: i + 1, monthly_salary: '' }))
                ); // Reset steps
                setNewGrade('');
            },
            onError: (errors) => {
                if (errors.grade) {
                    message.error(errors.grade);
                } else {
                    message.error('Failed to add salary grade.');
                }
            },
        });
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-center text-xl font-bold">Salary Grade Manager</h2>
            <div className="mb-6 flex justify-end">
                <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
                    Add Salary Grade
                </Button>
            </div>

            {/* Modal for Adding a New Salary Grade */}
            <Modal
                title="Add Salary Grade"
                visible={isAddModalVisible}
                onOk={handleSave}
                onCancel={() => setIsAddModalVisible(false)}
                okText="Save"
                cancelText="Cancel"
            >
                <Row gutter={[16, 16]} className="mb-4">
                    <Col span={8}>
                        <Input
                            placeholder="Grade"
                            value={newGrade}
                            onChange={(e) => setNewGrade(e.target.value)}
                        />
                    </Col>
                </Row>
                <Table
                    dataSource={steps}
                    columns={[
                        {
                            title: 'Step',
                            dataIndex: 'step',
                            key: 'step',
                            render: (text) => <span>{text}</span>,
                        },
                        {
                            title: 'Monthly Salary',
                            dataIndex: 'monthly_salary',
                            key: 'monthly_salary',
                            render: (text, record) => (
                                <InputNumber
                                    value={record.monthly_salary}
                                    onChange={(value) => handleSalaryChange(record.step, value)}
                                    formatter={(value) => `₱${value}`}
                                    parser={(value) => value.replace('₱', '')}
                                    placeholder="Enter Salary"
                                />
                            ),
                        },
                        {
                            title: 'Action',
                            key: 'action',
                            render: (_, record) =>
                                steps.length > 1 ? (
                                    <Button
                                        danger
                                        onClick={() => removeRow(record.step)}
                                        disabled={steps.length <= 1}
                                    >
                                        Remove
                                    </Button>
                                ) : null,
                        },
                    ]}
                    rowKey="step"
                    pagination={false}
                />
                <Button type="dashed" onClick={addRow} className="mt-4">
                    Add Step
                </Button>
            </Modal>
        </div>
    );
};

export default SalaryGradeManager;
