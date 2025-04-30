import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Positions = ({ auth }) => {
    const { props } = usePage();
    const { positions } = props; // Get positions data from the backend

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingPosition, setEditingPosition] = useState(null);

    const handleAddOrEdit = (values) => {
        if (editingPosition) {
            Inertia.put(`/hr/positions/${editingPosition.id}`, values, {
                onSuccess: () => {
                    message.success('Position updated successfully');
                    closeModal();
                },
                onError: () => message.error('Failed to update position'),
            });
        } else {
            Inertia.post('/hr/positions', values, {
                onSuccess: () => {
                    message.success('Position added successfully');
                    closeModal();
                },
                onError: () => message.error('Failed to add position'),
            });
        }
    };

    const handleDelete = (id) => {
        Inertia.delete(`/hr/positions/${id}`, {
            onSuccess: () => message.success('Position deleted successfully'),
            onError: () => message.error('Failed to delete position'),
        });
    };

    const openModal = (position = null) => {
        setEditingPosition(position);
        form.setFieldsValue(position || { name: '', description: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        form.resetFields();
        setEditingPosition(null);
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <PrimaryButton onClick={() => openModal(record)} style={{ marginRight: 8 }}>
                        Edit
                    </PrimaryButton>
                    <DangerButton danger onClick={() => handleDelete(record.id)}>
                        Delete
                    </DangerButton>
                </>
            ),
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <PrimaryButton type="primary" onClick={() => openModal()} style={{ marginBottom: 16 }}>
                Add Position
            </PrimaryButton>
            <Table columns={columns} dataSource={positions} rowKey="id" />

            <Modal
                title={editingPosition ? 'Edit Position' : 'Add Position'}
                open={isModalOpen}
                onCancel={closeModal}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleAddOrEdit}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input the position name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </AuthenticatedLayout>
    );
};

export default Positions;
