import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Home() {
    const { user } = useAuth();
    return (
        <div className="home p-4">
            <h1>Welcome to Carpulse</h1>
            {user ? (
                <p>Hello, {user.name}!</p>
            ) : (
                <p>
                    <Link to="/login" className="link">Log in</Link> or{' '}
                    <Link to="/signup" className="link">Sign up</Link> to get started.
                </p>
            )}
        </div>
    );
}