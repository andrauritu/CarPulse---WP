import React, { useState } from 'react';
        import { useNavigate } from 'react-router-dom';
        import useAuth from '../hooks/useAuth';

        export default function SignUp() {
            const [form, setForm] = useState({
                username: '',
                email: '',
                password: '',
                familyId: '',
                role: 'ROLE_USER'
            });
            const [error, setError] = useState(null);
            const { signup } = useAuth();
            const navigate = useNavigate();

            const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

            const handleSubmit = e => {
                e.preventDefault();
                setError(null);
                // Convert familyId to number
                const signupData = {
                    ...form,
                    familyId: Number(form.familyId)
                };
                signup(signupData)
                    .then(() => navigate('/cars'))
                    .catch(() => setError('Signup failed.'));
            };

            return (
                <div className="signup p-4">
                    <h1>Sign Up</h1>
                    {error && <p className="error">{error}</p>}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm">
                        <label>Username
                            <input name="username" value={form.username} onChange={handleChange} required />
                        </label>
                        <label>Email
                            <input name="email" type="email" value={form.email} onChange={handleChange} required />
                        </label>
                        <label>Password
                            <input name="password" type="password" value={form.password} onChange={handleChange} required />
                        </label>
                        <label>Family ID
                            <input name="familyId" type="number" value={form.familyId} onChange={handleChange} required />
                        </label>
                        <label>Role
                            <select name="role" value={form.role} onChange={handleChange}>
                                <option value="ROLE_USER">User</option>
                                <option value="ROLE_ADMIN">Admin</option>
                            </select>
                        </label>
                        <button type="submit" className="btn mt-2">Sign Up</button>
                    </form>
                </div>
            );
        }