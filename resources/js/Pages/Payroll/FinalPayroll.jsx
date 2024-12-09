import React from 'react';
import { Table } from 'antd';
import PrimaryButton from '@/Components/PrimaryButton';

// Helper function for PHP-style formatting
const PhpFormat = (value) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(value);
};

const FinalPayroll = ({ transaction, data }) => {
    const printPayroll = () => {
        window.print();
    };

    // Helper function to format the loan data
    const formatLoans = (loans) => {
        return loans.map((loan) => `${loan.loan_id}: ₱${loan.remaining_amortization}`).join(', ');
    };

    // Helper function to format the contributions data
    const formatContributions = (contributions) => {
        return contributions
            .map((contribution) => `${contribution.contribution_id}: ₱${contribution.amount}`)
            .join(', ');
    };

    // Helper function to format the benefits data
    const formatBenefits = (benefits) => {
        return benefits.map((benefit) => `${benefit.benefit_id}: ₱${benefit.amount}`).join(', ');
    };

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
        {
            title: 'TOTAL SALARY',
            dataIndex: 'total_salary',
            render: (value) => PhpFormat(value || 0),
            width: 150,
        },
        {
            title: 'TOTAL DEDUCTIONS',
            dataIndex: 'total_deductions',
            render: (value) => PhpFormat(value || 0),
            width: 150,
        },
        {
            title: 'NET PAY',
            dataIndex: 'net_amount',
            render: (value) => PhpFormat(value || 0),
            width: 150,
        },
        {
            title: 'LOANS',
            dataIndex: 'loans',
            render: (value) => formatLoans(value),
            width: 200,
        },
        {
            title: 'CONTRIBUTIONS',
            dataIndex: 'contributions',
            render: (value) => formatContributions(value),
            width: 200,
        },
        {
            title: 'BENEFITS',
            dataIndex: 'benefits',
            render: (value) => formatBenefits(value),
            width: 200,
        },
    ];

    return (
        <div>
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
        </div>
    );
};

export default FinalPayroll;
