import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const PayrollForm = ({ employee, auth }) => {
    const [payrollData, setPayrollData] = useState({
        basic_salary: employee.salary,
        deductions: 0,
        bonuses: 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post('/payroll', payrollData);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    name="deductions"
                    value={payrollData.deductions}
                    onChange={(e) =>
                        setPayrollData({
                            ...payrollData,
                            deductions: e.target.value,
                        })
                    }
                />
                <input
                    type="number"
                    name="bonuses"
                    value={payrollData.bonuses}
                    onChange={(e) => setPayrollData({ ...payrollData, bonuses: e.target.value })}
                />
                <button type="submit">Submit Payroll</button>
            </form>
        </AuthenticatedLayout>
    );
};

export default PayrollForm;
