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
                render: (_, record) => {
                    const monthlySalary = record.salary_grade?.monthly_salary || 0;
                    return <span className="font-semibold">{PhpFormat(monthlySalary)}</span>;
                },
                width: 150,
                className: 'bg-yellow-400',
            },
        ];

        const BenefitColumns = [
            {
                title: 'PERA',
                render: (_, record) => {
                    const benefit = record.benefits?.find((b) => b.name === 'PERA');
                    return benefit ? PhpFormat(benefit.pivot.amount || 0) : '₱0.00';
                },
            },
            {
                title: 'LWOP-PERA',
                render: (_, record) => {
                    const benefit = record.benefits?.find((b) => b.name === 'LWOP-PERA');
                    return benefit ? PhpFormat(benefit.pivot.amount || 0) : '₱0.00';
                },
                width: 150,
            },
            {
                title: 'NET PERA',
                render: (_, record) => {
                    const pera = record.benefits?.find((b) => b.name === 'PERA')?.pivot.amount || 0;
                    const lwopPera =
                        record.benefits?.find((b) => b.name === 'LWOP-PERA')?.pivot.amount || 0;
                    const netPera = pera - lwopPera;
                    return <span className="font-semibold">{PhpFormat(netPera)}</span>;
                },
                width: 150,
                className: 'bg-yellow-400',
            },
            {
                title: 'RATA',
                render: (_, record) => {
                    const benefit = record.benefits?.find((b) => b.name === 'RATA');
                    return benefit ? PhpFormat(benefit.pivot.amount || 0) : '₱0.00';
                },
                width: 150,
            },
            {
                title: 'SALARY DIFFERENTIAL',
                render: (_, record) => {
                    const benefit = record.benefits?.find((b) => b.name === 'SALARY DIFFERENTIAL');
                    return benefit ? PhpFormat(benefit.pivot.amount || 0) : '₱0.00';
                },
                width: 150,
            },
            {
                title: 'TOTAL',
                render: (_, record) => (
                    <span className="font-semibold">{PhpFormat(record.total || 0)}</span>
                ),
                width: 150,
                className: 'bg-yellow-400',
            },
        ];

        const ContributionColumns = [
            {
                title: 'TAX',
                render: (_, record) => {
                    const contribution = record.contributions?.find((c) => c.name === 'TAX');
                    return contribution ? PhpFormat(contribution.pivot.amount || 0) : '₱0.00';
                },
                width: 150,
            },
            {
                title: 'GSIS PREM',
                render: (_, record) => {
                    const contribution = record.contributions?.find((c) => c.name === 'GSIS PREM');
                    return contribution ? PhpFormat(contribution.pivot.amount || 0) : '₱0.00';
                },
                width: 150,
            },
            {
                title: 'HDMF PREM1',
                render: (_, record) => {
                    const contribution = record.contributions?.find((c) => c.name === 'HDMF PREM1');
                    return contribution ? PhpFormat(contribution.pivot.amount || 0) : '₱0.00';
                },
                width: 150,
            },
            {
                title: 'PHIC',
                render: (_, record) => {
                    const contribution = record.contributions?.find((c) => c.name === 'PHIC');
                    return contribution ? PhpFormat(contribution.pivot.amount || 0) : '₱0.00';
                },
                width: 150,
            },
            {
                title: 'BIR GSIS PHIC HDMF TOTAL',
                dataIndex: 'total_deductions',
                render: PhpFormat,
                width: 150,
                className: 'bg-yellow-400',
            },
        ];
        // Combine all columns
        setColumns([...staticColumns, ...BenefitColumns, ...ContributionColumns, ...loanColumns]);
    }, [loanTypes, benefits, employee]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <h2 className="pb-10 text-center text-2xl font-bold">Payroll Data</h2>
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
