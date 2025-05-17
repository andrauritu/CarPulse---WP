import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import navbarLogo from '../assets/image_navbar.png';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileMenuOpen(false);
    };

    // Helper to determine if route is active
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="flex items-center justify-between w-full px-4 sm:px-8 lg:px-12 py-4 z-20 relative">
            {/* Logo and Brand */}
            <div className="flex items-center">
                <Link to="/" className="flex items-center">
                    <img 
                        src={navbarLogo} 
                        alt="CarPulse Logo" 
                        className="h-8 sm:h-10" 
                    />
                </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
                className="md:hidden text-white focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-2xl`}></i>
            </button>
            
            {/* Desktop Nav Menu */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
                <Link to="/" className={`${isActive('/') 
                    ? 'text-white font-bold border-b-2 border-white pb-1' 
                    : 'text-gray-200 font-medium hover:text-white'} 
                    text-base lg:text-lg transition cursor-pointer`}>
                    Home
                </Link>
                
                <Link to="/cars" className={`${isActive('/cars') 
                    ? 'text-white font-bold border-b-2 border-white pb-1' 
                    : 'text-gray-200 font-medium hover:text-white'} 
                    text-base lg:text-lg transition cursor-pointer`}>
                    Cars
                </Link>
                
                <Link to="/alerts" className={`${isActive('/alerts') 
                    ? 'text-white font-bold border-b-2 border-white pb-1' 
                    : 'text-gray-200 font-medium hover:text-white'} 
                    text-base lg:text-lg transition cursor-pointer`}>
                    Alerts
                </Link>
                
                {!user ? (
                    <Link to="/signup" className={`${isActive('/signup') 
                        ? 'text-white font-bold border-b-2 border-white pb-1' 
                        : 'text-gray-200 font-medium hover:text-white'} 
                        text-base lg:text-lg transition cursor-pointer`}>
                        Sign up
                    </Link>
                ) : (
                    <button 
                        onClick={handleLogout}
                        className="text-gray-200 text-base lg:text-lg font-medium hover:text-white transition cursor-pointer"
                    >
                        Log out
                    </button>
                )}
                
                {/* User Avatar */}
                {user && (
                    <Link to="/profile" className="ml-4">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#222228] flex items-center justify-center text-white text-lg lg:text-xl font-bold select-none shadow-custom">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                    </Link>
                )}
            </div>
            
            {/* Mobile Nav Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-[#1b1b1f] p-4 mt-2 rounded-lg shadow-custom z-30">
                    <Link 
                        to="/" 
                        className={`block py-2 px-4 ${isActive('/') ? 'text-white font-bold' : 'text-gray-200'}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link 
                        to="/cars" 
                        className={`block py-2 px-4 ${isActive('/cars') ? 'text-white font-bold' : 'text-gray-200'}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Cars
                    </Link>
                    <Link 
                        to="/alerts" 
                        className={`block py-2 px-4 ${isActive('/alerts') ? 'text-white font-bold' : 'text-gray-200'}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Alerts
                    </Link>
                    
                    {!user ? (
                        <Link 
                            to="/signup" 
                            className={`block py-2 px-4 ${isActive('/signup') ? 'text-white font-bold' : 'text-gray-200'}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Sign up
                        </Link>
                    ) : (
                        <>
                            <Link 
                                to="/profile" 
                                className={`block py-2 px-4 ${isActive('/profile') ? 'text-white font-bold' : 'text-gray-200'}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Profile
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="block w-full text-left py-2 px-4 text-gray-200"
                            >
                                Log out
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
} 