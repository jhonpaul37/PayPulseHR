import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

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
            <h1>Add Loan</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Select Employee</label>
                    <select
                        value={data.employee_id}
                        onChange={(e) => setData('employee_id', e.target.value)}
                    >
                        <option value="">-- Select Employee --</option>
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                                {employee.first_name} {employee.last_name}
                            </option>
                        ))}
                    </select>
                    {errors.employee_id && <div>{errors.employee_id}</div>}
                </div>

                <div>
                    <label>Amount</label>
                    <TextInput
                        type="number"
                        value={data.amount}
                        onChange={(e) => setData('amount', e.target.value)}
                    />
                    {errors.amount && <div>{errors.amount}</div>}
                </div>

                <div>
                    <label>Loan Date</label>
                    <TextInput
                        type="date"
                        value={data.loan_date}
                        onChange={(e) => setData('loan_date', e.target.value)}
                    />
                    {errors.loan_date && <div>{errors.loan_date}</div>}
                </div>

                <div>
                    <label>Interest Rate (%)</label>
                    <TextInput
                        type="number"
                        value={data.interest_rate}
                        onChange={(e) => setData('interest_rate', e.target.value)}
                    />
                    {errors.interest_rate && <div>{errors.interest_rate}</div>}
                </div>

                <div>
                    <label>Due Date</label>
                    <TextInput
                        type="date"
                        value={data.due_date}
                        onChange={(e) => setData('due_date', e.target.value)}
                    />
                    {errors.due_date && <div>{errors.due_date}</div>}
                </div>

                {/* <button type="submit">Add Loan</button> */}
                <PrimaryButton className="ms-4" disabled={processing}>
                    Add Loan
                </PrimaryButton>
            </form>
        </AuthenticatedLayout>
    );
};

export default CreateLoan;
