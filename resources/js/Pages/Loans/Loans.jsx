import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Modal, Table, Drawer, Button, Form, Badge, Popover, List, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import styled from 'styled-components';
import LoanPrograms from './LoanPrograms';
import LoanTypes from './LoanTypes';
import EmployeeLoanForm from './EmployeeLoanForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faFolderOpen } from '@fortawesome/free-solid-svg-icons';

const FloatButton = styled.div`
    background-color: #f0c519 !important;
    color: #fff !important;
    width: 60px;
    height: 60px;
    font-size: 24px;
    position: fixed;
    bottom: 100px;
    right: 100px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`;

const PrintStyles = styled.div`
    @media print {
        body * {
            visibility: hidden;
        }
        #print-remittance,
        #print-remittance * {
            visibility: visible;
        }
        #print-remittance {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .no-print {
            display: none !important;
        }
    }
`;

const Loans = ({ auth, loanPrograms, loanTypes, employees, employeeLoan = [] }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [filteredEmployees, setFilteredEmployees] = useState(employees);
    const [searchValue, setSearchValue] = useState('');
    const [selectedEmployeeLoans, setSelectedEmployeeLoans] = useState([]);
    const [remittanceHistory, setRemittanceHistory] = useState([]);
    const [isRemittanceModalOpen, setIsRemittanceModalOpen] = useState(false);
    const [loanDetails, setLoanDetails] = useState(null);
    const [notifications] = useState([{ id: 1, message: 'Request for remittance approval' }]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    const showFolderModal = () => setIsFolderModalOpen(true);
    const handleFolderCancel = () => {
        setIsFolderModalOpen(false);
        form.resetFields();
    };

    const handleSearch = (value) => {
        setSearchValue(value);
        if (value) {
            const filtered = employees.filter((emp) =>
                `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredEmployees(filtered);
        } else {
            setFilteredEmployees(employees);
        }
    };

    const handleEmployeeSelect = (employeeId) => {
        setSelectedEmployeeLoans([]);
        form.setFieldsValue({ loan_id: undefined });

        const employee = employees.find((emp) => emp.id === employeeId);
        setSelectedEmployee(employee);

        const employeeLoans = employeeLoan.filter(
            (loan) =>
                loan.employee?.id === employeeId &&
                loan.amount >
                    loan.payments.reduce((acc, payment) => acc + parseFloat(payment.amount), 0)
        );

        setSelectedEmployeeLoans(employeeLoans);
    };

    const handleFolderSubmit = (values) => {
        const selectedLoan = selectedEmployeeLoans.find((loan) => loan.id === values.loan_id);

        if (!selectedLoan) return;

        const totalPaid = selectedLoan.payments.reduce((acc, payment) => {
            return acc + parseFloat(payment.amount);
        }, 0);

        const payments = selectedLoan.payments.map((payment, index) => ({
            key: index,
            no: index + 1,
            date: payment.payment_date,
            amount: parseFloat(payment.amount),
            remarks: payment.remarks || '',
        }));

        const loanAmount = parseFloat(selectedLoan.amount);
        const interestRate = parseFloat(selectedLoan.interest_rate);
        const remainingBalance = loanAmount - totalPaid;

        setLoanDetails({
            type: selectedLoan.loan_type?.type || `Loan ${selectedLoan.id}`,
            loanAmount: `₱${loanAmount.toFixed(2)}`,
            interestRate: `${interestRate.toFixed(2)}%`,
            totalPaid: `₱${totalPaid.toFixed(2)}`,
            remainingBalance: `₱${remainingBalance.toFixed(2)}`,
        });

        setRemittanceHistory(payments);
        setIsRemittanceModalOpen(true);
        handleFolderCancel();
    };

    const content = (
        <div className="w-64">
            {notifications.length > 0 ? (
                <List
                    dataSource={notifications}
                    renderItem={(item) => <List.Item>{item.message}</List.Item>}
                />
            ) : (
                <p className="text-center text-gray-500">No new notifications</p>
            )}
        </div>
    );

    const handlePrint = () => {
        const printContent = document.getElementById('print-remittance').innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;

        // Re-initialize any necessary scripts
        window.location.reload();
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <PrintStyles />
            <div className="flex justify-end">
                <FontAwesomeIcon
                    icon={faFolderOpen}
                    className="mr-3 cursor-pointer"
                    onClick={showFolderModal}
                />
            </div>

            <Modal
                title="Remittance History"
                open={isRemittanceModalOpen}
                onCancel={() => setIsRemittanceModalOpen(false)}
                footer={[
                    <Button key="print" type="primary" onClick={handlePrint}>
                        Print
                    </Button>,
                    <Button key="close" onClick={() => setIsRemittanceModalOpen(false)}>
                        Close
                    </Button>,
                ]}
                width={800}
                className="no-print"
            >
                <div id="print-remittance" className="p-4">
                    {loanDetails && selectedEmployee && (
                        <div className="mb-6">
                            <div className="mb-4 text-center">
                                <h2 className="text-xl font-bold">LOAN REMITTANCE HISTORY</h2>
                                <p className="text-sm text-gray-600">
                                    Date Issued: {new Date().toLocaleDateString()}
                                </p>
                            </div>

                            <div className="mb-4 grid grid-cols-2 gap-4">
                                <div>
                                    <p>
                                        <strong>Employee Name:</strong>{' '}
                                        {selectedEmployee.first_name} {selectedEmployee.last_name}
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        <strong>Loan Type:</strong> {loanDetails.type}
                                    </p>
                                    <p>
                                        <strong>Loan Amount:</strong> {loanDetails.loanAmount}
                                    </p>
                                    <p>
                                        <strong>Interest Rate:</strong> {loanDetails.interestRate}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <p>
                                    <strong>Total Paid:</strong> {loanDetails.totalPaid}
                                </p>
                                <p>
                                    <strong>Balance:</strong> {loanDetails.remainingBalance}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-full border">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-4 py-2 text-left">No.</th>
                                    <th className="border px-4 py-2 text-left">Payment Date</th>
                                    <th className="border px-4 py-2 text-left">Amount Paid</th>
                                </tr>
                            </thead>
                            <tbody>
                                {remittanceHistory.map((payment, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{payment.no}</td>
                                        <td className="border px-4 py-2">{payment.date}</td>
                                        <td className="border px-4 py-2">
                                            ₱
                                            {payment.amount.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>

            <Modal
                title="Employee Loan Details"
                open={isFolderModalOpen}
                onCancel={handleFolderCancel}
                footer={[
                    <Button key="back" onClick={handleFolderCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => form.submit()}>
                        Submit
                    </Button>,
                ]}
            >
                <Form form={form} onFinish={handleFolderSubmit}>
                    <Form.Item
                        label="Employee"
                        name="employee_id"
                        rules={[{ required: true, message: 'Please select an employee!' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Search employee..."
                            optionFilterProp="children"
                            onSearch={handleSearch}
                            onChange={handleEmployeeSelect}
                            filterOption={false}
                        >
                            {filteredEmployees.map((emp) => (
                                <Select.Option key={emp.id} value={emp.id}>
                                    {emp.first_name} {emp.last_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Available Loans"
                        name="loan_id"
                        rules={[{ required: true, message: 'Please select a loan!' }]}
                    >
                        <Select placeholder="Select a loan">
                            {selectedEmployeeLoans.map((loan) => (
                                <Select.Option key={loan.id} value={loan.id}>
                                    {loan.loan_type?.type || `Loan ${loan.id}`} - Remaining: ₱
                                    {loan.amount -
                                        loan.payments.reduce(
                                            (acc, payment) => acc + parseFloat(payment.amount),
                                            0
                                        )}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <div className="gap-5">
                <div>
                    <div className="my-4 border-b-2 border-yellow-400">
                        <span className="text-xl font-bold">Loan Programs</span>
                    </div>
                    <LoanPrograms programs={loanPrograms} />
                    <div className="my-4 border-b-2 border-yellow-400">
                        <span className="text-xl font-bold">Loan Types</span>
                    </div>
                    <LoanTypes loanPrograms={loanPrograms} loanTypes={loanTypes} />

                    <div className="my-4 border-b-2 border-yellow-400">
                        <span className="text-xl font-bold">Employee Loans</span>
                    </div>
                    <div className="mb-6 rounded-lg bg-white p-4 shadow">
                        <Table
                            dataSource={employeeLoan}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: true }}
                        >
                            <Table.Column
                                title="Employee"
                                dataIndex={['employee', 'first_name']}
                                key="employee"
                                render={(text, record) => (
                                    <span>
                                        {record.employee?.first_name} {record.employee?.last_name}
                                    </span>
                                )}
                            />
                            <Table.Column
                                title="Loan Type"
                                dataIndex={['loan_type', 'type']}
                                key="loan_type"
                            />
                            <Table.Column
                                title="Loan Program"
                                dataIndex={['loan_program', 'name']}
                                key="loan_program"
                            />
                            <Table.Column
                                title="Amount"
                                dataIndex="amount"
                                key="amount"
                                render={(amount) => `₱${parseFloat(amount).toFixed(2)}`}
                            />
                            <Table.Column
                                title="Interest Rate"
                                dataIndex="interest_rate"
                                key="interest_rate"
                                render={(rate) => `${parseFloat(rate).toFixed(2)}%`}
                            />
                            <Table.Column
                                title="Date Granted"
                                dataIndex="date_granted"
                                key="date_granted"
                                render={(date) => new Date(date).toLocaleDateString()}
                            />
                            <Table.Column
                                title="Status"
                                key="status"
                                render={(_, record) => {
                                    const totalPaid =
                                        record.payments?.reduce(
                                            (sum, payment) => sum + parseFloat(payment.amount),
                                            0
                                        ) || 0;
                                    const remaining = parseFloat(record.amount) - totalPaid;

                                    if (remaining <= 0) {
                                        return <Badge status="success" text="Fully Paid" />;
                                    } else if (totalPaid > 0) {
                                        return <Badge status="processing" text="Partially Paid" />;
                                    } else {
                                        return <Badge status="default" text="Unpaid" />;
                                    }
                                }}
                            />
                            <Table.Column
                                title="Remaining Balance"
                                key="remaining"
                                render={(_, record) => {
                                    const totalPaid =
                                        record.payments?.reduce(
                                            (sum, payment) => sum + parseFloat(payment.amount),
                                            0
                                        ) || 0;
                                    const remaining = parseFloat(record.amount) - totalPaid;
                                    return `₱${remaining.toFixed(2)}`;
                                }}
                            />
                        </Table>
                    </div>
                </div>

                <FloatButton onClick={showModal} title="Add Employee Loan">
                    <PlusOutlined />
                </FloatButton>

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
            </div>
        </AuthenticatedLayout>
    );
};

export default Loans;
