import React, { useState } from 'react';
import {
    Table,
    InputNumber,
    Modal,
    Row,
    Col,
    Input,
    Space,
    Pagination,
    Button,
    Upload,
    message,
} from 'antd';
import { Inertia } from '@inertiajs/inertia';
import Papa from 'papaparse';
import { UploadOutlined } from '@ant-design/icons';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const SalaryGradeManager = ({ salaryGrades, auth }) => {
    const grades = salaryGrades.reduce((acc, grade) => {
        acc[grade.grade] = acc[grade.grade] || [];
        acc[grade.grade].push(grade);
        return acc;
    }, {});
    const gradeKeys = Object.keys(grades);

    const [currentPage, setCurrentPage] = useState(1);
    const [editableGrades, setEditableGrades] = useState(grades);
    const [originalGrades, setOriginalGrades] = useState(grades);
    const [isEditMode, setIsEditMode] = useState(false);

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [newGrade, setNewGrade] = useState('');
    const [steps, setSteps] = useState(
        Array.from({ length: 8 }, (_, i) => ({ step: i + 1, monthly_salary: '' }))
    );

    // Handle CSV Upload
    const handleCSVUpload = (file) => {
        const formData = new FormData();
        formData.append('file', file);

        Inertia.post('/salary_grades/upload_csv', formData, {
            onSuccess: () => {
                message.success('File uploaded successfully!');
            },
            onError: () => {
                message.error('Failed to upload file.');
            },
        });

        // Prevent Ant Design from automatically uploading the file
        return false;
    };

    const handleEdit = () => {
        setIsEditMode(true);
        setOriginalGrades(editableGrades);
    };

    const handleCancel = () => {
        setEditableGrades(originalGrades);
        setIsEditMode(false);
    };

    const handleSave = () => {
        const updatedGrades = Object.values(editableGrades).flat();
        Inertia.post(
            '/salary_grades/bulk_update',
            { updatedGrades },
            {
                onSuccess: () => {
                    message.success('Salaries updated successfully');
                    setIsEditMode(false);
                },
                onError: () => {
                    message.error('Failed to update salaries');
                },
            }
        );
    };

    const pageSize = 3;
    const currentGrades = gradeKeys.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
            render: (text, record) =>
                isEditMode ? (
                    <InputNumber
                        value={record.monthly_salary}
                        onChange={(value) => {
                            const updated = { ...editableGrades };
                            updated[record.grade] = updated[record.grade].map((sg) =>
                                sg.step === record.step ? { ...sg, monthly_salary: value } : sg
                            );
                            setEditableGrades(updated);
                        }}
                        formatter={(value) => `₱${value}`}
                        parser={(value) => value.replace('₱', '')}
                    />
                ) : (
                    `₱${record.monthly_salary}`
                ),
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="container mx-auto p-6">
                <h2 className="text-center text-xl font-bold">Salary Grade Manager</h2>

                <div className="mb-6 flex justify-between">
                    <Space>
                        {isEditMode ? (
                            <>
                                <PrimaryButton type="primary" onClick={handleSave}>
                                    Save Changes
                                </PrimaryButton>
                                <DangerButton onClick={handleCancel}>Cancel</DangerButton>
                            </>
                        ) : (
                            <>
                                <PrimaryButton type="primary" onClick={handleEdit}>
                                    Edit
                                </PrimaryButton>
                                <PrimaryButton
                                    type="primary"
                                    onClick={() => setIsAddModalVisible(true)}
                                >
                                    Add Salary Grade
                                </PrimaryButton>
                                <Upload beforeUpload={handleCSVUpload} showUploadList={false}>
                                    <Button icon={<UploadOutlined />}>Upload CSV</Button>
                                </Upload>
                            </>
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

export default SalaryGradeManager;
