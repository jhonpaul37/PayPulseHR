import React from 'react';
import { Table, Button } from 'antd';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const UnassignedUsers = ({ auth, users }) => {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button type="primary" onClick={() => handleAssignDetails(record.id)}>
                    Assign Employee Info
                </Button>
            ),
        },
    ];

    const handleAssignDetails = (userId) => {
        Inertia.visit(`/admin/employees/create/${userId}`, {
            method: 'get',
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div>
                <div className="flex justify-center pb-5 text-xl font-bold">Unassigned Users</div>
                <Table dataSource={users} columns={columns} rowKey="id" />
            </div>
        </AuthenticatedLayout>
    );
};

export default UnassignedUsers;
