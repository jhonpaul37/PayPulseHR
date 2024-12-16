import React, { useState } from 'react';
import { Select, Button, message, Table, Divider } from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';

const Roles = ({ auth, employees, success }) => {
    const [selectedRoles, setSelectedRoles] = useState({});

    const handleRoleChange = (employeeId, role) => {
        setSelectedRoles({
            ...selectedRoles,
            [employeeId]: role,
        });
    };

    const handleAssignRoles = () => {
        // Send the selected roles to the backend via Inertia
        Inertia.post('/assign-roles', { roles: selectedRoles });
    };

    // If there's a success message, show it
    if (success) {
        message.success(success);
    }

    // Check if employees exist
    if (!employees || employees.length === 0) {
        return <div>No employees found.</div>;
    }

    // Columns for the table
    const columns = [
        {
            title: 'Employee Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => `${record.first_name} ${record.last_name}`,
        },
        {
            title: 'Current Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => role,
        },
        {
            title: 'Assign Role',
            dataIndex: 'assign_role',
            key: 'assign_role',
            render: (text, record) => (
                <Select
                    value={selectedRoles[record.id] || record.role} // Default to current role
                    onChange={(role) => handleRoleChange(record.id, role)}
                    style={{ width: 120 }}
                >
                    <Select.Option value="employee">Employee</Select.Option>
                    <Select.Option value="Accounting">Accounting</Select.Option>
                    <Select.Option value="Cashier">Cashier</Select.Option>
                    <Select.Option value="HR">HR</Select.Option>
                    <Select.Option value="SuperAdmin">SuperAdmin</Select.Option>
                </Select>
            ),
        },
    ];

    // Data for the table
    const data = employees.map((employee) => ({
        key: employee.id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        role: employee.role,
        id: employee.id,
    }));

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="container mx-auto p-4">
                <div className="pb-5 text-center text-xl font-bold">Assign Roles</div>

                <Divider />

                <Table columns={columns} dataSource={data} pagination={false} rowKey="id" />

                <div className="mt-5 text-center">
                    <Button type="primary" size="large" onClick={handleAssignRoles}>
                        Assign Roles
                    </Button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Roles;
