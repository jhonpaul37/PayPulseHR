import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FloatButton as Btn, Divider, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import styled from 'styled-components';
import LoanPrograms from './LoanPrograms';
import LoanTypes from './LoanTypes';
import PrimaryButton from '@/Components/PrimaryButton';
import EmployeeLoanForm from './EmployeeLoanForm';
import EmployeeLoanDetail from './EmployeeLoanDetail';

// Styled Component moved outside the Loans function
const FloatButton = styled(Btn)`
    background-color: #f0c519 !important;
    color: #fff !important;
    width: 60px;
    height: 60px;
    font-size: 24px;
    position: fixed;
    bottom: 100px;
    right: 100px;
`;

const Loans = ({ auth, loanPrograms, loanTypes, employees, loans = [], employeeLoan = [] }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null); // State for selected loan
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // State for loan detail modal

    // Function to open the modal for adding employee loan
    const showModal = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal for adding employee loan
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Function to show loan details
    const showLoanDetails = (loan) => {
        setSelectedLoan(loan);
        setIsDetailModalOpen(true);
    };

    // Function to close the loan detail modal
    const handleDetailCancel = () => {
        setIsDetailModalOpen(false);
        setSelectedLoan(null);
    };

    // Date formatting function
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            {/* Existing Sections for Loan Programs and Loan Types */}
            <div className="grid grid-cols-2 gap-5">
                <div>
                    <Divider style={{ borderColor: '#F0C519' }}>
                        <span className="text-xl font-bold">Loan Programs</span>
                    </Divider>
                    <LoanPrograms programs={loanPrograms} />
                </div>

                <div>
                    <Divider style={{ borderColor: '#F0C519' }}>
                        <span className="text-xl font-bold">Loan Types</span>
                    </Divider>
                    <LoanTypes loanPrograms={loanPrograms} loanTypes={loanTypes} />
                </div>
            </div>

            <Divider style={{ borderColor: '#F0C519' }}>
                <span className="text-xl font-bold">Employee Loans</span>
            </Divider>

            {/* Floating Add Button */}
            <FloatButton
                onClick={showModal}
                tooltip="Add Employee Loan"
                icon={<PlusOutlined />}
                className="border-high bg-high font-bold"
            />

            <Modal
                title="Add Employee Loan"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <EmployeeLoanForm
                    employees={employees}
                    loanTypes={loanTypes}
                    loanPrograms={loanPrograms}
                />
            </Modal>

            {/* Loan Detail Modal */}
            <Modal
                title="Employee Loan Details"
                open={isDetailModalOpen}
                onCancel={handleDetailCancel}
                footer={null}
            >
                {selectedLoan && (
                    <EmployeeLoanDetail
                        employeeLoan={selectedLoan}
                        payments={selectedLoan.payments || []}
                    />
                )}
            </Modal>

            {/* Section for Unpaid Loans */}
            {employeeLoan
                .filter((loan) => {
                    const totalPaid = loan.payments.reduce(
                        (acc, payment) => acc + parseFloat(payment.amount),
                        0
                    );
                    return totalPaid < loan.amount;
                })
                .map((loan) => {
                    const totalPaid = loan.payments.reduce(
                        (acc, payment) => acc + parseFloat(payment.amount),
                        0
                    );
                    const percentPaid =
                        loan.amount > 0 ? ((totalPaid / loan.amount) * 100).toFixed(0) : 0;

                    return (
                        <div key={loan.id} className="mb-4">
                            {' '}
                            {/* Added mb-4 for spacing */}
                            <div className="rounded-lg border border-gray-300 p-4 shadow-sm transition-shadow duration-200 hover:shadow-lg">
                                {/* Basic Info */}
                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-700">
                                        {loan.employee?.first_name || 'N/A'}{' '}
                                        {loan.employee?.last_name || ''}
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        <strong>Loan Date: </strong> {formatDate(loan.loan_date)}
                                    </span>
                                </div>

                                {/* Loan Details */}
                                <div className="grid grid-cols-3 text-sm text-gray-600">
                                    <p>
                                        <strong>Loan Type:</strong> {loan.loan_type?.type || 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Amount:</strong> ₱{loan.amount.toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>Monthly Amortization:</strong> ₱
                                        {loan.monthly_amortization.toLocaleString()}
                                    </p>
                                </div>

                                {/* Progress */}
                                <div className="col-span-2 pt-4">
                                    <div className="h-2 w-full rounded bg-gray-200">
                                        <div
                                            className="h-full rounded bg-green-500"
                                            style={{ width: `${percentPaid}%` }}
                                        ></div>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {percentPaid}% of the loan is paid (₱
                                        {totalPaid.toLocaleString()} out of ₱
                                        {loan.amount.toLocaleString()}).
                                    </p>
                                </div>

                                {/* Payment History Button */}
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
                })}
        </AuthenticatedLayout>
    );
};

export default Loans;
