import React, { useState } from 'react';
import { useRoute } from '@ziggy';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmployeeInfo from './EmployeeInfo';
import { Button, FloatButton as Btn } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const FloatButton = styled(Btn)`
    background-color: #f0c519 !important;
    color: #fff !important;
    width: 60px;
    height: 60px;
    font-size: 24px;
    position: fixed;
    bottom: 100px;
    right: 100px;
`;

export default function EmployeeList({ employees, auth }) {
    const route = useRoute();
    const [open, setOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const showDrawer = (employee) => {
        setSelectedEmployee(employee);
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        setSelectedEmployee(null);
    };

    const activeEmployees = employees.filter((employee) => !employee.termination_date);

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="border-b pb-6">
                <header className="flex justify-center text-xl font-bold">Employees List</header>
            </div>

            {/* Add BTN */}
            <FloatButton
                onClick={() => (window.location.href = route('employees.create'))}
                tooltip="Add New Employee"
                icon={<PlusOutlined />}
                className="border-high bg-high font-bold"
            />

            <div className="m-4 my-10">
                <div className="flex flex-col gap-5">
                    {activeEmployees.map((employee) => (
                        <div
                            key={employee.id}
                            className="flex w-full items-center justify-between rounded-lg border p-4 px-10 shadow-md"
                        >
                            <div className="flex items-center justify-center">
                                {/* Photo Section */}
                                {/* <div>
                                    <img
                                        src={employee.photo_url ? `/storage/${employee.photo_url}` : 'default-photo-url.jpg'}
                                        alt={`${employee.first_name}'s photo`}
                                        className="h-16 w-16 rounded-full border object-cover shadow-md"
                                    />
                                </div> */}
                                {/* Name and Position */}
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-main">
                                        {employee.first_name} {employee.middle_name}{' '}
                                        {employee.last_name}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        {employee.position}
                                    </span>
                                </div>
                            </div>

                            <div className="">
                                <Button onClick={() => showDrawer(employee)} type="primary">
                                    View Profile
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <EmployeeInfo visible={open} onClose={onClose} employee={selectedEmployee} />
        </AuthenticatedLayout>
    );
}
