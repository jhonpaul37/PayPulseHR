import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Format PHP Peso
const PhpFormat = (value) => {
    const num = parseFloat(value);
    return isNaN(num)
        ? '₱0.00'
        : `₱${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const PayrollData = ({ auth, employee, loanTypes, benefits }) => {
    const [dataSource, setDataSource] = useState(employee);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        // Loan Type Columns (include all loan types, even without loans)
        const loanTypeColumns = loanTypes.map((loanType) => ({
            title: loanType.type,
            dataIndex: `loan_type_${loanType.id}`,
            render: (_, record) => {
                const loan = record.loans?.find((loan) => loan.loan_type_id === loanType.id);
                return loan ? PhpFormat(loan.remainingAmortization || 0) : '₱0.00';
            },
            width: 150,
        }));

        // Benefit Columns (display all benefits and their amounts for employees)
        const benefitColumns = benefits.map((benefit) => ({
            title: benefit.name,
            dataIndex: `benefit_${benefit.id}`,
            render: (_, record) => {
                // Match benefit data with employee benefits
                const employeeBenefit = record.benefits?.find((b) => b.id === benefit.id);
                return employeeBenefit
                    ? PhpFormat(employeeBenefit.pivot.amount || 0) //benefit amount
                    : '₱0.00'; // Default
            },
            width: 150,
        }));

        // Static Columns
        const staticColumns = [
            {
                title: 'EMPLOYEE NO',
                dataIndex: 'employee_id',
                width: 120,
            },
            {
                title: 'EMPLOYEE NAME',
                render: (_, record) => {
                    const { first_name, middle_name, last_name } = record;
                    return `${first_name || ''} ${middle_name || ''} ${last_name || ''}`.trim();
                },
                width: 200,
            },
            {
                title: 'DEPARTMENT',
                render: (_, record) => {
                    const { department } = record;
                    return `${department || ''}`.trim();
                },
                width: 150,
            },
            {
                title: 'SG',
                render: (_, record) => {
                    const { salary_grade } = record;
                    return salary_grade ? `${salary_grade.grade}` : '';
                },
                width: 100,
            },
            {
                title: 'STEP',
                render: (_, record) => {
                    const { salary_grade } = record;
                    return salary_grade ? `${salary_grade.step}` : '';
                },
                width: 100,
            },
            {
                title: 'SG-STEP',
                render: (_, record) => {
                    const { salary_grade } = record;
                    return salary_grade ? `${salary_grade.grade}-${salary_grade.step}` : '';
                },
                width: 100,
            },
            {
                title: 'POSITION',
                dataIndex: 'position',
                width: 150,
            },
            {
                title: 'GSIS(6th)',

                width: 150,
            },
            {
                title: 'BASIC PAY',
                dataIndex: ['salary_grade', 'monthly_salary'],
                render: PhpFormat,
                width: 150,
            },
            {
                title: 'LWOP-Basic',
                width: 150,
            },
            {
                title: 'NET BASIC',
                dataIndex: ['salary_grade', 'monthly_salary'],
                render: PhpFormat,
                width: 150,
            },
            {
                title: 'NET PERA',
                render: (_, record) => (
                    <span className="font-semibold text-green-600">
                        {PhpFormat(record.net_pera || 0)}
                    </span>
                ),
                width: 150,
            },
            {
                title: 'TOTAL',
                render: (_, record) => (
                    <span className="font-semibold text-red-600">
                        {PhpFormat(record.total || 0)}
                    </span>
                ),
                width: 150,
            },
        ];

        // Combine all columns
        setColumns([...staticColumns, ...loanTypeColumns, ...benefitColumns]);
    }, [loanTypes, benefits, employee]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <h2 className="text-2xl font-bold">Payroll Data</h2>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey="employee_id"
                scroll={{
                    x: 'max-content',
                    y: 485,
                }}
            />
        </AuthenticatedLayout>
    );
};

export default PayrollData;
