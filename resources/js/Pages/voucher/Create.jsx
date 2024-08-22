import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

export default function Create({ uacsCodes }) {
    const { data, setData, post, errors, processing } = useForm({
        jev_no: '',
        f_cluster: '',
        ors_vurs_no: '',
        div_num: '',
        uacs_code: '',
        user_id: '',
    });

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    // Track the entries for dynamic rows
    const [entries, setEntries] = useState([
        { uacsTitle: '', uacsCode: '', debit: '', credit: '' },
        { uacsTitle: '', uacsCode: '', debit: '', credit: '' },
    ]);

    // Handle input change for Account Title
    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value) {
            const filteredSuggestions = uacsCodes.filter((code) =>
                code.Account_title.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.Account_title);
        setData('uacs_code', suggestion.UACS_code); // Set UACS code

        // Debugging logs to verify state update
        console.log('Selected Account Title:', suggestion.Account_title);
        console.log('Setting UACS Code:', suggestion.UACS_code);
        console.log('Updated form data:', data);

        setSuggestions([]); // Close the suggestions list
    };

    // Add a new row for accounting entry
    const addRow = () => {
        setEntries([
            ...entries,
            { uacsTitle: '', uacsCode: '', debit: '', credit: '' },
        ]);
    };

    // Remove the last row for accounting entry
    const removeRow = () => {
        if (entries.length > 2) {
            setEntries(entries.slice(0, -1));
        }
    };

    // Handle form submission
    function submit(e) {
        e.preventDefault();
        post('/voucher');
    }

    return (
        <>
            <form onSubmit={submit}>
                <div className="rounded border-2 border-black bg-white shadow-md">
                    {/* Accounting Entry */}
                    <div className="rounded border-2 border-black bg-white shadow-md">
                        <div>
                            <div className="border-b border-black p-2 text-xs">
                                B. Accounting Entry
                            </div>
                            <div>
                                <div className="grid grid-cols-4 border-b border-black text-xs">
                                    <div className="flex items-center justify-center">
                                        Account Title
                                    </div>
                                    <div className="flex items-center justify-center border-l border-black">
                                        UACS Code
                                    </div>
                                    <div className="flex items-center justify-center border-l border-black">
                                        Debit
                                    </div>
                                    <div className="flex items-center justify-center border-l border-black">
                                        Credit
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center border-b border-black">
                                    {entries.map((entry, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-4"
                                        >
                                            <div className="flex p-2">
                                                <div className="mr-2">
                                                    <button
                                                        type="button"
                                                        onClick={addRow}
                                                        className="rounded bg-high px-4 py-2 font-bold"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faPlus}
                                                        />
                                                    </button>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        id="uacsInput"
                                                        type="text"
                                                        value={query}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-high focus:outline-none focus:ring-high sm:text-sm"
                                                        placeholder="Start typing to search..."
                                                    />
                                                    {suggestions.length > 0 && (
                                                        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                                                            {suggestions.map(
                                                                (
                                                                    suggestion,
                                                                    index
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                        onClick={() =>
                                                                            handleSuggestionClick(
                                                                                suggestion
                                                                            )
                                                                        }
                                                                        className="cursor-pointer px-4 py-2 hover:bg-high hover:text-black"
                                                                    >
                                                                        {
                                                                            suggestion.Account_title
                                                                        }
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center border-l border-black p-2">
                                                <input
                                                    value={data.UACS_code}
                                                    type="number"
                                                    onChange={(e) =>
                                                        setData(
                                                            'uacs_code',
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="uacs_code"
                                                    className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none ${
                                                        errors.UACS_code
                                                            ? 'border-red-500 !ring-red-500'
                                                            : ''
                                                    }`}
                                                />
                                                {console.log(
                                                    'Current uacs_code:',
                                                    data.uacs_code
                                                )}
                                            </div>
                                            <div className="flex items-center justify-center border-l border-black p-2">
                                                <input
                                                    className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none"
                                                    type="number"
                                                    name="debit"
                                                />
                                            </div>
                                            <div className="flex items-center justify-center border-l border-black p-2">
                                                <input
                                                    className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none"
                                                    type="number"
                                                    name="credit"
                                                />
                                                <div className="ml-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeRow(
                                                                entries.length -
                                                                    1
                                                            )
                                                        }
                                                        className={`rounded bg-red-500 px-4 py-2 font-bold text-white ${
                                                            entries.length <= 2
                                                                ? 'cursor-not-allowed bg-red-200'
                                                                : ''
                                                        }`}
                                                        disabled={
                                                            entries.length <= 2
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faMinus}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="border-b-2 border-black">
                        <div className="grid grid-cols-6 text-xs">
                            <div className="col-span-5 flex items-center justify-center font-bold">
                                DISBURSEMENT VOUCHER
                            </div>

                            <div className="border-l-2 border-black">
                                {/* fund cluster */}
                                <div className="border-b border-black p-1">
                                    Fund Cluster:
                                    {/* <select
                                    name="fundCluster"
                                    value={formData.fundCluster}
                                    onChange={handleInputChange}
                                    onBlur={updateGeneratedCode}
                                    className="w-full"
                                >
                                    <option value="">
                                        Select Fund Cluster
                                    </option>
                                    {fundClusters.map((cluster) => (
                                        <option
                                            key={cluster.F_cluster}
                                            value={cluster.F_cluster}
                                        >
                                            {cluster.F_cluster}
                                        </option>
                                    ))}
                                </select> */}
                                    <input
                                        value={data.f_cluster}
                                        type="text"
                                        // drop down content from database

                                        onChange={(e) =>
                                            setData('f_cluster', e.target.value)
                                        }
                                        placeholder="fund cluster"
                                        className={
                                            errors.f_cluster && '!ring-red-500'
                                        }
                                    />
                                    {errors.f_cluster && (
                                        <div className="text-red-600">
                                            {errors.f_cluster}
                                        </div>
                                    )}
                                </div>

                                <div className="border-b border-black p-1">
                                    Date:
                                    {/* {currentDate} */}
                                </div>
                                <div className="p-1">
                                    DV No.
                                    {/* {formData.generatedCode} */}
                                    <input
                                        value={data.div_num}
                                        type="text"
                                        onChange={(e) =>
                                            setData('div_num', e.target.value)
                                        }
                                        placeholder="div_num"
                                        className={
                                            errors.div_num && '!ring-red-500'
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Mode of Payment */}
                    <div className="grid grid-cols-8 border-b-2 border-black">
                        <div className="col-span-2 p-2 font-bold">
                            Mode of Payment
                        </div>
                        <div className="col-span-6 flex justify-between border-l border-black px-5">
                            {['MDS Check', 'Commercial Check', 'ADA'].map(
                                (mode) => (
                                    <label
                                        key={mode}
                                        className="inline-flex items-center"
                                    >
                                        <input
                                            type="checkbox"
                                            className="form-checkbox"
                                        />
                                        <span className="ml-2">{mode}</span>
                                    </label>
                                )
                            )}

                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox"
                                />
                                <span className="ml-2">
                                    Others (Please Specify)
                                </span>
                                <input
                                    type="text"
                                    className="ml-2 border-b-2 border-black focus:outline-none"
                                />
                            </label>
                        </div>
                    </div>
                    {/* Payee and Address */}
                    <div>
                        <div className="grid grid-cols-8 border-b border-black">
                            <div className="col-span-2 flex items-center gap-2 p-2">
                                <label
                                    className="font-bold"
                                    htmlFor="clientName"
                                >
                                    Payee
                                </label>
                            </div>

                            <div className="col-span-2 flex items-center border-l border-black p-2">
                                <input
                                    className="focus:shadow-outline w-full appearance-none rounded border leading-tight shadow focus:outline-none"
                                    id="clientName"
                                    type="text"
                                    name="clientName"
                                />
                            </div>
                            <div className="col-span-2 border-l border-black p-2">
                                <label className="text-xs">
                                    TIN/Employee No.
                                </label>
                                <input
                                    className="focus:shadow-outline w-full appearance-none rounded border leading-tight shadow focus:outline-none"
                                    id="TIN/EmployeeNo"
                                    type="number"
                                    name="TIN/EmployeeNo"
                                />
                            </div>
                            <div className="col-span-2 border-l border-black p-2">
                                <label className="text-xs">ORS/BRS No.</label>
                                <input
                                    value={data.ors_burs_no}
                                    type="number"
                                    onChange={(e) =>
                                        setData('ors_burs_no', e.target.value)
                                    }
                                    placeholder="ors_burs_no"
                                    className={
                                        errors.ors_burs_no && '!ring-red-500'
                                    }
                                />
                                {errors.ors_burs_no && (
                                    <div className="text-red-600">
                                        {errors.ors_burs_no}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-8 items-center border-b border-black">
                            <div className="col-span-2 flex p-2">
                                <label
                                    className="block text-sm font-bold"
                                    htmlFor="address"
                                >
                                    Address
                                </label>
                            </div>
                            <div className="col-span-6 border-l border-black p-2">
                                <input
                                    className="focus:shadow-outline w-full appearance-none rounded border leading-tight shadow focus:outline-none"
                                    id="address"
                                    type="text"
                                    name="address"
                                    // value={formData.address}
                                    // onChange={handleInputChange}
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
                    {/* Input Section */}
                    <div className="grid grid-cols-10 border-b border-black">
                        <div className="col-span-4 flex items-center p-2">
                            <textarea
                                className="w-full rounded border px-3 py-2 shadow focus:outline-none"
                                name="particulars"
                                rows="4"
                            />
                        </div>
                        <div className="col-span-2 flex items-center border-l border-black p-2">
                            <input
                                className="w-full rounded border px-3 py-2 shadow focus:outline-none"
                                type="text"
                                name="ResponsibilityCenter"
                            />
                        </div>
                        <div className="col-span-2 flex items-center border-l border-black p-2">
                            <input
                                className="w-full rounded border px-3 py-2 shadow focus:outline-none"
                                type="text"
                                name="MFO/PAP"
                            />
                        </div>
                        <div className="col-span-2 flex items-center border-l border-black p-2">
                            <input
                                className="w-full rounded border px-3 py-2 shadow focus:outline-none"
                                type="number"
                                name="amount"
                            />
                        </div>
                    </div>
                    {/* Certified Section */}
                    <div className="border-b border-black p-2">
                        <div className="text-xs">
                            A. Certified: Expenses/Cash Advance necessary,
                            lawful and incurred under my direct supervision
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
                    {/* <div>
                        <div className="border-b border-black p-2 text-xs">
                            B. Accounting Entry
                        </div>
                        <div>
                            <div className="grid grid-cols-4 border-b border-black text-xs">
                                <div className="flex items-center justify-center">
                                    Account Title
                                </div>
                                <div className="flex items-center justify-center border-l border-black">
                                    UACS Code
                                </div>
                                <div className="flex items-center justify-center border-l border-black">
                                    Debit
                                </div>
                                <div className="flex items-center justify-center border-l border-black">
                                    Credit
                                </div>
                            </div>
                            <div className="flex flex-col justify-center border-b border-black">
                                {entries.map((entry, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-4"
                                    >
                                        <div className="flex p-2">
                                            <div className="mr-2">
                                                <button
                                                    type="button"
                                                    onClick={addRow}
                                                    className="rounded bg-high px-4 py-2 font-bold"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faPlus}
                                                    />
                                                </button>
                                            </div>
                                            <input
                                                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none"
                                                type="text"
                                                name="uacsTitle"
                                            />
                                        </div>
                                        <div className="flex items-center justify-center border-l border-black p-2">
                                            <input
                                                value={data.uacs_code}
                                                type="number"
                                                onChange={(e) =>
                                                    setData(
                                                        'uacs_code',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="uacs_code"
                                                className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none ${
                                                    errors.uacs_code
                                                        ? 'border-red-500 !ring-red-500'
                                                        : ''
                                                }`}
                                            />
                                        </div>
                                        <div className="flex items-center justify-center border-l border-black p-2">
                                            <input
                                                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none"
                                                type="number"
                                                name="debit"
                                            />
                                        </div>
                                        <div className="flex items-center justify-center border-l border-black p-2">
                                            <input
                                                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none"
                                                type="number"
                                                name="credit"
                                            />
                                            <div className="ml-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeRow(
                                                            entries.length - 1
                                                        )
                                                    }
                                                    className={`rounded bg-red-500 px-4 py-2 font-bold text-white ${
                                                        entries.length <= 2
                                                            ? 'cursor-not-allowed bg-red-200'
                                                            : ''
                                                    }`}
                                                    disabled={
                                                        entries.length <= 2
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faMinus}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div> */}

                    {/* Certified and Approved Section */}
                    <div className="grid grid-cols-2 border-b border-black">
                        {/* C Section */}
                        <div className="">
                            <div className="border-b border-black p-2">
                                C. Certified
                            </div>
                            <div className="flex h-28 flex-col justify-center p-2">
                                {' '}
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox"
                                    />
                                    <span className="ml-2">Cash available</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox"
                                    />
                                    <span className="ml-2">
                                        Subject to Authority to Debt Account
                                        (when applicable)
                                    </span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox"
                                    />
                                    <span className="ml-2">
                                        Supporting document complete and amount
                                        claim proper
                                    </span>
                                </label>
                            </div>

                            <div className="grid grid-cols-4 border-t border-black">
                                <div className="flex flex-col justify-between">
                                    <div className="border-b border-black p-2">
                                        Signature
                                    </div>
                                    <div className="border-b border-black p-2">
                                        Printed Name
                                    </div>
                                    <div className="flex flex-grow items-center border-black p-2">
                                        Position
                                    </div>
                                </div>

                                <div className="col-span-3 border-l border-black text-center">
                                    <div className="border-b border-black p-2">
                                        Empty space
                                    </div>
                                    <div className="border-b border-black p-2 font-bold">
                                        RHEA ANGELLICA D. ADDATU, CPA
                                    </div>
                                    <div className="grid grid-rows-2">
                                        <div className="border-b border-black p-2">
                                            College Accountant
                                        </div>
                                        <div className="p-2">
                                            Head, Accounting Unit/Authorized
                                            Representative
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
                                <input
                                    className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none"
                                    type="text"
                                    placeholder="Amount"
                                />
                            </div>
                            <div className="grid grid-cols-4 border-t border-black">
                                <div className="flex flex-col justify-between">
                                    <div className="border-b border-black p-2">
                                        Signature
                                    </div>
                                    <div className="border-b border-black p-2">
                                        Printed Name
                                    </div>
                                    <div className="flex flex-grow items-center border-black p-2">
                                        Position
                                    </div>
                                </div>

                                <div className="col-span-3 border-l border-black text-center">
                                    <div className="border-b border-black p-2">
                                        Empty space
                                    </div>
                                    <div className="border-b border-black p-2 font-bold">
                                        RHEA ANGELLICA D. ADDATU, CPA
                                    </div>
                                    <div className="grid grid-rows-2">
                                        <div className="border-b border-black p-2">
                                            College Accountant
                                        </div>
                                        <div className="p-2">
                                            Head, Accounting Unit/Authorized
                                            Representative
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Receipt of Payment */}
                    <div className="border-b border-black">
                        <div className="border-b border-black p-2">
                            E. Receipt of Payment
                        </div>
                        <div className="grid grid-cols-5">
                            <div className="col-span-1">
                                <div className="border-b border-black p-2">
                                    Check/ADA No.
                                </div>
                                <div className="p-2">Signatures</div>
                            </div>
                            <div className="border-l border-black">
                                <div className="border-b border-black p-2">
                                    //for signature
                                </div>
                                <div className="p-2">//for signature</div>
                            </div>
                            <div className="border-l border-black">
                                <div className="border-b border-black p-2">
                                    Date:
                                </div>
                                <div className="p-2">Date:</div>
                            </div>
                            <div className="border-l border-black">
                                <div className="border-b border-black p-2">
                                    Bank Name & Account Number:
                                </div>
                                <div className="p-2">Printed Name:</div>
                            </div>
                            <div className="border-l border-black">
                                <div className="border-b border-black p-2">
                                    JEV No.
                                    <input
                                        value={data.jev_no}
                                        type="text"
                                        onChange={(e) =>
                                            setData('jev_no', e.target.value)
                                        }
                                        placeholder="jev_no"
                                        className={
                                            errors.jev_no && '!ring-red-500'
                                        }
                                    />
                                    {errors.jev_no && (
                                        <div className="text-red-600">
                                            {errors.jev_no}
                                        </div>
                                    )}
                                </div>
                                <div className="p-2">Date:</div>
                            </div>
                        </div>
                    </div>
                    {/* Receipt and annex-3 */}
                    <div className="border-b border-black p-2">
                        Official Receipt No. & Date/Other Documents
                    </div>
                    <div className="flex justify-end border-b border-black p-2">
                        Annex-3
                    </div>

                    {/* Journal Entry Voucher */}
                    <div className="grid grid-cols-3 border-b border-black">
                        <div className="col-span-2 flex flex-col items-center justify-center p-2">
                            <label className="font-bold">
                                Journal Entry Voucher
                            </label>
                            <label className="font-bold">
                                BATANES STATE COLLEGE
                            </label>
                            <label>Agency Name</label>
                        </div>
                        <div className="flex flex-col justify-center border-l border-black p-2">
                            <span>No.</span>
                            <span>Date</span>
                        </div>
                    </div>

                    {/* accouting entries */}
                    <div>
                        <div className="grid grid-cols-5 text-center">
                            <div className="col-span-1 flex items-center justify-center border-b border-black p-2">
                                Resposibility Center
                            </div>
                            <div className="col-span-4 border-l border-black">
                                <div className="border-b border-black p-2">
                                    ACCOUNTING ENTRIES
                                </div>
                                <div className="grid grid-cols-5 border-b border-black">
                                    <div className="col-span-2 flex items-center justify-center">
                                        Accounts
                                    </div>
                                    <div className="flex items-center justify-center border-l border-black">
                                        Amount Code
                                    </div>
                                    <div className="flex items-center justify-center border-l border-black">
                                        Ref
                                    </div>
                                    <div className="flex flex-col border-l border-black">
                                        <div className="border-b border-black">
                                            Amount
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div>Debit</div>
                                            <div className="border-l border-black">
                                                Credit
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* details */}
                        <div className="grid grid-cols-5 text-center">
                            <div className="border-b border-black"></div>
                            <div className="col-span-4 border-l border-black">
                                <div className="grid grid-cols-5 border-b border-black">
                                    <div className="col-span-2 flex items-center justify-center p-2">
                                        NOTE: account title ref
                                    </div>
                                    <div className="flex items-center justify-center border-l border-black p-2">
                                        NOTE: UACS code ref
                                    </div>
                                    <div className="flex items-center justify-center border-l border-black p-2">
                                        emtpy
                                    </div>
                                    <div className="flex flex-col border-l border-black">
                                        <div className="grid grid-cols-2">
                                            <div className="p-2">
                                                NOTE: debit ref
                                            </div>
                                            <div className="border-l border-black p-2">
                                                NOTE: credit ref
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* duplicate */}
                        <div className="grid grid-cols-5 text-center">
                            <div className="border-b border-black"></div>
                            <div className="col-span-4 border-l border-black">
                                <div className="grid grid-cols-5 border-b border-black">
                                    <div className="col-span-2 flex items-center justify-center p-2">
                                        NOTE: account title ref
                                    </div>
                                    <div className="flex items-center justify-center border-l border-black p-2">
                                        NOTE: UACS code ref
                                    </div>
                                    <div className="flex items-center justify-center border-l border-black p-2">
                                        emtpy
                                    </div>
                                    <div className="flex flex-col border-l border-black">
                                        <div className="grid grid-cols-2">
                                            <div className="p-2">
                                                NOTE: debit ref
                                            </div>
                                            <div className="border-l border-black p-2">
                                                NOTE: credit ref
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* total */}
                        <div className="grid grid-cols-5 text-center">
                            <div className="col-span-1 border-b border-black p-2"></div>
                            <div className="col-span-4">
                                <div className="grid grid-cols-5 border-b border-black">
                                    <div className="col-span-4 flex items-center justify-end p-2 font-bold">
                                        TOTAL
                                    </div>
                                    <div className="flex items-center justify-center border-l border-black">
                                        <div className="grid w-full grid-cols-2">
                                            <div className="p-2 text-center">
                                                NOTE: debit ref
                                            </div>
                                            <div className="border-l border-black p-2 text-center">
                                                NOTE: credit ref
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2">
                        <div className="p-2">
                            <div className="">
                                {/* sino naka sign auto here the complete name */}
                                Prepared by:
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <span className="font-bold">
                                    JACITA P. MORA
                                </span>
                                <input
                                    value={data.user_id}
                                    type="number"
                                    onChange={(e) =>
                                        setData('user_id', e.target.value)
                                    }
                                    placeholder="user_id"
                                    className={
                                        errors.user_id && '!ring-red-500'
                                    }
                                />
                                {errors.jev_no && (
                                    <div className="text-red-600">
                                        {errors.user_id}
                                    </div>
                                )}
                                <span>Adimistrative Aide VI</span>
                            </div>
                        </div>
                        <div className="border-l border-black p-2">
                            <div> Approved by:</div>
                            <div className="flex flex-col items-center justify-center">
                                <span className="font-bold">
                                    RHEA ANGELLICA D. ADDATU, CPA
                                </span>
                                <span>Accountant II</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Submit and Print Buttons */}
                <div className="flex items-center justify-between pt-5">
                    <button
                        disabled={processing}
                        className="rounded-md bg-high px-10 py-3 font-bold"
                    >
                        Add
                    </button>
                    <button
                        className="focus:shadow-outline rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700 focus:outline-none"
                        type="button"
                    >
                        Print
                    </button>
                </div>
            </form>
        </>
    );
}
