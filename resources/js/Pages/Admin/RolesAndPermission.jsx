import { useState } from 'react';
import { Button, Checkbox, Form, Select, Row, Col, Card } from 'antd';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const RolePermissionIndex = ({ auth, permissions, users }) => {
    console.log(users);
    return (
        <AuthenticatedLayout user={auth.user}>
            <div>
                <h1>Assign Roles and Permissions</h1>
            </div>
        </AuthenticatedLayout>
    );
};

export default RolePermissionIndex;
