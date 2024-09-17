import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function NewEmployee({ auth }) {
    const { data, setData, post, errors } = useForm({
        company_id: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        birthdate: '',
        sex: '',
        civil_status: '',
        nationality: '',
        address: '',
        phone: '',
        email: '',
        position: '',
        department: '',
        start_date: '',
        employment_type: '',
        salary: '',
        vacation_days: 0,
        sick_days: 0,
        leave_balance: 0,
        photo: null, // Updated for photo file
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('employees.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="rounded-md border-2 p-5 shadow-md">
                <h1>Create New Employee</h1>
                <form onSubmit={handleSubmit}>
                    {/* Company ID */}
                    <div>
                        <label>Employee ID</label>
                        <input
                            type="text"
                            value={data.company_id}
                            onChange={(e) => setData('company_id', e.target.value)}
                            className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                        />
                        {errors.company_id && <div>{errors.company_id}</div>}
                    </div>

                    <div className="flex">
                        {/* First Name */}
                        <div>
                            <label>First Name</label>
                            <input
                                type="text"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
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
                                className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                            />
                            {errors.last_name && <div>{errors.last_name}</div>}
                        </div>

                        {/* Middle Name */}
                        <div>
                            <label>Middle Name</label>
                            <input
                                type="text"
                                value={data.middle_name}
                                onChange={(e) => setData('middle_name', e.target.value)}
                                className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                            />
                            {errors.middle_name && <div>{errors.middle_name}</div>}
                        </div>
                    </div>

                    {/* Birthdate */}
                    <div>
                        <label>Birthdate</label>
                        <input
                            type="date"
                            value={data.birthdate}
                            onChange={(e) => setData('birthdate', e.target.value)}
                            className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                        />
                        {errors.birthdate && <div>{errors.birthdate}</div>}
                    </div>

                    <div className="flex">
                        {/* Sex */}
                        <div>
                            <label>Sex</label>
                            <select
                                value={data.sex}
                                onChange={(e) => setData('sex', e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.sex && <div>{errors.sex}</div>}
                        </div>

                        {/* Civil Status */}
                        <div>
                            <label>Civil Status</label>
                            <select
                                value={data.civil_status}
                                onChange={(e) => setData('civil_status', e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="single">Single</option>
                                <option value="married">Married</option>
                                <option value="divorced">Divorced</option>
                            </select>
                            {errors.civil_status && <div>{errors.civil_status}</div>}
                        </div>

                        {/* Nationality */}
                        <div>
                            <label>Nationality</label>
                            <input
                                type="text"
                                value={data.nationality}
                                onChange={(e) => setData('nationality', e.target.value)}
                                className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                            />
                            {errors.nationality && <div>{errors.nationality}</div>}
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label>Address</label>
                        <input
                            type="text"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                        />
                        {errors.address && <div>{errors.address}</div>}
                    </div>

                    <div className="flex">
                        {/* Phone */}
                        <div>
                            <label>Phone</label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                            />
                            {errors.phone && <div>{errors.phone}</div>}
                        </div>

                        {/* Email */}
                        <div>
                            <label>Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                            />
                            {errors.email && <div>{errors.email}</div>}
                        </div>
                    </div>

                    {/*
                    <div>
                        <label>Position</label>
                        <input
                            type="text"
                            value={data.position}
                            onChange={(e) => setData('position', e.target.value)}
                            className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                        />
                        {errors.position && <div>{errors.position}</div>}
                    </div>

                    <div>
                        <label>Department</label>
                        <input
                            type="text"
                            value={data.department}
                            onChange={(e) => setData('department', e.target.value)}
                            className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                        />
                        {errors.department && <div>{errors.department}</div>}
                    </div> */}

                    {/* Start Date */}
                    <div>
                        <label>Start Date</label>
                        <input
                            type="date"
                            value={data.start_date}
                            onChange={(e) => setData('start_date', e.target.value)}
                            className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                        />
                        {errors.start_date && <div>{errors.start_date}</div>}
                    </div>

                    {/* Employment Type */}
                    <div>
                        <label>Employment Type</label>
                        <select
                            value={data.employment_type}
                            onChange={(e) => setData('employment_type', e.target.value)}
                        >
                            <option value="">Select</option>
                            <option value="full-time">Full-time</option>
                            <option value="part-time">Part-time</option>
                            <option value="contract">Contract</option>
                        </select>
                        {errors.employment_type && <div>{errors.employment_type}</div>}
                    </div>

                    {/* Salary */}
                    <div>
                        <label>Salary</label>
                        <input
                            type="number"
                            value={data.salary}
                            onChange={(e) => setData('salary', e.target.value)}
                            className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                        />
                        {errors.salary && <div>{errors.salary}</div>}
                    </div>

                    {/* Profile Picture */}
                    <div>
                        <label>Profile Picture</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('photo', e.target.files[0])}
                            className={`focus:shadow-outline appearance-none rounded border px-3 py-2 font-bold leading-tight shadow focus:outline-none`}
                        />
                        {errors.photo && <div>{errors.photo}</div>}
                    </div>

                    <button type="submit">Submit</button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
