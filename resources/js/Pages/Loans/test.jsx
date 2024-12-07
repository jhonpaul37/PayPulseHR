import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FloatButton as Btn, Divider, Modal, Table, Drawer } from 'antd';
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

const Loans = ({ auth, loanPrograms, loanTypes, employees, loans = [], employeeLoan = [] }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Handlers for Modals and Drawer
    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);
    const handleDetailCancel = () => {
        setIsDetailModalOpen(false);
        setSelectedLoan(null);
    };
    const showDrawer = (employee) => {
        setSelectedEmployee(employee);
        setDrawerVisible(true);
    };
    const closeDrawer = () => {
        setDrawerVisible(false);
        setSelectedEmployee(null);
    };

    // Format date for display
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            {/* Loan Programs and Loan Types Section */}
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

            {/* Employee Loans Section */}
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

            {/* Loan Details Modal */}
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

            {/* Employee Loans Table */}
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
                                        <br />
                                        <span className="text-gray-500">
                                            Remaining Balance: ₱{remainingBalance.toLocaleString()}
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
                    onClick: () => showDrawer(record),
                })}
            />

            {/* Employee Loan Drawer */}
            <Drawer
                title={`${selectedEmployee?.employee_name}'s Loans`}
                placement="right"
                onClose={closeDrawer}
                open={drawerVisible}
                width={500}
            >
                {selectedEmployee &&
                    employeeLoan
                        .filter((loan) => loan.employee?.id === selectedEmployee.key)
                        .map((loan) => (
                            <div key={loan.id} className="mb-4">
                                <h3 className="text-lg font-bold">
                                    {loan.loan_type?.type || `Loan ${loan.id}`}
                                </h3>
                                <p>
                                    Amount: ₱{loan.amount.toLocaleString()}
                                    <br />
                                    Paid: ₱
                                    {loan.payments
                                        .reduce(
                                            (acc, payment) => acc + parseFloat(payment.amount),
                                            0
                                        )
                                        .toLocaleString()}
                                    <br />
                                    Remaining Balance: ₱
                                    {(
                                        loan.amount -
                                        loan.payments.reduce(
                                            (acc, payment) => acc + parseFloat(payment.amount),
                                            0
                                        )
                                    ).toLocaleString()}
                                </p>
                            </div>
                        ))}
            </Drawer>
        </AuthenticatedLayout>
    );
};

export default Loans;
