import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

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

    if (!user) return <p>Please log in to view cars.</p>;
    if (isLoading) return <p>Loading cars...</p>;
    if (error) return <div className="error bg-red-100 p-4 rounded my-2 text-red-700">{error}</div>;

    return (
        <div className="cars-list p-4">
            <h1 className="text-2xl font-bold mb-4">
                {isAdmin ? "Family Cars" : "Your Cars"}
            </h1>
            
            {isAdmin && (
                <Link to="/addcar" className="btn bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4 inline-block">
                    Add New Car
                </Link>
            )}

            {cars.length === 0 ? (
                <p>{isAdmin ? "No cars found for your family." : "No cars assigned to you."}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {cars.map(car => (
                        <div key={car.id} className="card p-4 rounded shadow border border-gray-200">
                            <h2 className="text-xl font-semibold">{car.brand} {car.model}</h2>
                            <p>License: {car.licensePlate}</p>
                            <p>Mileage: {car.mileage} km</p>
                            {car.assignedUser && (
                                <p className="mt-2 bg-blue-100 p-1 rounded text-sm">
                                    Assigned to: {car.assignedUser.username}
                                </p>
                            )}
                            {car.imageUrl && (
                                <img src={car.imageUrl} alt={`${car.brand} ${car.model}`} 
                                    className="w-full h-32 object-cover mt-2 rounded" />
                            )}
                            <div className="mt-2 flex flex-wrap gap-2">
                                <Link to={`/cars/${car.id}`} className="btn btn-sm bg-gray-500 hover:bg-gray-600 text-white py-1 px-2 rounded text-sm">
                                    Details
                                </Link>
                                {isAdmin && (
                                    <>
                                        <Link to={`/cars/${car.id}/edit`} className="btn btn-sm bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded text-sm">
                                            Edit
                                        </Link>
                                        <button 
                                            onClick={() => openAssignModal(car)} 
                                            className="btn btn-sm bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded text-sm"
                                        >
                                            Assign
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Assignment Modal */}
            {assignUserModalOpen && currentCar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-xl font-semibold mb-4">
                            Assign {currentCar.brand} {currentCar.model}
                        </h3>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Select Family Member</label>
                            <select 
                                value={selectedUserId} 
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                className="w-full p-2 border rounded"
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
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={assignCar}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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