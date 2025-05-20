import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import BackgroundOverlay from '../components/BackgroundOverlay';

export default function CarsList() {
    const { user } = useAuth();
    const [cars, setCars] = useState([]);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [assignUserModalOpen, setAssignUserModalOpen] = useState(false);
    const [currentCar, setCurrentCar] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState('');

    const isAdmin = user?.role === 'ROLE_ADMIN';

    // Fetch appropriate cars based on user role
    useEffect(() => {
        if (!user) {
            console.log("No user found, cannot fetch cars");
            setError("You must be logged in to view cars");
            return;
        }
        
        console.log("Fetching cars for user:", user);
        const familyId = user.familyId;
        const token = localStorage.getItem('basicAuth');
        setIsLoading(true);
        setError(null);

        // If admin, fetch all family cars, otherwise fetch user's assigned cars
        const url = isAdmin 
            ? `/admin/families/${familyId}/cars`
            : `/admin/users/${user.id}/cars`;

        console.log("Fetching cars from URL:", url);

        fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Basic ${token}` }),
            },
            credentials: 'include'
        })
            .then(response => {
                console.log("Car fetch response status:", response.status);
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log("Cars data received:", data);
                setCars(data);
            })
            .catch(err => {
                console.error("Error fetching cars:", err);
                setError(`Failed to load cars: ${err.message || 'Unknown error'}`);
            })
            .finally(() => setIsLoading(false));
    }, [user, isAdmin]);

    // Fetch family members if user is admin
    useEffect(() => {
        if (!user || !isAdmin) return;
        
        const familyId = user.familyId;
        const token = localStorage.getItem('basicAuth');

        console.log("Fetching family members for family ID:", familyId);

        fetch(`/admin/families/${familyId}/users`, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Basic ${token}` }),
            },
            credentials: 'include'
        })
            .then(response => {
                console.log("Family members fetch response status:", response.status);
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log("Family members data received:", data);
                setFamilyMembers(data);
            })
            .catch(err => {
                console.error("Failed to load family members:", err);
                // Don't set error state here as it would override the main content
            });
    }, [user, isAdmin]);

    const openAssignModal = (car) => {
        setCurrentCar(car);
        setSelectedUserId(car.assignedUser?.id || '');
        setAssignUserModalOpen(true);
    };

    const closeAssignModal = () => {
        setAssignUserModalOpen(false);
        setCurrentCar(null);
        setSelectedUserId('');
    };

    const assignCar = () => {
        if (!currentCar) return;
        
        const token = localStorage.getItem('basicAuth');
        const url = selectedUserId 
            ? `/admin/cars/${currentCar.id}/assign?userId=${selectedUserId}`
            : `/admin/cars/${currentCar.id}/unassign`;

        console.log("Assigning car using URL:", url);

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Basic ${token}` }),
            },
            credentials: 'include'
        })
            .then(response => {
                console.log("Car assignment response status:", response.status);
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                return response.json();
            })
            .then(updatedCar => {
                console.log("Updated car data:", updatedCar);
                setCars(prev => prev.map(car => 
                    car.id === updatedCar.id ? updatedCar : car
                ));
                closeAssignModal();
            })
            .catch(err => {
                console.error("Failed to assign car:", err);
                setError(`Failed to assign car: ${err.message || 'Unknown error'}`);
            });
    };

    if (!user) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="text-white text-xl">Please log in to view cars.</div>
        </div>
    );
    
    if (isLoading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="text-white text-xl">Loading cars...</div>
        </div>
    );

    return (
        <div className="bg-[#0D0D0D] min-h-screen text-white">
            <BackgroundOverlay />
            
            <div className="relative min-h-screen">
                <main className="w-full max-w-7xl mx-auto px-6 pt-8 pb-20 z-10 relative">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Your Cars
                        </h1>
                        
                        {isAdmin && (
    <Link to="/addcar" className="px-4 py-2 bg-white text-black rounded-3xl flex items-center gap-2 hover:bg-gray-200 transition">
        <i className="fas fa-plus"></i>
        <span>Add car</span>
    </Link>
)}

                    </div>
                    
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}
                    
                    {cars.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-xl text-gray-300">No cars found. Add your first car to get started!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {cars.map(car => (
                                <div key={car.id} className="bg-[#1A1A1F] rounded-lg overflow-hidden shadow-lg">
                                    <div className="h-48 overflow-hidden">
                                        <img 
                                            src={car.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image'} 
                                            alt={`${car.brand} ${car.model}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <h2 className="text-xl font-semibold mb-3">{car.brand} {car.model}</h2>
                                        
                                        <div className="grid grid-cols-2 gap-y-2 mb-4">
                                            <div>
                                                <span className="text-gray-400">Year: </span>
                                                <span className="font-medium">{car.year || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Engine: </span>
                                                <span className="font-medium">{car.engine || '2.0L Turbo'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Doors: </span>
                                                <span className="font-medium">{car.doors || '4'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Fuel type: </span>
                                                <span className="font-medium">{car.fuelType || 'Petrol'}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2 mb-4">
                                            <Link 
                                                to={`/cars/${car.id}`}
                                                className="flex-1 text-center bg-[#27272F] py-3 rounded-md hover:bg-[#32323A] transition"
                                            >
                                                Details
                                            </Link>
                                            
                                            {isAdmin && (
                                                <button 
                                                    onClick={() => openAssignModal(car)}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
                                                >
                                                    <i className="fas fa-user-plus mr-2"></i>
                                                    {car.assignedUser ? 'Reassign' : 'Assign'}
                                                </button>
                                            )}
                                        </div>
                                        
                                        {car.assignedUser && (
                                            <div className="text-sm text-gray-400">
                                                <span>Assigned to: </span>
                                                <span className="font-medium text-white">{car.assignedUser.username}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Assignment Modal */}
            {assignUserModalOpen && currentCar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#1A1A1F] p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-xl font-semibold mb-4">
                            Assign {currentCar.brand} {currentCar.model}
                        </h3>
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Select Family Member</label>
                            <select 
                                value={selectedUserId} 
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                className="w-full p-2 bg-[#27272F] border border-[#3a3a47] rounded text-white"
                            >
                                <option value="">Unassigned</option>
                                {familyMembers.map(member => (
                                    <option key={member.id} value={member.id}>
                                        {member.username} ({member.role === 'ROLE_ADMIN' ? 'Admin' : 'User'})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button 
                                onClick={closeAssignModal}
                                className="px-4 py-2 bg-[#27272F] rounded hover:bg-[#32323A]"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={assignCar}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}