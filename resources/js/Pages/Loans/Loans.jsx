import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FloatButton as Btn, Divider, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import styled from 'styled-components';
import LoanPrograms from './LoanPrograms';
import LoanTypes from './LoanTypes';
import EmployeeLoanForm from './EmployeeLoanForm';

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

const Loans = ({ auth, loanPrograms, loanTypes, employees, loans = [] }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to open the modal
    const showModal = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="grid grid-cols-2 gap-5">
                <div>
                    <Divider
                        style={{
                            borderColor: '#F0C519',
                        }}
                    >
                        <span className="text-xl font-bold">Loan Programs</span>
                    </Divider>
                    <LoanPrograms programs={loanPrograms} />
                </div>

                <div>
                    <Divider
                        style={{
                            borderColor: '#F0C519',
                        }}
                    >
                        <span className="text-xl font-bold">Loan Types</span>
                    </Divider>
                    <LoanTypes loanPrograms={loanPrograms} loanTypes={loanTypes} />
                </div>
            </div>

            <Divider
                style={{
                    borderColor: '#F0C519',
                }}
            >
                <span className="text-xl font-bold">Employee Loan</span>
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

            {/* Loan List */}
            <div className="">
                {/* Display a list of loans */}
                {loans.length > 0 ? (
                    <div className="space-y-4">
                        {loans.map((loan) => (
                            <div
                                key={loan.id}
                                className="rounded-lg border border-gray-300 p-4 shadow-sm"
                            >
                                <p>
                                    <strong>Employee:</strong> {loan.employee_name}
                                </p>
                                <p>
                                    <strong>Loan Type:</strong> {loan.loan_type}
                                </p>
                                <p>
                                    <strong>Amount:</strong> ${loan.amount}
                                </p>
                                <p>
                                    <strong>Monthly Amortization:</strong> $
                                    {loan.monthly_amortization}
                                </p>
                                <p>
                                    <strong>Interest Rate:</strong> {loan.interest_rate}%
                                </p>
                                <p>
                                    <strong>Months to Pay:</strong> {loan.months}
                                </p>
                                <p>
                                    <strong>Loan Date:</strong> {loan.loan_date}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No loans available.</p>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default Loans;
