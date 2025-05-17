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
        login(form)
            .then(() => navigate('/cars'))
            .catch(() => setError('Invalid email or password.'));
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#0D0D0D]">
            {/* Background Circles and Overlays */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute rounded-full w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[520px] lg:h-[520px] left-[-180px] top-[-140px] circle-bg opacity-60"></div>
                <div className="absolute rounded-full w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] lg:w-[360px] lg:h-[360px] left-[52%] top-[40px] semi-circle opacity-40"></div>
                <div className="absolute rounded-full w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] lg:w-[220px] lg:h-[220px] left-[-60px] bottom-[10%] circle-bg opacity-30"></div>
                <div className="absolute rounded-full w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] lg:w-[260px] lg:h-[260px] right-[-80px] bottom-[-80px] semi-circle opacity-35"></div>
            </div>

            <Navbar />
            
            <main className="flex-grow flex justify-center items-center px-4 py-4 relative z-10">
                <div className="w-full max-w-[400px] mx-auto p-5 sm:p-6 bg-[#1b1b1f] rounded-xl shadow-custom">
                    <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">Log In</h1>
                    {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <div className="flex flex-col">
                            <label className="text-gray-300 mb-1 text-sm">Username</label>
                            <input 
                                name="username" 
                                type="text" 
                                value={form.username} 
                                onChange={handleChange} 
                                required 
                                className="bg-[#2a2a30] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-sm"
                            />
                        </div>
                        
                        <div className="flex flex-col">
                            <label className="text-gray-300 mb-1 text-sm">Password</label>
                            <input 
                                name="password" 
                                type="password" 
                                value={form.password} 
                                onChange={handleChange} 
                                required 
                                className="bg-[#2a2a30] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-sm"
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="w-full bg-white text-[#1b1b1f] font-semibold py-2 rounded-lg mt-3 hover:bg-gray-200 transition-colors text-sm"
                        >
                            Log In
                        </button>
                    </form>
                    
                    <p className="text-gray-400 mt-4 text-center text-sm">
                        Don't have an account? <Link to="/signup" className="text-white hover:underline">Sign up</Link>
                    </p>
                </div>
            </main>
            
            <footer className="w-full text-center text-gray-700 text-sm py-4 opacity-40 select-none relative z-10">
                &copy; 2024 CarPulse
            </footer>
        </div>
    );
}
