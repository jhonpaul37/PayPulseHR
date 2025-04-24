import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

function EmployeeLoanForm({ employeeLoan = {}, employees, loanTypes, loanPrograms }) {
    const [formData, setFormData] = useState({
        employee_id: employeeLoan.employee_id || '',
        employee_name: '',
        loan_type_id: employeeLoan.loan_type_id || '',
        amount: employeeLoan.amount || '',
        loan_date: employeeLoan.loan_date || '',
        interest_rate: employeeLoan.interest_rate || '',
        months: employeeLoan.months || '',
        monthly_amortization: employeeLoan.monthly_amortization || '',
        total_paid: employeeLoan.total_paid || '',
    });

    const [employeeSuggestions, setEmployeeSuggestions] = useState([]);

    // Handle changes for all input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle employee auto-suggestion logic (unchanged)
    const handleEmployeeInputChange = (e) => {
        const value = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            employee_name: value,
        }));

        if (value) {
            const filteredEmployees = employees.filter((employee) =>
                `${employee.first_name} ${employee.last_name}`
                    .toLowerCase()
                    .includes(value.toLowerCase())
            );
            setEmployeeSuggestions(filteredEmployees);
        } else {
            setEmployeeSuggestions([]);
        }
    };

    const handleSuggestionClick = (employee) => {
        setFormData((prevData) => ({
            ...prevData,
            employee_id: employee.id,
            employee_name: `${employee.first_name} ${employee.last_name}`,
        }));
        setEmployeeSuggestions([]);
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
            {/* Employee Name Input with Suggestions */}

            <div className="relative">
                <label htmlFor="employee_name" className="block text-sm font-medium text-gray-700">
                    Employee
                </label>
                <TextInput
                    type="text"
                    name="employee_name"
                    value={formData.employee_name}
                    onChange={handleEmployeeInputChange}
                    className="mt-1 block w-full"
                    autoComplete="off"
                />
                {employeeSuggestions.length > 0 && (
                    <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                        {employeeSuggestions.map((employee) => (
                            <li
                                key={employee.id}
                                className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                                onClick={() => handleSuggestionClick(employee)}
                            >
                                {`${employee.first_name} ${employee.last_name}`}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Loan Type Dropdown */}
            <select
                name="loan_type_id"
                value={formData.loan_type_id}
                onChange={handleChange}
                className="mt-1 block w-full"
                autoComplete="off"
            >
                <option value="">Select a loan type</option>
                {loanTypes.map((loanType) => (
                    <option key={loanType.id} value={loanType.id}>
                        {loanType.type} -{' '}
                        {loanType.loan_program ? loanType.loan_program.name : 'No Program'}
                    </option>
                ))}
            </select>

            {/* Other Fields */}
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Loan Amount
                </label>
                <TextInput
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                    autoComplete="off"
                />
            </div>

            <div>
                <label htmlFor="loan_date" className="block text-sm font-medium text-gray-700">
                    Loan Date
                </label>
                <TextInput
                    type="date"
                    name="loan_date"
                    value={formData.loan_date}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                />
            </div>

            <div>
                <label htmlFor="interest_rate" className="block text-sm font-medium text-gray-700">
                    Interest Rate (%)
                </label>
                <TextInput
                    type="number"
                    name="interest_rate"
                    value={formData.interest_rate}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                    step="0.01"
                    autoComplete="off"
                />
            </div>

            <div>
                <label htmlFor="months" className="block text-sm font-medium text-gray-700">
                    Months to Pay
                </label>
                <TextInput
                    type="number"
                    name="months"
                    value={formData.months}
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
                <TextInput
                    type="number"
                    name="monthly_amortization"
                    value={formData.monthly_amortization}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                    step="0.01"
                    autoComplete="off"
                />
            </div>
            <div>
                <label
                    htmlFor="monthly_amortization"
                    className="block text-sm font-medium text-gray-700"
                >
                    Total Paid
                </label>
                <TextInput
                    type="number"
                    name="total_paid"
                    value={formData.total_paid}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                    step="0.01"
                    autoComplete="off"
                />
            </div>

            <div className="flex justify-end">
                <PrimaryButton type="submit">Save</PrimaryButton>
            </div>
        </form>
    );
}

export default EmployeeLoanForm;
