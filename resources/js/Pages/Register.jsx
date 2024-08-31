import React from 'react';
import { useForm } from '@inertiajs/inertia-react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input
                type="text"
                name="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
            />
            {errors.name && <div>{errors.name}</div>}

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

            <label htmlFor="password_confirmation">Confirm Password:</label>
            <input
                type="password"
                name="password_confirmation"
                value={data.password_confirmation}
                onChange={(e) =>
                    setData('password_confirmation', e.target.value)
                }
            />
            {errors.password_confirmation && (
                <div>{errors.password_confirmation}</div>
            )}

            <button type="submit" disabled={processing}>
                Register
            </button>
        </form>
    );
}
