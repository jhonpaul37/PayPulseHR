import React from 'react';
import { Inertia } from '@inertiajs/inertia-react';
import { useForm } from '@inertiajs/inertia-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                name="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
            />
            {errors.email && <div>{errors.email}</div>}

            <label htmlFor="password">Password:</label>
            <input
                type="password"
                name="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
            />
            {errors.password && <div>{errors.password}</div>}

            <button type="submit" disabled={processing}>
                Login
            </button>
        </form>
    );
}
