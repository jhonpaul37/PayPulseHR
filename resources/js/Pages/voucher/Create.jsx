import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Create() {
    const { data, setData, post, errors, processing } = useForm({
        jev_no: '',
        f_cluster: '',
        ors_vurs_no: '',
        div_num: '',
        uacs_code: '',
        user_id: '',
    });

    const [entries, setEntries] = useState([
        { uacsTitle: '', uacsCode: '', debit: '', credit: '' },
        { uacsTitle: '', uacsCode: '', debit: '', credit: '' },
    ]);

    function submit(e) {
        e.preventDefault();
        post('/voucher', { ...data, entries });
    }

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newEntries = [...entries];
        newEntries[index][name] = value;
        setEntries(newEntries);
    };

    const addRow = (e) => {
        e.preventDefault();
        setEntries([
            ...entries,
            { uacsTitle: '', uacsCode: '', debit: '', credit: '' },
        ]);
    };

    return (
        <>
            <form className="rounded border-2 border-black bg-white shadow-md">
                {/* Header */}
                <div className="border-b-2 border-black">
                    <div className="grid grid-cols-6 text-xs">
                        <div className="col-span-5 flex items-center justify-center font-bold">
                            DISBURSEMENT VOUCHER
                        </div>

                        <div className="border-l-2 border-black">
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
                            </div>
                            <div className="border-b border-black p-1">
                                Date:
                                {/* {currentDate} */}
                            </div>
                            <div className="p-1">
                                DV No.
                                {/* {formData.generatedCode} */}
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
                            <input type="checkbox" className="form-checkbox" />
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
                            <label className="font-bold" htmlFor="clientName">
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
                            <label className="text-xs">TIN/Employee No.</label>
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
                                className="focus:shadow-outline w-full appearance-none rounded border leading-tight shadow focus:outline-none"
                                id="OrsBrsNo"
                                type="number"
                                name="OrsBrsNo"
                            />
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
                        A. Certified: Expenses/Cash Advance necessary, lawful
                        and incurred under my direct supervision
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="mt-2 text-center font-bold">
                            {/* {namePositions[3]?.name_pos} */} Mary Jane
                            Alarcado
                        </div>
                        <div className="text-xs">
                            {/* {namePositions[3]?.position} */}My BEBE Loves
                        </div>
                    </div>
                </div>

                {/* Accounting Entry */}
                <div>
                    <div className="border-b border-black p-2 text-xs">
                        B. Accounting Entry
                    </div>
                    <div className="">
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
                                <div key={index} className="grid grid-cols-4">
                                    <div className="p-2">
                                        <input
                                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none"
                                            type="text"
                                            name="uacsTitle"
                                            // value={entry.uacsTitle}
                                            // onChange={(e) =>
                                            //     handleInputChange(index, e)
                                            // }
                                        />
                                    </div>
                                    <div className="flex items-center justify-center border-l border-black p-2">
                                        <input
                                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none"
                                            type="text"
                                            name="uacsCode"
                                            // value={entry.uacsCode}
                                            // onChange={(e) =>
                                            //     handleInputChange(index, e)
                                            // }
                                            // readOnly
                                        />
                                    </div>
                                    <div className="flex items-center justify-center border-l border-black p-2">
                                        <input
                                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none"
                                            type="number"
                                            name="debit"
                                            // value={entry.debit}
                                            // onChange={(e) =>
                                            //     handleInputChange(index, e)
                                            // }
                                        />
                                    </div>
                                    <div className="flex items-center justify-center border-l border-black p-2">
                                        <input
                                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none"
                                            type="number"
                                            name="credit"
                                            // value={entry.credit}
                                            // onChange={(e) =>
                                            //     handleInputChange(index, e)
                                            // }
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* <button
                            onClick={addRow}
                            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
                        >
                            Add Entry
                        </button> */}
                    </div>
                </div>

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
                                    Subject to Authority to Debt Account (when
                                    applicable)
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
                            </div>
                            <div className="p-2">Date:</div>
                        </div>
                    </div>
                </div>

                <div className="border-b border-black">
                    Official Receipt No. & Date/Other Documents
                </div>
                <div className="flex justify-end border-b border-black">
                    Annex-3
                </div>
                <div className="grid grid-cols-3">
                    <div className="col-span-1 flex items-center justify-center bg-main p-2">
                        Journal Entry Voucher
                    </div>
                    <div className="flex flex-col p-2">
                        <span>No.</span>
                        <span>Date</span>
                    </div>
                </div>

                {/* Submit and Print Buttons */}
                <div className="flex items-center justify-between">
                    <button
                        className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                        type="submit"
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
