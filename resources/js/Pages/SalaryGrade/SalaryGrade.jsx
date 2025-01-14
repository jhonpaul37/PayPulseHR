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
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
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
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);

    // Add a new salary grade
    const handleNewGradeSave = () => {
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
                );
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
    const handleNewSalaryChange = (step, value) => {
        setSteps((prev) =>
            prev.map((row) => (row.step === step ? { ...row, monthly_salary: value } : row))
        );
    };
    const addRow = () => {
        const newStep = steps.length + 1;
        setSteps([...steps, { step: newStep, monthly_salary: '' }]);
    };
    const removeRow = (step) => {
        setSteps(steps.filter((row) => row.step !== step));
    };

    // Handle CSV Upload
    const handleCSVUpload = (file) => {
        const formData = new FormData();
        formData.append('file', file);

        Inertia.post('/salary_grades/upload_csv', formData, {
            onSuccess: () => {
                message.success('File uploaded successfully!');
                setIsUploadModalVisible(false); // Close modal on success
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
                                <PrimaryButton onClick={() => setIsUploadModalVisible(true)}>
                                    Upload Salary Grades CSV
                                </PrimaryButton>
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

                {/* Modal for Adding a New Salary Grade */}
                <Modal
                    title="Add Salary Grade"
                    open={isAddModalVisible}
                    onOk={handleNewGradeSave}
                    onCancel={() => setIsAddModalVisible(false)}
                    footer={[
                        <DangerButton
                            key="cancel"
                            onClick={() => setIsAddModalVisible(false)}
                            className="mr-5"
                        >
                            Cancel
                        </DangerButton>,
                        <PrimaryButton key="save" type="primary" onClick={handleNewGradeSave}>
                            Save
                        </PrimaryButton>,
                    ]}
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
                            },
                            {
                                title: 'Monthly Salary',
                                dataIndex: 'monthly_salary',
                                key: 'monthly_salary',
                                render: (text, record) => (
                                    <InputNumber
                                        value={record.monthly_salary}
                                        onChange={(value) =>
                                            handleNewSalaryChange(record.step, value)
                                        }
                                        formatter={(value) => `₱${value}`}
                                        parser={(value) => value.replace('₱', '')}
                                    />
                                ),
                            },
                            {
                                title: 'Action',
                                key: 'action',
                                render: (_, record) => (
                                    <Button
                                        danger
                                        onClick={() => removeRow(record.step)}
                                        disabled={steps.length <= 1}
                                    >
                                        Remove
                                    </Button>
                                ),
                            },
                        ]}
                        rowKey="step"
                        pagination={false}
                    />
                    <PrimaryButton type="dashed" onClick={addRow} className="mt-4">
                        Add Step
                    </PrimaryButton>
                </Modal>
            </div>

            {/* Upload Modal */}
            <Modal
                title="Upload Salary Grades CSV"
                open={isUploadModalVisible}
                onCancel={() => setIsUploadModalVisible(false)}
                footer={[
                    <DangerButton
                        key="cancel"
                        onClick={() => setIsUploadModalVisible(false)}
                        className="mr-5"
                    >
                        Cancel
                    </DangerButton>,
                    <PrimaryButton
                        key="upload"
                        onClick={() => setIsUploadModalVisible(false)} // Close modal after upload
                    >
                        Upload CSV
                    </PrimaryButton>,
                ]}
            >
                <Upload.Dragger
                    name="file"
                    accept=".csv"
                    beforeUpload={handleCSVUpload}
                    showUploadList={false}
                    className="p-4"
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Ensure the file is in CSV format and follows the required structure.
                    </p>
                </Upload.Dragger>
            </Modal>
        </AuthenticatedLayout>
    );
};

export default SalaryGradeManager;
