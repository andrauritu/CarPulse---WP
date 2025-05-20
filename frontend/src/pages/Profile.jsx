import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import BackgroundOverlay from '../components/BackgroundOverlay';

export default function Profile() {
    const { user, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                username: user.username || '',
                password: ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (user.role !== 'ROLE_ADMIN') {
            setError("You don't have permission to edit profile information");
            return;
        }

        const token = localStorage.getItem('basicAuth');
        const payload = {
            ...formData,
            id: user.id,
            familyId: user.familyId,
            role: user.role
        };

        if (!formData.password) {
            delete payload.password;
        }

        fetch(`/admin/users/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Basic ${token}` }),
            },
            credentials: 'include',
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                return response.json();
            })
            .then(updatedUser => {
                const newUserData = {
                    ...user,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    username: updatedUser.username
                };
                setUser(newUserData);

                const mockUser = localStorage.getItem('user');
                if (mockUser) {
                    localStorage.setItem('user', JSON.stringify(newUserData));
                }

                setSuccess("Profile updated successfully");
                setIsEditing(false);
            })
            .catch(err => {
                console.error("Error updating profile:", err);
                setError(`Failed to update profile: ${err.message || 'Unknown error'}`);
            });
    };

    if (!user) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="text-white text-xl">Loading profile...</div>
        </div>
    );

    return (
        <div className="relative min-h-screen bg-transparent text-white overflow-x-hidden">
            

            <div className="flex min-h-screen">
                {/* Side Navigation */}
                <aside className="fixed left-0 top-0 h-full w-[200px] bg-[#111114]/90 border-r border-[#232328] z-20">
                    <div className="flex flex-col h-full p-6">
                        <div className="mb-10"></div>
                        <div className="flex-1 space-y-4">
                            <Link to="/profile" className="flex items-center gap-3 text-white bg-[#1E1E24] px-4 py-3 rounded-lg">
                                <i className="fa-solid fa-user"></i>
                                <span>Profile</span>
                            </Link>
                           
                            <Link to="/team" className="flex items-center gap-3 text-gray-400 hover:text-white px-4 py-3 rounded-lg transition">
                                <i className="fa-solid fa-users"></i>
                                <span>Your Team</span>
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="ml-[200px] w-full pt-8 pb-20 relative z-10 px-6 md:px-8">
                    <div className="w-full max-w-4xl mx-auto">
                        <div className="mb-10">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Profile
                            </h1>
                            <p className="text-gray-400 mt-2">
                                This information will be displayed publicly so be careful what you share.
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg mb-6">
                                {success}
                            </div>
                        )}

                        {/* Personal Info */}
                        <div className="bg-[#1A1A1F]/90 rounded-xl p-6 mb-8 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold">Personal Information</h2>
                                {!isEditing && user.role === 'ROLE_ADMIN' && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-transparent border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>

                            {isEditing && user.role === 'ROLE_ADMIN' ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {["name", "email", "username", "password"].map((field, i) => (
                                            <div key={i}>
                                                <label className="block text-gray-400 mb-2 capitalize">{field}</label>
                                                <input
                                                    type={field === "password" ? "password" : "text"}
                                                    name={field}
                                                    value={formData[field]}
                                                    onChange={handleChange}
                                                    placeholder={field === "password" ? "Leave blank to keep current password" : ""}
                                                    className="w-full px-4 py-3 bg-[#111114] border border-[#27272C] rounded-lg text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-3 bg-transparent border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-gray-400 uppercase text-sm font-semibold tracking-wider">Full Name</h3>
                                        <p className="text-white text-lg mt-1">{user.name || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-gray-400 uppercase text-sm font-semibold tracking-wider">Email</h3>
                                        <p className="text-white text-lg mt-1">{user.email || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-gray-400 uppercase text-sm font-semibold tracking-wider">Username</h3>
                                        <p className="text-white text-lg mt-1">{user.username || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-gray-400 uppercase text-sm font-semibold tracking-wider">Role</h3>
                                        <p className="text-white text-lg mt-1">
                                            {user.role === 'ROLE_ADMIN' ? 'Administrator' : 'Standard User'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Family Info */}
                        <div className="bg-[#1A1A1F]/90 rounded-xl p-6 shadow-lg">
                            <h2 className="text-xl font-semibold mb-6">Family Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-gray-400 uppercase text-sm font-semibold tracking-wider">FAMILY ID</h3>
                                    <p className="text-white text-lg mt-1">{user.familyId || 'Not available'}</p>
                                </div>
                                <div>
                                    <h3 className="text-gray-400 uppercase text-sm font-semibold tracking-wider">FAMILY NAME</h3>
                                    <p className="text-white text-lg mt-1">{user.familyName || 'Not available'}</p>
                                </div>
                                <div className="pt-2">
                                    <Link to="/team" className="text-blue-400 hover:text-blue-300 transition inline-flex items-center">
                                        <span>View Family Members</span>
                                        <i className="fa-solid fa-arrow-right ml-2"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
