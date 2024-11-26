import { useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import { Select, Radio } from 'antd';
import { useState, useEffect } from 'react';
import AccountingEntry from './components/AccountingEntry';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const { Option } = Select;

export default function Create({ uacsCodes, fundClusters, auth, employee, filEmployees }) {
    const { data, setData, post, errors, processing } = useForm({
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

    useEffect(() => {
        if (data.f_cluster) {
            fetchAutoIncrementValue();
        }
    }, [data.f_cluster]);

    const fetchAutoIncrementValue = async () => {
        try {
            const response = await fetch('/autoIncrement');
            const result = await response.json();

            if (result.incrementNumber) {
                setData((prevData) => ({
                    ...prevData,
                    autoIncrement: result.incrementNumber,
                }));
                generateCode(result.incrementNumber);
            }
        } catch (error) {
            console.error('Failed to fetch auto-increment value:', error);
        }
    };

    const generateCode = (incrementNumber) => {
        const currentYearMonth = new Date().toISOString().slice(2, 7).replace('-', '');
        const fundCluster = data.f_cluster;

        // Generate the code using the autoIncrement value
        const generatedCode = `${currentYearMonth}-${fundCluster}-${incrementNumber}`;
        setData((prevData) => ({
            ...prevData,
            code: generatedCode,
        }));
    };

    const handleInputChange = (e) => {
        setData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

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
    const [totalDebitAmount, setTotalDebitAmount] = useState(0);
    const [totalCreditAmount, setTotalCreditAmount] = useState(0);
    const [balanceError, setBalanceError] = useState(false);

    // checks the debit change
    const handleAmountChange = (e) => {
        const amount = parseFloat(e.target.value) || 0;
        setData('amount', e.target.value);
        setTotalDebitAmount(amount);
        setTotalCreditAmount(amount);
        validateBalance();
    };

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
    //check the debit and credit total is equal to amount
    const validateBalance = () => {
        const totalDebits = entries.reduce((sum, entry) => sum + (parseFloat(entry.debit) || 0), 0);
        const totalCredits = entries.reduce(
            (sum, entry) => sum + (parseFloat(entry.credit) || 0),
            0
        );

        const debitError = totalDebits !== totalDebitAmount;
        const creditError = totalCredits !== totalCreditAmount;

        setDebitError(debitError);
        setCreditError(creditError);
        setBalanceError(debitError || creditError);
    };
    const totalDebit = entries.reduce((sum, entry) => sum + (parseFloat(entry.debit) || 0), 0);
    const totalCredit = entries.reduce((sum, entry) => sum + (parseFloat(entry.credit) || 0), 0);

    //display te current date
    const currentDate = (() => {
        const date = new Date();
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear().toString().slice(-2);
        return `${day}-${month}-${year}`;
    })();

    function submit(e) {
        e.preventDefault();
        post('/voucher');
    }

    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleEmployeeChange = (value) => {
        setData((prevData) => ({
            ...prevData,
            approved_by: value,
        }));

        const employee = filEmployees.find((emp) => emp.id === parseInt(value));
        setSelectedEmployee(employee);
    };

    return (
        <>
            <AuthenticatedLayout user={auth}>
                <form onSubmit={submit} className="w-[1000px]">
                    {/* <FundCluster /> */}
                    <div className="border-2 border-black">
                        {/* fund cluster */}
                        <div className="flex items-center justify-center gap-5 border-b-2 border-black p-2">
                            <div className="flex flex-col">
                                <label>Fund Cluster:</label>
                                <Select
                                    value={data.f_cluster}
                                    onChange={(value) =>
                                        setData({
                                            ...data,
                                            f_cluster: value,
                                        })
                                    }
                                    className={`w-full ${errors.f_cluster ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Select a Fund Cluster"
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    <Option value="" disabled>
                                        Select a Fund Cluster
                                    </Option>
                                    {fundClusters.map((cluster) => (
                                        <Option key={cluster.id} value={cluster.cluster_code}>
                                            {cluster.cluster_code}
                                        </Option>
                                    ))}
                                </Select>
                            </div>

                            <div className="">
                                DV No.
                                <TextInput
                                    value={data.div_num}
                                    type="text"
                                    onChange={(e) => setData('div_num', e.target.value)}
                                    className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                    autoComplete="off"
                                    readOnly
                                />
                            </div>
                        </div>
                        {/* Mode of Payment */}

                        <div className="grid grid-cols-8 border-b-2 border-black">
                            <div className="col-span-2 p-2 font-bold">Mode of Payment</div>
                            <div className="col-span-6 flex justify-between border-l border-black px-5">
                                {['MDS Check', 'Commercial Check', 'ADA'].map((mode) => (
                                    <label key={mode} className="inline-flex items-center">
                                        <Radio
                                            value={mode}
                                            checked={data.paymentMode === mode}
                                            onChange={(e) =>
                                                setData({
                                                    ...data,
                                                    paymentMode: e.target.value,
                                                })
                                            }
                                        />
                                        <span className="ml-2">{mode}</span>
                                    </label>
                                ))}

                                <label className="inline-flex items-center">
                                    <Radio
                                        value="Others"
                                        checked={data.paymentMode === 'Others'}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                paymentMode: e.target.value,
                                            })
                                        }
                                    />
                                    <span className="ml-2">Others (Please Specify)</span>
                                    <TextInput
                                        type="text"
                                        value={data.otherPaymentMode || ''}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                otherPaymentMode: e.target.value,
                                            })
                                        }
                                        className="ml-2 border-b-2 border-black focus:outline-none"
                                        autoComplete="off"
                                        disabled={data.paymentMode !== 'Others'}
                                    />
                                </label>
                            </div>
                        </div>
                        {/* Payee and Address */}
                        <div>
                            <div className="grid grid-cols-8 border-b border-black">
                                <div className="col-span-2 flex items-center gap-2 p-2">
                                    <label className="font-bold" htmlFor="clientName">
                                        Payee
                                    </label>
                                </div>

                                <div className="col-span-2 flex items-center border-l border-black p-2">
                                    <TextInput
                                        name="clientName"
                                        autoComplete="off"
                                        type="text"
                                        placeholder="Client Name"
                                        value={data.payee}
                                        onChange={(e) => {
                                            setData('payee', e.target.value);
                                        }}
                                        className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none ${
                                            !data.payee ? 'border-high' : ''
                                        } ${errors.payee ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                </div>
                                <div className="col-span-2 border-l border-black p-2">
                                    <label className="text-xs">TIN/Employee No.</label>
                                    <TextInput
                                        type="number"
                                        autoComplete="off"
                                        placeholder="TIN/Employee No."
                                        value={data.tin_no}
                                        onChange={(e) => {
                                            setData('tin_no', e.target.value);
                                        }}
                                        className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none ${
                                            !data.tin_no ? 'border-high' : ''
                                        } ${errors.tin_no ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                </div>
                                <div className="col-span-2 border-l border-black p-2">
                                    <label className="text-xs">ORS/BRS No.</label>
                                    <TextInput
                                        value={data.ors_burs_no}
                                        type="number"
                                        onChange={(e) => setData('ors_burs_no', e.target.value)}
                                        placeholder="ors_burs_no"
                                        className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none ${
                                            !data.ors_burs_no ? 'border-high' : ''
                                        } ${errors.ors_burs_no ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-8 items-center border-b border-black">
                                <div className="col-span-2 flex p-2">
                                    <label className="block text-sm font-bold" htmlFor="address">
                                        Address
                                    </label>
                                </div>
                                <div className="col-span-6 border-l border-black p-2">
                                    <TextInput
                                        type="text"
                                        name="address"
                                        autoComplete="off"
                                        placeholder="Address"
                                        value={data.address}
                                        onChange={(e) => {
                                            setData('address', e.target.value);
                                        }}
                                        className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none ${
                                            !data.address ? 'border-high' : ''
                                        } ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Particulars Section */}
                        <div className="grid grid-cols-10 border-b border-black">
                            <label className="col-span-4 flex items-center justify-center p-2 text-center">
                                Particulars
                            </label>
                            <label className="col-span-2 flex items-center justify-center border-l border-black p-2 text-center">
                                Responsibility Center
                            </label>
                            <label className="col-span-2 flex items-center justify-center border-l border-black p-2 text-center">
                                MFO/PAP
                            </label>
                            <label className="col-span-2 flex items-center justify-center border-l border-black p-2 text-center">
                                Amount
                            </label>
                        </div>
                        {/* TextInput Section */}
                        <div className="grid grid-cols-10 border-b border-black">
                            <div className="col-span-4 flex items-center p-2">
                                <textarea
                                    name="particulars"
                                    rows="4"
                                    value={data.particulars}
                                    onChange={(e) => {
                                        setData('particulars', e.target.value);
                                    }}
                                    className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none ${
                                        !data.particulars ? 'border-high' : ''
                                    } ${errors.particulars ? 'border-red-500' : 'border-gray-300'}`}
                                />
                            </div>
                            <div className="col-span-2 flex items-center border-l border-black p-2">
                                <TextInput
                                    className="w-full rounded border px-3 py-2 shadow focus:outline-none"
                                    type="text"
                                    name="ResponsibilityCenter"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="col-span-2 flex items-center border-l border-black p-2">
                                <TextInput
                                    className="w-full rounded border px-3 py-2 shadow focus:outline-none"
                                    type="text"
                                    name="MFO/PAP"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="col-span-2 flex items-center border-l border-black p-2">
                                <TextInput
                                    placeholder="Enter amount"
                                    type="number"
                                    name="amount"
                                    autoComplete="off"
                                    value={data.amount}
                                    onChange={handleAmountChange} // Use only handleAmountChange here
                                    className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none ${
                                        !data.amount ? 'border-high' : ''
                                    } ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
                                />
                            </div>
                        </div>
                        {/* Certified Section */}
                        <div className="border-b border-black p-2">
                            <div className="text-xs">
                                A. Certified: Expenses/Cash Advance necessary, lawful and incurred
                                under my direct supervision
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <div className="mt-2 text-center font-bold">
                                    {/* {namePositions[3]?.name_pos} */} Name
                                </div>
                                <div className="text-xs">
                                    {/* {namePositions[3]?.position} */}Position
                                </div>
                            </div>
                        </div>
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
                        {/* Certified and Approved Section */}
                        <div className="grid grid-cols-2 border-b border-black">
                            {/* C Section */}
                            <div className="">
                                <div className="border-b border-black p-2">C. Certified</div>
                                <div className="flex h-28 flex-col justify-center p-2">
                                    {' '}
                                    <label className="inline-flex items-center">
                                        <TextInput
                                            type="checkbox"
                                            className="form-checkbox"
                                            autoComplete="off"
                                        />
                                        <span className="ml-2">Cash available</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <TextInput
                                            type="checkbox"
                                            className="form-checkbox"
                                            autoComplete="off"
                                        />
                                        <span className="ml-2">
                                            Subject to Authority to Debt Account (when applicable)
                                        </span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <TextInput
                                            type="checkbox"
                                            className="form-checkbox"
                                            autoComplete="off"
                                        />
                                        <span className="ml-2">
                                            Supporting document complete and amount claim proper
                                        </span>
                                    </label>
                                </div>

                                <div className="grid grid-cols-4 border-t border-black">
                                    <div className="flex flex-col justify-between">
                                        <div className="border-b border-black p-2">Signature</div>
                                        <div className="border-b border-black p-2">
                                            Printed Name
                                        </div>
                                        <div className="flex flex-grow items-center border-black p-2">
                                            Position
                                        </div>
                                    </div>

                                    <div className="col-span-3 border-l border-black text-center">
                                        <div className="border-b border-black p-2">Empty space</div>
                                        <div className="border-b border-black p-2 font-bold">
                                            RHEA ANGELLICA D. ADDATU, CPA
                                        </div>
                                        <div className="grid grid-rows-2">
                                            <div className="border-b border-black p-2">
                                                College Accountant
                                            </div>
                                            <div className="p-2">
                                                Head, Accounting Unit/Authorized Representative
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* D Section */}
                            <div className="border-l border-black">
                                <div className="border-b border-black p-2">
                                    D. Approved for Payment
                                </div>
                                <div className="flex h-28 items-center justify-center p-2">
                                    {' '}
                                    <TextInput
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Approve Amount"
                                        value={data.ApproveAmount}
                                        onChange={(e) => {
                                            setData('ApproveAmount', e.target.value);
                                        }}
                                        className={`focus:shadow-outline mx-10 w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none ${
                                            !data.ApproveAmount ? 'border-high' : ''
                                        } ${errors.ApproveAmount ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                </div>
                                <div className="grid grid-cols-4 border-t border-black">
                                    <div className="flex flex-col justify-between">
                                        <div className="border-b border-black p-2">Signature</div>
                                        <div className="border-b border-black p-2">
                                            Printed Name
                                        </div>
                                        <div className="flex flex-grow items-center border-black p-2">
                                            Position
                                        </div>
                                    </div>

                                    <div className="col-span-3 border-l border-black text-center">
                                        <div className="border-b border-black p-2">Empty space</div>
                                        <div className="border-b border-black p-2 font-bold">
                                            RHEA ANGELLICA D. ADDATU, CPA
                                        </div>
                                        <div className="grid grid-rows-2">
                                            <div className="border-b border-black p-2">
                                                College Accountant
                                            </div>
                                            <div className="p-2">
                                                Head, Accounting Unit/Authorized Representative
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Receipt of Payment */}
                        <div className="border-b border-black">
                            <div className="border-b border-black p-2">E. Receipt of Payment</div>
                            <div className="flex justify-between p-2">
                                <div>
                                    <label>Bank Name & Account Number:</label>
                                    <TextInput
                                        autoComplete="off"
                                        type="text"
                                        value={data.bankName}
                                        onChange={(e) => {
                                            setData('bankName', e.target.value);
                                        }}
                                        className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none ${
                                            !data.bankName ? 'border-high' : ''
                                        } ${errors.bankName ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                </div>
                                <div>
                                    <span className="mr-2">JEV No. </span>
                                    <TextInput
                                        name="jev_no"
                                        value={data.code}
                                        type="text"
                                        onChange={handleInputChange}
                                        placeholder="Auto Generated"
                                        className={`focus:shadow-outline w-full appearance-none rounded border border-blue-500 px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                        autoComplete="off"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                        {/* "Prepared by" Section */}
                        <div className="grid grid-cols-2">
                            <div className="p-2">
                                <div className="">Prepared by:</div>
                                <div className="flex flex-col items-center justify-center">
                                    <span className="font-bold">
                                        {employee
                                            ? `${employee.first_name} ${employee.last_name}`
                                            : 'N/A'}
                                    </span>
                                    {errors.user_id && (
                                        <div className="text-red-600">{errors.user_id}</div>
                                    )}
                                    <span>{employee?.position || 'N/A'}</span>
                                </div>
                            </div>

                            {/* "Approved by" Section */}
                            <div className="border-l border-black p-2">
                                <div>Approved by:</div>
                                <div className="flex flex-col items-center justify-center">
                                    <Select
                                        name="approved_by"
                                        value={data.approved_by}
                                        onChange={handleEmployeeChange}
                                        placeholder="Select an employee"
                                    >
                                        {filEmployees.map((emp) => (
                                            <Option key={emp.id} value={emp.id}>
                                                {
                                                    <span className="text-bold">
                                                        {emp.first_name} {emp.last_name}
                                                    </span>
                                                }
                                            </Option>
                                        ))}
                                    </Select>
                                    {selectedEmployee && (
                                        <div className="mt-2 text-center">
                                            <div className="text-xs">
                                                {selectedEmployee.position}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Submit and Print Buttons */}
                    <div className="flex items-center justify-between pt-5">
                        <PrimaryButton disabled={processing}>Add</PrimaryButton>
                        <button
                            className="focus:shadow-outline rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700 focus:outline-none"
                            type="button"
                        >
                            Print
                        </button>
                    </div>
                </form>
            </AuthenticatedLayout>
        </>
    );
}
