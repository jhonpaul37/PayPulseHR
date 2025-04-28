import React, { useState, useEffect } from 'react';

function AvailLeave({ typeOfLeave, onLeaveTypeChange, leaveDetails: initialLeaveDetails = {} }) {
    const avail = [
        'Vacation Leave',
        'Mandatory',
        'Sick Leave',
        'Maternity Leave',
        'Paternity Leave',
        'Special Privilege Leave',
        'Solo Parent Leave',
        'Study Leave',
        '10-Day VAWC Leave',
        'Rehabilitation Privilege Leave',
        'Special Benefits for Women',
        'Special Emergency',
        'Adoption Leave',
        'Others',
    ];

    // Initialize with the first item if typeOfLeave is an array
    const initialLeaveType = Array.isArray(typeOfLeave) ? typeOfLeave[0] : typeOfLeave || '';

    const [leaveType, setLeaveType] = useState(initialLeaveType);
    const [leaveDetails, setLeaveDetails] = useState({
        vacationLeave: initialLeaveDetails?.vacationLeave || '',
        sickLeave: initialLeaveDetails?.sickLeave || '',
        specialBenefitsWomen: initialLeaveDetails?.specialBenefitsWomen || '',
        studyLeave: initialLeaveDetails?.studyLeave || '',
        otherPurpose: initialLeaveDetails?.otherPurpose || '',
        vacationLeaveText: initialLeaveDetails?.vacationLeaveText || '',
        sickLeaveText: initialLeaveDetails?.sickLeaveText || '',
        specialBenefitsWomenText: initialLeaveDetails?.specialBenefitsWomenText || '',
    });

    // Initialize the component state only once when mounted
    useEffect(() => {
        if (typeOfLeave) {
            const newLeaveType = Array.isArray(typeOfLeave) ? typeOfLeave[0] : typeOfLeave;
            setLeaveType(newLeaveType);
        }
        if (initialLeaveDetails) {
            setLeaveDetails((prev) => ({
                ...prev,
                ...initialLeaveDetails,
            }));
        }
    }, []); // Empty dependency array means this runs only once on mount

    const handleRadioChange = (e) => {
        const newType = e.target.value;
        setLeaveType(newType);
        // Reset details when leave type changes
        setLeaveDetails({
            vacationLeave: '',
            sickLeave: '',
            specialBenefitsWomen: '',
            studyLeave: '',
            otherPurpose: '',
            vacationLeaveText: '',
            sickLeaveText: '',
            specialBenefitsWomenText: '',
        });
        // Call the change handler immediately
        onLeaveTypeChange(newType, {
            vacationLeave: '',
            sickLeave: '',
            specialBenefitsWomen: '',
            studyLeave: '',
            otherPurpose: '',
            vacationLeaveText: '',
            sickLeaveText: '',
            specialBenefitsWomenText: '',
        });
    };

    const handleDetailsChange = (e) => {
        const { name, value } = e.target;
        const newDetails = {
            ...leaveDetails,
            [name]: value,
        };
        setLeaveDetails(newDetails);
        // Call the change handler immediately
        onLeaveTypeChange(leaveType, newDetails);
    };

    const isVacationLeave =
        leaveType === 'Vacation Leave' || leaveType === 'Special Privilege Leave';
    const isSickLeave = leaveType === 'Sick Leave';
    const isSpecialBenefitsForWomen = leaveType === 'Special Benefits for Women';
    const isStudyLeave = leaveType === 'Study Leave';
    const isOthers = leaveType === 'Others';

    return (
        <div className="">
            <div className="grid grid-cols-2">
                <div className="p-1">
                    <label>6.A TYPE OF LEAVE TO BE AVAILED OF</label>

                    <div className="flex flex-col p-4">
                        {avail.map((type) => (
                            <label key={type} className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="leaveType"
                                    value={type}
                                    checked={leaveType === type}
                                    onChange={handleRadioChange}
                                    className="form-radio h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="border-l border-black p-1">
                    <label>6.B DETAILS OF LEAVE</label>

                    <div className="p-4">
                        {/* Vacation/Special Privilege Leave */}
                        <div>
                            <label className="italic">
                                In case of Vacation/Special Privilege Leave
                            </label>
                            <div className="flex items-center">
                                <div className="flex flex-col">
                                    <label>
                                        <input
                                            type="radio"
                                            name="vacationLeave"
                                            value="Within the Philippines"
                                            disabled={!isVacationLeave}
                                            onChange={handleDetailsChange}
                                            className="form-radio"
                                            autoComplete="off"
                                        />{' '}
                                        <span
                                            className={`mx-2 ${!isVacationLeave ? 'text-gray-400' : ''}`}
                                        >
                                            Within the Philippines
                                        </span>
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="vacationLeave"
                                            value="Abroad"
                                            disabled={!isVacationLeave}
                                            onChange={handleDetailsChange}
                                            className="form-radio"
                                            autoComplete="off"
                                        />{' '}
                                        <span
                                            className={`mx-2 ${!isVacationLeave ? 'text-gray-400' : ''}`}
                                        >
                                            Abroad (Specify)
                                        </span>
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    name="vacationLeaveText"
                                    value={leaveDetails.vacationLeaveText}
                                    disabled={!isVacationLeave}
                                    onChange={handleDetailsChange}
                                    className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                />
                            </div>
                        </div>

                        {/* Sick Leave */}
                        <div>
                            <label className="italic">In case of Sick Leave</label>
                            <div className="flex items-center">
                                <div className="flex flex-col">
                                    <label>
                                        <input
                                            type="radio"
                                            name="sickLeave"
                                            value="In Hospital"
                                            disabled={!isSickLeave}
                                            onChange={handleDetailsChange}
                                            className="form-radio"
                                            autoComplete="off"
                                        />{' '}
                                        <span
                                            className={`mx-2 ${!isSickLeave ? 'text-gray-400' : ''}`}
                                        >
                                            In Hospital (Specify Illness)
                                        </span>
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="sickLeave"
                                            value="Out Patient"
                                            disabled={!isSickLeave}
                                            onChange={handleDetailsChange}
                                            className="form-radio"
                                            autoComplete="off"
                                        />{' '}
                                        <span
                                            className={`mx-2 ${!isSickLeave ? 'text-gray-400' : ''}`}
                                        >
                                            Out Patient (Specify Illness)
                                        </span>
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    name="sickLeaveText"
                                    value={leaveDetails.sickLeaveText}
                                    disabled={!isSickLeave}
                                    onChange={handleDetailsChange}
                                    className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                />
                            </div>
                        </div>

                        {/* Special Benefits for Women */}
                        <div>
                            <label className="italic">
                                In case of Special Leave Benefits for Women
                            </label>
                            <div className="flex flex-col">
                                <label>
                                    <span
                                        className={`mx-2 ${!isSpecialBenefitsForWomen ? 'text-gray-400' : ''}`}
                                    >
                                        (Specify Illness)
                                    </span>
                                    <input
                                        type="text"
                                        name="specialBenefitsWomenText"
                                        value={leaveDetails.specialBenefitsWomenText}
                                        disabled={!isSpecialBenefitsForWomen}
                                        onChange={handleDetailsChange}
                                        className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Study Leave */}
                        <div>
                            <label className="italic">In case of Study Leave:</label>
                            <div className="flex flex-col">
                                <label>
                                    <input
                                        type="radio"
                                        name="studyLeave"
                                        value="Master's Degree"
                                        disabled={!isStudyLeave}
                                        onChange={handleDetailsChange}
                                        className="form-radio"
                                        autoComplete="off"
                                    />{' '}
                                    <span
                                        className={`mx-2 ${!isStudyLeave ? 'text-gray-400' : ''}`}
                                    >
                                        Completion of Master's Degree
                                    </span>
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="studyLeave"
                                        value="BAR Exam"
                                        disabled={!isStudyLeave}
                                        onChange={handleDetailsChange}
                                        className="form-radio"
                                        autoComplete="off"
                                    />{' '}
                                    <span
                                        className={`mx-2 ${!isStudyLeave ? 'text-gray-400' : ''}`}
                                    >
                                        BAR/Board Examination Review
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Other Purposes */}
                        <div>
                            <label className="italic">Other purpose:</label>
                            <div className="flex flex-col">
                                <label>
                                    <input
                                        type="radio"
                                        name="otherPurpose"
                                        value="Monetization"
                                        disabled={leaveType !== 'Others'}
                                        onChange={handleDetailsChange}
                                        className="form-radio"
                                        autoComplete="off"
                                    />{' '}
                                    <span
                                        className={`mx-2 ${leaveType !== 'Others' ? 'text-gray-400' : ''}`}
                                    >
                                        Monetization of Leave Credits
                                    </span>
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="otherPurpose"
                                        value="Terminal Leave"
                                        disabled={leaveType !== 'Others'}
                                        onChange={handleDetailsChange}
                                        className="form-radio"
                                        autoComplete="off"
                                    />{' '}
                                    <span
                                        className={`mx-2 ${leaveType !== 'Others' ? 'text-gray-400' : ''}`}
                                    >
                                        Terminal Leave
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AvailLeave;
