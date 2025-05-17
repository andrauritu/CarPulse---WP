import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/Layout';
import Home from './pages/Home';
import AddCar from './pages/AddCar';
import CarsList from './pages/CarsList';
import CarDetails from './pages/CarDetails';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    {/* Protected and layouted routes */}
                    <Route element={<Layout />}>  {/* All routes here render inside Layout via Outlet */}
                        <Route path="/" element={<Home />} />
                        <Route path="/cars" element={<CarsList />} />
                        <Route path="/cars/:carId" element={<CarDetails />} />
                        <Route path="/addcar" element={<AddCar />} />
                        <Route path="/alerts" element={<Alerts />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}