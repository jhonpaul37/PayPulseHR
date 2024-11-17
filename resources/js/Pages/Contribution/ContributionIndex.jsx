import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Table, Button, Space, message } from 'antd';

export default function ContributionsIndex({ contributions }) {
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
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (text) => `$${parseFloat(text).toFixed(2)}`,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button onClick={() => Inertia.get(`/contributions/${record.id}/edit`)}>
                        Edit
                    </Button>
                    <Button danger onClick={() => handleDelete(record.id)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this contribution?')) {
            Inertia.delete(`/contributions/${id}`, {
                onSuccess: () => message.success('Contribution deleted successfully'),
            });
        }
    };

    return (
        <div>
            <Button type="primary" onClick={() => Inertia.get('/contributions/create')}>
                Add Contribution
            </Button>
            <Table dataSource={contributions} columns={columns} rowKey="id" />
        </div>
    );
}
