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
        // Benefit Columns (specific columns for PERA, LWOP-PERA, RATA, and SALARY DIFFERENTIAL)
        const specificBenefitColumns = [
            {
                title: 'PERA',
                render: (_, record) => {
                    const benefit = record.benefits?.find((b) => b.name === 'PERA');
                    return benefit ? PhpFormat(benefit.pivot.amount || 0) : '₱0.00';
                },
                width: 150,
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
                    return (
                        <span className="font-semibold text-green-600">{PhpFormat(netPera)}</span>
                    );
                },
                width: 150,
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
        ];

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
                title: 'NET BASIC',
                render: (_, record) => (
                    <span className="font-semibold text-blue-600">
                        {PhpFormat(record.net_basic || 0)}
                    </span>
                ),
                width: 150,
            },
        ];
        const totalColumn = {
            title: 'TOTAL',
            render: (_, record) => {
                const netBasic = record.net_basic || 0;
                const pera = record.benefits?.find((b) => b.name === 'PERA')?.pivot.amount || 0;
                const lwopPera =
                    record.benefits?.find((b) => b.name === 'LWOP-PERA')?.pivot.amount || 0;
                const netPera = pera - lwopPera;
                const rata = record.benefits?.find((b) => b.name === 'RATA')?.pivot.amount || 0;
                const salaryDifferential =
                    record.benefits?.find((b) => b.name === 'SALARY DIFFERENTIAL')?.pivot.amount ||
                    0;

                const total = netBasic + netPera + rata + salaryDifferential;

                return <span className="font-semibold text-red-600">{PhpFormat(total)}</span>;
            },
            width: 150,
        };

        // Combine all columns
        setColumns([...staticColumns, ...specificBenefitColumns, totalColumn]);
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
