// PaymentForm.jsx
import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

function PaymentForm({ employeeLoanId }) {
    const [amount, setAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post(`/employee-loans/${employeeLoanId}/add-payment`, {
            amount,
            payment_date: paymentDate,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Amount</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Payment Date</label>
                <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Add Payment</button>
        </form>
    );
}

export default PaymentForm;
