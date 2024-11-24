import React from 'react';
import { Button, Table, Space } from 'antd';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Index = ({ salaryGrades, auth }) => {
    const columns = [
        {
            title: 'Grade',
            dataIndex: 'grade',
            key: 'grade',
        },
        {
            title: 'Step',
            dataIndex: 'step',
            key: 'step',
        },
        {
            title: 'Monthly Salary',
            dataIndex: 'monthly_salary',
            key: 'monthly_salary',
            render: (text) => `$${text}`,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Link href={`/salary_grades/${record.id}/edit`}>
                        <Button>Edit</Button>
                    </Link>
                    {/* <Link href={`/salary_grades/${record.id}`} method="delete">
                        <Button type="danger">Delete</Button>
                    </Link> */}
                </Space>
            ),
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="container mx-auto p-6">
                <Link href="/salary_grades/create">
                    {/* <Button type="primary" className="mb-4">
                        Create New Salary Grade
                    </Button> */}
                </Link>
                <Table dataSource={salaryGrades} columns={columns} rowKey="id" />
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
