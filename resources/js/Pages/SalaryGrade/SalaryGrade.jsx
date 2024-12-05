import React, { useState } from 'react';
import { Table, InputNumber, Button, Space, Pagination, Row, Col } from 'antd';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const BulkEdit = ({ salaryGrades, auth }) => {
    // Group salary grades by grade
    const grades = salaryGrades.reduce((acc, grade) => {
        acc[grade.grade] = acc[grade.grade] || [];
        acc[grade.grade].push(grade);
        return acc;
    }, {});

    const gradeKeys = Object.keys(grades); // Get unique grades
    const [currentPage, setCurrentPage] = useState(1); // Current page state
    const [editableGrades, setEditableGrades] = useState(grades); // State to store edited grades
    const [originalGrades, setOriginalGrades] = useState(grades); // State to store original grades for cancel
    const [isEditMode, setIsEditMode] = useState(false); // Tracks whether we are in edit mode

    const handleSalaryChange = (grade, step, value) => {
        setEditableGrades((prev) => ({
            ...prev,
            [grade]: prev[grade].map((sg) =>
                sg.step === step ? { ...sg, monthly_salary: value } : sg
            ),
        }));
    };

    const handleEdit = () => {
        setIsEditMode(true); // Enter edit mode
        setOriginalGrades(editableGrades); // Save the current state to allow canceling
    };

    const handleCancel = () => {
        setEditableGrades(originalGrades); // Restore the original state
        setIsEditMode(false); // Exit edit mode
    };

    const handleSave = () => {
        const updatedGrades = Object.values(editableGrades).flat();
        Inertia.post(
            '/salary_grades/bulk_update',
            { updatedGrades },
            {
                onSuccess: () => {
                    message.success('Salaries updated successfully');
                    setIsEditMode(false); // Exit edit mode after saving
                },
                onError: () => {
                    message.error('Failed to update salaries');
                },
            }
        );
    };

    const columns = [
        {
            title: 'Step',
            dataIndex: 'step',
            key: 'step',
        },
        {
            title: 'Monthly Salary',
            dataIndex: 'monthly_salary',
            key: 'monthly_salary',
            render: (text, record) => {
                return isEditMode ? (
                    <InputNumber
                        value={record.monthly_salary}
                        onChange={(value) => handleSalaryChange(record.grade, record.step, value)}
                        formatter={(value) => `₱${value}`}
                        parser={(value) => value.replace('₱', '')}
                    />
                ) : (
                    `₱${record.monthly_salary}` // Display as text when not in edit mode
                );
            },
        },
    ];

    const pageSize = 3; // Number of grades per page
    const currentGrades = gradeKeys.slice((currentPage - 1) * pageSize, currentPage * pageSize); // Get the grades for the current page

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="container mx-auto p-6">
                <h2 className="flex justify-center pb-4 text-xl font-bold">Salary Grade</h2>
                <div className="mb-6 flex items-center justify-between">
                    <Space>
                        {isEditMode ? (
                            <>
                                <Button type="primary" onClick={handleSave}>
                                    Save Changes
                                </Button>
                                <Button onClick={handleCancel}>Cancel</Button>
                            </>
                        ) : (
                            <Button type="primary" onClick={handleEdit}>
                                Edit
                            </Button>
                        )}
                    </Space>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={gradeKeys.length}
                        onChange={(page) => setCurrentPage(page)}
                        showSizeChanger={false}
                    />
                </div>
                <Row gutter={[16, 16]}>
                    {currentGrades.map((grade) => (
                        <Col span={8} key={grade}>
                            <div className="mb-6 rounded-md border bg-white p-4 shadow-sm">
                                <h2 className="mb-4 text-center text-lg font-bold">
                                    Grade {grade}
                                </h2>
                                <Table
                                    dataSource={editableGrades[grade]}
                                    columns={columns}
                                    rowKey="step"
                                    pagination={false}
                                />
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>
        </AuthenticatedLayout>
    );
};

export default BulkEdit;
