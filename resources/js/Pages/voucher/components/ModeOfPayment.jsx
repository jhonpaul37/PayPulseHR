import React from 'react';

const ModeOfPayment = () => {
    return (
        <div className="mb-4 border">
            <div className="mb-2 font-bold">Mode of Payment</div>
            <div className="flex space-x-4">
                <label className="inline-flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="ml-2">MDS Check</span>
                </label>
                <label className="inline-flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="ml-2">Commercial Check</span>
                </label>
                <label className="inline-flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="ml-2">ADA</span>
                </label>
                <label className="inline-flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="ml-2">Others (Please Specify)</span>
                </label>
            </div>
        </div>
    );
};

export default ModeOfPayment;
