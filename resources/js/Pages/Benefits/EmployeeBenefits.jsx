import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Table, Modal, Form, InputNumber, Select, Card, Empty, message, Divider } from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';

const { Grid } = Card;

const getGridStyle = (totalItems) => {
    const gridWidth = totalItems > 0 ? `${100 / Math.min(totalItems, 4)}%` : '25%';
    return {
        width: gridWidth,
        textAlign: 'center',
        cursor: 'pointer',
    };
};

// Format numbers as Philippine Peso
const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '₱0.00';
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(amount);
};

const BenefitsDashboard = ({ auth, employees, benefits, employeeBenefits }) => {
    const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
    const [editedBenefits, setEditedBenefits] = useState([]); // Track changes during edit mode
    const [selectedEmployees, setSelectedEmployees] = useState([]); // Track selected employees
    const [selectedBenefit, setSelectedBenefit] = useState(null); // Track the selected benefit for bulk editing
    const [bulkAmount, setBulkAmount] = useState(null); // Amount to apply to selected employees

    // Filter out the LWOP-PERA benefit
    const filteredBenefits = benefits.filter((benefit) => benefit.name !== 'LWOP-PERA');

    const handleEmployeeSelection = (selectedRowKeys) => {
        setSelectedEmployees(selectedRowKeys);
    };

    const handleBulkUpdate = () => {
        if (!selectedBenefit) {
            message.warning('Please select a benefit to update.');
            return;
        }

        if (bulkAmount === null) {
            message.warning('Please enter an amount.');
            return;
        }

        const changes = selectedEmployees.map((employeeId) => ({
            employee_id: employeeId,
            benefit_id: selectedBenefit,
            amount: bulkAmount,
        }));

        Inertia.post(
            route('employee_benefits.bulkUpdate'),
            { changes },
            {
                onSuccess: () => {
                    message.success('Bulk benefits updated successfully!');
                    setEditedBenefits([]);
                    setIsEditing(false);
                    setSelectedEmployees([]);
                    setBulkAmount(null);
                    setSelectedBenefit(null);
                },
                onError: () => {
                    message.error('Failed to update benefits.');
                },
            }
        );
    };

    const rowSelection = {
        selectedRowKeys: selectedEmployees,
        onChange: handleEmployeeSelection,
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            {/* Available Benefits */}
            {filteredBenefits && filteredBenefits.length > 0 ? (
                <Card title="Gross Earnings" className="mb-6">
                    {filteredBenefits.map((benefit) => (
                        <Grid key={benefit.id} style={getGridStyle(filteredBenefits.length)}>
                            <div className="text-lg font-bold">{benefit.name}</div>
                        </Grid>
                    ))}
                </Card>
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No benefits available"
                    className="mb-6"
                />
            )}

            <Divider style={{ borderColor: '#F0C519' }} className="pt-5" />

            <div>
                <h2 className="mb-5 text-lg font-semibold">Gross Earnings Management</h2>
                <div className="mb-4 flex gap-2">
                    <Select
                        placeholder="Select Benefit"
                        value={selectedBenefit}
                        onChange={(value) => setSelectedBenefit(value)}
                        style={{ width: 200 }}
                    >
                        {filteredBenefits.map((benefit) => (
                            <Select.Option key={benefit.id} value={benefit.id}>
                                {benefit.name}
                            </Select.Option>
                        ))}
                    </Select>
                    <InputNumber
                        placeholder="Enter Amount"
                        value={bulkAmount}
                        onChange={(value) => setBulkAmount(value)}
                        style={{ width: 200 }}
                    />
                    <PrimaryButton type="primary" onClick={handleBulkUpdate}>
                        Apply to Selected
                    </PrimaryButton>
                </div>

                <Table
                    dataSource={employees}
                    rowKey="id"
                    rowSelection={rowSelection}
                    pagination={{ pageSize: 10 }}
                >
                    <Table.Column
                        title="Employee"
                        render={(text, record) => (
                            <span>
                                {record.first_name} {record.last_name}
                            </span>
                        )}
                    />
                    {filteredBenefits.map((benefit) => (
                        <Table.Column
                            key={benefit.id}
                            title={benefit.name}
                            render={(text, record) => {
                                const employeeBenefit = employeeBenefits.find(
                                    (eb) =>
                                        eb.employee_id === record.id && eb.benefit_id === benefit.id
                                );
                                return <span>{formatCurrency(employeeBenefit?.amount || 0)}</span>;
                            }}
                        />
                    ))}
                </Table>
            </div>
        </AuthenticatedLayout>
    );
};

export default BenefitsDashboard;
