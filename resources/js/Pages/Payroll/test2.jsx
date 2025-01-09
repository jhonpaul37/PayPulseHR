import { React, useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Table, Drawer, Modal } from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';

// Format PHP Peso
const PhpFormat = (value) => {
    const num = parseFloat(value);
    return isNaN(num)
        ? '₱0.00'
        : `₱${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const PayrollData = ({
    auth,
    employee,
    loanTypes,
    message,
    reference_number,
    transaction,
    benefits,
}) => {
    const [dataSource, setDataSource] = useState(employee);
    const [columns, setColumns] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [grandTotals, setGrandTotals] = useState({});

    const showEmployeeModal = (employee) => {
        setSelectedEmployee(employee);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    // Calculate grand totals
    const calculateGrandTotals = () => {
        const totals = {
            basic_pay: 0,
            net_basic: 0,
            pera: 0,
            net_pera: 0,
            rata: 0,
            salary_differential: 0,
            total_salary: 0,
            tax: 0,
            gsis_prem: 0,
            hdmf_prem1: 0,
            phic: 0,
            total_contributions: 0,
            patve_cont: 0,
            loans_total: 0,
            total_deductions: 0,
            net_amount: 0,
        };

        dataSource.forEach((record) => {
            totals.basic_pay += record.salary_grade?.monthly_salary || 0;
            totals.net_basic += record.salary_grade?.monthly_salary || 0;
            totals.pera += record.benefits?.find((b) => b.name === 'PERA')?.pivot?.amount || 0;
            totals.net_pera += record.net_pera || 0;
            totals.rata += record.benefits?.find((b) => b.name === 'RATA')?.pivot?.amount || 0;
            totals.salary_differential +=
                record.benefits?.find((b) => b.name === 'SALARY DIFFERENTIAL')?.pivot?.amount || 0;
            totals.total_salary += record.total_salary || 0;
            totals.tax += record.contributions?.find((c) => c.name === 'TAX')?.pivot?.amount || 0;
            totals.gsis_prem +=
                record.contributions?.find((c) => c.name === 'GSIS PREM')?.pivot?.amount || 0;
            totals.hdmf_prem1 +=
                record.contributions?.find((c) => c.name === 'HDMF PREM1')?.pivot?.amount || 0;
            totals.phic += record.contributions?.find((c) => c.name === 'PHIC')?.pivot?.amount || 0;
            totals.total_contributions += record.total_contributions || 0;
            totals.patve_cont +=
                record.contributions?.find((c) => c.name === 'PATVE CONT.')?.pivot?.amount || 0;
            totals.loans_total += record.loans?.reduce(
                (sum, loan) => sum + (loan.remainingAmortization || 0),
                0
            );
            totals.total_deductions += record.total_deductions || 0;
            totals.net_amount += record.net_amount || 0;
        });

        setGrandTotals(totals);
    };

    useEffect(() => {
        calculateGrandTotals();
    }, [dataSource]);

    useEffect(() => {
        // ... existing column definitions ...

        // Add summary row to the table
        const allColumns = [
            ...staticColumns,
            ...BenefitColumns,
            ...ContributionColumns,
            ...loanColumns,
            PATVEColumn,
            loansTotalColumn,
            totalDeductionColumn,
            NetAmountColumn,
        ];

        setColumns(allColumns);
    }, [loanTypes, employee]);

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const saveTransaction = () => {
        const dataToSend = {
            employees: dataSource.map((employee) => ({
                id: employee.id,
                loans: employee.loans.map((loan) => ({
                    loan_id: loan.id,
                    remaining_amortization: loan.remainingAmortization,
                })),
                contributions: employee.contributions.map((contribution) => ({
                    contribution_id: contribution.id,
                    amount: contribution.pivot.amount,
                })),
                benefits: employee.benefits.map((benefit) => ({
                    benefit_id: benefit.id,
                    amount: benefit.pivot.amount,
                })),
                total_salary: employee.total_salary,
                total_deductions: employee.total_deductions,
                net_amount: employee.net_amount,
                net_pay: employee.net_pay,
            })),
            grand_totals: grandTotals,
        };

        Inertia.post(
            '/transactions',
            { data: dataToSend },
            {
                onSuccess: (page) => {
                    const referenceNumber = page.props.reference_number;
                    if (referenceNumber) {
                        Inertia.visit(`/transactions/${referenceNumber}`);
                    }
                },
            }
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <h2 className="pb-10 text-center text-2xl font-bold">Payroll Data</h2>
            {message && (
                <div className="pb-4 text-center font-semibold text-green-600">{message}</div>
            )}
            {reference_number && (
                <div className="pb-4 text-center font-semibold text-blue-600">
                    Transaction Reference: {reference_number}
                </div>
            )}
            <div className="flex justify-end gap-5 pb-5">
                <PrimaryButton onClick={saveTransaction} className="rounded px-4 py-2">
                    Save Transaction
                </PrimaryButton>

                <PrimaryButton onClick={showDrawer} className="rounded px-4 py-2">
                    view
                </PrimaryButton>
            </div>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey="employee_id"
                scroll={{ x: 'max-content', y: 485 }}
                onRow={(record) => ({
                    onClick: () => showEmployeeModal(record),
                })}
                summary={() => (
                    <Table.Summary fixed>
                        <Table.Summary.Row className="bg-gray-100 font-bold">
                            <Table.Summary.Cell index={0} colSpan={5}>
                                Grand Total
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>
                                {PhpFormat(grandTotals.basic_pay)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>
                                {PhpFormat(grandTotals.net_basic)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={7}>
                                {PhpFormat(grandTotals.pera)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={8}>
                                {PhpFormat(grandTotals.lwop_pera)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={9}>
                                {PhpFormat(grandTotals.net_pera)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={10}>
                                {PhpFormat(grandTotals.rata)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={11}>
                                {PhpFormat(grandTotals.salary_differential)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={12}>
                                {PhpFormat(grandTotals.total_salary)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={13}>
                                {PhpFormat(grandTotals.tax)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={14}>
                                {PhpFormat(grandTotals.gsis_prem)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={15}>
                                {PhpFormat(grandTotals.hdmf_prem1)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={16}>
                                {PhpFormat(grandTotals.phic)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={17}>
                                {PhpFormat(grandTotals.total_contributions)}
                            </Table.Summary.Cell>
                            {/* Add cells for loan columns dynamically */}
                            {loanTypes.map((_, index) => (
                                <Table.Summary.Cell key={index}></Table.Summary.Cell>
                            ))}
                            <Table.Summary.Cell>
                                {PhpFormat(grandTotals.patve_cont)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                                {PhpFormat(grandTotals.loans_total)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                                {PhpFormat(grandTotals.total_deductions)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                                {PhpFormat(grandTotals.net_amount)}
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />

            {/* Existing Drawer and Modal components remain unchanged */}
            <Drawer title="Saved Payrolls" width={500} open={visible} onClose={onClose}>
                {/* ... existing drawer content ... */}
            </Drawer>

            <Modal open={modalVisible} onCancel={handleCloseModal} footer={null} width={800}>
                {/* ... existing modal content ... */}
            </Modal>
        </AuthenticatedLayout>
    );
};

export default PayrollData;
