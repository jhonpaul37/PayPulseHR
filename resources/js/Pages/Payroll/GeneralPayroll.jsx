import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const GeneralPayroll = ({ auth }) => {
    return (
        <AuthenticatedLayout user={auth.user}>
            <div>General Payroll</div>
        </AuthenticatedLayout>
    );
};

export default GeneralPayroll;
