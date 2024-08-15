import { useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, errors, processing } = useForm({
        jev_no: '',
        f_cluster: '',
        ors_vurs_no: '',
        div_num: '',
        uacs_code: '',
        user_id: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/voucher');
    }

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
                <div className="mb-4 border p-4">
                    <div className="font-bold">
                        A. Certified: Expenses/Cash Advance necessary, lawful
                        and incurred under my direct supervision
                    </div>
                    <div className="mt-2 font-semibold">
                        {/* {namePositions[3]?.name_pos} */}
                    </div>
                    <div>{/* {namePositions[3]?.position} */}</div>
                </div>

                {/* Accounting Entry */}
                <div className="mb-4 border p-4">
                    <div className="mb-2 font-bold">B. Accounting Entry</div>
                    <div className="grid grid-cols-4 gap-2">
                        <div>Account Title</div>
                        <div>UACS Code</div>
                        <div>Debit</div>
                        <div>Credit</div>
                    </div>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                        <input
                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none"
                            type="text"
                            name="uacsTitle"
                            // value={formData.uacsTitle}
                            // onChange={handleInputChange}
                        />
                        <input
                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none"
                            type="text"
                            name="uacsCode"
                            // value={formData.uacsCode}
                            // onChange={handleInputChange}
                            readOnly
                        />
                        <input
                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none"
                            type="number"
                            name="debit"
                            // value={formData.debit}
                            // onChange={handleInputChange}
                        />
                        <input
                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none"
                            type="number"
                            name="credit"
                            // value={formData.credit}
                            // onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Certified and Approved Section */}
                <div className="mb-4 grid grid-cols-2 gap-4 border p-4">
                    <div>
                        <div className="font-bold">C. Certified</div>
                        <div className="mt-2">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox"
                                />
                                <span className="ml-2">Cash available</span>
                            </label>
                        </div>
                        <div className="mt-2">
                            <label className="inline-flex items-center">
                                <span className="ml-2">Signature:</span>
                            </label>
                        </div>
                        <div className="mt-2">
                            <div className="font-semibold">name</div>
                            <div>position</div>
                        </div>
                    </div>
                    <div>
                        <div className="font-bold">D. Approved for Payment</div>
                        <div className="mt-2">
                            <input
                                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none"
                                type="text"
                                placeholder="Amount"
                            />
                        </div>
                        <div className="mt-2">
                            <label className="inline-flex items-center">
                                <span className="ml-2">Signature:</span>
                            </label>
                        </div>
                        <div className="mt-2">
                            <div className="font-semibold">name</div>
                            <div>position</div>
                        </div>
                    </div>
                </div>

                {/* Receipt of Payment */}
                <div className="mb-4 border p-4">
                    <div className="font-bold">E. Receipt of Payment</div>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                            <div>Check/ADA No.:</div>
                            <div>Date:</div>
                            <div>Bank Name & Account Number:</div>
                        </div>
                        <div>
                            <div>JEV No. </div>
                            <div>Signature:</div>
                            <div>Date:</div>
                        </div>
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
