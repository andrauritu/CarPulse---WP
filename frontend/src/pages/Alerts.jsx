import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

export default function Alerts() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cars, setCars] = useState([]);
    const [alerts, setAlerts] = useState([]);

    // Fetch user's cars
    useEffect(() => {
        if (!user) return;

        const familyId = user.familyId;
        const userId = user.id;
        const token = localStorage.getItem('basicAuth');
        
        // If admin, fetch all family cars, otherwise fetch user's assigned cars
        const url = user.role === 'ROLE_ADMIN' 
            ? `/admin/families/${familyId}/cars`
            : `/admin/users/${userId}/cars`;
        
        fetch(url, {
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
            .then(data => {
                setCars(data);
            })
            .catch(err => {
                console.error("Error fetching cars:", err);
                setError(`Failed to load cars: ${err.message || 'Unknown error'}`);
            })
            .finally(() => setLoading(false));
    }, [user]);

    // Fetch maintenance records for all cars and generate alerts
    useEffect(() => {
        if (!cars.length) return;
        
        const token = localStorage.getItem('basicAuth');
        const fetchPromises = cars.map(car => 
            fetch(`/admin/cars/${car.id}/maintenance`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Basic ${token}` }),
                },
                credentials: 'include'
            })
            .then(res => {
                if (!res.ok) throw new Error(`Failed to fetch maintenance logs for car ${car.id}`);
                return res.json();
            })
            .then(records => {
                // Add car info to each record
                return records.map(record => ({
                    ...record,
                    car: {
                        id: car.id,
                        brand: car.brand,
                        model: car.model,
                        licensePlate: car.licensePlate
                    }
                }));
            })
            .catch(err => {
                console.error(`Error fetching maintenance for car ${car.id}:`, err);
                return []; // Return empty array on error to avoid breaking Promise.all
            })
        );

        // Process all records from all cars
        Promise.all(fetchPromises)
            .then(allRecords => {
                // Flatten the array of arrays
                const flattenedRecords = allRecords.flat();
                
                // Generate alerts from maintenance records
                const generatedAlerts = [];
                const today = new Date();
                
                flattenedRecords.forEach(record => {
                    if (!record.nextDueDate) return; // Skip records with no due date
                    
                    const dueDate = new Date(record.nextDueDate);
                    const timeDiff = dueDate.getTime() - today.getTime();
                    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    
                    // Records with due dates in the past (overdue)
                    if (daysDiff < 0) {
                        generatedAlerts.push({
                            id: `maintenance-${record.id}`,
                            type: 'danger', // Red alert
                            title: `Overdue: ${getMaintenanceTypeLabel(record.type)} for ${record.car.brand} ${record.car.model}`,
                            description: record.description || 'Maintenance item is overdue',
                            car: record.car,
                            daysOverdue: Math.abs(daysDiff),
                            icon: getIconForMaintenanceType(record.type)
                        });
                    } 
                    // Records due within 5 days
                    else if (daysDiff <= 5) {
                        generatedAlerts.push({
                            id: `maintenance-${record.id}`,
                            type: 'warning', // Yellow alert
                            title: `Due Soon: ${getMaintenanceTypeLabel(record.type)} for ${record.car.brand} ${record.car.model}`,
                            description: record.description || 'Maintenance item is due soon',
                            car: record.car,
                            daysDue: daysDiff,
                            icon: getIconForMaintenanceType(record.type)
                        });
                    }
                });
                
                // Sort alerts: overdue first (most overdue at top), then due soon (closest due date at top)
                generatedAlerts.sort((a, b) => {
                    // First sort by type (danger before warning)
                    if (a.type !== b.type) {
                        return a.type === 'danger' ? -1 : 1;
                    }
                    
                    // Then sort by days (for overdue: most overdue first, for warnings: soonest first)
                    if (a.type === 'danger') {
                        return b.daysOverdue - a.daysOverdue; // Most overdue first
                    } else {
                        return a.daysDue - b.daysDue; // Closest due date first
                    }
                });
                
                setAlerts(generatedAlerts);
            });
    }, [cars]);

    // Helper function to get a human-readable label for maintenance type
    const getMaintenanceTypeLabel = (type) => {
        const typeMap = {
            'ENGINE': 'Engine Service',
            'TIRES': 'Tire Service',
            'BRAKES': 'Brake Service',
            'OIL_CHANGE': 'Oil Change',
            'OTHER': 'Service'
        };
        return typeMap[type] || 'Maintenance';
    };

    // Helper function to get an appropriate icon for maintenance type
    const getIconForMaintenanceType = (type) => {
        const iconMap = {
            'ENGINE': 'fa-gear',
            'TIRES': 'fa-circle-dot',
            'BRAKES': 'fa-brake-warning',
            'OIL_CHANGE': 'fa-oil-can',
            'OTHER': 'fa-wrench'
        };
        return iconMap[type] || 'fa-wrench';
    };

    const getBackgroundColor = (type) => {
        switch (type) {
            case 'danger':
                return 'bg-[#C62828]';
            case 'warning':
                return 'bg-[#F57F17]';
            case 'info':
                return 'bg-[#0097A7]';
            case 'success':
                return 'bg-[#388E3C]';
            default:
                return 'bg-[#323232]';
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="text-white text-xl">Loading alerts...</div>
        </div>
    );

    return (
        <div className="bg-[#0D0D0D] min-h-[100vh] overflow-x-hidden">
            <div className="relative min-h-[100vh] flex flex-col">
                {/* Background overlays */}
                <div className="pointer-events-none absolute inset-0 z-0">
                    <div className="absolute -top-32 -left-44 w-[38rem] h-[38rem] rounded-full bg-gradient-to-br from-[#18181c] to-[#232328] opacity-60"></div>
                    <div className="absolute top-1/3 left-1/2 w-[21rem] h-[21rem] rounded-full bg-[#1b1b1f] opacity-50 blur-xl -translate-x-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-[32rem] h-[16rem] rounded-tl-full bg-[#202024] opacity-30"></div>
                    <div className="absolute top-0 right-0 w-40 h-40 rounded-bl-full bg-[#161617] opacity-30"></div>
                    <div className="absolute bottom-10 left-1/4 w-52 h-52 rounded-full bg-[#141416] opacity-20"></div>
                </div>

                {/* Main content */}
                <main className="flex-1 w-full px-6 md:px-0 pt-8 pb-20 z-10 relative flex flex-col items-center">
                    <section className="w-full max-w-2xl mb-10 flex items-center justify-between">
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>Alerts</h1>
                    </section>

                    <section className="w-full max-w-2xl flex flex-col gap-7">
                        {alerts.length > 0 ? (
                            alerts.map(alert => (
                                <div 
                                    key={alert.id} 
                                    className={`flex items-start justify-between ${getBackgroundColor(alert.type)} rounded-2xl px-7 py-5 shadow-lg min-h-[94px]`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mt-1">
                                            <i className={`fa-solid ${alert.icon} text-white text-2xl`}></i>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white text-lg md:text-xl font-bold mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                {alert.title}
                                            </span>
                                            <p className="text-white text-base font-normal">
                                                {alert.description}
                                            </p>
                                            <p className="text-white/80 text-sm mt-1">
                                                Car: {alert.car.brand} {alert.car.model} ({alert.car.licensePlate})
                                            </p>
                                        </div>
                                    </div>
                                    <span className="ml-6 shrink-0 bg-white/20 px-4 py-1.5 rounded-full text-white text-sm font-semibold whitespace-nowrap mt-1">
                                        {alert.type === 'danger' 
                                            ? `${alert.daysOverdue} ${alert.daysOverdue === 1 ? 'day' : 'days'} overdue` 
                                            : `${alert.daysDue} ${alert.daysDue === 1 ? 'day' : 'days'} left`}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="bg-[#1e1e2f] rounded-2xl px-7 py-10 text-center">
                                <i className="fa-solid fa-check-circle text-green-400 text-4xl mb-4"></i>
                                <p className="text-white text-xl font-medium">
                                    No alerts at this time
                                </p>
                                <p className="text-gray-400 mt-2">
                                    All maintenance items are up to date
                                </p>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}
