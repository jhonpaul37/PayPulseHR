import React from 'react';
import { Table, Button } from 'antd';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';

const UnassignedUsers = ({ auth, users }) => {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <PrimaryButton type="primary" onClick={() => handleAssignDetails(record.id)}>
                    Assign Employee Info
                </PrimaryButton>
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
