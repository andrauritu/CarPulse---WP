import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import BackgroundOverlay from '../components/BackgroundOverlay';

export default function AddCar() {
    const { user } = useAuth();
    const [form, setForm] = useState({ 
        brand: '', 
        model: '', 
        licensePlate: '', 
        mileage: '',
        year: new Date().getFullYear(),
        imageUrl: '',
        engine: '',
        doors: 4,
        fuelType: 'Petrol'
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setSelectedImage(file);
        
        // Create a preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            // We're storing the base64 image data directly in the form
            setForm(prev => ({ ...prev, imageUrl: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = e => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        
        if (!user) {
            setError('You must be logged in to add a car.');
            setIsSubmitting(false);
            return;
        }
        
        const familyId = user.familyId;
        const token = localStorage.getItem('basicAuth');
        
        if (!token) {
            setError('Authentication token not found. Please log in again.');
            setIsSubmitting(false);
            return;
        }
        
        // Convert mileage and year to numbers
        const carData = {
            ...form,
            mileage: Number(form.mileage),
            year: Number(form.year),
            doors: Number(form.doors)
        };

        fetch(`/admin/cars?familyId=${familyId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${token}`
            },
            credentials: 'include',
            body: JSON.stringify(carData),
        })
            .then(res => {
                if (!res.ok) {
                    const errorMsg = res.headers.get('X-Error-Message');
                    throw new Error(errorMsg || `HTTP error: ${res.status}`);
                }
                return res.json();
            })
            .then(() => navigate('/cars'))
            .catch((err) => {
                console.error('Failed to add car:', err);
                setError(`Failed to add car: ${err.message}`);
            })
            .finally(() => setIsSubmitting(false));
    };

    const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Other'];

    return (
        <div className="bg-[#0D0D0D] min-h-screen text-white">
            <BackgroundOverlay />
            
            <div className="relative min-h-screen">
                <main className="w-full max-w-3xl mx-auto px-6 pt-8 pb-20 z-10 relative">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Add New Car</h1>
                    
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}
                    
                    <div className="bg-[#1A1A1F]/90 rounded-xl p-6 shadow-lg">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Car Image */}
                            <div className="mb-8">
                                <label className="block text-gray-300 mb-2 font-medium">Car Image</label>
                                <div className="flex items-center justify-center">
                                    <div className="w-full h-64 bg-[#111114] rounded-lg border border-[#27272C] flex flex-col items-center justify-center relative overflow-hidden">
                                        {imagePreview ? (
                                            <>
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Car preview" 
                                                    className="w-full h-full object-cover"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedImage(null);
                                                        setImagePreview(null);
                                                        setForm(prev => ({ ...prev, imageUrl: '' }));
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full w-8 h-8 flex items-center justify-center"
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                                                <p className="text-gray-400">Click to upload an image</p>
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    onChange={handleImageChange}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Basic Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium">Brand</label>
                                    <input 
                                        name="brand" 
                                        value={form.brand} 
                                        onChange={handleChange} 
                                        className="w-full px-4 py-3 bg-[#111114] border border-[#27272C] rounded-lg text-white focus:outline-none focus:border-blue-500" 
                                        placeholder="e.g., BMW" 
                                        required 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium">Model</label>
                                    <input 
                                        name="model" 
                                        value={form.model} 
                                        onChange={handleChange} 
                                        className="w-full px-4 py-3 bg-[#111114] border border-[#27272C] rounded-lg text-white focus:outline-none focus:border-blue-500" 
                                        placeholder="e.g., 3 Series" 
                                        required 
                                    />
                                </div>
                            </div>
                            
                            {/* Additional Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium">License Plate</label>
                                    <input 
                                        name="licensePlate" 
                                        value={form.licensePlate} 
                                        onChange={handleChange} 
                                        className="w-full px-4 py-3 bg-[#111114] border border-[#27272C] rounded-lg text-white focus:outline-none focus:border-blue-500" 
                                        placeholder="e.g., ABC-123" 
                                        required 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium">Year</label>
                                    <input 
                                        name="year" 
                                        type="number" 
                                        value={form.year} 
                                        onChange={handleChange} 
                                        className="w-full px-4 py-3 bg-[#111114] border border-[#27272C] rounded-lg text-white focus:outline-none focus:border-blue-500" 
                                        min="1900" 
                                        max={new Date().getFullYear() + 1} 
                                        required 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium">Mileage (km)</label>
                                    <input 
                                        name="mileage" 
                                        type="number" 
                                        value={form.mileage} 
                                        onChange={handleChange} 
                                        className="w-full px-4 py-3 bg-[#111114] border border-[#27272C] rounded-lg text-white focus:outline-none focus:border-blue-500" 
                                        placeholder="e.g., 50000" 
                                        required 
                                    />
                                </div>
                            </div>
                            
                            {/* Technical Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium">Engine</label>
                                    <input 
                                        name="engine" 
                                        value={form.engine} 
                                        onChange={handleChange} 
                                        className="w-full px-4 py-3 bg-[#111114] border border-[#27272C] rounded-lg text-white focus:outline-none focus:border-blue-500" 
                                        placeholder="e.g., 2.0L Turbo" 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium">Doors</label>
                                    <input 
                                        name="doors" 
                                        type="number" 
                                        value={form.doors} 
                                        onChange={handleChange} 
                                        className="w-full px-4 py-3 bg-[#111114] border border-[#27272C] rounded-lg text-white focus:outline-none focus:border-blue-500" 
                                        min="1" 
                                        max="6" 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium">Fuel Type</label>
                                    <select 
                                        name="fuelType" 
                                        value={form.fuelType} 
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-[#111114] border border-[#27272C] rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    >
                                        {fuelTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="pt-4">
                                <button 
                                    type="submit" 
                                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition ${
                                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Adding Car...' : 'Add Car'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
