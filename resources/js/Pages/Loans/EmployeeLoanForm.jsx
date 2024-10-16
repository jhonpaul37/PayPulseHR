import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import PrimaryButton from '@/Components/PrimaryButton';

function EmployeeLoanForm({ employeeLoan = {}, employees, loanPlans }) {
    const [formData, setFormData] = useState({
        employee_id: employeeLoan.employee_id || '',
        loan_plan_id: employeeLoan.loan_plan_id || '',
        amount: employeeLoan.amount || '',
        loan_date: employeeLoan.loan_date || '',
        monthly_amortization: employeeLoan.monthly_amortization || '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (employeeLoan.id) {
            Inertia.put(`/employee_loans/${employeeLoan.id}`, formData);
        } else {
            Inertia.post('/employee_loans', formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700">
                    Employee
                </label>
                <select
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                >
                    <option value="">Select an employee</option>
                    {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                            {`${employee.first_name} ${employee.last_name}`}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="loan_plan_id" className="block text-sm font-medium text-gray-700">
                    Loan Plan
                </label>
                <select
                    name="loan_plan_id"
                    value={formData.loan_plan_id}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                >
                    <option value="">Select a loan plan</option>
                    {loanPlans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                            {`${plan.months} months, ${plan.interest_rate}% interest`}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Amount
                </label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                />
            </div>

            <div>
                <label htmlFor="loan_date" className="block text-sm font-medium text-gray-700">
                    Loan Date
                </label>
                <input
                    type="date"
                    name="loan_date"
                    value={formData.loan_date}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                />
            </div>

            <div>
                <label
                    htmlFor="monthly_amortization"
                    className="block text-sm font-medium text-gray-700"
                >
                    Monthly Amortization
                </label>
                <input
                    type="number"
                    name="monthly_amortization"
                    value={formData.monthly_amortization}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                />
            </div>

            <div className="flex justify-end">
                <PrimaryButton type="submit" className="">
                    Save
                </PrimaryButton>
            </div>
        </form>
    );
}

export default EmployeeLoanForm;
