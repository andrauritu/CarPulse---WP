import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';

export default function Login() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = e => {
        e.preventDefault();
        setError(null);

        // Bypass login for testing UI
        if (form.username === 'abd' && form.password === '123') {
            // Mock successful login with admin role
            localStorage.setItem('user', JSON.stringify({
                id: 999,
                username: 'abd',
                name: 'Abd',
                email: 'abd@test.com',
                familyId: 1,
                role: 'ROLE_ADMIN'
            }));
            
            navigate('/cars');
            return;
        }

        // Regular login for other credentials
        login(form)
            .then(() => navigate('/cars'))
            .catch(() => setError('Invalid email or password.'));
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
                        <h2 className="text-white font-bold text-3xl tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>Sign in</h2>
                        <span className="text-gray-400 text-base text-center">Access your CarPulse account</span>
                    </div>
                    
                    {error && <div className="text-red-500 text-center bg-red-500/10 py-2 rounded-lg">{error}</div>}
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="login-username" className="text-gray-300 text-sm font-semibold pl-1">Username</label>
                            <div className="flex items-center bg-[#1b1b1f] rounded-lg px-3 py-2 border border-[#232328] focus-within:border-[#3B82F6] transition">
                                <i className="fa-regular fa-user text-gray-400 text-lg mr-2"></i>
                                <input 
                                    type="text" 
                                    id="login-username" 
                                    name="username" 
                                    placeholder="Enter your username" 
                                    value={form.username}
                                    onChange={handleChange}
                                    className="bg-transparent outline-none text-white w-full text-base placeholder-gray-500" 
                                    autoComplete="username" 
                                    required 
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <label htmlFor="login-password" className="text-gray-300 text-sm font-semibold pl-1">Password</label>
                            <div className="flex items-center bg-[#1b1b1f] rounded-lg px-3 py-2 border border-[#232328] focus-within:border-[#3B82F6] transition">
                                <i className="fa-solid fa-lock text-gray-400 text-lg mr-2"></i>
                                <input 
                                    type="password" 
                                    id="login-password" 
                                    name="password" 
                                    placeholder="Enter your password" 
                                    value={form.password}
                                    onChange={handleChange}
                                    className="bg-transparent outline-none text-white w-full text-base placeholder-gray-500" 
                                    autoComplete="current-password" 
                                    required 
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-4 mt-2">
                            <button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white font-semibold rounded-lg px-6 py-3 text-lg shadow-lg hover:from-[#2563EB] hover:to-[#3730A3] transition"
                            >
                                Sign in
                            </button>
                            <div className="flex items-center justify-center">
                                <span className="text-gray-400 text-sm">Don't have an account?</span>
                                <Link to="/signup" className="ml-2 text-[#3B82F6] text-sm hover:underline transition cursor-pointer">Sign up</Link>
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
