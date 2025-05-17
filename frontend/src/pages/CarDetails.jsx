import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function CarDetails() {
    const { carId } = useParams();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ make: '', model: '', licensePlate: '', mileage: '' });

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        fetch(`/admin/cars/${carId}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch car');
                return res.json();
            })
            .then(data => {
                setCar(data);
                setForm({
                    make: data.make,
                    model: data.model,
                    licensePlate: data.licensePlate,
                    mileage: data.mileage
                });
            })
            .catch(() => setError('Could not load car details.'))
            .finally(() => setLoading(false));
    }, [carId]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        fetch(`/admin/cars/${carId}`, {
            method: 'PUT',
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
            .then(updated => {
                setCar(updated);
                setIsEditing(false);
            })
            .catch(() => setError('Failed to update car.'))
            .finally(() => setLoading(false));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;
    if (!car) return null;

    return (
        <div className="car-details">
            <h1>{car.make} {car.model}</h1>
            <p>License Plate: {car.licensePlate}</p>
            <p>Mileage: {car.mileage} km</p>
            {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="btn">Edit</button>
            )}

            {isEditing && (
                <div className="edit-form mt-4 p-4 border rounded">
                    <h2>Edit Car</h2>
                    <label>
                        Make:
                        <input name="make" value={form.make} onChange={handleChange} />
                    </label>
                    <label>
                        Model:
                        <input name="model" value={form.model} onChange={handleChange} />
                    </label>
                    <label>
                        License Plate:
                        <input name="licensePlate" value={form.licensePlate} onChange={handleChange} />
                    </label>
                    <label>
                        Mileage:
                        <input name="mileage" type="number" value={form.mileage} onChange={handleChange} />
                    </label>
                    <div className="mt-2">
                        <button onClick={handleSave} className="btn btn-primary mr-2">Save</button>
                        <button onClick={() => setIsEditing(false)} className="btn btn-secondary">Cancel</button>
                    </div>
                </div>
            )}

            {/* You can also render maintenance, fuel logs, compliance sections here */}
        </div>
    );
}
