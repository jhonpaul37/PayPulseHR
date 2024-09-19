import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Computation = ({ auth }) => {
    return (
        <AuthenticatedLayout user={auth.user}>
            <div>
                <header className="text-center text-xl font-bold">Computation</header>
            </div>
        </AuthenticatedLayout>
    );
};

export default Computation;
