import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

const Loans = ({ auth }) => {
    const [name, setName] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        Inertia.post(
            '/loan-programs',
            {
                name,
                interest_rate: interestRate,
            },
            {
                onError: (err) => setErrors(err),
                onSuccess: () => {
                    setName('');
                    setInterestRate('');
                    setErrors({});
                },
            }
        );
    };
    return (
        <AuthenticatedLayout user={auth.user}>
            <h1>Create Loan Program</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Loan Program Name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <span>{errors.name}</span>}
                </div>

                <div>
                    <label htmlFor="interestRate">Interest Rate (%)</label>
                    <input
                        id="interestRate"
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                    />
                    {errors.interest_rate && <span>{errors.interest_rate}</span>}
                </div>

                <button type="submit">Add Loan Program</button>
            </form>
        </AuthenticatedLayout>
    );
};

export default Loans;
