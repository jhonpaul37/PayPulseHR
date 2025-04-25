import React, { useState } from 'react';
import { Table, Input } from 'antd';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Helper for PHP format
const PhpFormat = (value) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(value);
};

const FinalPayroll = ({ auth, transaction, data, loanTypes, benefit, contribution }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const printPayroll = () => {
        const printableContent = document.getElementById('printable-area').innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printableContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
    };

    // Dynamically build columns (loan, benefit, contribution) like in your original code
    const loanColumns = (loanTypes || []).map((loanType) => ({
        title: `${loanType.type.toUpperCase()}`,
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

    const contributionColumns = (contribution || []).map((contribution) => ({
        title: `${contribution.name}`,
        render: (_, record) => {
            const contributionEntry = record.contributions.find(
                (c) => c.contribution_id === contribution.id
            );
            return PhpFormat(contributionEntry ? contributionEntry.amount : 0);
        },
        width: 200,
    }));
    console.log(data);

    const columns = [
        {
            title: 'EMPLOYEE NO',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: 'EMPLOYEE NAME',
            // dataIndex: 'name',
            render: (_, record) =>
                `${record.employee?.first_name || ''} ${record.employee?.last_name || ''}`,
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
        ...grossIncomeColumns.slice(0, 2),
        {
            title: 'NET PERA',
            dataIndex: 'net_pera',
            render: (value) => <span className="font-bold">{PhpFormat(value || 0)}</span>,
            width: 150,
        },
        ...grossIncomeColumns.slice(2),
        {
            title: 'TOTAL',
            dataIndex: 'total_salary',
            render: (value) => <span className="font-bold">{PhpFormat(value || 0)}</span>,
            width: 150,
        },
        ...contributionColumns,
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

    // 🔍 FILTER data based on search
    const filteredData = data.filter((item) => {
        const fullName =
            `${item.employee?.first_name || ''} ${item.employee?.last_name || ''}`.toLowerCase();
        const search = searchTerm.toLowerCase();
        return item.id.toString().includes(search) || fullName.includes(search);
    });

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

                <div className="flex items-center justify-between pb-4">
                    <div>
                        <Input
                            placeholder="Search Employee No or Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            allowClear
                            style={{ width: 300 }}
                        />
                    </div>
                    <PrimaryButton onClick={printPayroll} className="rounded px-4 py-2">
                        Print Payroll
                    </PrimaryButton>
                </div>

                <div id="printable-area">
                    <h2 className="pb-10 text-center text-2xl font-bold">Final Payroll</h2>
                    <div className="pb-4 text-center font-semibold text-blue-600">
                        Reference Number: {transaction.reference_number}
                    </div>
                    <Table
                        dataSource={filteredData}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                        scroll={false}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default FinalPayroll;
