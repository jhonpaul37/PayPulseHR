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
    loanPayment,
}) => {
    const [dataSource, setDataSource] = useState(employee);
    const [columns, setColumns] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [grandTotals, setGrandTotals] = useState({});

    console.log(loanPayment);

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

    const showEmployeeModal = (employee) => {
        setSelectedEmployee(employee);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };
    console.log(employee);

    useEffect(() => {
        // loan columns for all loan types
        const loanColumns = loanTypes.map((loanType) => ({
            title: loanType.type.toUpperCase(),
            render: (_, record) => {
                const loan = record.loans?.find((loan) => loan.loan_type_id === loanType.id);
                if (loan) {
                    return loan.remainingAmortization && loan.remainingAmortization > 0
                        ? PhpFormat(loan.remainingAmortization)
                        : ''; // empty if no remaining amortization
                }
                return ''; // no loan, return empty
            },
            width: 150,
        }));
        // "Loans Total"
        const loansTotalColumn = {
            title: 'LOANS TOTAL',
            render: (_, record) => {
                const totalLoans = record.loans?.reduce(
                    (sum, loan) => sum + (loan.remainingAmortization || 0),
                    0
                );
                return <span className="font-semibold">{PhpFormat(totalLoans || 0)}</span>;
            },
            width: 150,
        };
        const PATVEColumn = {
            title: 'PATVE CONT.',
            render: (_, record) => {
                const contribution = record.contributions?.find((c) => c.name === 'PATVE CONT.');
                return contribution ? PhpFormat(contribution.pivot.amount || 0) : ' ';
            },
            width: 150,
        };
        // Static columns
        const staticColumns = [
            {
                title: 'EMPLOYEE NO',
                dataIndex: 'employee_id',
                width: 120,
            },
            {
                title: 'EMPLOYEE NAME',
                render: (_, record) => {
                    const { first_name, middle_name, last_name } = record;
                    return `${first_name || ''} ${middle_name || ''} ${last_name || ''}`.trim();
                },
                width: 200,
            },
            {
                title: 'DEPARTMENT',
                dataIndex: 'department',
                key: 'department',
                render: (_, employee) => (employee.department ? employee.department.name : 'N/A'),
                width: 150,
            },
            {
                title: 'SG-STEP',
                render: (_, record) => {
                    const { salary_grade } = record;
                    return salary_grade ? `${salary_grade.grade}-${salary_grade.step}` : '';
                },
                width: 100,
            },
            {
                title: 'POSITION',
                dataIndex: 'position',
                key: 'position',
                render: (_, employee) => (employee.position ? employee.position.name : 'N/A'),
                width: 150,
            },
            {
                title: 'BASIC PAY',
                dataIndex: ['salary_grade', 'monthly_salary'],
                render: PhpFormat,
                width: 150,
            },
            {
                title: 'NET BASIC',
                render: (_, record) => {
                    const monthlySalary = record.salary_grade?.monthly_salary || 0;
                    return <span className="font-semibold">{PhpFormat(monthlySalary)}</span>;
                },
                width: 150,
            },
            {
                title: 'PERA',
                render: (_, record) => {
                    const benefit = record.benefits?.find((b) => b.name === 'PERA');
                    return benefit ? PhpFormat(benefit.pivot.amount || 0) : '';
                },
            },
        ];
        // Gross income
        const BenefitColumns = [
            {
                title: 'LWOP-PERA',
                render: (_, record) => {
                    const benefit = record.benefits?.find((b) => b.name === 'LWOP-PERA');
                    return benefit ? PhpFormat(benefit.pivot.amount || 0) : '';
                },
                width: 150,
            },
            {
                title: 'NET PERA',
                render: (_, record) => {
                    return <span className="font-semibold">{PhpFormat(record.net_pera)}</span>;
                },
                width: 150,
            },
            {
                title: 'RATA',
                render: (_, record) => {
                    const benefit = record.benefits?.find((b) => b.name === 'RATA');
                    return benefit ? PhpFormat(benefit.pivot.amount || 0) : ' ';
                },
                width: 150,
            },
            {
                title: 'SALARY DIFFERENTIAL',
                render: (_, record) => {
                    const benefit = record.benefits?.find((b) => b.name === 'SALARY DIFFERENTIAL');
                    return benefit ? PhpFormat(benefit.pivot.amount || 0) : ' ';
                },
                width: 150,
            },
            {
                title: 'TOTAL',
                render: (_, record) => (
                    <span className="font-semibold">{PhpFormat(record.total_salary || 0)}</span>
                ),
                width: 150,
            },
        ];

        // Deductions
        const ContributionColumns = [
            {
                title: 'TAX',
                render: (_, record) => {
                    const contribution = record.contributions?.find((c) => c.name === 'TAX');
                    return contribution ? PhpFormat(contribution.pivot.amount || 0) : ' ';
                },
                width: 150,
            },
            {
                title: 'GSIS PREM',
                render: (_, record) => {
                    const contribution = record.contributions?.find((c) => c.name === 'GSIS PREM');
                    return contribution ? PhpFormat(contribution.pivot.amount || 0) : ' ';
                },
                width: 150,
            },
            {
                title: 'HDMF PREM1',
                render: (_, record) => {
                    const contribution = record.contributions?.find((c) => c.name === 'HDMF PREM1');
                    return contribution ? PhpFormat(contribution.pivot.amount || 0) : ' ';
                },
                width: 150,
            },
            {
                title: 'PHIC',
                render: (_, record) => {
                    const contribution = record.contributions?.find((c) => c.name === 'PHIC');
                    return contribution ? PhpFormat(contribution.pivot.amount || 0) : ' ';
                },
                width: 150,
            },
            {
                title: 'BIR GSIS PHIC HDMF TOTAL',
                dataIndex: 'total_contributions',
                render: (text) => <strong>{PhpFormat(text)}</strong>,
                width: 150,
            },
        ];
        // Total Deduction
        const totalDeductionColumn = {
            title: 'TOTAL DEDUCTION',
            render: (_, record) => {
                return (
                    <span className="font-semibold">{PhpFormat(record.total_deductions || 0)}</span>
                );
            },
            width: 200,
        };
        // Net Amont
        const NetAmountColumn = {
            title: 'Net Amount',
            render: (_, record) => {
                return <span className="font-semibold">{PhpFormat(record.net_amount || 0)}</span>;
            },
            width: 200,
        };

        setColumns([
            ...staticColumns,
            ...BenefitColumns,
            ...ContributionColumns,
            ...loanColumns,
            PATVEColumn,
            loansTotalColumn,
            totalDeductionColumn,
            NetAmountColumn,
        ]);
    }, [loanTypes, employee]);

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const saveTransaction = () => {
        const dataToSend = dataSource.map((employee) => ({
            id: employee.id,
            monthly_salary: employee.salary_grade.monthly_salary,
            total_contributions: employee.total_contributions,
            total_loans: employee.total_loans,
            total_deductions: employee.total_deductions,

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
            net_pera: employee.net_pera,
            net_pay: employee.net_pay,
            net_amount: employee.net_amount,
        }));

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
                    Save Payroll
                </PrimaryButton>

                <PrimaryButton onClick={showDrawer} className="rounded px-4 py-2">
                    View
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

            <Drawer
                title="Saved Payrolls"
                width={500}
                open={visible}
                onClose={onClose}
                styles={{
                    body: { paddingBottom: 80 },
                }}
            >
                <Table
                    dataSource={transaction
                        .filter(
                            (t) => new Date(t.created_at).getFullYear() === new Date().getFullYear()
                        )
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))}
                    columns={[
                        {
                            title: 'Reference Number',
                            dataIndex: 'reference_number',
                            key: 'reference_number',
                        },
                        {
                            title: 'Date',
                            dataIndex: 'created_at',
                            key: 'created_at',
                            render: (created_at) => new Date(created_at).toLocaleDateString(),
                        },
                    ]}
                    rowKey="reference_number"
                    pagination={false}
                    onRow={(record) => ({
                        onClick: () => {
                            if (record.reference_number) {
                                Inertia.visit(`/transactions/${record.reference_number}`);
                            } else {
                                console.error('Missing reference number:', record);
                            }
                        },
                    })}
                />
            </Drawer>
            <Modal open={modalVisible} onCancel={handleCloseModal} footer={null} width={800}>
                <div className="flex justify-center py-5 text-xl font-bold">Employee Details</div>
                {selectedEmployee && (
                    <div>
                        <div className="grid grid-cols-2">
                            <span className="font-bold">DEPARTMENT:</span>
                            <span>{selectedEmployee.department?.name}</span>

                            <span className="font-bold">EMPLOYEE NO:</span>
                            <span>{selectedEmployee.employee_id}</span>

                            <span className="font-bold">EMPLOYEE NAME:</span>
                            <span>{`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}</span>

                            <span className="font-bold">POSITION:</span>
                            <span>{selectedEmployee.position?.name}</span>

                            {selectedEmployee.salary_grade && (
                                <>
                                    <span className="font-bold">SG-STEP:</span>
                                    <span>{`${selectedEmployee.salary_grade.grade}-${selectedEmployee.salary_grade.step}`}</span>
                                </>
                            )}

                            <span className="font-bold">BASIC SALARY:</span>
                            <span>{PhpFormat(selectedEmployee.salary_grade?.monthly_salary)}</span>
                        </div>

                        <div className="my-4 border-b-4 border-t-4 border-black bg-slate-300 px-2">
                            <span className="font-bold">GROSS EARNINGS</span>
                        </div>

                        <div className="grid grid-cols-2">
                            {benefits.map((benefit) => {
                                const employeeBenefit = selectedEmployee?.benefits?.find(
                                    (b) => b.id === benefit.id
                                );
                                return (
                                    <>
                                        <span className="font-bold">{benefit.name}:</span>
                                        <span>
                                            {PhpFormat(employeeBenefit?.pivot?.amount || 0)}
                                        </span>
                                    </>
                                );
                            })}

                            <span className="font-bold">TOTAL:</span>
                            <span>{PhpFormat(selectedEmployee.total_salary || 0)}</span>
                        </div>

                        <div className="my-4 border-b-4 border-t-4 border-black bg-slate-300 px-2">
                            <span className="font-bold">LESS: DEDUCTIONS</span>
                        </div>

                        <div className="grid grid-cols-2">
                            {loanTypes.map((loanType) => {
                                const employeeLoan = selectedEmployee?.loans?.find(
                                    (loan) => loan.loan_type_id === loanType.id
                                );
                                return (
                                    <>
                                        <span className="font-bold">{loanType.type}:</span>
                                        <span>
                                            {PhpFormat(employeeLoan?.remainingAmortization || 0)}
                                        </span>
                                    </>
                                );
                            })}

                            {selectedEmployee.contributions?.map((contribution) => (
                                <>
                                    <span className="font-bold">{contribution.name}:</span>
                                    <span>{PhpFormat(contribution.pivot.amount)}</span>
                                </>
                            ))}

                            <span className="font-bold">TOTAL DEDUCTION:</span>
                            <span>{PhpFormat(selectedEmployee.total_deductions || 0)}</span>
                        </div>

                        <div className="grid grid-cols-2 bg-high p-2 font-bold">
                            <span className="font-bold">NET AMOUNT:</span>
                            <span>{PhpFormat(selectedEmployee.total_payable || 0)}</span>
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
};

export default PayrollData;
