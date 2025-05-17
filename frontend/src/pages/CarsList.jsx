import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CarsList() {
    const [cars, setCars] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const familyId = localStorage.getItem('familyId');
        const token = localStorage.getItem('authToken');
        setIsLoading(true);

        fetch(`/admin/families/${familyId}/cars`, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
        })
            .then(response => {
                if (!response.ok) throw new Error();
                return response.json();
            })
            .then(data => setCars(data))
            .catch(() => setError('Failed to load cars.'))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <p>Loading cars...</p>;
    if (error)     return <p className="error">{error}</p>;

    return (
        <div className="cars-list p-4">
            <h1>Your Cars</h1>
            <Link to="/addcar" className="btn">Add New Car</Link>

            {cars.length === 0 ? (
                <p>No cars found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {cars.map(car => (
                        <div key={car.id} className="card p-4 rounded shadow">
                            <h2 className="text-xl font-semibold">{car.make} {car.model}</h2>
                            <p>License: {car.licensePlate}</p>
                            <p>Mileage: {car.mileage} km</p>
                            <div className="mt-2">
                                <Link to={`/cars/${car.id}`} className="btn btn-sm mr-2">Details</Link>
                                <Link to={`/cars/${car.id}/edit`} className="btn btn-sm">Edit</Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}