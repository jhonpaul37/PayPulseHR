import React, { useState } from 'react';

const AccountingEntry = () => {
    // Initial state with two empty rows
    const [entries, setEntries] = useState([
        { uacsTitle: '', uacsCode: '', debit: '', credit: '' },
        { uacsTitle: '', uacsCode: '', debit: '', credit: '' },
    ]);

    // Function to handle input changes
    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newEntries = [...entries];
        newEntries[index][name] = value;
        setEntries(newEntries);
    };

    // Function to add a new row
    const addRow = () => {
        setEntries([
            ...entries,
            { uacsTitle: '', uacsCode: '', debit: '', credit: '' },
        ]);
    };

    return (
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
                {entries.map((entry, index) => (
                    <div key={index} className="mt-2 grid grid-cols-4 gap-2">
                        <input
                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none"
                            type="text"
                            name="uacsTitle"
                            value={entry.uacsTitle}
                            onChange={(e) => handleInputChange(index, e)}
                        />
                        <input
                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none"
                            type="text"
                            name="uacsCode"
                            value={entry.uacsCode}
                            onChange={(e) => handleInputChange(index, e)}
                            readOnly
                        />
                        <input
                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none"
                            type="number"
                            name="debit"
                            value={entry.debit}
                            onChange={(e) => handleInputChange(index, e)}
                        />
                        <input
                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none"
                            type="number"
                            name="credit"
                            value={entry.credit}
                            onChange={(e) => handleInputChange(index, e)}
                        />
                    </div>
                ))}
                <button
                    onClick={addRow}
                    className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
                >
                    Add Entry
                </button>
            </div>
        </div>
    );
};

export default AccountingEntry;
