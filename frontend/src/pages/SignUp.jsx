import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';

export default function SignUp() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        familyId: '',
        role: 'ROLE_USER'
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = e => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        
        // Special bypass case - automatically create test account
        if (form.username.toLowerCase() === 'test') {
            // Store mock user in localStorage
            localStorage.setItem('user', JSON.stringify({
                id: 888,
                username: form.username,
                name: form.username,
                email: form.email || 'test@example.com',
                familyId: Number(form.familyId) || 1,
                role: form.role
            }));
            
            navigate('/cars');
            return;
        }
        
        // Validate that users have a familyId
        if (form.role === 'ROLE_USER' && !form.familyId) {
            setError('Family ID is required for regular users');
            setIsSubmitting(false);
            return;
        }
        
        // Regular signup for other usernames
        // Convert familyId to number if provided
        const signupData = {
            username: form.username,
            email: form.email,
            password: form.password,
            familyId: form.familyId ? Number(form.familyId) : null,
            role: form.role  // This will be sent directly as the string enum value
        };
        
        console.log('Submitting signup data:', signupData);
        
        signup(signupData)
            .then(() => navigate('/cars'))
            .catch((error) => {
                console.error('Signup error:', error);
                setError('Signup failed: ' + (error.message || ''));
            })
            .finally(() => setIsSubmitting(false));
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#0D0D0D]">
            {/* Background Circles and Overlays */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute -top-32 -left-44 w-[38rem] h-[38rem] rounded-full bg-gradient-to-br from-[#18181c] to-[#232328] opacity-60"></div>
                <div className="absolute top-1/3 left-1/2 w-[21rem] h-[21rem] rounded-full bg-[#1b1b1f] opacity-50 blur-xl -translate-x-1/2"></div>
                <div className="absolute bottom-0 right-0 w-[32rem] h-[16rem] rounded-tl-full bg-[#202024] opacity-30"></div>
                <div className="absolute top-0 right-0 w-40 h-40 rounded-bl-full bg-[#161617] opacity-30"></div>
                <div className="absolute bottom-10 left-1/4 w-52 h-52 rounded-full bg-[#141416] opacity-20"></div>
            </div>

            <Navbar />
            
            <main className="flex flex-1 justify-center items-center px-4 py-10 relative z-10">
                <div className="w-full max-w-md bg-[#16161a]/90 rounded-3xl shadow-2xl p-10 flex flex-col gap-8 border border-[#232328] relative backdrop-blur-lg">
                    <div className="flex flex-col items-center gap-2">
                        <span className="flex items-center justify-center w-16 h-16 rounded-full bg-[#18181c] shadow-lg mb-1">
                            <i className="fa-solid fa-user-plus text-white text-3xl"></i>
                        </span>
                        <h2 className="text-white font-bold text-3xl tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>Sign up</h2>
                        <span className="text-gray-400 text-base text-center">Create your CarPulse account</span>
                    </div>
                    
                    {error && <div className="text-red-500 text-center bg-red-500/10 py-2 rounded-lg">{error}</div>}
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="username" className="text-gray-300 text-sm font-semibold pl-1">Username</label>
                            <div className="flex items-center bg-[#1b1b1f] rounded-lg px-3 py-2 border border-[#232328] focus-within:border-[#3B82F6] transition">
                                <i className="fa-regular fa-user text-gray-400 text-lg mr-2"></i>
                                <input 
                                    type="text" 
                                    id="username" 
                                    name="username" 
                                    placeholder="Choose a username" 
                                    value={form.username}
                                    onChange={handleChange}
                                    className="bg-transparent outline-none text-white w-full text-base placeholder-gray-500" 
                                    autoComplete="username" 
                                    required 
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-gray-300 text-sm font-semibold pl-1">Email</label>
                            <div className="flex items-center bg-[#1b1b1f] rounded-lg px-3 py-2 border border-[#232328] focus-within:border-[#3B82F6] transition">
                                <i className="fa-regular fa-envelope text-gray-400 text-lg mr-2"></i>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    placeholder="Enter your email" 
                                    value={form.email}
                                    onChange={handleChange}
                                    className="bg-transparent outline-none text-white w-full text-base placeholder-gray-500" 
                                    autoComplete="email" 
                                    required 
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-gray-300 text-sm font-semibold pl-1">Password</label>
                            <div className="flex items-center bg-[#1b1b1f] rounded-lg px-3 py-2 border border-[#232328] focus-within:border-[#3B82F6] transition">
                                <i className="fa-solid fa-lock text-gray-400 text-lg mr-2"></i>
                                <input 
                                    type="password" 
                                    id="password" 
                                    name="password" 
                                    placeholder="Create a password" 
                                    value={form.password}
                                    onChange={handleChange}
                                    className="bg-transparent outline-none text-white w-full text-base placeholder-gray-500" 
                                    autoComplete="new-password" 
                                    required 
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <label htmlFor="role" className="text-gray-300 text-sm font-semibold pl-1">Role</label>
                            <div className="flex items-center bg-[#1b1b1f] rounded-lg px-3 py-2 border border-[#232328] focus-within:border-[#3B82F6] transition">
                                <i className="fa-solid fa-user-shield text-gray-400 text-lg mr-2"></i>
                                <select 
                                    id="role" 
                                    name="role" 
                                    value={form.role}
                                    onChange={handleChange}
                                    className="bg-transparent outline-none text-white w-full text-base appearance-none pr-6 cursor-pointer"
                                >
                                    <option value="ROLE_USER" className="bg-[#232328] text-white">User</option>
                                    <option value="ROLE_ADMIN" className="bg-[#232328] text-white">Admin</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <label htmlFor="familyId" className="text-gray-300 text-sm font-semibold pl-1">
                                Family ID 
                                {form.role === 'ROLE_ADMIN' && <span className="text-xs text-gray-400 ml-2">(optional for Admin - will create new family if blank)</span>}
                                {form.role === 'ROLE_USER' && <span className="text-xs text-gray-400 ml-2">(required for User)</span>}
                            </label>
                            <div className="flex items-center bg-[#1b1b1f] rounded-lg px-3 py-2 border border-[#232328] focus-within:border-[#3B82F6] transition">
                                <i className="fa-solid fa-users text-gray-400 text-lg mr-2"></i>
                                <input 
                                    type="text" 
                                    id="familyId" 
                                    name="familyId" 
                                    placeholder={form.role === 'ROLE_ADMIN' ? "Optional - leave blank to create new family" : "Enter your Family ID"} 
                                    value={form.familyId}
                                    onChange={handleChange}
                                    className="bg-transparent outline-none text-white w-full text-base placeholder-gray-500" 
                                    required={form.role === 'ROLE_USER'} 
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-4 mt-2">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`w-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white font-semibold rounded-lg px-6 py-3 text-lg shadow-lg ${
                                    isSubmitting 
                                        ? 'opacity-70 cursor-not-allowed' 
                                        : 'hover:from-[#2563EB] hover:to-[#3730A3]'
                                } transition`}
                            >
                                {isSubmitting ? 'Signing up...' : 'Sign up'}
                            </button>
                            <div className="flex items-center justify-center">
                                <span className="text-gray-400 text-sm">Already have an account?</span>
                                <Link to="/login" className="ml-2 text-[#3B82F6] text-sm hover:underline transition cursor-pointer">Sign in</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
            
            <footer className="w-full pt-4 pb-8 text-center text-gray-700 text-sm opacity-40 select-none relative z-10">
                &copy; 2024 CarPulse
            </footer>
        </div>
    );
}