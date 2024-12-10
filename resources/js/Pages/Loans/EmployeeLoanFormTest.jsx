import React, { useState, useEffect } from 'react';
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
    });

    const [employeeSuggestions, setEmployeeSuggestions] = useState([]);

    // employee name (auto-suggest)
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

    // suggestion Employee
    const handleSuggestionClick = (employee) => {
        setFormData((prevData) => ({
            ...prevData,
            employee_id: employee.id,
            employee_name: `${employee.first_name} ${employee.last_name}`,
        }));
        setEmployeeSuggestions([]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Cal amortization
    const calculateAmortization = () => {
        const { amount, interest_rate, months } = formData;

        if (amount && interest_rate && months) {
            const P = parseFloat(amount); // Principal
            const r = parseFloat(interest_rate) / 100 / 12; // Monthly interest rate
            const n = parseInt(months, 10); // Number of months

            if (r === 0) {
                return (P / n).toFixed(2);
            }

            const M = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            return M.toFixed(2);
        }
        return '';
    };

    useEffect(() => {
        const amortization = calculateAmortization();
        setFormData((prevData) => ({
            ...prevData,
            monthly_amortization: amortization,
        }));
    }, [formData.amount, formData.interest_rate, formData.months]);

    const formattedAmortization = formData.monthly_amortization
        ? parseFloat(formData.monthly_amortization).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
          })
        : '';

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData); // Log the form data to ensure loan_type_id is present

        if (employeeLoan.id) {
            Inertia.put(`/employee_loans/${employeeLoan.id}`, formData);
        } else {
            Inertia.post('/employee_loans', formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
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
                    <ul className="mt-1 max-h-60 overflow-y-auto border border-gray-300">
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
                    autoComplete="off"
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
                    autoComplete="off"
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
                    type="text"
                    name="monthly_amortization"
                    value={formattedAmortization}
                    className="mt-1 block w-full"
                    readOnly
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
