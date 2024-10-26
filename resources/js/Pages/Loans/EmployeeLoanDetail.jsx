import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Table, Divider } from 'antd';
import React from 'react';

function EmployeeLoanDetail({ auth, employeeLoan = [], payments }) {
    // Cal total amount paid
    const totalPaid = payments.reduce((acc, payment) => acc + parseFloat(payment.amount), 0);
    const percentPaid =
        employeeLoan.amount > 0 ? ((totalPaid / employeeLoan.amount) * 100).toFixed(0) : 0;

    // Ant Design Table
    const columns = [
        {
            title: 'Payment Date',
            dataIndex: 'payment_date',
            render: (text) => {
                const paymentDate = new Date(text);
                return paymentDate.toLocaleDateString('en-PH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
            },
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            render: (text) => `₱${parseFloat(text).toLocaleString()}`,
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <h2 className="mb-4 text-xl font-semibold text-gray-700">Loan Details</h2>

            {/* Loan Details Section */}
            <div className="grid grid-cols-2 gap-y-2 text-gray-600">
                <div className="grid grid-cols-2">
                    <p className="font-semibold">Employee:</p>
                    <p>
                        {employeeLoan.employee?.first_name} {employeeLoan.employee?.last_name}
                    </p>
                </div>
                <div className="grid grid-cols-2">
                    <p className="font-semibold">Loan Type:</p>
                    <p>{employeeLoan.loan_type?.type || 'N/A'}</p>
                </div>
                <div className="grid grid-cols-2">
                    <p className="font-semibold">Amount:</p>
                    <p>₱{employeeLoan.amount.toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-2">
                    <p className="font-semibold">Interest Rate:</p>
                    <p>{employeeLoan.interest_rate}%</p>
                </div>
                <div className="grid grid-cols-2">
                    <p className="font-semibold">Months to Pay:</p>
                    <p>{employeeLoan.months} Months</p>
                </div>
                <div className="grid grid-cols-2">
                    <p className="font-semibold">Monthly Amortization:</p>
                    <p>₱{employeeLoan.monthly_amortization.toLocaleString()}</p>
                </div>
            </div>

            {/* Payment Progress Section */}
            <div className="mt-4">
                <div className="h-2 w-full rounded bg-gray-200">
                    <div
                        className="h-full rounded bg-green-500"
                        style={{ width: `${percentPaid}%` }}
                    ></div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                    {percentPaid}% of the loan is paid (₱{totalPaid.toLocaleString()} out of ₱
                    {employeeLoan.amount.toLocaleString()})
                </p>
            </div>

            <Divider style={{ borderColor: '#F0C519' }} />

            {/* Payment History Section */}
            <div className="mt-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-700">Payment History</h2>
                <Table dataSource={payments} columns={columns} rowKey="id" pagination={false} />
            </div>
        </AuthenticatedLayout>
    );
}

export default EmployeeLoanDetail;
