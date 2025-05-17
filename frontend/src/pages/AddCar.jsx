import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function AddCar() {
    const { user } = useAuth();
    const [form, setForm] = useState({ 
        brand: '', 
        model: '', 
        licensePlate: '', 
        mileage: '',
        year: new Date().getFullYear(),
        imageUrl: '/assets/car1_vols.png' // Default image
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        setError(null);
        
        if (!user) {
            setError('You must be logged in to add a car.');
            return;
        }
        
        const familyId = user.familyId;
        const token = localStorage.getItem('authToken');
        
        // Convert mileage and year to numbers
        const carData = {
            ...form,
            mileage: Number(form.mileage),
            year: Number(form.year)
        };

        fetch(`/admin/cars?familyId=${familyId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
            body: JSON.stringify(carData),
        })
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(() => navigate('/cars'))
            .catch(() => setError('Failed to add car.'));
    };

    const availableImages = [
        { url: '/assets/car1_vols.png', label: 'Volkswagen' },
        { url: '/assets/car2_honda.png', label: 'Honda' }
    ];

    return (
        <div className="add-car p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6">Add New Car</h1>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                    <p>{error}</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input 
                        name="brand" 
                        value={form.brand} 
                        onChange={handleChange} 
                        className="w-full px-3 py-2 border rounded-md" 
                        placeholder="e.g., Toyota" 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input 
                        name="model" 
                        value={form.model} 
                        onChange={handleChange} 
                        className="w-full px-3 py-2 border rounded-md" 
                        placeholder="e.g., Corolla" 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                    <input 
                        name="licensePlate" 
                        value={form.licensePlate} 
                        onChange={handleChange} 
                        className="w-full px-3 py-2 border rounded-md" 
                        placeholder="e.g., ABC-123" 
                        required 
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mileage (km)</label>
                        <input 
                            name="mileage" 
                            type="number" 
                            value={form.mileage} 
                            onChange={handleChange} 
                            className="w-full px-3 py-2 border rounded-md" 
                            placeholder="e.g., 50000" 
                            required 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <input 
                            name="year" 
                            type="number" 
                            value={form.year} 
                            onChange={handleChange} 
                            className="w-full px-3 py-2 border rounded-md" 
                            min="1900" 
                            max={new Date().getFullYear() + 1} 
                            required 
                        />
                    </div>
                </div>
                
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Car Image</label>
                    <div className="grid grid-cols-2 gap-4">
                        {availableImages.map(image => (
                            <div 
                                key={image.url} 
                                className={`cursor-pointer border-2 rounded-md p-2 ${form.imageUrl === image.url ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                onClick={() => setForm(prev => ({ ...prev, imageUrl: image.url }))}
                            >
                                <img 
                                    src={image.url} 
                                    alt={image.label} 
                                    className="w-full h-32 object-cover rounded-md mb-1" 
                                />
                                <p className="text-center text-sm">{image.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="form-group mt-4">
                    <button 
                        type="submit" 
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                    >
                        Add Car
                    </button>
                </div>
            </form>
        </div>
    );
}
