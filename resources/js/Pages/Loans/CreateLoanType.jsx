import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const CreateLoanType = ({ auth, loanPrograms }) => {
    const { data, setData, post, errors } = useForm({
        loan_program_id: '',
        type: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('loanTypes.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div>
                <h1>Create Loan Type</h1>
                <form onSubmit={handleSubmit}>
                    {/* Loan Program Dropdown */}
                    <div className="">
                        <label>Loan Program</label>
                        <select
                            value={data.loan_program_id}
                            onChange={(e) => setData('loan_program_id', e.target.value)}
                            className=""
                        >
                            <option value="">Select Loan Program</option>
                            {loanPrograms.map((program) => (
                                <option key={program.id} value={program.id}>
                                    {program.name}
                                </option>
                            ))}
                        </select>
                        {errors.loan_program_id && <div className="">{errors.loan_program_id}</div>}
                    </div>

                    {/* Type Input */}
                    <div className="">
                        <label>Type</label>
                        <input
                            type="text"
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className=""
                        />
                        {errors.type && <div className="">{errors.type}</div>}
                    </div>

                    {/* Description Input */}
                    <div className="">
                        <label>Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className=""
                        />
                        {errors.description && <div className="">{errors.description}</div>}
                    </div>

                    <PrimaryButton type="submit" className="">
                        Save
                    </PrimaryButton>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default CreateLoanType;
