import { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Table, Button, Select } from 'antd';

const PermissionsPage = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        // Fetch users, roles, and permissions from your backend
        Inertia.get('/api/users').then((response) => setUsers(response.data));
        Inertia.get('/api/roles').then((response) => setRoles(response.data));
        Inertia.get('/api/permissions').then((response) => setPermissions(response.data));
    }, []);

    const assignPermission = (userId, roleId, permissionId) => {
        Inertia.post('/api/assign-permission', {
            user_id: userId,
            role_id: roleId,
            permission_id: permissionId,
        });
    };

    return (
        <div>
            <h1>Assign Roles and Permissions</h1>
            <Table
                dataSource={users}
                columns={[
                    { title: 'Name', dataIndex: 'name', key: 'name' },
                    { title: 'Role', dataIndex: 'role', key: 'role' },
                    { title: 'Permission', dataIndex: 'permission', key: 'permission' },
                    {
                        title: 'Assign Permission',
                        render: (text, record) => (
                            <div>
                                <Select
                                    style={{ width: 120 }}
                                    placeholder="Role"
                                    onChange={(roleId) => assignPermission(record.id, roleId, null)}
                                >
                                    {roles.map((role) => (
                                        <Select.Option key={role.id} value={role.id}>
                                            {role.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                                <Select
                                    style={{ width: 120 }}
                                    placeholder="Permission"
                                    onChange={(permissionId) =>
                                        assignPermission(record.id, null, permissionId)
                                    }
                                >
                                    {permissions.map((permission) => (
                                        <Select.Option key={permission.id} value={permission.id}>
                                            {permission.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default PermissionsPage;
