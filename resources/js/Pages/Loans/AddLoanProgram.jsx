import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function AddLoanProgram() {
    const [name, setName] = useState('');

    const submit = (e) => {
        e.preventDefault();
        Inertia.post('/loan-programs', { name });
    };

    return (
        <div>
            <h2>Add Loan Program</h2>
            <form onSubmit={submit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Loan Program Name"
                />
                <button type="submit">Add Program</button>
            </form>
        </div>
    );
}
