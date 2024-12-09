import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Table, Divider, Modal, Input, DatePicker, message } from 'antd';
import React, { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import { Inertia } from '@inertiajs/inertia';

function EmployeeLoanDetail({ auth, employeeLoan = [], payments }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(employeeLoan.monthly_amortization || '');
    const [paymentDate, setPaymentDate] = useState(null);

    const totalPaid = payments.reduce((acc, payment) => acc + parseFloat(payment.amount), 0);
    const remainingBalance = employeeLoan.amount - totalPaid;
    const isFullyPaid = remainingBalance <= 0;
    const percentPaid =
        employeeLoan.amount > 0
            ? Math.min((totalPaid / employeeLoan.total_paid) * 100, 100).toFixed(0)
            : 0;

    // Calculate breakdown components
    const monthlyInterest =
        (employeeLoan.amount * (employeeLoan.interest_rate / 100)) / employeeLoan.months;
    const monthlyAmountWithoutInterest = employeeLoan.monthly_amortization - monthlyInterest;

    const columns = [
        {
            title: 'Payment Date',
            dataIndex: 'payment_date',
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            render: (amount) => `₱${parseFloat(amount).toLocaleString()}`,
        },
    ];

    const handleCancel = () => {
        setIsModalVisible(false);
        setPaymentAmount(employeeLoan.monthly_amortization);
    };

    const showPaymentModal = () => {
        setIsModalVisible(true);
        setPaymentAmount(
            remainingBalance > 0
                ? Math.min(employeeLoan.monthly_amortization, remainingBalance)
                : ''
        );
    };

    const handlePaymentSubmit = () => {
        if (!paymentAmount || !paymentDate) {
            message.error('Please enter both payment amount and date.');
            return;
        }

        if (parseFloat(paymentAmount) > remainingBalance) {
            message.error(
                `Payment amount cannot exceed the remaining balance of ₱${remainingBalance.toLocaleString()}`
            );
            return;
        }

        const minimumPayment = Math.min(employeeLoan.monthly_amortization, remainingBalance);

        if (parseFloat(paymentAmount) < minimumPayment) {
            message.error(`Payment amount cannot be less than ₱${minimumPayment.toLocaleString()}`);
            return;
        }

        Inertia.post(
            `/employee-loans/${employeeLoan.id}/add-payment`,
            {
                amount: paymentAmount,
                payment_date: paymentDate.format('YYYY-MM-DD'),
            },
            {
                onSuccess: () => {
                    message.success('Payment recorded successfully!');
                    setIsModalVisible(false);
                    setPaymentAmount(employeeLoan.monthly_amortization);
                    setPaymentDate(null);
                },
                onError: () => {
                    message.error('Failed to record payment. Please try again.');
                },
            }
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-700">Loan Details</h2>
                </div>
                <div>
                    {!isFullyPaid && (
                        <PrimaryButton onClick={showPaymentModal}>Make Payment</PrimaryButton>
                    )}
                    <Modal
                        title="Make a Payment"
                        open={isModalVisible}
                        onOk={handlePaymentSubmit}
                        onCancel={handleCancel}
                        okText="Submit Payment"
                    >
                        <div className="mb-4">
                            <label>Payment Amount:</label>
                            <Input
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                min={employeeLoan.monthly_amortization}
                            />
                        </div>
                        <div className="mb-4">
                            <label>Payment Date:</label>
                            <DatePicker
                                value={paymentDate}
                                onChange={setPaymentDate}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </Modal>
                </div>
            </div>

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
                    <p className="font-semibold">Total Paid:</p>
                    <p>₱{employeeLoan.total_paid} </p>
                </div>
                <div className="grid grid-cols-2">
                    <p className="font-semibold">Monthly Amortization:</p>
                    <p>₱{employeeLoan.monthly_amortization.toLocaleString()}</p>
                </div>
            </div>

            <div className="mt-4">
                <div className="h-2 w-full rounded bg-gray-200">
                    <div
                        className="h-full rounded bg-green-500"
                        style={{ width: `${percentPaid}%` }}
                    ></div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                    {isFullyPaid ? 'Loan is fully paid' : `${percentPaid}% of the loan is paid `}
                    (₱{totalPaid.toLocaleString()} out of ₱
                    {employeeLoan.total_paid.toLocaleString()})
                </p>
            </div>

            <Divider style={{ borderColor: '#F0C519' }} />

            <div className="mt-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-700">Payment History</h2>
                <Table dataSource={payments} columns={columns} rowKey="id" pagination={false} />
            </div>
        </AuthenticatedLayout>
    );
}

export default EmployeeLoanDetail;
