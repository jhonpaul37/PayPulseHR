import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import { Card, Empty, message, Modal, Form, Input, Select, Table, Row, Col } from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const { Option } = Select;

export default function ContributionsIndex({
    employees,
    contributions,
    lwopPera,
    auth,
    employeeContribution,
    employeeBenefits,
}) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAmountDisabled, setIsAmountDisabled] = useState(false);
    const [isLwopPeraModalVisible, setIsLwopPeraModalVisible] = useState(false);
    const [isBulkEditModalVisible, setIsBulkEditModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [lwopForm] = Form.useForm();
    const [bulkEditForm] = Form.useForm();
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

    // Row selection handler
    const onSelectChange = (selectedRowKeys) => {
        setSelectedEmployeeIds(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys: selectedEmployeeIds,
        onChange: onSelectChange,
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const showLwopPeraModal = () => {
        setIsLwopPeraModalVisible(true);
    };

    const handleLwopPeraCancel = () => {
        setIsLwopPeraModalVisible(false);
        lwopForm.resetFields();
        setSelectedEmployee(null);
        setSearchValue('');
    };

    const handleBulkEditCancel = () => {
        setIsBulkEditModalVisible(false);
        bulkEditForm.resetFields();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setIsAmountDisabled(false);
    };

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                Inertia.post(
                    route('contributions.store'),
                    {
                        employee_id: values.employee_id,
                        contribution_id: values.contribution_id,
                        amount: values.amount,
                    },
                    {
                        onSuccess: () => {
                            message.success('Contribution added successfully');
                            setIsModalVisible(false);
                            form.resetFields();
                        },
                    }
                );
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleLwopPeraSubmit = () => {
        lwopForm
            .validateFields()
            .then((values) => {
                if (!selectedEmployee) {
                    message.error('Please select an employee!');
                    return;
                }

                Inertia.post(
                    route('storeLwopRecord'),
                    {
                        employee_id: selectedEmployee.id,
                        minutes: values.minutes || 0,
                        hours: values.hours || 0,
                        days: values.days || 0,
                        amount: values.amount,
                    },
                    {
                        onSuccess: () => {
                            message.success('LWOP record saved successfully!');
                            setIsLwopPeraModalVisible(false);
                            lwopForm.resetFields();
                            setSelectedEmployee(null);
                            setSearchValue('');
                        },
                        onError: (errors) => {
                            message.error('Failed to save LWOP record');
                            console.error(errors);
                        },
                    }
                );
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleBulkEditSubmit = () => {
        bulkEditForm
            .validateFields()
            .then((values) => {
                if (selectedEmployeeIds.length === 0) {
                    message.error('Please select at least one employee!');
                    return;
                }

                Inertia.post(
                    route('employee_benefits.bulkUpdate'),
                    {
                        changes: selectedEmployeeIds.map((employee_id) => ({
                            employee_id,
                            benefit_id: lwopPera.id,
                            amount: values.amount,
                        })),
                    },
                    {
                        onSuccess: () => {
                            message.success('Bulk LWOP-PERA updated successfully!');
                            setIsBulkEditModalVisible(false);
                            bulkEditForm.resetFields();
                            setSelectedEmployeeIds([]);
                        },
                    }
                );
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleEmployeeSelect = (value, option) => {
        const employee = employees.find((e) => e.id === value);
        setSelectedEmployee(employee);
    };

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const filteredEmployees = employees.filter((employee) =>
        `${employee.first_name} ${employee.last_name}`
            .toLowerCase()
            .includes(searchValue.toLowerCase())
    );

    const handleFieldChange = () => {
        const { employee_id, contribution_id } = form.getFieldsValue();
        const selectedContribution = contributions.find((c) => c.id === contribution_id);
        const employee = employees.find((e) => e.id === employee_id);

        if (selectedContribution && employee) {
            const monthlySalary = employee.salary_grade?.monthly_salary || 0;

            if (selectedContribution.name === 'GSIS PREM') {
                const calculatedAmount = (monthlySalary * 0.09).toFixed(2);
                form.setFieldsValue({ amount: calculatedAmount });
                setIsAmountDisabled(true);
            } else if (selectedContribution.name === 'HDMF PREM1') {
                const calculatedAmount = (monthlySalary * 0.02).toFixed(2);
                form.setFieldsValue({ amount: calculatedAmount });
                setIsAmountDisabled(true);
            } else if (selectedContribution.name === 'PHIC') {
                const netBasic = monthlySalary;
                const calculatedAmount = (netBasic * 0.025).toFixed(2);
                form.setFieldsValue({ amount: calculatedAmount });
                setIsAmountDisabled(true);
            } else {
                setIsAmountDisabled(false);
            }
        } else {
            setIsAmountDisabled(false);
            form.setFieldsValue({ amount: '' });
        }
    };

    const columns = [
        {
            title: 'Employee',
            dataIndex: 'employee_name',
            key: 'employee_name',
        },
        {
            title: 'Contribution',
            dataIndex: 'contribution_name',
            key: 'contribution_name',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => `₱${parseFloat(amount).toFixed(2)}`,
        },
    ];

    const data = employeeBenefits.map((item) => {
        const lwopPeraAmount = item.benefit.name === 'LWOP-PERA' ? item.amount : null;

        return {
            key: item.id,
            employee_name: `${item.employee.first_name} ${item.employee.last_name}`,
            lwopPera: lwopPeraAmount ? `₱${parseFloat(lwopPeraAmount).toFixed(2)}` : '----',
        };
    });

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="border-b pb-6">
                <header className="flex items-center text-xl font-bold">
                    <Link
                        href={route('leaveManagement')}
                        className="mr-4 flex items-center text-gray-600 hover:text-gray-800"
                    >
                        {/* <ArrowLeftOutlined className="mr-1" /> */}
                    </Link>
                    Deduction
                </header>
            </div>
            <div className="pt-10">
                <div className="flex gap-6">
                    {/* Left Content */}
                    <div className="flex-1">
                        <div className="mb-4 flex gap-4">
                            {/* Add Deduction */}
                            <PrimaryButton type="primary" onClick={showModal}>
                                Add
                            </PrimaryButton>

                            {/* Edit LWOP (Single) */}
                            <PrimaryButton type="primary" onClick={showLwopPeraModal}>
                                LWOP
                            </PrimaryButton>
                        </div>

                        {/* Table */}
                        {employeeBenefits.length > 0 || employeeContribution.length > 0 ? (
                            <Table
                                dataSource={employees.map((employee) => {
                                    const lwopPeraAmount =
                                        employeeBenefits
                                            .filter(
                                                (item) =>
                                                    item.benefit.name === 'LWOP-PERA' &&
                                                    item.employee.id === employee.id
                                            )
                                            .map((item) => item.amount)[0] || '----';

                                    const contributionsForEmployee = employeeContribution.filter(
                                        (item) => item.employee.id === employee.id
                                    );

                                    const contributionsByName = {};
                                    contributionsForEmployee.forEach((item) => {
                                        contributionsByName[item.contribution.name] =
                                            `₱${parseFloat(item.amount).toFixed(2)}`;
                                    });

                                    return {
                                        key: employee.id,
                                        employee_name: `${employee.first_name} ${employee.last_name}`,
                                        ...contributionsByName,
                                        lwopPera:
                                            lwopPeraAmount === '----'
                                                ? lwopPeraAmount
                                                : `₱${parseFloat(lwopPeraAmount).toFixed(2)}`,
                                    };
                                })}
                                columns={[
                                    {
                                        title: 'Employee',
                                        dataIndex: 'employee_name',
                                        key: 'employee_name',
                                        fixed: 'left',
                                    },
                                    ...contributions.map((contribution) => ({
                                        title: contribution.name,
                                        dataIndex: contribution.name,
                                        key: contribution.name,
                                        render: (amount) => amount || '----',
                                    })),
                                    {
                                        title: 'LWOP-PERA',
                                        dataIndex: 'lwopPera',
                                        key: 'lwopPera',
                                        render: (amount) => amount || '----',
                                    },
                                ]}
                                pagination={false}
                                scroll={{ x: 'max-content' }}
                            />
                        ) : (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="No employee benefits or contributions available"
                                className="mt-6"
                            />
                        )}
                    </div>

                    {/* Right Content - Deduction Card */}
                    <div style={{ width: 300 }}>
                        {contributions && contributions.length > 0 ? (
                            <Card title="Deduction" className="mb-6" bodyStyle={{ padding: 12 }}>
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns:
                                            'repeat(auto-fill, minmax(120px, 1fr))',
                                        gap: 8,
                                    }}
                                >
                                    {contributions.map((contribution) => (
                                        <div
                                            key={contribution.id}
                                            style={{
                                                padding: 8,
                                                border: '1px solid #f0f0f0',
                                                borderRadius: 4,
                                                backgroundColor: '#fafafa',
                                            }}
                                        >
                                            <div style={{ fontSize: 14, fontWeight: 500 }}>
                                                {contribution.name}
                                            </div>
                                            <div style={{ fontSize: 12, color: '#666' }}>
                                                {contribution.description}
                                            </div>
                                        </div>
                                    ))}

                                    {lwopPera && (
                                        <div
                                            style={{
                                                padding: 8,
                                                border: '1px solid #f0f0f0',
                                                borderRadius: 4,
                                                backgroundColor: '#fafafa',
                                            }}
                                        >
                                            <div style={{ fontSize: 14, fontWeight: 500 }}>
                                                {lwopPera.name}
                                            </div>
                                            <div style={{ fontSize: 12, color: '#666' }}>
                                                {lwopPera.description}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ) : (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="No contributions available"
                                className="mb-6"
                            />
                        )}
                    </div>
                </div>

                {/* Add Deduction Modal */}
                <Modal
                    title="Add Deduction"
                    open={isModalVisible}
                    onCancel={handleCancel}
                    footer={[
                        <DangerButton
                            key="cancel"
                            onClick={handleCancel}
                            style={{ marginRight: '8px' }}
                        >
                            Cancel
                        </DangerButton>,
                        <PrimaryButton key="submit" type="primary" onClick={handleOk}>
                            Save
                        </PrimaryButton>,
                    ]}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        name="add_contribution_form"
                        onValuesChange={handleFieldChange}
                    >
                        <Form.Item
                            name="employee_id"
                            label="Employee"
                            rules={[{ required: true, message: 'Please select an employee!' }]}
                        >
                            <Select placeholder="Select an employee">
                                {employees.map((employee) => (
                                    <Option key={employee.id} value={employee.id}>
                                        {employee.first_name} {employee.last_name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="contribution_id"
                            label="Contribution"
                            rules={[{ required: true, message: 'Please select a contribution!' }]}
                        >
                            <Select placeholder="Select contribution">
                                {contributions.map((contribution) => (
                                    <Option key={contribution.id} value={contribution.id}>
                                        {contribution.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="amount"
                            label="Amount"
                            rules={[
                                {
                                    required: !isAmountDisabled,
                                    message: 'Please input the amount!',
                                },
                            ]}
                        >
                            <Input
                                type="number"
                                placeholder="Enter amount"
                                disabled={isAmountDisabled}
                            />
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Edit LWOP Modal (Single) */}
                <Modal
                    title="LWOP"
                    open={isLwopPeraModalVisible}
                    onCancel={handleLwopPeraCancel}
                    footer={[
                        <DangerButton
                            key="cancel"
                            onClick={handleLwopPeraCancel}
                            style={{ marginRight: '8px' }}
                        >
                            Cancel
                        </DangerButton>,
                        <PrimaryButton key="submit" type="primary" onClick={handleLwopPeraSubmit}>
                            Save
                        </PrimaryButton>,
                    ]}
                    width={700}
                >
                    <Form form={lwopForm} layout="vertical">
                        <Form.Item
                            name="employee_id"
                            label="Select Employee"
                            rules={[{ required: true, message: 'Please select an employee!' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Search employee"
                                filterOption={false}
                                onSearch={handleSearch}
                                onChange={handleEmployeeSelect}
                                notFoundContent={null}
                                style={{ width: '100%' }}
                            >
                                {filteredEmployees.map((employee) => (
                                    <Option key={employee.id} value={employee.id}>
                                        {employee.first_name} {employee.last_name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        {console.log(employees)}

                        {selectedEmployee && (
                            <>
                                <div className="flex justify-between">
                                    <div>
                                        <label className="mr-3">Month of:</label>
                                        <TextInput
                                            value={new Date().toLocaleString('en-US', {
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                            disabled
                                            className="bg-gray-100 text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="mr-3">Monthly Salary:</label>
                                        <TextInput
                                            value={
                                                selectedEmployee?.salary_grade?.monthly_salary
                                                    ? `₱${selectedEmployee.salary_grade.monthly_salary.toLocaleString()}`
                                                    : ''
                                            }
                                            disabled
                                            className="bg-gray-100 text-gray-500"
                                        />
                                    </div>
                                </div>
                                <label className="font-bold">Period</label>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Form.Item name="days" label="Day(s)">
                                            <TextInput
                                                type="number"
                                                placeholder="Days"
                                                min={0}
                                                style={{ width: '100%' }}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name="hours" label="Hour(s)">
                                            <TextInput
                                                type="number"
                                                placeholder="Hours"
                                                min={0}
                                                max={23}
                                                style={{ width: '100%' }}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item
                                            name="minutes"
                                            label="Minute(s)"
                                            rules={[
                                                { required: true, message: 'Please enter minutes' },
                                            ]}
                                        >
                                            <TextInput
                                                type="number"
                                                placeholder="Minutes"
                                                min={0}
                                                max={59}
                                                style={{ width: '100%' }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <label className="font-bold">Equivalent</label>
                                <div className="flex gap-5">
                                    <Form.Item name="credit" label="Credit">
                                        <Input type="credit" placeholder="Credit" />
                                    </Form.Item>

                                    <Form.Item
                                        name="amount"
                                        label="Amount *"
                                        rules={[
                                            { required: true, message: 'Please enter the amount' },
                                        ]}
                                    >
                                        <Input
                                            type="number"
                                            placeholder="Amount"
                                            prefix="₱"
                                            autoComplete="off"
                                        />
                                    </Form.Item>
                                </div>
                            </>
                        )}
                    </Form>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
