import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import BackgroundOverlay from '../components/BackgroundOverlay';

// Map of frontend category names to backend maintenance types
const CATEGORY_TO_TYPE_MAP = {
    'engine': 'ENGINE',
    'transmission': 'ENGINE',
    'wheels': 'TIRES',
    'suspension': 'OTHER',
    'brakes': 'BRAKES',
    'bodywork': 'OTHER',
    'interior': 'OTHER',
    'inspections': 'OTHER'
};

// Map of backend types to frontend categories (for grouping)
const TYPE_TO_CATEGORY_MAP = {
    'ENGINE': ['engine', 'transmission'],
    'TIRES': ['wheels'],
    'BRAKES': ['brakes'],
    'OIL_CHANGE': ['engine'],
    'OTHER': ['suspension', 'bodywork', 'interior', 'inspections']
};

export default function CarDetails() {
    const { carId } = useParams();
    const { user } = useAuth();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ make: '', model: '', licensePlate: '', mileage: '' });
    const [activeCategory, setActiveCategory] = useState('engine');
    const [maintenanceLogs, setMaintenanceLogs] = useState([]);
    const [isAddingLog, setIsAddingLog] = useState(false);
    const [isEditingLog, setIsEditingLog] = useState(false);
    const [currentLog, setCurrentLog] = useState(null);
    const [logForm, setLogForm] = useState({
        type: 'ENGINE',
        description: '',
        datePerformed: new Date().toISOString().split('T')[0],
        nextDueDate: '',
        mileageAtService: '',
        estimatedCost: ''
    });

    const isAdmin = user?.role === 'ROLE_ADMIN';

    // Fetch car details
    useEffect(() => {
        const token = localStorage.getItem('basicAuth');
        fetch(`/admin/cars/${carId}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Basic ${token}` }),
            },
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch car');
                return res.json();
            })
            .then(data => {
                setCar(data);
                setForm({
                    make: data.brand,
                    model: data.model,
                    licensePlate: data.licensePlate,
                    mileage: data.mileage
                });
            })
            .catch(() => setError('Could not load car details.'))
            .finally(() => setLoading(false));
    }, [carId]);

    // Fetch maintenance logs
    useEffect(() => {
        if (!carId) return;
        
        const token = localStorage.getItem('basicAuth');
        fetch(`/admin/cars/${carId}/maintenance`, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Basic ${token}` }),
            },
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch maintenance logs');
                return res.json();
            })
            .then(data => {
                // Process the data to include frontend category
                const processedData = data.map(log => {
                    // Find which frontend category this log belongs to based on type
                    let category = 'engine'; // default
                    if (log.type && TYPE_TO_CATEGORY_MAP[log.type]) {
                        // Choose the first matching category
                        category = TYPE_TO_CATEGORY_MAP[log.type][0];
                    }
                    
                    // Format date to display format
                    const formattedDate = log.datePerformed 
                        ? new Date(log.datePerformed).toLocaleDateString('en-GB') 
                        : '';
                    
                    return {
                        ...log,
                        category,
                        formattedDate
                    };
                });
                
                setMaintenanceLogs(processedData);
            })
            .catch(err => {
                console.error('Error fetching maintenance logs:', err);
                // Use mock data as fallback
                setMaintenanceLogs([
                    {
                        id: 1,
                        category: 'engine',
                        type: 'ENGINE',
                        description: 'Changed spark plugs due to misfiring and loss of power.',
                        formattedDate: '16-09-2024',
                        datePerformed: '2024-09-16'
                    },
                    {
                        id: 2,
                        category: 'engine',
                        type: 'ENGINE',
                        description: 'Ignition coils checked and one faulty coil replaced.',
                        formattedDate: '11-07-2024',
                        datePerformed: '2024-07-11'
                    },
                    {
                        id: 3,
                        category: 'engine',
                        type: 'ENGINE',
                        description: 'Routine inspection of spark plug wires and connectors.',
                        formattedDate: '02-04-2024',
                        datePerformed: '2024-04-02'
                    }
                ]);
            });
    }, [carId]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleLogFormChange = e => {
        const { name, value } = e.target;
        setLogForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setLoading(true);
        const token = localStorage.getItem('basicAuth');
        
        // Prepare the data - map form fields to backend fields
        const carData = {
            brand: form.make,
            model: form.model,
            licensePlate: form.licensePlate,
            mileage: parseInt(form.mileage, 10),
            // Preserve other fields from the car object
            id: car.id,
            family: car.family,
            assignedUser: car.assignedUser,
            year: car.year,
            imageUrl: car.imageUrl
        };
        
        fetch(`/admin/cars/${carId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Basic ${token}` }),
            },
            credentials: 'include',
            body: JSON.stringify(carData),
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

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
    };

    const addMaintenanceLog = () => {
        // Set the default type based on selected category
        setLogForm({
            type: CATEGORY_TO_TYPE_MAP[activeCategory] || 'OTHER',
            description: '',
            datePerformed: new Date().toISOString().split('T')[0],
            nextDueDate: '',
            mileageAtService: car?.mileage || '',
            estimatedCost: ''
        });
        setIsAddingLog(true);
    };

    const editMaintenanceLog = (log) => {
        setCurrentLog(log);
        
        // Format dates for form inputs
        const formatDate = (dateString) => {
            if (!dateString) return '';
            // Handle both ISO date strings and formatted dates
            const date = dateString.includes('-') 
                ? dateString
                : dateString.split('/').reverse().join('-');
            return date;
        };
        
        setLogForm({
            type: log.type || CATEGORY_TO_TYPE_MAP[log.category] || 'OTHER',
            description: log.description || '',
            datePerformed: formatDate(log.datePerformed),
            nextDueDate: formatDate(log.nextDueDate) || '',
            mileageAtService: log.mileageAtService || car?.mileage || '',
            estimatedCost: log.estimatedCost || ''
        });
        
        setIsEditingLog(true);
    };

    const saveMaintenanceLog = () => {
        const token = localStorage.getItem('basicAuth');
        
        // Convert form values to correct types
        const logData = {
            ...logForm,
            mileageAtService: parseInt(logForm.mileageAtService, 10),
            estimatedCost: logForm.estimatedCost ? parseFloat(logForm.estimatedCost) : null
        };
        
        if (isEditingLog && currentLog) {
            // Update existing log
            fetch(`/admin/maintenance/${currentLog.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Basic ${token}` }),
                },
                credentials: 'include',
                body: JSON.stringify(logData),
            })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to update maintenance log');
                    return res.json();
                })
                .then(updated => {
                    // Update the maintenance logs list
                    setMaintenanceLogs(prev => prev.map(log => 
                        log.id === updated.id ? {
                            ...updated,
                            category: activeCategory,
                            formattedDate: new Date(updated.datePerformed).toLocaleDateString('en-GB')
                        } : log
                    ));
                    setIsEditingLog(false);
                    setCurrentLog(null);
                })
                .catch(err => {
                    console.error('Error updating maintenance log:', err);
                    setError('Failed to update maintenance log.');
                });
        } else {
            // Create new log
            fetch(`/admin/cars/${carId}/maintenance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Basic ${token}` }),
                },
                credentials: 'include',
                body: JSON.stringify(logData),
            })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to create maintenance log');
                    return res.json();
                })
                .then(created => {
                    // Add the new log to the list
                    setMaintenanceLogs(prev => [...prev, {
                        ...created,
                        category: activeCategory,
                        formattedDate: new Date(created.datePerformed).toLocaleDateString('en-GB')
                    }]);
                    setIsAddingLog(false);
                })
                .catch(err => {
                    console.error('Error creating maintenance log:', err);
                    setError('Failed to create maintenance log.');
                });
        }
    };

    const deleteMaintenanceLog = (id) => {
        if (!window.confirm('Are you sure you want to delete this maintenance log?')) {
            return;
        }
        
        const token = localStorage.getItem('basicAuth');
        fetch(`/admin/maintenance/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Basic ${token}` }),
            },
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to delete maintenance log');
                // Remove the log from the list
                setMaintenanceLogs(prev => prev.filter(log => log.id !== id));
            })
            .catch(err => {
                console.error('Error deleting maintenance log:', err);
                setError('Failed to delete maintenance log.');
            });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;
    if (!car) return null;

    return (
        <div className="bg-[#0D0D0D] min-h-[100vh] overflow-x-hidden">
            <div className="relative min-h-[100vh] flex flex-col">

                {/* Main content */}
                <main className="flex-1 w-full px-6 md:px-14 pt-8 pb-16 z-10 relative flex flex-col">
                    {/* Vehicle details section */}
                    <section className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12 md:mb-16">
                        <div className="flex flex-col gap-7 flex-1 min-w-[270px]">
                            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                                {car.brand} {car.model}
                            </h2>
                            <div className="flex flex-col gap-3 mt-2">
                                <span className="text-lg text-gray-200 font-medium">
                                    License Plate: <span className="font-bold text-white">{car.licensePlate}</span>
                                </span>
                                <span className="text-lg text-gray-200 font-medium">
                                    Mileage: <span className="font-bold text-white">{car.mileage} km</span>
                                </span>
                                {car.year && (
                                    <span className="text-lg text-gray-200 font-medium">
                                        Year: <span className="font-bold text-white">{car.year}</span>
                                    </span>
                                )}
                            </div>
                            {isAdmin && !isEditing && (
                                <div className="mt-7">
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="px-7 py-3 rounded-full border border-white text-white font-semibold text-lg bg-transparent hover:bg-white/10 transition focus:outline-none"
                                    >
                                        <i className="fa-regular fa-pen-to-square mr-2"></i>Edit car
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 flex items-center justify-end min-w-[270px]">
                            <div className="w-full max-w-xs md:max-w-sm aspect-[4/3] rounded-xl overflow-hidden bg-[#191922] border border-[#23232f] shadow-xl">
                                {car.imageUrl ? (
                                    <img 
                                        src={car.imageUrl} 
                                        alt={`${car.brand} ${car.model}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img 
                                        src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=600&q=80" 
                                        alt={`${car.brand} ${car.model}`}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Maintenance logs section */}
                    <section className="flex flex-col md:flex-row gap-8 w-full">
                        {/* Categories sidebar */}
                        <aside className="flex md:flex-col flex-row overflow-x-auto md:overflow-visible gap-4 md:gap-3 w-full md:w-60 mb-2 md:mb-0">
                            <button
                                className={`category-tab ${activeCategory === 'engine' ? 'bg-[#24243a] ring-2 ring-white/40' : 'bg-[#191920]'} border border-[#252535] text-white w-full px-6 py-3 rounded-lg text-base font-semibold hover:bg-[#24243a] transition flex items-center gap-3 focus:outline-none whitespace-nowrap`}
                                onClick={() => handleCategoryClick('engine')}
                            >
                                <i className="fa-solid fa-gear text-white/70"></i>
                                <span>Engine</span>
                            </button>
                            <button
                                className={`category-tab ${activeCategory === 'transmission' ? 'bg-[#24243a] ring-2 ring-white/40' : 'bg-[#191920]'} border border-[#252535] text-white w-full px-6 py-3 rounded-lg text-base font-semibold hover:bg-[#24243a] transition flex items-center gap-3 focus:outline-none whitespace-nowrap`}
                                onClick={() => handleCategoryClick('transmission')}
                            >
                                <i className="fa-solid fa-gears text-white/70"></i>
                                <span>Engine & Transmission</span>
                            </button>
                            <button
                                className={`category-tab ${activeCategory === 'wheels' ? 'bg-[#24243a] ring-2 ring-white/40' : 'bg-[#191920]'} border border-[#252535] text-white w-full px-6 py-3 rounded-lg text-base font-semibold hover:bg-[#24243a] transition flex items-center gap-3 focus:outline-none whitespace-nowrap`}
                                onClick={() => handleCategoryClick('wheels')}
                            >
                                <i className="fa-solid fa-circle-dot text-white/70"></i>
                                <span>Wheels & Tires</span>
                            </button>
                            <button
                                className={`category-tab ${activeCategory === 'suspension' ? 'bg-[#24243a] ring-2 ring-white/40' : 'bg-[#191920]'} border border-[#252535] text-white w-full px-6 py-3 rounded-lg text-base font-semibold hover:bg-[#24243a] transition flex items-center gap-3 focus:outline-none whitespace-nowrap`}
                                onClick={() => handleCategoryClick('suspension')}
                            >
                                <i className="fa-solid fa-people-carry-box text-white/70"></i>
                                <span>Suspension & Steering</span>
                            </button>
                            <button
                                className={`category-tab ${activeCategory === 'brakes' ? 'bg-[#24243a] ring-2 ring-white/40' : 'bg-[#191920]'} border border-[#252535] text-white w-full px-6 py-3 rounded-lg text-base font-semibold hover:bg-[#24243a] transition flex items-center gap-3 focus:outline-none whitespace-nowrap`}
                                onClick={() => handleCategoryClick('brakes')}
                            >
                                <i className="fa-solid fa-shield-halved text-white/70"></i>
                                <span>Brakes & Safety</span>
                            </button>
                            <button
                                className={`category-tab ${activeCategory === 'bodywork' ? 'bg-[#24243a] ring-2 ring-white/40' : 'bg-[#191920]'} border border-[#252535] text-white w-full px-6 py-3 rounded-lg text-base font-semibold hover:bg-[#24243a] transition flex items-center gap-3 focus:outline-none whitespace-nowrap`}
                                onClick={() => handleCategoryClick('bodywork')}
                            >
                                <i className="fa-solid fa-car-side text-white/70"></i>
                                <span>BodyWork & Tires</span>
                            </button>
                            <button
                                className={`category-tab ${activeCategory === 'interior' ? 'bg-[#24243a] ring-2 ring-white/40' : 'bg-[#191920]'} border border-[#252535] text-white w-full px-6 py-3 rounded-lg text-base font-semibold hover:bg-[#24243a] transition flex items-center gap-3 focus:outline-none whitespace-nowrap`}
                                onClick={() => handleCategoryClick('interior')}
                            >
                                <i className="fa-solid fa-couch text-white/70"></i>
                                <span>Interior & Comfort</span>
                            </button>
                            <button
                                className={`category-tab ${activeCategory === 'inspections' ? 'bg-[#24243a] ring-2 ring-white/40' : 'bg-[#191920]'} border border-[#252535] text-white w-full px-6 py-3 rounded-lg text-base font-semibold hover:bg-[#24243a] transition flex items-center gap-3 focus:outline-none whitespace-nowrap`}
                                onClick={() => handleCategoryClick('inspections')}
                            >
                                <i className="fa-regular fa-file-lines text-white/70"></i>
                                <span>Inspections & Documentation</span>
                            </button>
                        </aside>

                        {/* Maintenance logs panel */}
                        <div className="flex-1 flex flex-col gap-7">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col gap-2">
                                    <span className="text-lg text-gray-300 uppercase font-bold tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>
                                        {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Maintenance
                                    </span>
                                    <span className="text-md text-gray-400 font-medium">
                                        {maintenanceLogs.filter(log => log.category === activeCategory).length} record(s)
                                    </span>
                                </div>
                                {isAdmin && !isAddingLog && !isEditingLog && (
                                    <button 
                                        onClick={addMaintenanceLog}
                                        className="px-5 py-2 rounded-full border border-white text-white font-medium text-sm bg-transparent hover:bg-white/10 transition focus:outline-none"
                                    >
                                        <i className="fa-solid fa-plus mr-2"></i>Add Log
                                    </button>
                                )}
                            </div>

                            {/* Maintenance logs list */}
                            <div className="flex flex-col gap-6 mt-2">
                                {/* Add/Edit form */}
                                {(isAddingLog || isEditingLog) && (
                                    <div className="bg-[#1e1e2f] border border-[#31313e] rounded-xl px-7 py-6 shadow-lg">
                                        <h3 className="text-xl font-semibold text-white mb-5">
                                            {isAddingLog ? 'Add New Maintenance Log' : 'Edit Maintenance Log'}
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-gray-300 mb-1">Maintenance Type</label>
                                                <select
                                                    name="type"
                                                    value={logForm.type}
                                                    onChange={handleLogFormChange}
                                                    className="w-full px-4 py-2 bg-[#18181c] border border-[#31313e] rounded text-white"
                                                >
                                                    <option value="ENGINE">Engine</option>
                                                    <option value="TIRES">Tires</option>
                                                    <option value="BRAKES">Brakes</option>
                                                    <option value="OIL_CHANGE">Oil Change</option>
                                                    <option value="OTHER">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-gray-300 mb-1">Description</label>
                                                <textarea
                                                    name="description"
                                                    value={logForm.description}
                                                    onChange={handleLogFormChange}
                                                    rows="3"
                                                    className="w-full px-4 py-2 bg-[#18181c] border border-[#31313e] rounded text-white"
                                                ></textarea>
                                            </div>
                                            <div>
                                                <label className="block text-gray-300 mb-1">Date Performed</label>
                                                <input
                                                    type="date"
                                                    name="datePerformed"
                                                    value={logForm.datePerformed}
                                                    onChange={handleLogFormChange}
                                                    className="w-full px-4 py-2 bg-[#18181c] border border-[#31313e] rounded text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-300 mb-1">Next Due Date (optional)</label>
                                                <input
                                                    type="date"
                                                    name="nextDueDate"
                                                    value={logForm.nextDueDate}
                                                    onChange={handleLogFormChange}
                                                    className="w-full px-4 py-2 bg-[#18181c] border border-[#31313e] rounded text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-300 mb-1">Mileage at Service</label>
                                                <input
                                                    type="number"
                                                    name="mileageAtService"
                                                    value={logForm.mileageAtService}
                                                    onChange={handleLogFormChange}
                                                    className="w-full px-4 py-2 bg-[#18181c] border border-[#31313e] rounded text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-300 mb-1">Estimated Cost (optional)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    name="estimatedCost"
                                                    value={logForm.estimatedCost}
                                                    onChange={handleLogFormChange}
                                                    className="w-full px-4 py-2 bg-[#18181c] border border-[#31313e] rounded text-white"
                                                />
                                            </div>
                                            <div className="flex gap-3 pt-2">
                                                <button
                                                    onClick={saveMaintenanceLog}
                                                    className="px-5 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700"
                                                >
                                                    {isAddingLog ? 'Add' : 'Save'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsAddingLog(false);
                                                        setIsEditingLog(false);
                                                        setCurrentLog(null);
                                                    }}
                                                    className="px-5 py-2 rounded border border-gray-500 text-gray-200 font-medium hover:bg-gray-700"
                                                >
                                                    Cancel
                                                </button>
                                                {isEditingLog && (
                                                    <button
                                                        onClick={() => deleteMaintenanceLog(currentLog.id)}
                                                        className="px-5 py-2 rounded bg-red-600 text-white font-medium hover:bg-red-700 ml-auto"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* List of maintenance logs */}
                                {!isAddingLog && !isEditingLog && (
                                    <>
                                        {maintenanceLogs.filter(log => log.category === activeCategory).length > 0 ? (
                                            maintenanceLogs
                                                .filter(log => log.category === activeCategory)
                                                .map(log => (
                                                    <div 
                                                        key={log.id}
                                                        className="bg-[#1e1e2f] border border-[#31313e] rounded-xl px-7 py-6 flex flex-col md:flex-row justify-between items-start gap-4 shadow-lg"
                                                    >
                                                        <div className="flex-1">
                                                            <p className="text-white text-base font-normal leading-relaxed">
                                                                {log.description}
                                                            </p>
                                                            {log.nextDueDate && (
                                                                <p className="text-blue-300 text-sm mt-2">
                                                                    Next due: {new Date(log.nextDueDate).toLocaleDateString('en-GB')}
                                                                </p>
                                                            )}
                                                            {log.mileageAtService && (
                                                                <p className="text-gray-400 text-sm mt-1">
                                                                    Mileage: {log.mileageAtService} km
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col items-end gap-2 min-w-[120px]">
                                                            <span className="text-gray-300 text-sm font-semibold">
                                                                {log.formattedDate}
                                                            </span>
                                                            {log.estimatedCost && (
                                                                <span className="text-green-400 text-sm font-semibold">
                                                                    ${parseFloat(log.estimatedCost).toFixed(2)}
                                                                </span>
                                                            )}
                                                            {isAdmin && (
                                                                <button 
                                                                    onClick={() => editMaintenanceLog(log)}
                                                                    className="px-4 py-1 rounded-full border border-white text-white text-sm font-medium bg-transparent hover:bg-white/10 transition focus:outline-none"
                                                                >
                                                                    <i className="fa-regular fa-pen-to-square mr-1"></i>Edit
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                        ) : (
                                            <div className="bg-[#1e1e2f] border border-[#31313e] rounded-xl px-7 py-10 text-center">
                                                <p className="text-gray-300 text-lg">No maintenance logs found for this category</p>
                                                {isAdmin && (
                                                    <button 
                                                        onClick={addMaintenanceLog}
                                                        className="mt-4 px-5 py-2 rounded-full border border-white text-white font-medium text-sm bg-transparent hover:bg-white/10 transition focus:outline-none"
                                                    >
                                                        <i className="fa-solid fa-plus mr-2"></i>Add First Log
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {/* Edit car modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1e1e2f] border border-[#31313e] rounded-xl p-6 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-white mb-4">Edit Car</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-1">Make</label>
                                <input 
                                    type="text"
                                    name="make"
                                    value={form.make}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-[#18181c] border border-[#31313e] rounded text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1">Model</label>
                                <input 
                                    type="text"
                                    name="model"
                                    value={form.model}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-[#18181c] border border-[#31313e] rounded text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1">License Plate</label>
                                <input 
                                    type="text"
                                    name="licensePlate"
                                    value={form.licensePlate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-[#18181c] border border-[#31313e] rounded text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1">Mileage (km)</label>
                                <input 
                                    type="number"
                                    name="mileage"
                                    value={form.mileage}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-[#18181c] border border-[#31313e] rounded text-white"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button 
                                onClick={handleSave}
                                className="px-5 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700"
                            >
                                Save
                            </button>
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="px-5 py-2 rounded border border-gray-500 text-gray-200 font-medium hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
