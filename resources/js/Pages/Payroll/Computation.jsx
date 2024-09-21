import React from 'react';
import Payroll from './Payroll';

const Computation = ({ auth }) => {
    return (
        <Payroll auth={auth}>
            <div>
                <header className="text-center">Testing</header>
            </div>
        </Payroll>
    );
};

export default Computation;
