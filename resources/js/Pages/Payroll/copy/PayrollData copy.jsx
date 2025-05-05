import { React, useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Table, Drawer, Modal, Spin, Alert } from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';

// Error Boundary Component
const ErrorBoundary = ({ children }) => {
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState(null);

    const handleOnError = (error, errorInfo) => {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        setHasError(true);
        setError(error);
    };

    if (hasError) {
        return (
            <div className="rounded border border-red-400 bg-red-100 p-4 text-red-700">
                <h3 className="font-bold">Something went wrong</h3>
                <p>{error?.message || 'Unknown error'}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-2 rounded bg-red-500 px-3 py-1 text-white"
                >
                    Reload Page
                </button>
            </div>
        );
    }

    return children;
};

// Format PHP Peso
const PhpFormat = (value) => {
    if (value === undefined || value === null) return '₱0.00';
    const num = parseFloat(value);
    return isNaN(num)
        ? '₱0.00'
        : `₱${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const PayrollData = ({
    auth,
    employees = [],
    loanTypes = [],
    message,
    reference_number,
    transactions = [],
    benefits = [],
    contributions = [],
}) => {
    const [dataSource, setDataSource] = useState([]);
    const [columns, setColumns] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [grandTotals, setGrandTotals] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Transform employee data for the table
    useEffect(() => {
        try {
            if (!employees || !Array.isArray(employees)) {
                throw new Error('Invalid employees data');
            }

            const transformedData = employees.map((employee) => {
                // Calculate totals from relationships with proper null checks
                const totalBenefits =
                    employee?.benefits?.reduce(
                        (sum, benefit) => sum + parseFloat(benefit?.pivot?.amount || 0),
                        0
                    ) || 0;

                const totalContributions =
                    employee?.contributions?.reduce(
                        (sum, contribution) => sum + parseFloat(contribution?.pivot?.amount || 0),
                        0
                    ) || 0;

                const totalLoans =
                    employee?.loans?.reduce(
                        (sum, loan) => sum + parseFloat(loan?.pivot?.monthly_amortization || 0),
                        0
                    ) || 0;

                const totalDeductions = totalContributions + totalLoans;
                const grossSalary = (employee?.salary_grade?.monthly_salary || 0) + totalBenefits;
                const netAmount = grossSalary - totalDeductions;

                return {
                    ...employee,
                    key: employee?.employee_id || employee?.id,
                    total_benefits: totalBenefits,
                    total_contributions: totalContributions,
                    total_loans: totalLoans,
                    total_deductions: totalDeductions,
                    gross_salary: grossSalary,
                    net_amount: netAmount,
                    pera_amount:
                        employee?.benefits?.find((b) => b?.name === 'PERA')?.pivot?.amount || 0,
                    net_pera:
                        employee?.benefits?.find((b) => b?.name === 'PERA')?.pivot?.amount || 0,
                    loans:
                        employee?.loans?.map((loan) => ({
                            ...loan,
                            remainingAmortization: loan?.pivot?.monthly_amortization,
                        })) || [],
                };
            });

            setDataSource(transformedData);
            setLoading(false);
        } catch (err) {
            console.error('Error transforming employee data:', err);
            setError(err);
            setLoading(false);
        }
    }, [employees]);

    // Calculate grand totals
    useEffect(() => {
        if (!dataSource || dataSource.length === 0) return;

        const totals = {
            basic_pay: 0,
            net_basic: 0,
            pera: 0,
            net_pera: 0,
            lwop_pera: 0,
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

        try {
            dataSource.forEach((record) => {
                totals.basic_pay += record?.salary_grade?.monthly_salary || 0;
                totals.net_basic += record?.salary_grade?.monthly_salary || 0;
                totals.pera +=
                    record?.benefits?.find((b) => b?.name === 'PERA')?.pivot?.amount || 0;
                totals.net_pera += record?.net_pera || 0;
                totals.lwop_pera +=
                    record?.benefits?.find((b) => b?.name === 'LWOP-PERA')?.pivot?.amount || 0;
                totals.rata +=
                    record?.benefits?.find((b) => b?.name === 'RATA')?.pivot?.amount || 0;
                totals.salary_differential +=
                    record?.benefits?.find((b) => b?.name === 'SALARY DIFFERENTIAL')?.pivot
                        ?.amount || 0;
                totals.total_salary += record?.gross_salary || 0;
                totals.tax +=
                    record?.contributions?.find((c) => c?.name === 'TAX')?.pivot?.amount || 0;
                totals.gsis_prem +=
                    record?.contributions?.find((c) => c?.name === 'GSIS PREM')?.pivot?.amount || 0;
                totals.hdmf_prem1 +=
                    record?.contributions?.find((c) => c?.name === 'HDMF PREM1')?.pivot?.amount ||
                    0;
                totals.phic +=
                    record?.contributions?.find((c) => c?.name === 'PHIC')?.pivot?.amount || 0;
                totals.total_contributions += record?.total_contributions || 0;
                totals.patve_cont +=
                    record?.contributions?.find((c) => c?.name === 'PATVE CONT.')?.pivot?.amount ||
                    0;
                totals.loans_total +=
                    record?.loans?.reduce(
                        (sum, loan) => sum + (loan?.remainingAmortization || 0),
                        0
                    ) || 0;
                totals.total_deductions += record?.total_deductions || 0;
                totals.net_amount += record?.net_amount || 0;
            });

            setGrandTotals(totals);
        } catch (err) {
            console.error('Error calculating grand totals:', err);
            setError(err);
        }
    }, [dataSource]);

    // Set up table columns
    useEffect(() => {
        try {
            if (!loanTypes || !Array.isArray(loanTypes)) {
                throw new Error('Invalid loan types data');
            }

            const loanColumns =
                loanTypes?.map((loanType) => ({
                    title: loanType?.type?.toUpperCase() || 'LOAN',
                    render: (_, record) => {
                        const loan = record?.loans?.find(
                            (loan) => loan?.loan_type_id === loanType?.id
                        );
                        return loan?.remainingAmortization
                            ? PhpFormat(loan.remainingAmortization)
                            : '';
                    },
                    width: 150,
                })) || [];

            const loansTotalColumn = {
                title: 'LOANS TOTAL',
                render: (_, record) => (
                    <span className="font-semibold">{PhpFormat(record?.total_loans || 0)}</span>
                ),
                width: 150,
            };

            const PATVEColumn = {
                title: 'PATVE CONT.',
                render: (_, record) => {
                    const contribution = record?.contributions?.find(
                        (c) => c?.name === 'PATVE CONT.'
                    );
                    return contribution ? PhpFormat(contribution?.pivot?.amount || 0) : ' ';
                },
                width: 150,
            };

            const staticColumns = [
                {
                    title: 'EMPLOYEE NO',
                    dataIndex: 'employee_id',
                    width: 120,
                },
                {
                    title: 'EMPLOYEE NAME',
                    render: (_, record) =>
                        `${record?.first_name || ''} ${record?.last_name || ''}`.trim(),
                    width: 200,
                },
                {
                    title: 'DEPARTMENT',
                    render: (_, record) => record?.department?.name || 'N/A',
                    width: 150,
                },
                {
                    title: 'SG-STEP',
                    render: (_, record) =>
                        record?.salary_grade
                            ? `${record.salary_grade.grade}-${record.salary_grade.step}`
                            : '',
                    width: 100,
                },
                {
                    title: 'POSITION',
                    render: (_, record) => record?.position?.name || 'N/A',
                    width: 150,
                },
                {
                    title: 'BASIC PAY',
                    render: (_, record) => PhpFormat(record?.salary_grade?.monthly_salary || 0),
                    width: 150,
                },
                {
                    title: 'NET BASIC',
                    render: (_, record) => (
                        <span className="font-semibold">
                            {PhpFormat(record?.salary_grade?.monthly_salary || 0)}
                        </span>
                    ),
                    width: 150,
                },
                {
                    title: 'PERA',
                    render: (_, record) => {
                        const benefit = record?.benefits?.find((b) => b?.name === 'PERA');
                        return benefit ? PhpFormat(benefit?.pivot?.amount || 0) : '';
                    },
                    width: 150,
                },
            ];

            const BenefitColumns = [
                {
                    title: 'LWOP-PERA',
                    render: (_, record) => {
                        const benefit = record?.benefits?.find((b) => b?.name === 'LWOP-PERA');
                        return benefit ? PhpFormat(benefit?.pivot?.amount || 0) : '';
                    },
                    width: 150,
                },
                {
                    title: 'NET PERA',
                    render: (_, record) => (
                        <span className="font-semibold">{PhpFormat(record?.net_pera || 0)}</span>
                    ),
                    width: 150,
                },
                {
                    title: 'RATA',
                    render: (_, record) => {
                        const benefit = record?.benefits?.find((b) => b?.name === 'RATA');
                        return benefit ? PhpFormat(benefit?.pivot?.amount || 0) : ' ';
                    },
                    width: 150,
                },
                {
                    title: 'SALARY DIFFERENTIAL',
                    render: (_, record) => {
                        const benefit = record?.benefits?.find(
                            (b) => b?.name === 'SALARY DIFFERENTIAL'
                        );
                        return benefit ? PhpFormat(benefit?.pivot?.amount || 0) : ' ';
                    },
                    width: 150,
                },
                {
                    title: 'TOTAL',
                    render: (_, record) => (
                        <span className="font-semibold">
                            {PhpFormat(record?.gross_salary || 0)}
                        </span>
                    ),
                    width: 150,
                },
            ];

            const ContributionColumns = [
                {
                    title: 'TAX',
                    render: (_, record) => {
                        const contribution = record?.contributions?.find((c) => c?.name === 'TAX');
                        return contribution ? PhpFormat(contribution?.pivot?.amount || 0) : ' ';
                    },
                    width: 150,
                },
                {
                    title: 'GSIS PREM',
                    render: (_, record) => {
                        const contribution = record?.contributions?.find(
                            (c) => c?.name === 'GSIS PREM'
                        );
                        return contribution ? PhpFormat(contribution?.pivot?.amount || 0) : ' ';
                    },
                    width: 150,
                },
                {
                    title: 'HDMF PREM1',
                    render: (_, record) => {
                        const contribution = record?.contributions?.find(
                            (c) => c?.name === 'HDMF PREM1'
                        );
                        return contribution ? PhpFormat(contribution?.pivot?.amount || 0) : ' ';
                    },
                    width: 150,
                },
                {
                    title: 'PHIC',
                    render: (_, record) => {
                        const contribution = record?.contributions?.find((c) => c?.name === 'PHIC');
                        return contribution ? PhpFormat(contribution?.pivot?.amount || 0) : ' ';
                    },
                    width: 150,
                },
                {
                    title: 'BIR GSIS PHIC HDMF TOTAL',
                    render: (_, record) => (
                        <strong>{PhpFormat(record?.total_contributions || 0)}</strong>
                    ),
                    width: 150,
                },
            ];

            const totalDeductionColumn = {
                title: 'TOTAL DEDUCTION',
                render: (_, record) => (
                    <span className="font-semibold">
                        {PhpFormat(record?.total_deductions || 0)}
                    </span>
                ),
                width: 200,
            };

            const NetAmountColumn = {
                title: 'Net Amount',
                render: (_, record) => (
                    <span className="font-semibold">{PhpFormat(record?.net_amount || 0)}</span>
                ),
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
        } catch (err) {
            console.error('Error setting up columns:', err);
            setError(err);
        }
    }, [loanTypes]);

    const showEmployeeModal = (employee) => {
        try {
            setSelectedEmployee(employee);
            setModalVisible(true);
        } catch (err) {
            console.error('Error showing employee modal:', err);
            setError(err);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const savePayroll = async () => {
        try {
            if (!dataSource || dataSource.length === 0) {
                throw new Error('No employee data available to save');
            }

            const payrollData = {
                pay_period_start: new Date().toISOString().split('T')[0],
                pay_period_end: new Date().toISOString().split('T')[0],
                pay_date: new Date().toISOString().split('T')[0],
                employees: dataSource.map((employee) => ({
                    employee_id: employee?.id,
                    basic_salary: employee?.salary_grade?.monthly_salary || 0,
                    gross_earnings: employee?.gross_salary || 0,
                    total_deductions: employee?.total_deductions || 0,
                    net_pay: employee?.net_amount || 0,
                    earnings:
                        employee?.benefits?.map((benefit) => ({
                            benefit_id: benefit?.id,
                            amount: benefit?.pivot?.amount || 0,
                        })) || [],
                    deductions:
                        employee?.contributions?.map((contribution) => ({
                            contribution_id: contribution?.id,
                            amount: contribution?.pivot?.amount || 0,
                            type: 'contribution',
                        })) || [],
                    loans:
                        employee?.loans?.map((loan) => ({
                            loan_id: loan?.id,
                            amount: loan?.remainingAmortization || 0,
                            type: 'loan',
                        })) || [],
                })),
            };

            await Inertia.post('/payrolls', payrollData, {
                onSuccess: () => {
                    Inertia.reload();
                },
                onError: (errors) => {
                    throw new Error(errors?.message || 'Failed to save payroll');
                },
            });
        } catch (err) {
            console.error('Error saving payroll:', err);
            setError(err);
        }
    };

    if (loading) {
        return (
            <AuthenticatedLayout user={auth?.user}>
                <div className="flex h-64 items-center justify-center">
                    <Spin size="large" tip="Loading payroll data..." />
                </div>
            </AuthenticatedLayout>
        );
    }

    if (error) {
        return (
            <AuthenticatedLayout user={auth?.user}>
                <div className="p-4">
                    <Alert
                        message="Error"
                        description={error?.message || 'An unexpected error occurred'}
                        type="error"
                        showIcon
                        closable
                        onClose={() => setError(null)}
                    />
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
                    >
                        Reload Page
                    </button>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <ErrorBoundary>
            <AuthenticatedLayout user={auth?.user}>
                <h2 className="pb-10 text-center text-2xl font-bold">Payroll Data</h2>
                {message && (
                    <div className="pb-4 text-center font-semibold text-green-600">{message}</div>
                )}
                {reference_number && (
                    <div className="pb-4 text-center font-semibold text-blue-600">
                        Payroll Reference: {reference_number}
                    </div>
                )}

                <div className="flex justify-end gap-5 pb-5">
                    <PrimaryButton
                        onClick={savePayroll}
                        className="rounded px-4 py-2"
                        disabled={!dataSource || dataSource.length === 0}
                    >
                        Save Payroll
                    </PrimaryButton>
                    <PrimaryButton onClick={showDrawer} className="rounded px-4 py-2">
                        View Past Payrolls
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
                                {loanTypes?.map((_, index) => (
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

                {/* Drawer for viewing past payrolls */}
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
                        dataSource={transactions}
                        columns={[
                            {
                                title: 'Pay Date',
                                dataIndex: 'pay_date',
                                key: 'pay_date',
                                render: (date) =>
                                    date ? new Date(date).toLocaleDateString() : 'N/A',
                            },
                            {
                                title: 'Employees',
                                dataIndex: 'employee_count',
                                key: 'employee_count',
                                render: (_, record) => record?.employees?.length || 0,
                            },
                            {
                                title: 'Total Amount',
                                dataIndex: 'total_amount',
                                key: 'total_amount',
                                render: (_, record) => {
                                    const total =
                                        record?.employees?.reduce(
                                            (sum, emp) => sum + (emp?.net_pay || 0),
                                            0
                                        ) || 0;
                                    return PhpFormat(total);
                                },
                            },
                        ]}
                        rowKey="id"
                        pagination={false}
                        onRow={(record) => ({
                            onClick: () => {
                                Inertia.visit(`/payrolls/${record?.id}`);
                            },
                        })}
                    />
                </Drawer>

                {/* Modal for employee details */}
                <Modal
                    open={modalVisible}
                    onCancel={handleCloseModal}
                    footer={null}
                    width={800}
                    destroyOnClose
                >
                    <div className="flex justify-center py-5 text-xl font-bold">
                        Employee Details
                    </div>
                    {selectedEmployee ? (
                        <div>
                            <div className="grid grid-cols-2 gap-2">
                                <span className="font-bold">DEPARTMENT:</span>
                                <span>{selectedEmployee?.department?.name || 'N/A'}</span>

                                <span className="font-bold">EMPLOYEE NO:</span>
                                <span>{selectedEmployee?.employee_id || 'N/A'}</span>

                                <span className="font-bold">EMPLOYEE NAME:</span>
                                <span>
                                    {`${selectedEmployee?.first_name || ''} ${selectedEmployee?.last_name || ''}`.trim() ||
                                        'N/A'}
                                </span>

                                <span className="font-bold">POSITION:</span>
                                <span>{selectedEmployee?.position?.name || 'N/A'}</span>

                                <span className="font-bold">SG-STEP:</span>
                                <span>
                                    {selectedEmployee?.salary_grade
                                        ? `${selectedEmployee.salary_grade.grade}-${selectedEmployee.salary_grade.step}`
                                        : 'N/A'}
                                </span>

                                <span className="font-bold">BASIC SALARY:</span>
                                <span>
                                    {PhpFormat(selectedEmployee?.salary_grade?.monthly_salary)}
                                </span>
                            </div>

                            <div className="my-4 border-b-4 border-t-4 border-black bg-slate-300 px-2">
                                <span className="font-bold">GROSS EARNINGS</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {benefits?.map((benefit) => {
                                    const employeeBenefit = selectedEmployee?.benefits?.find(
                                        (b) => b?.id === benefit?.id
                                    );
                                    return (
                                        <>
                                            <span className="font-bold">{benefit?.name}:</span>
                                            <span>
                                                {PhpFormat(employeeBenefit?.pivot?.amount || 0)}
                                            </span>
                                        </>
                                    );
                                })}

                                <span className="font-bold">TOTAL:</span>
                                <span>{PhpFormat(selectedEmployee?.gross_salary || 0)}</span>
                            </div>

                            <div className="my-4 border-b-4 border-t-4 border-black bg-slate-300 px-2">
                                <span className="font-bold">LESS: DEDUCTIONS</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {loanTypes?.map((loanType) => {
                                    const employeeLoan = selectedEmployee?.loans?.find(
                                        (loan) => loan?.loan_type_id === loanType?.id
                                    );
                                    return (
                                        <>
                                            <span className="font-bold">{loanType?.type}:</span>
                                            <span>
                                                {PhpFormat(
                                                    employeeLoan?.remainingAmortization || 0
                                                )}
                                            </span>
                                        </>
                                    );
                                })}

                                {contributions?.map((contribution) => {
                                    const employeeContribution =
                                        selectedEmployee?.contributions?.find(
                                            (c) => c?.id === contribution?.id
                                        );
                                    return (
                                        <>
                                            <span className="font-bold">{contribution?.name}:</span>
                                            <span>
                                                {PhpFormat(
                                                    employeeContribution?.pivot?.amount || 0
                                                )}
                                            </span>
                                        </>
                                    );
                                })}

                                <span className="font-bold">TOTAL DEDUCTION:</span>
                                <span>{PhpFormat(selectedEmployee?.total_deductions || 0)}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 bg-gray-100 p-2 font-bold">
                                <span>NET AMOUNT:</span>
                                <span>{PhpFormat(selectedEmployee?.net_amount || 0)}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="py-4 text-center">No employee data available</div>
                    )}
                </Modal>
            </AuthenticatedLayout>
        </ErrorBoundary>
    );
};

export default PayrollData;
