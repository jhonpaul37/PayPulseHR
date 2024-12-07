import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
import { FloatButton as Btn, Divider, Modal, Table, Drawer, Button, Form, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import styled from 'styled-components';
import LoanPrograms from './LoanPrograms';
import LoanTypes from './LoanTypes';
import PrimaryButton from '@/Components/PrimaryButton';
import EmployeeLoanForm from './EmployeeLoanForm';
import EmployeeLoanDetail from './EmployeeLoanDetail';

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

const Loans = ({ auth, loanPrograms, loanTypes, employees, employeeLoan = [] }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeLoans, setActiveLoans] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal for editing loan

    // Open the modal for adding employee loan
    const showModal = () => {
        setIsModalOpen(true);
    };

    // Close the modal for adding employee loan
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Show loan details
    const showLoanDetails = (loan) => {
        setSelectedLoan(loan);
        setIsDetailModalOpen(true);
    };

    // Close loan detail modal
    const handleDetailCancel = () => {
        setIsDetailModalOpen(false);
        setSelectedLoan(null);
    };

    // Open Sidebar and show active loans for an employee
    const openSidebar = (employee) => {
        const activeLoansForEmployee = employeeLoan.filter(
            (loan) =>
                loan.employee?.id === employee.id &&
                loan.amount >
                    loan.payments.reduce((acc, payment) => acc + parseFloat(payment.amount), 0)
        );

        setActiveLoans(activeLoansForEmployee);
        setIsSidebarOpen(true);
    };

    // Close Sidebar
    const closeSidebar = () => {
        setIsSidebarOpen(false);
        setActiveLoans([]);
    };

    // Open Edit Modal
    const openEditModal = (loan) => {
        setSelectedLoan(loan);
        setIsEditModalOpen(true);
    };

    // Close Edit Modal
    const closeEditModal = () => {
        setSelectedLoan(null);
        setIsEditModalOpen(false);
    };

    const handleEditSubmit = (values) => {
        // Send updated loan data to the backend
        Inertia.put(route('employee_loans.update', selectedLoan.id), values, {
            onSuccess: () => {
                closeEditModal();
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            {/* Loan Programs and Loan Types */}
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
                        s
                    />
                )}
            </Modal>

            {/* Unpaid Loans Table */}
            <Table
                dataSource={employees
                    .map((employee) => {
                        const loansForEmployee = employeeLoan.filter(
                            (loan) =>
                                loan.employee?.id === employee.id &&
                                loan.amount >
                                    loan.payments.reduce(
                                        (acc, payment) => acc + parseFloat(payment.amount),
                                        0
                                    )
                        );

                        if (loansForEmployee.length === 0) return null;

                        const loansByType = {};
                        loansForEmployee.forEach((loan) => {
                            const totalPaid = loan.payments.reduce(
                                (acc, payment) => acc + parseFloat(payment.amount),
                                0
                            );
                            const remainingBalance = loan.amount - totalPaid;
                            const monthlyAmortization =
                                loan.monthly_amortization || (loan.amount / 12).toFixed(2);

                            loansByType[loan.loan_type?.type || `Loan ${loan.id}`] = {
                                remainingBalance,
                                monthlyAmortization,
                                display: (
                                    <div>
                                        <span className="text-primary font-bold">
                                            ₱{parseFloat(monthlyAmortization).toLocaleString()}
                                        </span>
                                    </div>
                                ),
                            };
                        });

                        return {
                            key: employee.id,
                            employee_name: `${employee.first_name} ${employee.last_name}`,
                            ...Object.keys(loansByType).reduce((acc, loanType) => {
                                acc[loanType] = loansByType[loanType].display;
                                return acc;
                            }, {}),
                            employee, // Add employee data for row click
                        };
                    })
                    .filter((entry) => entry !== null)}
                columns={[
                    {
                        title: 'Employee',
                        dataIndex: 'employee_name',
                        key: 'employee_name',
                        fixed: 'left',
                    },
                    ...Array.from(
                        new Set(
                            employeeLoan.map((loan) => loan.loan_type?.type || `Loan ${loan.id}`)
                        )
                    ).map((loanType) => ({
                        title: loanType,
                        dataIndex: loanType,
                        key: loanType,
                        render: (value) => value || '----',
                    })),
                ]}
                pagination={false}
                scroll={{ x: 'max-content' }}
                onRow={(record) => ({
                    onClick: () => openSidebar(record.employee),
                })}
            />

            {/* Sidebar for Active Loans */}
            <Drawer
                title="Active Loans"
                placement="right"
                width={400}
                onClose={closeSidebar}
                open={isSidebarOpen}
            >
                {activeLoans.map((loan) => (
                    <div key={loan.id} className="mb-4">
                        <h3 className="font-bold">{loan.loan_type?.type || `Loan ${loan.id}`}</h3>
                        <p>Amount: ₱{loan.amount.toLocaleString()}</p>
                        <p>
                            Remaining Balance: ₱
                            {loan.amount -
                                loan.payments.reduce((acc, p) => acc + parseFloat(p.amount), 0)}
                        </p>
                        <p>Monthly Amortization: ₱{loan.monthly_amortization?.toLocaleString()}</p>
                        <div className="flex justify-end py-2">
                            <PrimaryButton type="primary" onClick={() => openEditModal(loan)}>
                                Edit
                            </PrimaryButton>
                        </div>
                        <Divider />
                    </div>
                ))}
            </Drawer>

            {/* Edit Loan Modal */}
            <Modal title="Edit Loan" open={isEditModalOpen} onCancel={closeEditModal} footer={null}>
                {selectedLoan && (
                    <Form
                        initialValues={{
                            amount: selectedLoan.amount,
                            loan_date: selectedLoan.loan_date,
                            interest_rate: selectedLoan.interest_rate,
                            months: selectedLoan.months,
                            monthly_amortization: selectedLoan.monthly_amortization,
                        }}
                        onFinish={handleEditSubmit}
                    >
                        {/* Display Total Paid (including Interest) */}
                        <div style={{ marginBottom: '16px' }}>
                            <strong>Total Paid: </strong> ₱
                            {selectedLoan.payments
                                .reduce((acc, payment) => acc + parseFloat(payment.amount), 0)
                                .toLocaleString()}
                        </div>

                        {/* Display Total Loan Amount with Interest */}
                        <div style={{ marginBottom: '16px' }}>
                            <strong>Total Loan Amount with Interest: </strong> ₱
                            {(
                                selectedLoan.amount +
                                selectedLoan.amount * (selectedLoan.interest_rate / 100)
                            ).toLocaleString()}
                        </div>

                        {/* Display Remaining Balance */}
                        <div style={{ marginBottom: '16px' }}>
                            <strong>Remaining Balance: </strong> ₱
                            {(
                                selectedLoan.amount +
                                selectedLoan.amount * (selectedLoan.interest_rate / 100) -
                                selectedLoan.payments.reduce(
                                    (acc, payment) => acc + parseFloat(payment.amount),
                                    0
                                )
                            ).toLocaleString()}
                        </div>

                        {/* Loan Amount Input */}
                        <Form.Item
                            name="amount"
                            label="Amount"
                            rules={[{ required: true, message: 'Please input the loan amount!' }]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>

                        {/* Interest Rate Input */}
                        <Form.Item
                            name="interest_rate"
                            label="Interest Rate (%)"
                            rules={[{ required: true, message: 'Please input the interest rate!' }]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>

                        {/* Months Input */}
                        <Form.Item
                            name="months"
                            label="Months"
                            rules={[
                                { required: true, message: 'Please input the number of months!' },
                            ]}
                        >
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>

                        {/* Monthly Amortization Input */}
                        <Form.Item
                            name="monthly_amortization"
                            label="Monthly Amortization"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the monthly amortization!',
                                },
                            ]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Save Changes
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
};

export default Loans;
