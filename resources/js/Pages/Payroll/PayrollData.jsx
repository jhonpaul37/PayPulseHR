import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Table } from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Format PHP Peso
const PhpFormat = (value) => {
    const num = parseFloat(value);
    return isNaN(num)
        ? '₱0.00'
        : `₱${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const PayrollData = ({ auth, employee, loanTypes, message, reference_number }) => {
    const [dataSource, setDataSource] = useState(employee || []);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        const loanColumns = loanTypes.map((loanType) => ({
            title: loanType.type.toUpperCase(),
            render: (_, record) => {
                const loan = record.loans?.find((loan) => loan.loan_type_id === loanType.id);
                return loan ? PhpFormat(loan.remainingAmortization || 0) : '';
            },
            width: 150,
        }));

        const staticColumns = [
            {
                title: 'EMPLOYEE NO',
                dataIndex: 'employee_id',
                width: 120,
            },
            {
                title: 'EMPLOYEE NAME',
                render: (_, record) =>
                    `${record.first_name} ${record.middle_name || ''} ${record.last_name}`,
                width: 200,
            },
            {
                title: 'DEPARTMENT',
                render: (_, record) => record.department || '',
                width: 150,
            },
            {
                title: 'SG-STEP',
                render: (_, record) =>
                    record.salary_grade
                        ? `${record.salary_grade.grade}-${record.salary_grade.step}`
                        : '',
                width: 100,
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
                    <span className="font-semibold">
                        {PhpFormat(record.salary_grade?.monthly_salary || 0)}
                    </span>
                ),
                width: 150,
                className: 'bg-yellow-400',
            },
        ];

        setColumns([...staticColumns, ...loanColumns]);
    }, [loanTypes]);

    const saveTransaction = () => {
        const dataToSend = dataSource.map((employee) => ({
            id: employee.id,
            loans: employee.loans.map((loan) => ({
                loan_id: loan.id,
                remaining_amortization: loan.remainingAmortization,
            })),
        }));

        Inertia.post('/transactions', { data: dataToSend });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <h2 className="pb-10 text-center text-2xl font-bold">Payroll Data</h2>
            {message && (
                <div className="pb-4 text-center font-semibold text-green-600">{message}</div>
            )}
            {reference_number && (
                <div className="pb-4 text-center font-semibold text-blue-600">
                    Transaction Reference: {reference_number}
                </div>
            )}
            <div className="flex justify-end pb-5">
                <button
                    onClick={saveTransaction}
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Save Transaction
                </button>
            </div>
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
