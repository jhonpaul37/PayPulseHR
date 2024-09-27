import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Loans = ({ auth }) => {
    return (
        <AuthenticatedLayout user={auth.user}>
            <div>hello</div>
        </AuthenticatedLayout>
    );
};

export default Loans;
