import React from 'react';
import { Table, Button } from 'antd';
import { Inertia } from '@inertiajs/inertia';

const UnassignedUsers = ({ users }) => {
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
        // Redirect to the form to assign employee details
        Inertia.visit(`/admin/employees/create/${userId}`, {
            method: 'get',
        });
    };

    return (
        <div>
            <h2>Unassigned Users</h2>
            <Table dataSource={users} columns={columns} rowKey="id" />
        </div>
    );
};

export default UnassignedUsers;
