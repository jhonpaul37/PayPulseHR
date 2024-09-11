// FormHeader.jsx
import React, { Component } from 'react';
import BSCLogo from '../../../../assets/BSC_LOGO.png';

class FormHeader extends Component {
    constructor(props) {
        super(props);
    }

    state = {};

    render() {
        return (
            <div>
                <div className="relative mb-5 flex items-center justify-center">
                    <img
                        src={BSCLogo}
                        alt="Batanes State College Logo"
                        className="mr-4 h-20 w-20"
                    />
                    <div className="flex flex-col items-center">
                        <span className="font-oldenglish">Republic of the Philippines</span>
                        <span className="font-copperplate text-2xl tracking-wide">
                            BATANES STATE COLLEGE
                        </span>
                        <span className="font-times">San Antonio, Basco, Batanes</span>
                        <div className="">
                            <span className="mr-2">www.bscbatanes.edu.ph</span>
                            <span className="mr-2">batanes_bsat@yahoo.com</span>
                            <span>09057867863</span>
                        </div>
                    </div>
                    <div className="absolute right-0 top-0 flex flex-col text-end">
                        <span>BSC-FORM-HRP-001</span>
                        <span>REF#: ________________________</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default FormHeader;
