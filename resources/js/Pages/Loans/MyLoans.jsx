import { useState } from 'react';
import { Card, Col, Row, Statistic, Divider, Tabs, Badge } from 'antd';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const { TabPane } = Tabs;

const MyLoans = ({
    auth,
    loans,
    activeLoans,
    fullyPaidLoans,
    totalLoanAmount,
    totalPaidLoanAmount,
    totalActiveLoanAmount,
    remainingBalance,
    transaction,
}) => {
    const [selectedLoanType, setSelectedLoanType] = useState('active');

    return (
        <AuthenticatedLayout user={auth.user}>
            {/* Dashboard Summary Cards */}
            <Row gutter={16} className="mb-8">
                <Col span={6}>
                    <Card bordered={false} className="bg-gray-100 shadow-lg">
                        <Statistic
                            title="Total Loan"
                            value={`₱${totalLoanAmount.toLocaleString()}`}
                        />
                    </Card>
                </Col>
                {/* <Col span={6}>
                    <Card bordered={false} className="bg-gray-100 shadow-lg">
                        <Statistic
                            title="Amount Paid"
                            value={`₱${totalPaidLoanAmount.toLocaleString()}`}
                        />
                    </Card>
                </Col> */}
                <Col span={6}>
                    <Card bordered={false} className="bg-gray-100 shadow-lg">
                        <Statistic
                            title="Loan Balance"
                            value={`₱${(remainingBalance ?? 0).toLocaleString()}`}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="bg-gray-100 shadow-lg">
                        <Statistic
                            title="Leave Balance"
                            // value={fullyPaidLoans.length}
                            // suffix="Leave"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="bg-gray-100 shadow-lg">
                        <Statistic
                            title="Payslip"
                            // value={fullyPaidLoans.length}
                            // suffix="Payslip"
                        />
                    </Card>
                </Col>
            </Row>
            <Tabs
                defaultActiveKey="active"
                onChange={(key) => setSelectedLoanType(key)}
                items={[
                    {
                        key: 'active',
                        label: (
                            <Badge count={activeLoans.length} offset={[10, 0]} color="maroon">
                                <span>Active Loans</span>
                            </Badge>
                        ),
                        children:
                            activeLoans.length > 0 ? (
                                activeLoans.map((loan) => <LoanItem key={loan.id} loan={loan} />)
                            ) : (
                                <p>No active loans</p>
                            ),
                    },
                    {
                        key: 'fullyPaid',
                        label: (
                            <Badge count={fullyPaidLoans.length} offset={[10, 0]} color="maroon">
                                <span>Paid Loans</span>
                            </Badge>
                        ),
                        children:
                            fullyPaidLoans.length > 0 ? (
                                fullyPaidLoans.map((loan) => <LoanItem key={loan.id} loan={loan} />)
                            ) : (
                                <p>No fully paid loans</p>
                            ),
                    },
                ]}
            />
        </AuthenticatedLayout>
    );
};

const LoanItem = ({ loan }) => {
    const totalPaid = loan.payments.reduce((acc, payment) => acc + parseFloat(payment.amount), 0);
    const percentPaid = loan.amount > 0 ? ((totalPaid / loan.amount) * 100).toFixed(0) : 0;

    return (
        <div className="mb-4">
            <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-700">
                        {loan.loan_type?.type || 'N/A'}
                    </h3>
                    <span className="text-sm text-gray-500">
                        Loan Date: {new Date(loan.loan_date).toLocaleDateString()}
                    </span>
                </div>
                <div className="grid grid-cols-3 text-sm text-gray-600">
                    <p>
                        <strong>Total Paid:</strong> ₱{totalPaid.toLocaleString()}
                    </p>
                    <p>
                        <strong>Monthly Amortization:</strong> ₱
                        {loan.monthly_amortization.toLocaleString()}
                    </p>
                </div>
                <div className="col-span-2 pt-4">
                    <div className="h-2 w-full rounded bg-gray-200">
                        <div
                            className="h-full rounded bg-green-500"
                            style={{ width: `${percentPaid}%` }}
                        ></div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                        {percentPaid}% of the loan is paid (₱{totalPaid.toLocaleString()} out of ₱
                        {loan.total_paid.toLocaleString()})
                    </p>
                </div>
                <div className="mt-4 flex justify-end">
                    <PrimaryButton
                        onClick={() =>
                            (window.location.href = route('loan.details', {
                                employeeLoan: loan.id,
                            }))
                        }
                        className="px-4 py-2 text-center"
                    >
                        Payment History
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};

export default MyLoans;
