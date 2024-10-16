import React from 'react';
import EmployeeLoanForm from '@/Components/EmployeeLoanForm';

function EditEmployeeLoan({ employeeLoan, employees, loanPlans }) {
    return (
        <div className="mx-auto max-w-4xl">
            <h1 className="mb-4 text-2xl font-semibold">
                {employeeLoan ? 'Edit Loan Program' : 'Add Loan Program'}
            </h1>
            <EmployeeLoanForm
                employeeLoan={employeeLoan}
                employees={employees}
                loanPlans={loanPlans}
            />
        </div>
    );
}

export default EditEmployeeLoan;
