import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen bg-[#0D0D0D]">
            {/* Background Circles and Overlays - Positioned fixed to prevent scrolling issues */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute rounded-full w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[520px] lg:h-[520px] left-[-180px] top-[-140px] circle-bg opacity-60"></div>
                <div className="absolute rounded-full w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] lg:w-[360px] lg:h-[360px] left-[52%] top-[40px] semi-circle opacity-40"></div>
                <div className="absolute rounded-full w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] lg:w-[220px] lg:h-[220px] left-[-60px] bottom-[10%] circle-bg opacity-30"></div>
                <div className="absolute rounded-full w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] lg:w-[260px] lg:h-[260px] right-[-80px] bottom-[-80px] semi-circle opacity-35"></div>
            </div>

            {/* Navbar */}
            <Navbar />
            
            {/* Main Content */}
            <main className="flex-grow flex justify-center items-start py-4 relative z-10">
                <Outlet />
            </main>
            
            {/* Footer */}
            <footer className="w-full text-center text-gray-700 text-sm py-4 opacity-40 select-none relative z-10">
                &copy; 2024 CarPulse
            </footer>
        </div>
    );
}
