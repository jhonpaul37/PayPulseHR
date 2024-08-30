import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const AccountingEntry = ({
    entries,
    uacsCodes,
    balanceError,
    debitError,
    creditError,
    errors,
    handleDebitChange,
    handleCreditChange,
    setEntries,
    setData,
    amount,
}) => {
    const addRow = () => {
        if (entries.length < 4) {
            setEntries([
                ...entries,
                {
                    uacsTitle: '',
                    uacsCode: '',
                    debit: '',
                    credit: '',
                    query: '',
                    suggestions: [],
                },
            ]);
        }
    };

    const removeRow = () => {
        if (entries.length > 2) {
            const updatedEntries = entries.slice(0, -1);
            setEntries(updatedEntries);
            setData(
                'uacs_code',
                updatedEntries.map((entry) => entry.uacsCode)
            );
        }
    };
    // Handle input Account Title
    const handleInputChange = (e, index) => {
        const value = e.target.value;

        const updatedEntries = [...entries];
        updatedEntries[index].query = value;

        if (value) {
            const filteredSuggestions = uacsCodes.filter((code) =>
                code.Account_title.toLowerCase().includes(value.toLowerCase())
            );
            updatedEntries[index].suggestions = filteredSuggestions;
        } else {
            updatedEntries[index].suggestions = [];
        }

        setEntries(updatedEntries);
    };

    // Handle suggestion
    const handleSuggestionClick = (suggestion, index) => {
        const updatedEntries = [...entries];
        updatedEntries[index].uacsTitle = suggestion.Account_title;
        updatedEntries[index].uacsCode = suggestion.UACS_code;
        updatedEntries[index].query = suggestion.Account_title;
        updatedEntries[index].suggestions = [];

        setEntries(updatedEntries);

        // UACS codes
        setData(
            'uacs_code',
            updatedEntries.map((entry) => entry.uacsCode)
        );
    };
    return (
        <div className="">
            <div>
                <div className="border-b border-black p-2 text-xs">
                    B. Accounting Entry {amount}
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
                            {balanceError && (
                                <div className="text-red-500">
                                    Total Debit:{' '}
                                    {entries.reduce(
                                        (sum, entry) =>
                                            sum +
                                            (parseFloat(entry.debit) || 0),
                                        0
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-center justify-center border-l border-black">
                            <span>Credit</span>
                            {balanceError && (
                                <div className="text-red-500">
                                    Total Credits:{' '}
                                    {entries.reduce(
                                        (sum, entry) =>
                                            sum +
                                            (parseFloat(entry.credit) || 0),
                                        0
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center border-b border-black">
                        {entries.map((entry, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-4 border-b border-black"
                            >
                                <div className="flex p-2">
                                    <div className="mr-2">
                                        <button
                                            type="button"
                                            onClick={addRow}
                                            className={`rounded px-4 py-2 font-bold ${
                                                entries.length >= 4
                                                    ? 'cursor-not-allowed bg-gray-300'
                                                    : 'hover:bg-high-dark bg-high'
                                            }`}
                                            disabled={entries.length >= 4}
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                    <div className="relative w-full">
                                        <input
                                            id={`uacsInput-${index}`}
                                            type="text"
                                            value={entry.query}
                                            onChange={(e) =>
                                                handleInputChange(e, index)
                                            }
                                            className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none ${
                                                !entry.query &&
                                                !errors.uacs_code
                                                    ? 'border-high' // Highlight when empty
                                                    : errors.uacs_code
                                                      ? 'border-red-500' // error
                                                      : 'border-gray-300'
                                            }`}
                                            placeholder="Typing to search Account Title"
                                            autoComplete="off"
                                        />
                                        {entry.suggestions.length > 0 && (
                                            <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                                                {entry.suggestions.map(
                                                    (suggestion, i) => (
                                                        <li
                                                            key={i}
                                                            onClick={() =>
                                                                handleSuggestionClick(
                                                                    suggestion,
                                                                    index
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
                                        value={entry.uacsCode}
                                        className={`focus:shadow-outline w-full appearance-none rounded border border-blue-500 px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                        onChange={(e) => {
                                            const updatedEntries = [...entries];
                                            updatedEntries[index].uacsCode =
                                                e.target.value;
                                            setEntries(updatedEntries);
                                            setData(
                                                'uacs_code',
                                                updatedEntries.map(
                                                    (entry) => entry.uacsCode
                                                )
                                            );
                                        }}
                                        autoComplete="off"
                                        readOnly
                                    />
                                </div>
                                <div className="flex items-center justify-center border-l border-black p-2">
                                    <input
                                        type="number"
                                        value={
                                            entry.debit === 0 ? '' : entry.debit
                                        }
                                        onChange={(e) =>
                                            handleDebitChange(e, index)
                                        }
                                        className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none ${
                                            !entry.credit
                                                ? 'border-high' // Highlight when empty
                                                : balanceError && debitError
                                                  ? 'border-red-500' // error
                                                  : 'border-gray-300'
                                        }`}
                                    />
                                </div>
                                <div className="flex items-center justify-center border-l border-black p-2">
                                    <input
                                        type="number"
                                        value={
                                            entry.credit === 0
                                                ? ''
                                                : entry.credit
                                        }
                                        onChange={(e) =>
                                            handleCreditChange(e, index)
                                        }
                                        className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none ${
                                            !entry.credit
                                                ? 'border-high' // Highlight when empty
                                                : balanceError && creditError
                                                  ? 'border-red-500' //  error
                                                  : 'border-gray-300'
                                        }`}
                                    />
                                    <div className="ml-2">
                                        <button
                                            type="button"
                                            onClick={removeRow}
                                            className={`rounded px-4 py-2 font-bold text-white ${
                                                entries.length <= 2
                                                    ? 'cursor-not-allowed bg-red-200' // Lighter color
                                                    : 'bg-red-500 hover:bg-red-600'
                                            }`}
                                            disabled={entries.length <= 2}
                                        >
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountingEntry;
