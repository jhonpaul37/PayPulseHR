import React, { useState, useEffect } from 'react';

function AvailLeave({ onLeaveTypeChange }) {
    const avail = [
        'Vacation Leave',
        'Mandatory',
        'Sick Leave',
        'Maternity Leave',
        'Peternity Leave',
        'Special Privilege Leave',
        'Solo Parnt Leave',
        'Study Leave',
        '10-Day VAWC Leave',
        'Rehabilitation Privilege Leave',
        'Special Benifits for Women',
        'Special Emergency',
        'Adoption Leave',
        'Others',
    ];
    // State to manage checked checkboxes
    const [leaveType, setLeaveType] = useState([]);

    // Handler for checkbox change
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        if (checked) {
            setLeaveType([...leaveType, name]); // Add the checked item
        } else {
            setLeaveType(leaveType.filter((item) => item !== name)); // Remove the unchecked item
        }
    };

    // Use useEffect to pass the selected leave types to the parent when they change
    useEffect(() => {
        onLeaveTypeChange(leaveType); // Pass the selected leave types to the parent component
    }, [leaveType, onLeaveTypeChange]);

    return (
        <div className="">
            <div className="grid grid-cols-2">
                <div className="p-1">
                    <label>6.A TYPE OF LEAVE TO BE AVAILED OF</label>
                    <div className="flex flex-col p-4">
                        {avail.map((type, index) => (
                            <label
                                key={index}
                                className={`inline-flex items-center ${
                                    type === 'Others (please specify)' ? 'col-span-3' : ''
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    name={type}
                                    checked={leaveType.includes(type)}
                                    onChange={handleCheckboxChange}
                                    className="form-checkbox"
                                    autoComplete="off"
                                />
                                <span className="ml-2">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="border-l border-black p-1">
                    <label>6.B DETAILS OF LEAVE</label>
                    <div className="p-4">
                        <div>
                            <label className="italic">
                                In case of Vacation/Special Previlege Leave
                            </label>
                            <div className="flex flex-col">
                                <label>
                                    <input
                                        type="checkbox"
                                        className="form-checkbox"
                                        autoComplete="off"
                                    />{' '}
                                    <span className="mx-2">With in the Philippines</span>
                                    <input type="text" />
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        className="form-checkbox"
                                        autoComplete="off"
                                    />{' '}
                                    <span className="mx-2">Abroad (Specify)</span>
                                    <input type="text" />
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="italic">In case of Sick Leave</label>
                            <div className="flex flex-col">
                                <label>
                                    <input
                                        type="checkbox"
                                        className="form-checkbox"
                                        autoComplete="off"
                                    />{' '}
                                    <span className="mx-2">In Hospital (Specify Illness)</span>
                                    <input type="text" />
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        className="form-checkbox"
                                        autoComplete="off"
                                    />{' '}
                                    <span className="mx-2">Out Patient (Specify Illness)</span>
                                    <input type="text" />
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="italic">
                                In case of Special Leave Benifits for Women
                            </label>
                            <div className="flex flex-col">
                                <label>
                                    <span className="mx-2">(Specify Illness)</span>
                                    <input type="text" />
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="italic">In case of Study Leave:</label>
                            <div className="flex flex-col">
                                <label>
                                    <input
                                        type="checkbox"
                                        className="form-checkbox"
                                        autoComplete="off"
                                    />{' '}
                                    <span className="mx-2">Completion of Master's Degree</span>
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        className="form-checkbox"
                                        autoComplete="off"
                                    />{' '}
                                    <span className="mx-2">BAR/Board Examination Review</span>
                                </label>
                            </div>
                            <label className="italic">Other purpose:</label>
                            <div className="flex flex-col">
                                <label>
                                    <input
                                        type="checkbox"
                                        className="form-checkbox"
                                        autoComplete="off"
                                    />{' '}
                                    <span className="mx-2">Monetization of Leave Credits</span>
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        className="form-checkbox"
                                        autoComplete="off"
                                    />{' '}
                                    <span className="mx-2">Terminal Leave</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2">
                <div className="border-t border-black p-1">
                    <label>6.C NUMBER OF WORKING DAYS APPLIED FOR</label>
                    <div className="flex flex-col p-4">
                        <input type="text" />
                        <span>INCLUSIVE DATES</span>
                        <input type="text" />
                    </div>
                </div>
                <div className="border-l border-t border-black p-1">
                    <label>6.D COMMUTATION</label>
                    <div className="flex flex-col p-4">
                        <label>
                            <input type="checkbox" className="form-checkbox" autoComplete="off" />{' '}
                            <span className="mx-2">Not Requested</span>
                        </label>
                        <label>
                            <input type="checkbox" className="form-checkbox" autoComplete="off" />{' '}
                            <span className="mx-2">Requested</span>
                        </label>
                        <label className="mt-10 border-t border-black">
                            <span className="flex justify-center">(Signature of Applicants)</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AvailLeave;
