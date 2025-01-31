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

const FinalPayroll = ({ auth, transaction, data, loanTypes, benefit, contribution }) => {
    const printPayroll = () => {
        const printableContent = document.getElementById('printable-area').innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printableContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
    };
    // console.log()

    const loanColumns = (loanTypes || []).map((loanType) => ({
        title: `${loanType.type.toUpperCase()}`,
        // title: `${loanType.type.toUpperCase()} (ID: ${loanType.id})`,
        render: (_, record) => {
            const loan = record.loans.find((loan) => loan.loan_id === loanType.id);
            return PhpFormat(loan ? loan.remaining_amortization : 0);
        },
        width: 150,
    }));

    const grossIncomeColumns = (benefit || []).map((benefit) => ({
        title: `${benefit.name}`,
        render: (_, record) => {
            const benefitEntry = record.benefits.find((b) => b.benefit_id === benefit.id);
            return PhpFormat(benefitEntry ? benefitEntry.amount : 0);
        },
        width: 200,
    }));

    const ContributionColumns = (contribution || []).map((contribution) => ({
        title: `${contribution.name}`,
        // title: `${contribution.name} (ID: ${contribution.id})`,
        render: (_, record) => {
            const contributionEntry = record.contributions.find(
                (c) => c.contribution_id === contribution.id
            );
            return PhpFormat(contributionEntry ? contributionEntry.amount : 0);
        },
        width: 200,
    }));

    // Base columns
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
            title: 'BASIC PAY',
            dataIndex: 'monthly_salary',
            render: (value) => PhpFormat(value || 0),
            width: 150,
        },
        {
            title: 'NET-BASIC',
            dataIndex: 'monthly_salary',
            render: (value) => <span className="font-bold">{PhpFormat(value || 0)}</span>,
            width: 150,
        },
        ...grossIncomeColumns.slice(0, 2), // NET BASIC
        {
            title: 'NET PERA',
            dataIndex: 'net_pera',
            render: (value) => <span className="font-bold">{PhpFormat(value || 0)}</span>,
            width: 150,
        },
        ...grossIncomeColumns.slice(2), // RATA, SALARY DIFFERENTIAL,
        {
            title: 'TOTAL',
            dataIndex: 'total_salary',
            render: (value) => <span className="font-bold">{PhpFormat(value || 0)}</span>,
            width: 150,
        },
        ...ContributionColumns,
        {
            title: 'BIR GSIS PHIC HDMF TOTAL',
            dataIndex: 'total_contributions',
            render: (value) => <span className="font-bold">{PhpFormat(value || 0)}</span>,
            width: 150,
        },
        ...loanColumns,
        {
            title: 'LOANS TOTAL',
            dataIndex: 'total_loans',
            render: (value) => <span className="font-bold">{PhpFormat(value || 0)}</span>,
            width: 150,
        },
        {
            title: 'TOTAL DEDUCTIONS',
            dataIndex: 'total_deductions',
            render: (value) => <span className="font-bold">{PhpFormat(value || 0)}</span>,
            width: 150,
        },
        {
            title: 'NET AMOUNT',
            dataIndex: 'net_amount',
            render: (value) => <span className="font-bold">{PhpFormat(value || 0)}</span>,
            width: 150,
        },
    ];

    console.log(data);

    return (
        <AuthenticatedLayout user={auth.user}>
            <div>
                <style>{`
                        @media print {
                            @page {
                                size: landscape;
                            }
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
