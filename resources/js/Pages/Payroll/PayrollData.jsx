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
    const [dataSource, setDataSource] = useState(employee);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        // loan columns for all loan types
        const loanColumns = loanTypes.map((loanType) => ({
            title: loanType.type.toUpperCase(),
            render: (_, record) => {
                const loan = record.loans?.find((loan) => loan.loan_type_id === loanType.id);
                if (loan) {
                    return loan.remainingAmortization && loan.remainingAmortization > 0
                        ? PhpFormat(loan.remainingAmortization)
                        : ''; // empty if no remaining amortization
                }
                return ''; // no loan, return empty
            },
            width: 150,
        }));

        // "Loans Total" column
        // const loansTotalColumn = {
        //     title: 'LOANS TOTAL',
        //     render: (_, record) => {
        //         const totalLoans = record.loans?.reduce(
        //             (sum, loan) => sum + (loan.remainingAmortization || 0),
        //             0
        //         );
        //         return <span className="font-semibold">{PhpFormat(totalLoans || 0)}</span>;
        //     },
        //     width: 150,
        //     className: 'bg-yellow-400',
        // };

        // const PATVEColumn = {
        //     title: 'PATVE CONT.',
        //     render: (_, record) => {
        //         const contribution = record.contributions?.find((c) => c.name === 'PATVE CONT.');
        //         return contribution ? PhpFormat(contribution.pivot.amount || 0) : ' ';
        //     },
        //     width: 150,
        //     className: 'bg-yellow-300',
        // };

        // Static columns
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
            // {
            //     title: 'DEPARTMENT',
            //     render: (_, record) => {
            //         const { department } = record;
            //         return `${department || ''}`.trim();
            //     },
            //     width: 150,
            // },
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
                render: (_, record) => {
                    const monthlySalary = record.salary_grade?.monthly_salary || 0;
                    return <span className="font-semibold">{PhpFormat(monthlySalary)}</span>;
                },
                width: 150,
                className: 'bg-yellow-400',
            },
            {
                title: 'PERA',
                render: (_, record) => {
                    const benefit = record.benefits?.find((b) => b.name === 'PERA');
                    return benefit ? PhpFormat(benefit.pivot.amount || 0) : '';
                },
            },
            // {
            //     title: 'LWOP-Basic',
            //     width: 150,
            // },
        ];

        // Gross income
        const BenefitColumns = [
            {
                title: 'LWOP-PERA',
                render: (_, record) => {
                    const benefit = record.benefits?.find((b) => b.name === 'LWOP-PERA');
                    return benefit ? PhpFormat(benefit.pivot.amount || 0) : '';
                },
                width: 150,
            },
            {
                title: 'NET PERA',
                render: (_, record) => {
                    return <span className="font-semibold">{PhpFormat(record.net_pera)}</span>;
                },
                width: 150,
                className: 'bg-yellow-400',
            },
            {
                title: 'RATA',
                render: (_, record) => {
                    const benefit = record.benefits?.find((b) => b.name === 'RATA');
                    return benefit ? PhpFormat(benefit.pivot.amount || 0) : ' ';
                },
                width: 150,
            },
            // {
            //     title: 'SALARY DIFFERENTIAL',
            //     render: (_, record) => {
            //         const benefit = record.benefits?.find((b) => b.name === 'SALARY DIFFERENTIAL');
            //         return benefit ? PhpFormat(benefit.pivot.amount || 0) : ' ';
            //     },
            //     width: 150,
            // },
            // {
            //     title: 'TOTAL',
            //     render: (_, record) => (
            //         <span className="font-semibold">{PhpFormat(record.total_salary || 0)}</span>
            //     ),
            //     width: 150,
            //     className: 'bg-yellow-400',
            // },
        ];

        // Deductions
        const ContributionColumns = [
            {
                title: 'TAX',
                render: (_, record) => {
                    const contribution = record.contributions?.find((c) => c.name === 'TAX');
                    return contribution ? PhpFormat(contribution.pivot.amount || 0) : ' ';
                },
                width: 150,
            },
            {
                title: 'GSIS PREM',
                render: (_, record) => {
                    const contribution = record.contributions?.find((c) => c.name === 'GSIS PREM');
                    return contribution ? PhpFormat(contribution.pivot.amount || 0) : ' ';
                },
                width: 150,
            },
            {
                title: 'HDMF PREM1',
                render: (_, record) => {
                    const contribution = record.contributions?.find((c) => c.name === 'HDMF PREM1');
                    return contribution ? PhpFormat(contribution.pivot.amount || 0) : ' ';
                },
                width: 150,
            },
            {
                title: 'PHIC',
                render: (_, record) => {
                    const contribution = record.contributions?.find((c) => c.name === 'PHIC');
                    return contribution ? PhpFormat(contribution.pivot.amount || 0) : ' ';
                },
                width: 150,
            },
            // {
            //     title: 'BIR GSIS PHIC HDMF TOTAL',
            //     dataIndex: 'total_contributions',
            //     render: PhpFormat,
            //     width: 150,
            //     className: 'bg-yellow-400',
            // },
        ];

        // Total Deduction
        // const totalDeductionColumn = {
        //     title: 'TOTAL DEDUCTION',
        //     render: (_, record) => {
        //         return (
        //             <span className="font-semibold">{PhpFormat(record.total_deductions || 0)}</span>
        //         );
        //     },
        //     width: 200,
        //     className: 'bg-orange-400 ',
        // };

        // Net Amont
        const NetAmountColumn = {
            title: 'Net Amount',
            render: (_, record) => {
                return <span className="font-semibold">{PhpFormat(record.net_amount || 0)}</span>;
            },
            width: 200,
            // className: 'bg-red-400 ',
        };

        // const NetPay1To15Column = [
        //     {
        //         title: 'Net Pay 1-15',
        //         render: (_, record) => {
        //             return <span className="font-semibold">{PhpFormat(record.net_pay || 0)}</span>;
        //         },
        //         width: 200,
        //         className: 'bg-green-200',
        //     },
        //     {
        //         title: 'Net Pay 16-30',
        //         render: (_, record) => {
        //             return <span className="font-semibold">{PhpFormat(record.net_pay || 0)}</span>;
        //         },
        //         width: 200,
        //         className: 'bg-green-300',
        //     },
        // ];

        // Combine all columns
        setColumns([
            ...staticColumns,
            ...BenefitColumns,
            ...ContributionColumns,
            ...loanColumns,
            // PATVEColumn,
            // loansTotalColumn,
            // totalDeductionColumn,
            NetAmountColumn,
            // ...NetPay1To15Column,
        ]);
    }, [loanTypes, employee]);

    const saveTransaction = () => {
        const dataToSend = dataSource.map((employee) => ({
            id: employee.id,
            loans: employee.loans.map((loan) => ({
                loan_id: loan.id,
                remaining_amortization: loan.remainingAmortization, // Include this value
            })),
        }));

        Inertia.post('/transactions', {
            data: dataToSend, // Send data with remaining_amortization
        });
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
