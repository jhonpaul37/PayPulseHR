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
                    <label className="font-bold">6.A TYPE OF LEAVE TO BE AVAILED OF</label>
                    <div className="grid grid-cols-1 gap-2 p-4">
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

                {/* ... rest of your component remains the same ... */}
            </div>
        </div>
    );
}

export default AvailLeave;
