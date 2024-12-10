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
        const printableContent = document.getElementById('printable-area').innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printableContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
    };

    const getLoanAmount = (loans, loanTypeId) => {
        const loan = loans.find((loan) => loan.loan_id === loanTypeId);
        return loan ? PhpFormat(loan.remaining_amortization || 0) : '';
    };

    const loanColumns = loanTypes.map((loanType) => ({
        title: loanType.type.toUpperCase(),
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
            dataIndex: 'name',
            width: 200,
        },
        {
            title: 'NET PAY',
            dataIndex: 'net_pay',
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
            dataIndex: 'loans',
            render: (loans) =>
                loans
                    .map(
                        (loan) => `ID: ${loan.loan_id} - ₱${PhpFormat(loan.remaining_amortization)}`
                    )
                    .join(', '),
            width: 200,
        },
        ...loanColumns,
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <div>
                <style>{`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #printable-area, #printable-area * {
                            visibility: visible;
                        }
                        #printable-area {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                        }
                        .ant-pagination {
                            display: none !important;
                        }
                        .ant-table-body {
                            overflow: visible !important;
                        }
                    }
                `}</style>
                <div id="printable-area">
                    <h2 className="pb-10 text-center text-2xl font-bold">Final Payroll</h2>
                    <div className="pb-4 text-center font-semibold text-blue-600">
                        Reference Number: {transaction.reference_number}
                    </div>
                    <Table
                        dataSource={data}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                        scroll={false}
                    />
                </div>
                <div className="flex justify-end pt-5">
                    <PrimaryButton onClick={printPayroll} className="rounded px-4 py-2">
                        Print Payroll
                    </PrimaryButton>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default FinalPayroll;
