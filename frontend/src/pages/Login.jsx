import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Login() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = e => {
        e.preventDefault();
        setError(null);
        login(form)
            .then(() => navigate('/cars'))
            .catch(() => setError('Invalid email or password.'));
    };

    return (
        <div className="login p-4">
            <h1>Log In</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm">
                <label>Username<input name="username" type="text" value={form.username} onChange={handleChange} required /></label>                <label>Password<input name="password" type="password" value={form.password} onChange={handleChange} required /></label>
                <button type="submit" className="btn mt-2">Log In</button>
            </form>
        </div>
    );
}
