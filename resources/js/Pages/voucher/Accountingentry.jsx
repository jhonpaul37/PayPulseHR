import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import AccountingEntry from './components/AccountingEntry';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ uacsCodes, auth }) {
    const { setData, post, errors } = useForm({
        jev_no: '',
        f_cluster: '',
        ors_burs_no: '',
        div_num: '',
        uacs_code: [],
        user_id: auth.id,
        code: '',
        autoIncrement: '',
        amount: '',
        ApproveAmount: '',
        particulars: '',
        address: '',
        payee: '',
        tin_no: '',
        bankName: '',
    });

    // used in AccountingEntry Component
    const [entries, setEntries] = useState([
        {
            uacsTitle: '',
            uacsCode: '',
            debit: 0,
            credit: 0,
            query: '',
            suggestions: [],
        },
        {
            uacsTitle: '',
            uacsCode: '',
            debit: 0,
            credit: 0,
            query: '',
            suggestions: [],
        },
    ]);

    const [debitError, setDebitError] = useState(false);
    const [creditError, setCreditError] = useState(false);
    const [balanceError, setBalanceError] = useState(false);

    // checks the debit change
    const handleDebitChange = (e, index) => {
        const updatedEntries = [...entries];
        updatedEntries[index].debit = parseFloat(e.target.value) || 0;
        setEntries(updatedEntries);
        setData(
            'debit',
            updatedEntries.map((entry) => entry.debit)
        );
    };
    // checks the credit change
    const handleCreditChange = (e, index) => {
        const updatedEntries = [...entries];
        updatedEntries[index].credit = parseFloat(e.target.value) || 0;
        setEntries(updatedEntries);
        setData(
            'credit',
            updatedEntries.map((entry) => entry.credit)
        );
    };

    function submit(e) {
        e.preventDefault();
        post('/voucher');
    }

    return (
        <>
            <AuthenticatedLayout user={auth.user}>
                <form onSubmit={submit} className="w-[1500px]">
                    {/* Accounting Entry */}
                    <AccountingEntry
                        uacsCodes={uacsCodes}
                        entries={entries}
                        balanceError={balanceError}
                        debitError={debitError}
                        creditError={creditError}
                        errors={errors}
                        handleDebitChange={handleDebitChange}
                        handleCreditChange={handleCreditChange}
                        setEntries={setEntries}
                        setData={setData}
                    />
                </form>
            </AuthenticatedLayout>
        </>
    );
}
