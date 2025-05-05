import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
import { FloatButton as Btn, Divider, Modal, Table, Drawer, Button, Form, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import LoanPrograms from '../LoanPrograms';
import LoanTypes from '../LoanTypes';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import EmployeeLoanForm from '../EmployeeLoanForm';
import EmployeeLoanDetail from '../EmployeeLoanDetail';
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
    const handleFolderSubmit = (values) => {
        console.log('Received values:', values);
        // You can add your logic here to handle the form submission
        setIsFolderModalOpen(false);
        form.resetFields();
    };

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
                    <Form.Item
                        label="Start Date"
                        name="startDate"
                        rules={[{ required: true, message: 'Please select the start date!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="End Date"
                        name="endDate"
                        rules={[{ required: true, message: 'Please select the end date!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
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
                                        loan.total_paid >
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
                                                    ₱
                                                    {parseFloat(
                                                        monthlyAmortization
                                                    ).toLocaleString()}
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
                                    employee,
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
                                    employeeLoan.map(
                                        (loan) => loan.loan_type?.type || `Loan ${loan.id}`
                                    )
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
                                <h3 className="font-bold">
                                    {loan.loan_type?.type || `Loan ${loan.id}`}
                                </h3>
                                <p>Total Paid: ₱{loan.total_paid.toLocaleString()}</p>
                                <p>Amount: ₱{loan.amount.toLocaleString()}</p>
                                <p>Months to pay: {loan.months.toLocaleString()}</p>
                                <p>
                                    Remaining Balance: ₱
                                    {loan.total_paid -
                                        loan.payments.reduce(
                                            (acc, p) => acc + parseFloat(p.amount),
                                            0
                                        )}
                                </p>
                                <p>
                                    Monthly Amortization: ₱
                                    {loan.monthly_amortization?.toLocaleString()}
                                </p>
                                <p>Status: {loan.status?.toLocaleString()}</p>
                                <div className="flex justify-end py-2">
                                    <PrimaryButton
                                        type="primary"
                                        onClick={() => openEditModal(loan)}
                                    >
                                        Edit
                                    </PrimaryButton>
                                </div>
                                <Divider />
                            </div>
                        ))}
                    </Drawer>
                    {/* {console.log(employeeLoan)} */}
                    {/* Edit Loan Modal */}
                    <Modal
                        title="Edit Loan"
                        open={isEditModalOpen}
                        onCancel={closeEditModal} // This will close the modal when clicked
                        footer={[
                            <DangerButton
                                key="cancel"
                                onClick={closeEditModal}
                                style={{ marginRight: '8px' }}
                            >
                                Cancel
                            </DangerButton>,
                            <PrimaryButton key="save" type="primary" htmlType="submit">
                                Save Changes
                            </PrimaryButton>,
                        ]}
                    >
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
                                <div style={{ marginBottom: '16px' }}>
                                    <strong>Total Paid: </strong> ₱
                                    {selectedLoan.payments
                                        .reduce(
                                            (acc, payment) => acc + parseFloat(payment.amount),
                                            0
                                        )
                                        .toLocaleString()}
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <strong>Total Loan Amount with Interest: </strong> ₱
                                    {(
                                        selectedLoan.amount +
                                        selectedLoan.amount * (selectedLoan.interest_rate / 100)
                                    ).toLocaleString()}
                                </div>

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

                                <Form.Item
                                    name="amount"
                                    label="Amount"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input the loan amount!',
                                        },
                                    ]}
                                >
                                    <InputNumber min={0} style={{ width: '100%' }} />
                                </Form.Item>

                                <Form.Item
                                    name="interest_rate"
                                    label="Interest Rate (%)"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input the interest rate!',
                                        },
                                    ]}
                                >
                                    <InputNumber min={0} style={{ width: '100%' }} />
                                </Form.Item>

                                <Form.Item
                                    name="months"
                                    label="Months"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input the number of months!',
                                        },
                                    ]}
                                >
                                    <InputNumber min={1} style={{ width: '100%' }} />
                                </Form.Item>

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

                                {/* <Form.Item>
                            <PrimaryButton type="primary" htmlType="submit">
                                Save Changes
                            </PrimaryButton>
                        </Form.Item> */}
                            </Form>
                        )}
                    </Modal>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Loans;
