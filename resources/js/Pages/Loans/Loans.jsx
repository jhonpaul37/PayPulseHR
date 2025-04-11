import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
import { FloatButton as Btn, Divider, Modal, Table, Drawer, Button, Form, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import LoanPrograms from './LoanPrograms';
import LoanTypes from './LoanTypes';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import EmployeeLoanForm from './EmployeeLoanForm';
import EmployeeLoanDetail from './EmployeeLoanDetail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { Badge, Popover, List, Input, DatePicker, Select } from 'antd';

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
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [filteredEmployees, setFilteredEmployees] = useState(employees);
    const [searchValue, setSearchValue] = useState('');
    const [selectedEmployeeLoans, setSelectedEmployeeLoans] = useState([]);

    //add emplyee loan

    // Open the modal for adding employee loan
    const showModal = () => {
        setIsModalOpen(true);
    };

    // Close the modal for adding employee loan
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Close loan detail modal
    const handleDetailCancel = () => {
        setIsDetailModalOpen(false);
        setSelectedLoan(null);
    };

    //Loan info sidebar

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

    //Remittance
    // Handle employee search
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
        setSelectedEmployeeLoans([]); // Reset available loans
        form.setFieldsValue({ loan_id: undefined }); // Reset the selected loan field

        const employeeLoans = employeeLoan.filter(
            (loan) =>
                loan.employee?.id === employeeId &&
                loan.amount >
                    loan.payments.reduce((acc, payment) => acc + parseFloat(payment.amount), 0)
        );

        setSelectedEmployeeLoans(employeeLoans);
    };

    // Open the modal for folder icon
    const showFolderModal = () => {
        setIsFolderModalOpen(true);
    };

    // Close the modal for folder icon
    const handleFolderCancel = () => {
        setIsFolderModalOpen(false);
        form.resetFields();
    };

    // Handle form submission
    // const handleFolderSubmit = (values) => {
    //     console.log('Received values:', values);
    //     // You can add your logic here to handle the form submission
    //     setIsFolderModalOpen(false);
    //     form.resetFields();
    // };

    const handleEditSubmit = (values) => {
        // Send updated loan data to the backend
        Inertia.put(route('employee_loans.update', selectedLoan.id), values, {
            onSuccess: () => {
                closeEditModal();
            },
        });
    };

    const [notifications, setNotifications] = useState([
        { id: 1, message: 'Request for remittance approval' },
    ]);

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

    const [remittanceHistory, setRemittanceHistory] = useState([]);
    const [isRemittanceModalOpen, setIsRemittanceModalOpen] = useState(false);
    const [loanDetails, setLoanDetails] = useState(null); // Store loan info

    const handleFolderSubmit = (values) => {
        const selectedLoan = selectedEmployeeLoans.find((loan) => loan.id === values.loan_id);

        if (!selectedLoan) {
            message.error('Invalid loan selection');
            return;
        }

        // Extract remittance (payment) history
        const payments = selectedLoan.payments.map((payment, index) => ({
            key: index + 1,
            date: payment.payment_date,
            amount: `₱${parseFloat(payment.amount).toFixed(2)}`,
        }));

        // Store loan details
        setLoanDetails({
            type: selectedLoan.loan_type?.type || `Loan ${selectedLoan.id}`,
            totalAmount: `₱${parseFloat(selectedLoan.amount).toFixed(2)}`,
            totalPaid: `₱${parseFloat(selectedLoan.total_paid).toFixed(2)}`,
            remainingBalance: `₱${(selectedLoan.amount - selectedLoan.total_paid).toFixed(2)}`,
        });

        setRemittanceHistory(payments);
        setIsRemittanceModalOpen(true);
        message.success('Loan assigned successfully!');
        handleFolderCancel();
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="flex justify-end">
                {/* <FontAwesomeIcon icon={faFolderOpen} className="mr-3" /> */}
                <FontAwesomeIcon
                    icon={faFolderOpen}
                    className="mr-3 cursor-pointer"
                    onClick={showFolderModal}
                />
                <Popover
                    placement="bottomRight"
                    content={content}
                    title="Notifications"
                    trigger="click"
                >
                    <Badge count={notifications.length} size="small">
                        <FontAwesomeIcon icon={faBell} className="cursor-pointer text-xl" />
                    </Badge>
                </Popover>
            </div>
            <Modal
                title="Remittance History"
                open={isRemittanceModalOpen}
                onCancel={() => setIsRemittanceModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsRemittanceModalOpen(false)}>
                        Close
                    </Button>,
                ]}
            >
                {loanDetails && (
                    <div style={{ marginBottom: 16 }}>
                        <p>
                            <strong>Loan Type:</strong> {loanDetails.type}
                        </p>
                        <p>
                            <strong>Total Loan Amount:</strong> {loanDetails.totalAmount}
                        </p>
                        <p>
                            <strong>Total Paid:</strong> {loanDetails.totalPaid}
                        </p>
                        <p>
                            <strong>Remaining Balance:</strong> {loanDetails.remainingBalance}
                        </p>
                    </div>
                )}

                <Table
                    dataSource={remittanceHistory}
                    columns={[
                        { title: 'No.', dataIndex: 'key', key: 'key' },
                        { title: 'Payment Date', dataIndex: 'date', key: 'date' },
                        { title: 'Amount Paid', dataIndex: 'amount', key: 'amount' },
                    ]}
                    pagination={false}
                />
            </Modal>

            {console.log(employeeLoan)}

            {/* Folder Modal */}
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
                    {/* Searchable Employee Select */}
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
            {/* Loan Programs and Loan Types */}
            {/* <div className="grid grid-cols-2 gap-5"> */}
            <div className="gap-5">
                <div>
                    <Divider style={{ borderColor: '#F0C519' }}>
                        <span className="text-xl font-bold">Loan Programs</span>
                    </Divider>
                    <LoanPrograms programs={loanPrograms} />

                    <Divider style={{ borderColor: '#F0C519' }}>
                        <span className="text-xl font-bold">Loan Types</span>
                    </Divider>
                    <LoanTypes loanPrograms={loanPrograms} loanTypes={loanTypes} />
                </div>
                <div>
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Loans;
