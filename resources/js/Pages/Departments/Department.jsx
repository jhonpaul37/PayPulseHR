import React, { useState } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import { Table, Space, Typography, Modal, Form, Input } from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';

const { Title } = Typography;

const Department = ({ auth }) => {
    const { departments } = usePage().props;
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentDepartment, setCurrentDepartment] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: '',
    });

    const handleCreate = () => {
        reset();
        setIsCreateModalVisible(true);
    };

    const handleEdit = (department) => {
        setCurrentDepartment(department);
        setData({ name: department.name, description: department.description });
        setIsEditModalVisible(true);
    };

    const handleCancel = () => {
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
        reset();
    };

    const handleCreateSubmit = () => {
        post('/hr/departments', {
            onSuccess: () => setIsCreateModalVisible(false),
        });
    };

    const handleEditSubmit = () => {
        if (currentDepartment) {
            put(`/hr/departments/${currentDepartment.id}`, {
                onSuccess: () => setIsEditModalVisible(false),
            });
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <PrimaryButton type="primary" size="small" onClick={() => handleEdit(record)}>
                        Edit
                    </PrimaryButton>
                    <Link
                        method="delete"
                        href={`/hr/departments/${record.id}`}
                        as="form"
                        data={{ method: 'delete' }}
                    >
                        <DangerButton type="primary" danger size="small">
                            Delete
                        </DangerButton>
                    </Link>
                </Space>
            ),
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <div style={{ padding: '24px' }}>
                <Title level={2}>Departments</Title>
                <div style={{ marginBottom: '16px' }}>
                    <PrimaryButton type="primary" onClick={handleCreate}>
                        Add Department
                    </PrimaryButton>
                </div>
                <Table
                    columns={columns}
                    dataSource={departments.map((department) => ({
                        key: department.id,
                        ...department,
                    }))}
                    bordered
                />

                {/* Create Modal */}
                <Modal
                    title="Create Department"
                    open={isCreateModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <Form layout="vertical">
                        <Form.Item
                            label="Name"
                            validateStatus={errors.name ? 'error' : ''}
                            help={errors.name}
                        >
                            <Input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Description"
                            validateStatus={errors.description ? 'error' : ''}
                            help={errors.description}
                        >
                            <Input.TextArea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <DangerButton onClick={handleCancel}>Cancel</DangerButton>
                            <PrimaryButton onClick={handleCreateSubmit} disabled={processing}>
                                Save
                            </PrimaryButton>
                        </div>
                    </Form>
                </Modal>

                {/* Edit Modal */}
                <Modal
                    title="Edit Department"
                    open={isEditModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <Form layout="vertical">
                        <Form.Item
                            label="Name"
                            validateStatus={errors.name ? 'error' : ''}
                            help={errors.name}
                        >
                            <Input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Description"
                            validateStatus={errors.description ? 'error' : ''}
                            help={errors.description}
                        >
                            <Input.TextArea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <DangerButton onClick={handleCancel}>Cancel</DangerButton>
                            <PrimaryButton onClick={handleEditSubmit} disabled={processing}>
                                Save Changes
                            </PrimaryButton>
                        </div>
                    </Form>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
};

export default Department;
