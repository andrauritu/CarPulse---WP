import React from 'react';
import useAuth from '../hooks/useAuth';

export default function Profile() {
    const { user } = useAuth();
    if (!user) return <p>Loading profile...</p>;
    return (
        <div className="profile p-4">
            <h1>Your Profile</h1>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Family:</strong> {user.familyName}</p>
        </div>
    );
}
