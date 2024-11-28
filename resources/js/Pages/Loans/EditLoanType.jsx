import React from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const EditLoanType = ({ auth, loanType }) => {
    const { data, setData, put, errors } = useForm({
        type: loanType.type,
        description: loanType.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('loanTypes.update', loanType.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div>
                <h1>Edit Loan Type</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Type</label>
                        <input
                            type="text"
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className="form-control"
                        />
                        {errors.type && <div className="text-danger">{errors.type}</div>}
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="form-control"
                        />
                        {errors.description && (
                            <div className="text-danger">{errors.description}</div>
                        )}
                    </div>

                    <PrimaryButton type="submit" className="">
                        Update
                    </PrimaryButton>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditLoanType;
