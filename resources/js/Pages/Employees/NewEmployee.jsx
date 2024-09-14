import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function NewEmployee({ auth }) {
    const { data, setData, post, errors } = useForm({
        first_name: '',
        last_name: '',
        birthdate: '',
        sex: '',
        marital_status: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('employees.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div>
                <h1>Create New Employee</h1>
                <form onSubmit={handleSubmit}>
                    {/* First Name */}
                    <div>
                        <label>First Name</label>
                        <input
                            type="text"
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                        />
                        {errors.first_name && <div>{errors.first_name}</div>}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label>Last Name</label>
                        <input
                            type="text"
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                        />
                        {errors.last_name && <div>{errors.last_name}</div>}
                    </div>

                    {/* Birthdate */}
                    <div>
                        <label>Birthdate</label>
                        <input
                            type="date"
                            value={data.birthdate}
                            onChange={(e) => setData('birthdate', e.target.value)}
                        />
                        {errors.birthdate && <div>{errors.birthdate}</div>}
                    </div>

                    {/* Sex */}
                    <div>
                        <label>Sex</label>
                        <select value={data.sex} onChange={(e) => setData('sex', e.target.value)}>
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.sex && <div>{errors.sex}</div>}
                    </div>

                    {/* Marital Status */}
                    <div>
                        <label>Civil Status</label>
                        <select
                            value={data.marital_status}
                            onChange={(e) => setData('civil_status', e.target.value)}
                        >
                            <option value="">Select</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="divorced">Divorced</option>
                        </select>
                        {errors.marital_status && <div>{errors.marital_status}</div>}
                    </div>

                    <button type="submit">Submit</button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
