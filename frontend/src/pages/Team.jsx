import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function Team() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [inviteForm, setInviteForm] = useState({
        username: '',
        email: '',
        password: '',
        role: 'ROLE_USER'
    });

    useEffect(() => {
        if (!user || !user.familyId) return;
        const token = localStorage.getItem('basicAuth');
        fetch(`/admin/families/${user.familyId}/users`, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Basic ${token}` }),
            },
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                return response.json();
            })
            .then(data => setFamilyMembers(data))
            .catch(err => setError(`Failed to load family members: ${err.message || 'Unknown error'}`))
            .finally(() => setLoading(false));
    }, [user]);

    const handleInviteFormChange = (e) => {
        const { name, value } = e.target;
        setInviteForm(prev => ({ ...prev, [name]: value }));
    };

    const handleInvite = (e) => {
        e.preventDefault();
        if (!user || !user.familyId) return;
        const token = localStorage.getItem('basicAuth');
        fetch(`/admin/users?familyId=${user.familyId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Basic ${token}` }),
            },
            credentials: 'include',
            body: JSON.stringify(inviteForm)
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                return response.json();
            })
            .then(newUser => {
                setFamilyMembers(prev => [...prev, newUser]);
                setShowInviteForm(false);
                setInviteForm({ username: '', email: '', password: '', role: 'ROLE_USER' });
            })
            .catch(err => setError(`Failed to invite user: ${err.message || 'Unknown error'}`));
    };

    const handleRemoveMember = (userId) => {
        if (!window.confirm('Are you sure you want to remove this family member?')) return;
        const token = localStorage.getItem('basicAuth');
        fetch(`/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Basic ${token}` }),
            },
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                setFamilyMembers(prev => prev.filter(member => member.id !== userId));
            })
            .catch(err => setError(`Failed to remove family member: ${err.message || 'Unknown error'}`));
    };

    if (!user) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="text-white text-xl">Loading...</div>
        </div>
    );

    return (
        <div className="bg-[#0D0D0D] min-h-screen overflow-x-hidden text-white">
            <div className="relative min-h-screen flex">

                {/* Sidebar */}
                <aside className="fixed left-0 top-0 h-full w-[200px] bg-[#111114] border-r border-[#232328] z-10">
                    <div className="flex flex-col h-full p-6">
                        <div className="mb-10" />
                        <div className="flex-1 space-y-4">
                            <Link to="/profile" className="flex items-center gap-3 text-gray-400 hover:text-white px-4 py-3 rounded-lg transition">
                                <i className="fa-solid fa-user"></i>
                                <span>Profile</span>
                            </Link>
                            
                            <Link to="/team" className="flex items-center gap-3 text-white bg-[#1E1E24] px-4 py-3 rounded-lg">
                                <i className="fa-solid fa-users"></i>
                                <span>Your Team</span>
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="ml-[200px] flex-1 w-full pt-8 pb-20 z-10 relative px-6 md:px-8">
                    <div className="w-full max-w-4xl mx-auto">
                        <div className="mb-10">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Your Team</h1>
                            <p className="text-gray-400 mt-2">Manage your family members and their access to your cars</p>
                        </div>

                        {/* Family Info */}
                        <div className="bg-[#1A1A1F]/90 rounded-xl p-6 mb-8">
                            <h2 className="text-xl font-semibold mb-4">Family Information</h2>
                            <div className="space-y-2">
                                <p><span className="text-gray-400">FAMILY ID: </span>{user.familyId || 'Not available'}</p>
                                <p><span className="text-gray-400">FAMILY NAME: </span>{user.familyName || 'Not available'}</p>
                            </div>
                        </div>

                        {/* Family Members */}
                        <div className="bg-[#1A1A1F]/90 rounded-xl p-6 shadow">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold">Family Members</h2>
                                {user.role === 'ROLE_ADMIN' && !showInviteForm && (
                                    <button onClick={() => setShowInviteForm(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                        <i className="fa-solid fa-user-plus mr-2"></i>Invite Member
                                    </button>
                                )}
                            </div>

                            {showInviteForm && (
                                <div className="mb-8 bg-[#111114] p-6 rounded-lg border border-[#232328]">
                                    <h3 className="text-lg font-semibold mb-4">Invite New Member</h3>
                                    <form onSubmit={handleInvite} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {["username", "email", "password"].map((field, i) => (
                                                <div key={i}>
                                                    <label className="block text-gray-400 mb-1 capitalize">{field}</label>
                                                    <input
                                                        type={field === "password" ? "password" : "text"}
                                                        name={field}
                                                        value={inviteForm[field]}
                                                        onChange={handleInviteFormChange}
                                                        required
                                                        className="w-full px-4 py-2 bg-[#1A1A1F] border border-[#27272C] rounded-lg text-white focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                            ))}
                                            <div>
                                                <label className="block text-gray-400 mb-1">Role</label>
                                                <select name="role" value={inviteForm.role} onChange={handleInviteFormChange}
                                                    className="w-full px-4 py-2 bg-[#1A1A1F] border border-[#27272C] rounded-lg text-white focus:outline-none focus:border-blue-500">
                                                    <option value="ROLE_USER">Standard User</option>
                                                    <option value="ROLE_ADMIN">Administrator</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Invite</button>
                                            <button type="button" onClick={() => setShowInviteForm(false)} className="px-4 py-2 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition">Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Member List */}
                            {loading ? (
                                <p className="text-center text-white py-8">Loading family members...</p>
                            ) : error ? (
                                <p className="text-center text-red-500 py-8">{error}</p>
                            ) : familyMembers.length === 0 ? (
                                <p className="text-center text-gray-400 py-8">No family members found</p>
                            ) : (
                                <div className="space-y-4">
                                    {familyMembers.map(member => (
                                        <div key={member.id} className="flex justify-between items-center bg-[#111114] p-4 rounded-lg border border-[#232328]">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[#232328] flex items-center justify-center text-white font-semibold">
                                                    {member.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-medium">{member.username}</h3>
                                                    <p className="text-gray-400 text-sm">{member.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    member.roles?.includes('ROLE_ADMIN')
                                                        ? 'bg-blue-900/50 text-blue-300'
                                                        : 'bg-gray-800 text-gray-300'
                                                }`}>
                                                    {member.roles?.includes('ROLE_ADMIN') ? 'Admin' : 'User'}
                                                </span>
                                                {member.id === user.id && (
                                                    <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs font-medium">You</span>
                                                )}
                                                {user.role === 'ROLE_ADMIN' && member.id !== user.id && (
                                                    <button onClick={() => handleRemoveMember(member.id)} className="text-red-400 hover:text-red-300 transition">
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
