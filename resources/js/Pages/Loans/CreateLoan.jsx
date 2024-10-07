import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Select } from 'antd';
import TextInput from '@/Components/TextInput';
import DateInput from '@/Components/DateInput';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const { Option } = Select;

const CreateLoan = ({ auth, employees }) => {
    const { data, setData, post, errors, processing } = useForm({
        employee_id: '',
        amount: '',
        loan_date: '',
        interest_rate: '',
        due_date: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('loans.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="border-b pb-6">
                <header className="flex justify-center text-xl font-bold">Add Loan</header>
            </div>
            <div className="grid grid-cols-2 gap-10 pt-10">
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <label>Select Employee</label>
                            <Select
                                showSearch
                                placeholder="Select Employee"
                                optionFilterProp="children"
                                value={data.employee_id}
                                onChange={(value) => setData('employee_id', value)}
                                filterOption={(input, option) =>
                                    option?.children
                                        ?.toString()
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                                style={{ width: '100%' }}
                            >
                                {employees.map((employee) => (
                                    <Option key={employee.id} value={employee.id}>
                                        {employee.first_name} {employee.last_name}
                                    </Option>
                                ))}
                            </Select>

                            {errors.employee_id && <div>{errors.employee_id}</div>}
                        </div>

                        <div className="flex flex-col">
                            <label>Amount</label>
                            <TextInput
                                type="number"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                            />
                            {errors.amount && <div>{errors.amount}</div>}
                        </div>

                        <div className="flex flex-col">
                            <label>Loan Date</label>
                            <DateInput
                                value={data.loan_date}
                                onChange={(date, dateString) => setData('loan_date', dateString)} // Handle dateString correctly
                            />
                            {errors.loan_date && <div>{errors.loan_date}</div>}
                        </div>

                        <div className="flex flex-col">
                            <label>Interest Rate (%)</label>
                            <TextInput
                                type="number"
                                value={data.interest_rate}
                                onChange={(e) => setData('interest_rate', e.target.value)}
                            />
                            {errors.interest_rate && <div>{errors.interest_rate}</div>}
                        </div>

                        <div className="flex flex-col">
                            <label>Due Date</label>
                            <DateInput
                                value={data.due_date}
                                onChange={(date, dateString) => setData('due_date', dateString)} // Handle dateString correctly
                            />
                            {errors.due_date && <div>{errors.due_date}</div>}
                        </div>

                        <div className="flex justify-end pt-10">
                            <PrimaryButton className="ms-4" disabled={processing}>
                                Add Loan
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
                <div>table</div>
            </div>
        </AuthenticatedLayout>
    );
};

export default CreateLoan;
