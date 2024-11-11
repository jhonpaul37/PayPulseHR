import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Format PHP Peso
const PhpFormat = (value) => {
    const num = parseFloat(value);
    return isNaN(num)
        ? ''
        : `₱${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const PayrollData = ({ auth, employee, loanTypes }) => {
    const [dataSource, setDataSource] = useState(employee);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        // Get a list of all loan types that have at least one existing loan
        const activeLoanTypes = loanTypes.filter((loanType) =>
            employee.some((emp) => emp.loans.some((loan) => loan.loan_type_id === loanType.id))
        );

        const loanTypeColumns = activeLoanTypes.map((loanType) => ({
            title: loanType.type,
            dataIndex: `loan_type_${loanType.id}`,
            render: (_, record) => {
                const loan = record.loans?.find((loan) => loan.loan_type_id === loanType.id);
                return loan && loan.remainingAmortization > 0
                    ? PhpFormat(loan.remainingAmortization)
                    : ''; // Show empty if no remaining amortization
            },
        }));

        const staticColumns = [
            {
                title: 'EMPLOYEE NO',
                dataIndex: 'employee_id',
            },
            {
                title: 'EMPLOYEE NAME',
                render: (_, record) => {
                    const { first_name, middle_name, last_name } = record;
                    return `${first_name || ''} ${middle_name || ''} ${last_name || ''}`.trim();
                },
            },
            {
                title: 'SG',
                render: (_, record) => {
                    const { salary_grade } = record;
                    return salary_grade ? `${salary_grade.grade}` : '';
                },
            },
            {
                title: 'STEP',
                render: (_, record) => {
                    const { salary_grade } = record;
                    return salary_grade ? `${salary_grade.step}` : '';
                },
            },
            {
                title: 'SG-STEP',
                render: (_, record) => {
                    const { salary_grade } = record;
                    return salary_grade ? `${salary_grade.grade}-${salary_grade.step}` : '';
                },
            },
            {
                title: 'POSITION',
                dataIndex: 'position',
            },
            {
                title: 'BASIC PAY',
                dataIndex: ['salary_grade', 'monthly_salary'],
                render: PhpFormat,
            },
        ];

        setColumns([...staticColumns, ...loanTypeColumns]);
    }, [loanTypes, employee]);

    // Handle table cell edits
    const handleTableChange = (pagination, filters, sorter) => {
        // Add any required sorting, filtering, or pagination actions here
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <h2>Payroll Data</h2>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey="employee_id"
                pagination={{
                    pageSize: 15,
                    pageSizeOptions: [15, 20, 50, 100],
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
                scroll={{ y: 485 }}
            />
        </AuthenticatedLayout>
    );
};

export default PayrollData;
