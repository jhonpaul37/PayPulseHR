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

    const showEmployeeModal = (employee) => {
        setSelectedEmployee(employee);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

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
            // className: 'bg-yellow-400',
        };
        const PATVEColumn = {
            title: 'PATVE CONT.',
            render: (_, record) => {
                const contribution = record.contributions?.find((c) => c.name === 'PATVE CONT.');
                return contribution ? PhpFormat(contribution.pivot.amount || 0) : ' ';
            },
            width: 150,
            // className: 'bg-yellow-300',
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
                render: (_, record) => {
                    const { department } = record;
                    return `${department || ''}`.trim();
                },
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
                // className: 'bg-yellow-400',
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
                // className: 'bg-yellow-400',
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
                // className: 'bg-yellow-400',
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
                render: PhpFormat,
                width: 150,
                // className: 'bg-yellow-400',
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
            // className: 'bg-orange-400 ',
        };
        // Net Amont
        const NetAmountColumn = {
            title: 'Net Amount',
            render: (_, record) => {
                return <span className="font-semibold">{PhpFormat(record.net_amount || 0)}</span>;
            },
            width: 200,
            // className: 'bg-red-400 ',
        };
        // const NetPay1To15Column = [
        //     {
        //         title: 'Net Pay 1-15',
        //         render: (_, record) => {
        //             return <span className="font-semibold">{PhpFormat(record.net_pay || 0)}</span>;
        //         },
        //         width: 200,
        //         className: 'bg-green-200',
        //     },
        //     {
        //         title: 'Net Pay 16-30',
        //         render: (_, record) => {
        //             return <span className="font-semibold">{PhpFormat(record.net_pay || 0)}</span>;
        //         },
        //         width: 200,
        //         className: 'bg-green-300',
        //     },
        // ];

        // Combine all columns
        setColumns([
            ...staticColumns,
            ...BenefitColumns,
            ...ContributionColumns,
            ...loanColumns,
            PATVEColumn,
            loansTotalColumn,
            totalDeductionColumn,
            NetAmountColumn,
            // ...NetPay1To15Column,
        ]);
    }, [loanTypes, employee]);

    // const saveTransaction = () => {
    //     const dataToSend = dataSource.map((employee) => ({
    //         id: employee.id,v
    //         loans: employee.loans.map((loan) => ({
    //             loan_id: loan.id,
    //             remaining_amortization: loan.remainingAmortization,
    //         })),
    //     }));

    //     Inertia.post('/transactions', {
    //         data: dataToSend,
    //     });
    // };

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };
    const saveTransaction = () => {
        const dataToSend = dataSource.map((employee) => ({
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
            // Add any other data that needs to be sent
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
            />
            {/* <Table
                dataSource={dataSource}
                columns={columns}
                rowKey="employee_id"
                scroll={{ x: 'max-content', y: 485 }}
                onRow={(record) => ({
                    onClick: () => showEmployeeModal(record),
                })}
            /> */}

            {/* {console.log(transaction)} */}
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
                            <span>{selectedEmployee.department}</span>

                            <span className="font-bold">EMPLOYEE NO:</span>
                            <span>{selectedEmployee.employee_id}</span>

                            <span className="font-bold">EMPLOYEE NAME:</span>
                            <span>{`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}</span>

                            <span className="font-bold">POSITION:</span>
                            <span>{selectedEmployee.position}</span>

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
                        {/* <div className="my-4 border-b-4 border-t-4 border-black bg-slate-300 px-2">
                            <span className="font-bold">NET PAY</span>
                        </div> */}
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
};

export default PayrollData;
