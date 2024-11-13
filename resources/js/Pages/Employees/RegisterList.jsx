import React from 'react';

function RegisterList({ employees = [] }) {
    return (
        <div className="rounded bg-white p-4 shadow">
            <h2 className="text-2xl font-bold">Employee Registrations</h2>
            <table className="mt-4 min-w-full">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td>
                                {employee.first_name} {employee.last_name}
                            </td>
                            <td>{employee.user ? employee.user.email : 'No Account'}</td>
                            <td>{employee.position}</td>
                            <td>{employee.department}</td>
                            <td>{employee.user ? 'Registered' : 'Pending'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default RegisterList;
