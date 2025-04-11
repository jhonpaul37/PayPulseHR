import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';

const EmployeeLoans = ({ auth, employees }) => {
    const [search, setSearch] = useState('');

    // Ensure employees is an array before filtering
    const filteredEmployees = Array.isArray(employees)
        ? employees.filter((employee) =>
              `${employee.first_name} ${employee.last_name}`
                  .toLowerCase()
                  .includes(search.toLowerCase())
          )
        : [];

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="p-4">
                <h2 className="mb-4 text-2xl font-bold">Search Employee Loans</h2>

                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search employee..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4 w-full rounded border border-gray-300 p-2"
                />

                {/* Display filtered employees */}
                <div className="rounded bg-white p-4 shadow-md">
                    {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => (
                            <div key={employee.id} className="border-b p-2">
                                <h3 className="text-lg font-semibold">
                                    {employee.first_name} {employee.last_name}
                                </h3>
                                {/* Ensure `loans` is an array before using `.length` */}
                                <p>
                                    Loan Count:{' '}
                                    {Array.isArray(employee.loans) ? employee.loans.length : 0}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No employees found.</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EmployeeLoans;
