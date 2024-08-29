export default function Show({ voucher }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear().toString().slice(-2);
        return `${day}-${month}-${year}`;
    };

    return (
        <>
            {/* <div className="my-10">
                <div className="my-2 border bg-white p-4">
                    <div className="text-sm text-gray-500">
                        <span>Created at </span>
                        <span>
                            {new Date(voucher.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <p>{voucher.jev_no}</p>
                </div>
            </div> */}
            <div className="border-2 border-black bg-white shadow-md">
                {/* Header */}
                <div className="border-b-2 border-black">
                    <div className="grid grid-cols-6 text-xs">
                        <div className="col-span-5 flex items-center justify-center font-bold">
                            DISBURSEMENT VOUCHER
                        </div>

                        <div className="border-l-2 border-black">
                            {/* fund cluster */}
                            <div className="flex items-center border-b border-black p-1">
                                <span>Fund Cluster: </span>
                                <span className="ml-5 text-center font-bold">
                                    {voucher.f_cluster}
                                </span>
                            </div>

                            <div className="border-b border-black p-1">
                                Date:
                            </div>
                            <div className="flex p-1">
                                <span>DV No. </span>
                                <span className="ml-5 text-center font-bold">
                                    {voucher.div_num}
                                </span>
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
                        {/* {['MDS Check', 'Commercial Check', 'ADA'].map(
                            (mode) => (
                                <label
                                    key={mode}
                                    className="inline-flex items-center"
                                >
                                    <input
                                        type="checkbox"
                                        className="form-checkbox"
                                        autoComplete="off"
                                    />

                                    <span className="ml-2">{mode}</span>
                                </label>
                            )
                        )} */}

                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox"
                                autoComplete="off"
                            />
                            <span className="ml-2">
                                Others (Please Specify)
                            </span>
                            <input
                                type="text"
                                className="ml-2 border-b-2 border-black focus:outline-none"
                                autoComplete="off"
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
                                autoComplete="off"
                            />
                        </div>
                        <div className="col-span-2 border-l border-black p-2">
                            <label className="text-xs">TIN/Employee No.</label>
                            <input
                                className="focus:shadow-outline w-full appearance-none rounded border leading-tight shadow focus:outline-none"
                                id="TIN/EmployeeNo"
                                type="number"
                                name="TIN/EmployeeNo"
                                autoComplete="off"
                            />
                        </div>
                        <div className="col-span-2 border-l border-black p-2">
                            <label className="text-xs">ORS/BRS No.</label>
                            {/* <input
                                value={data.ors_burs_no}
                                type="number"
                                onChange={(e) =>
                                    setData('ors_burs_no', e.target.value)
                                }
                                placeholder="ors_burs_no"
                                className={`w-full rounded border px-3 py-2 shadow focus:outline-none ${
                                    !data.ors_burs_no ? 'border-high' : ''
                                } ${errors.ors_burs_no ? '!ring-red-500' : ''}`}
                                autoComplete="off"
                            /> */}

                            {/* {errors.ors_burs_no && (
                                    <div className="text-red-600">
                                        {errors.ors_burs_no}
                                    </div>
                                )} */}
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
                                autoComplete="off"
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
                            autoComplete="off"
                        />
                    </div>
                    <div className="col-span-2 flex items-center border-l border-black p-2">
                        <input
                            className="w-full rounded border px-3 py-2 shadow focus:outline-none"
                            type="text"
                            name="MFO/PAP"
                            autoComplete="off"
                        />
                    </div>
                    <div className="col-span-2 flex items-center border-l border-black p-2">
                        {/* <input
                            className={`w-full rounded border px-3 py-2 shadow focus:outline-none ${
                                !data.amount ? 'border-high' : ''
                            } ${balanceError ? 'border-red-500' : ''}`}
                            type="number"
                            name="amount"
                            autoComplete="off"
                            onChange={handleAmountChange}
                            placeholder="Enter amount"
                        /> */}
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
                            {/* {namePositions[3]?.name_pos} */} Name
                        </div>
                        <div className="text-xs">
                            {/* {namePositions[3]?.position} */}Position
                        </div>
                    </div>
                </div>

                {/* Accounting Entry */}
                {/* <AccountingEntry
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
                /> */}
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
                            <div className="flex flex-col items-center justify-center border-l border-black">
                                <div>Debit </div>
                            </div>
                            <div className="flex flex-col items-center justify-center border-l border-black">
                                <span>Credit</span>
                            </div>
                        </div>
                        {voucher.uacs_code.map((uacs, index) => (
                            <div
                                key={index}
                                className="flex flex-col justify-center border-b border-black"
                            >
                                <div className="grid grid-cols-4 border-b border-black">
                                    <div className="flex p-2">
                                        <div className="mr-2">
                                            {uacs.accountTitle}
                                        </div>
                                        <div className="relative w-full"></div>
                                    </div>
                                    <div className="flex items-center justify-center border-l border-black p-2">
                                        {uacs.uacs_code}
                                    </div>
                                    <div className="flex items-center justify-center border-l border-black p-2">
                                        {/* {item.debit} */}
                                    </div>
                                    <div className="flex items-center justify-center border-l border-black p-2">
                                        {/* {item.credit} */}
                                    </div>
                                </div>
                            </div>
                        ))}
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
                                    autoComplete="off"
                                />
                                <span className="ml-2">Cash available</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    autoComplete="off"
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
                                    autoComplete="off"
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
                                autoComplete="off"
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
                            <div className="flex border-b border-black p-2">
                                <span>JEV No. </span>
                                <span className="ml-5 text-center font-bold">
                                    {voucher.jev_no}
                                </span>
                                {/* <input
                                    name="jev_no"
                                    value={data.code}
                                    type="text"
                                    onChange={handleInputChange}
                                    placeholder="Auto Generated"
                                    className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none ${errors.jev_no ? '!ring-red-500' : ''}`}
                                    autoComplete="off"
                                    readOnly
                                /> */}
                            </div>
                            <div className="p-2">
                                {' '}
                                <span>Date: </span>
                                <span className="ml-5 font-bold">
                                    {formatDate(voucher.created_at)}
                                </span>
                            </div>
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
                            Responsibility Center
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

                    {/* Displaying Entries */}
                    <div className="grid grid-cols-5 text-center">
                        <div className="border-b border-black"></div>
                        <div className="col-span-4 border-l border-black">
                            {/* {entries.map((entry, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-5 border-b border-black"
                                >
                                    <div className="col-span-2 flex items-center justify-center p-2">
                                        {entry.uacsTitle}
                                    </div>
                                    <div className="flex items-center justify-center border-l border-black p-2">
                                        {entry.uacsCode}
                                    </div>
                                    <div className="flex items-center justify-center border-l border-black p-2">

                                    </div>
                                    <div className="flex flex-col border-l border-black">
                                        <div className="grid grid-cols-2">
                                            <div className="p-2">
                                                {entry.debit}
                                            </div>
                                            <div className="border-l border-black p-2">
                                                {entry.credit}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))} */}
                        </div>
                    </div>

                    {/* Total */}
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
                                            {/* {totalDebit.toFixed(2)} */}
                                        </div>
                                        <div className="border-l border-black p-2 text-center">
                                            {/* {totalCredit.toFixed(2)} */}
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
                                {voucher.user_id} userID_name here
                            </span>
                            <span>Adimistrative Aide VI/ Position</span>
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
        </>
    );
}
