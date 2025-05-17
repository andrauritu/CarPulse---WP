import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddCar() {
    const [form, setForm] = useState({ make: '', model: '', licensePlate: '', mileage: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        setError(null);
        const familyId = localStorage.getItem('familyId');
        const token = localStorage.getItem('authToken');

        fetch(`/admin/families/${familyId}/cars`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
            body: JSON.stringify(form),
        })
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(() => navigate('/cars'))
            .catch(() => setError('Failed to add car.'));
    };

    return (
        <div className="add-car p-4">
            <h1>Add New Car</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm">
                <label>Make<input name="make" value={form.make} onChange={handleChange} required /></label>
                <label>Model<input name="model" value={form.model} onChange={handleChange} required /></label>
                <label>License Plate<input name="licensePlate" value={form.licensePlate} onChange={handleChange} required /></label>
                <label>Mileage<input name="mileage" type="number" value={form.mileage} onChange={handleChange} required /></label>
                <button type="submit" className="btn mt-2">Save</button>
            </form>
        </div>
    );
}
