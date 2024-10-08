import React, { useState, useEffect } from 'react';

function AvailLeave({ typeOfLeave, onLeaveTypeChange }) {
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

    const [leaveType, setLeaveType] = useState({ typeOfLeave });
    const [leaveDetails, setLeaveDetails] = useState({
        vacationLeave: '',
        sickLeave: '',
        specialBenefitsWomen: '',
        studyLeave: '',
        otherPurpose: '',

        vacationLeaveText: '',
        sickLeaveText: '',
        specialBenefitsWomenText: '',
    });

    const handleRadioChange = (e) => {
        setLeaveType(e.target.value);
        setLeaveDetails((prevDetails) => ({
            ...prevDetails,
            vacationLeaveText: '',
            sickLeaveText: '',
            specialBenefitsWomenText: '',
        }));
    };

    useEffect(() => {
        onLeaveTypeChange(leaveType, leaveDetails);
    }, [leaveType, leaveDetails]);

    const handleDetailsChange = (e) => {
        const { name, value } = e.target;
        setLeaveDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };
    // console.log(leaveType);

    const isVacationLeave =
        leaveType === 'Vacation Leave' || leaveType === 'Special Privilege Leave';
    const isSickLeave = leaveType === 'Sick Leave';
    const isSpecialBenefitsForWomen = leaveType === 'Special Benefits for Women';
    const isStudyLeave = leaveType === 'Study Leave';

    return (
        <div className="">
            <div className="grid grid-cols-2">
                <div className="p-1">
                    <label>6.A TYPE OF LEAVE TO BE AVAILED OF</label>

                    {/* {typeOfLeave} */}
                    <div className="flex flex-col p-4">
                        {/* {avail.map((type, index) => (
                            <label
                                key={index}
                                className={`inline-flex items-center ${
                                    type === 'Others (please specify)' ? 'col-span-3' : ''
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="leaveType"
                                    checked={typeOfLeave.includes(type)}
                                    value={type}
                                    onChange={handleRadioChange}
                                    className="form-radio"
                                    autoComplete="off"
                                />
                                <span className="ml-2">{type}</span>
                            </label>
                        ))} */}
                        {avail.map((type, index) => (
                            <label
                                key={index}
                                className={`inline-flex items-center ${
                                    type === 'Others (please specify)' ? 'col-span-3' : ''
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="leaveType"
                                    value={type}
                                    checked={leaveType === type}
                                    onChange={handleRadioChange}
                                    className="form-radio"
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
