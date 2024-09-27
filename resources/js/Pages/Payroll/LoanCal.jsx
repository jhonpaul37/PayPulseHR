import { Inertia } from '@inertiajs/inertia';
import { useState } from 'react';

const LoanCalculator = () => {
    const [principal, setPrincipal] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [term, setTerm] = useState('');
    const [interestType, setInterestType] = useState('fixed');
    const [amortizationType, setAmortizationType] = useState('equal_payments');
    const [monthlyPayment, setMonthlyPayment] = useState(null);

    const handleCalculate = () => {
        // Make sure you use Inertia.post() here to send a POST request
        Inertia.post(
            '/loan/calculate',
            {
                principal,
                interestRate,
                term,
                interestType,
                amortizationType,
            },
            {
                onSuccess: ({ props }) => {
                    setMonthlyPayment(props.monthlyPayment);
                },
            }
        );
    };

    return (
        <div>
            <h1>Loan Calculator</h1>
            <div>
                <label>Principal: </label>
                <input
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                />
            </div>
            <div>
                <label>Interest Rate (%): </label>
                <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                />
            </div>
            <div>
                <label>Loan Term (Months): </label>
                <input type="number" value={term} onChange={(e) => setTerm(e.target.value)} />
            </div>
            <div>
                <label>Interest Type: </label>
                <select value={interestType} onChange={(e) => setInterestType(e.target.value)}>
                    <option value="fixed">Fixed</option>
                    <option value="variable">Variable</option>
                </select>
            </div>
            <div>
                <label>Amortization Type: </label>
                <select
                    value={amortizationType}
                    onChange={(e) => setAmortizationType(e.target.value)}
                >
                    <option value="equal_payments">Equal Payments</option>
                    <option value="declining_balance">Declining Balance</option>
                </select>
            </div>
            <button onClick={handleCalculate}>Calculate</button>

            {monthlyPayment && <div>Monthly Payment: {monthlyPayment}</div>}
        </div>
    );
};

export default LoanCalculator;
