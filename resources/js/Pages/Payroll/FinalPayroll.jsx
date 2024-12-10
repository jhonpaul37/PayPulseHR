import React from 'react';
import { Table } from 'antd';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Helper function for PHP-style formatting
const PhpFormat = (value) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(value);
};

const FinalPayroll = ({ auth, transaction, data, loanTypes }) => {
    const printPayroll = () => {
        window.print();
    };

    // Helper function to format the loan data for each loan type
    const getLoanAmount = (loans, loanTypeId) => {
        const loan = loans.find((loan) => loan.loan_id === loanTypeId);
        return loan ? PhpFormat(loan.remaining_amortization || 0) : ''; // If loan exists, format remaining amortization, else return empty string
    };
    console.log(data);

    // Create loan columns dynamically based on loanTypes
    const loanColumns = loanTypes.map((loanType) => ({
        title: loanType.type.toUpperCase(),
        // Render the loan data by matching the loan type
        render: (_, record) => getLoanAmount(record.loans, loanType.id),
        width: 150,
    }));

    const columns = [
        {
            title: 'EMPLOYEE NO',
            dataIndex: 'id',
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
        //     title: 'TOTAL SALARY',
        //     dataIndex: 'total_salary',
        //     render: (value) => PhpFormat(value || 0),
        //     width: 150,
        // },
        // {
        //     title: 'TOTAL DEDUCTIONS',
        //     dataIndex: 'total_deductions',
        //     render: (value) => PhpFormat(value || 0),
        //     width: 150,
        // },
        {
            title: 'NET PAY',
            dataIndex: 'net_amount',
            render: (value) => PhpFormat(value || 0),
            width: 150,
        },
        {
            title: 'Deductions',
            dataIndex: 'contributions',
            render: (value) =>
                value
                    .map(
                        (contribution) =>
                            `ID: ${contribution.contribution_id} - ₱${PhpFormat(contribution.amount)}`
                    )
                    .join(', '),
            width: 200,
        },
        {
            title: 'Gross Income',
            dataIndex: 'benefits',
            render: (value) =>
                value
                    .map((benefit) => `ID: ${benefit.benefit_id} - ₱${PhpFormat(benefit.amount)}`)
                    .join(', '),
            width: 200,
        },
        {
            title: 'Loans',
            dataIndex: 'loans', // Access the loans array
            render: (loans) =>
                loans
                    .map(
                        (loan) => `ID: ${loan.loan_id} - ₱${PhpFormat(loan.remaining_amortization)}`
                    )
                    .join(', '),
            width: 200,
        },

        // Include dynamically generated loan columns here
        ...loanColumns,
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <h2 className="pb-10 text-center text-2xl font-bold">Final Payroll</h2>
            <div className="pb-4 text-center font-semibold text-blue-600">
                Reference Number: {transaction.reference_number}
            </div>
            <Table dataSource={data} columns={columns} rowKey="id" scroll={{ x: 'max-content' }} />
            <div className="flex justify-end pt-5">
                <PrimaryButton onClick={printPayroll} className="rounded px-4 py-2">
                    Print Payroll
                </PrimaryButton>
            </div>
        </AuthenticatedLayout>
    );
};

export default FinalPayroll;
