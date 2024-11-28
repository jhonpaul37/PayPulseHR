import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function AddEmployeeLoan({ employees, loanPlans }) {
    const [employeeId, setEmployeeId] = useState('');
    const [loanPlanId, setLoanPlanId] = useState('');
    const [amount, setAmount] = useState('');

    const submit = (e) => {
        e.preventDefault();
        Inertia.post('/employee-loans', {
            employee_id: employeeId,
            loan_plan_id: loanPlanId,
            amount,
        });
    };

    return (
        <form onSubmit={submit}>
            <div>
                <label>Employee</label>
                <select onChange={(e) => setEmployeeId(e.target.value)} value={employeeId}>
                    {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                            {employee.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Loan Plan</label>
                <select onChange={(e) => setLoanPlanId(e.target.value)} value={loanPlanId}>
                    {loanPlans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                            {plan.type} - {plan.interest_rate}% for {plan.months} months
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Loan Amount</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>

            <button type="submit">Add Loan</button>
        </form>
    );
}
