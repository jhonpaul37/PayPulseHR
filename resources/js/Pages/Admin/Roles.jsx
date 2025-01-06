import React, { useState } from 'react';
import { Select, Input, message, Table, Divider } from 'antd';
import { SearchOutlined } from '@ant-design/icons'; // Importing the Search icon
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
import PrimaryButton from '@/Components/PrimaryButton';
import SearchInput from '@/Components/SearchInput';

const { Search } = Input;

const Roles = ({ auth, employees, success }) => {
    const [selectedRoles, setSelectedRoles] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    const handleRoleChange = (employeeId, role) => {
        setSelectedRoles({
            ...selectedRoles,
            [employeeId]: role,
        });
    };

    const handleAssignRoles = () => {
        Inertia.post('/assign-roles', { roles: selectedRoles });
    };

    if (success) {
        message.success(success);
    }

    const roleAccess = {
        Accounting: ['Voucher', 'Gross Earnings', 'Salary Grade', 'Deduction'],
        Cashier: ['Payroll', 'Loans'],
        HR: ['Employee Management', 'Leave Requests', 'Positions'],
        SuperAdmin: ['All Pages', 'Settings', 'Roles Management'],
        Employee: ['My Profile', 'Leave Application', 'Payslips'],
    };

    const filteredEmployees = employees.filter((employee) =>
        `${employee.first_name} ${employee.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

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
                    value={selectedRoles[record.id] || record.role}
                    onChange={(role) => handleRoleChange(record.id, role)}
                    style={{ width: 150 }}
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
    const data = filteredEmployees.map((employee) => ({
        key: employee.id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        role: employee.role,
        id: employee.id,
    }));

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="container mx-auto flex p-4">
                <div className="w-2/3 pr-4">
                    <div className="pb-5 text-center text-xl font-bold">Assign Roles</div>

                    <Divider />

                    <div className="mb-4 flex justify-end">
                        <SearchInput
                            placeholder="Search employees"
                            prefix={<SearchOutlined />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ maxWidth: 300 }}
                        />
                    </div>

                    <Table columns={columns} dataSource={data} pagination={false} rowKey="id" />

                    <div className="mt-5 flex justify-end pr-10">
                        <PrimaryButton type="primary" size="large" onClick={handleAssignRoles}>
                            Assign Roles
                        </PrimaryButton>
                    </div>
                </div>

                <div className="w-1/4 border-l pl-4">
                    <div className="pb-5 text-center text-xl font-bold">Role Access</div>

                    <Divider />

                    {Object.entries(roleAccess).map(([role, pages]) => (
                        <div key={role} className="mb-5">
                            <div className="font-bold">{role}</div>
                            <ul className="list-disc pl-5">
                                {pages.map((page, index) => (
                                    <li key={index}>{page}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Roles;
