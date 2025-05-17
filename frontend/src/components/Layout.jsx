import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="app-container">
            <nav className="navbar p-4 bg-gray-100 mb-4 flex items-center">
                <Link to="/" className="mr-4">Home</Link>
                <Link to="/cars" className="mr-4">Cars</Link>
                <Link to="/addcar" className="mr-4">Add Car</Link>
                <Link to="/alerts" className="mr-4">Alerts</Link>
                <Link to="/profile" className="mr-4">Profile</Link>
                <div className="ml-auto">
                    {!user ? (
                        <>
                            <Link to="/login" className="mr-4">Log In</Link>
                            <Link to="/signup">Sign Up</Link>
                        </>
                    ) : (
                        <button onClick={handleLogout} className="btn">Log Out</button>
                    )}
                </div>
            </nav>
            <main className="content p-4">
                <Outlet />
            </main>
        </div>
    );
}
