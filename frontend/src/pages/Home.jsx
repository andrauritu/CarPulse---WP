import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import carImage from '../assets/image_main.png';

export default function Home() {
    const { user } = useAuth();
    
    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 py-4 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            {/* LEFT: Text + CTA */}
            <section className="flex flex-col justify-center max-w-xl z-10">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Maintenance<br />Made Simple
                </h1>
                
                {user ? (
                    <Link to="/addcar">
                        <button className="w-fit border-2 border-white text-white text-lg font-semibold rounded-full px-6 py-2 bg-transparent hover:bg-[#18181b] hover:border-gray-200 transition-all duration-150 shadow-custom focus:outline-none">
                            Add car!
                        </button>
                    </Link>
                ) : (
                    <Link to="/signup">
                        <button className="w-fit border-2 border-white text-white text-lg font-semibold rounded-full px-6 py-2 bg-transparent hover:bg-[#18181b] hover:border-gray-200 transition-all duration-150 shadow-custom focus:outline-none">
                            Get started!
                        </button>
                    </Link>
                )}
            </section>
            
            {/* RIGHT: Car Image with tools */}
            <section className="relative flex-1 flex items-center justify-center z-10 min-w-[300px] max-w-[500px]">
                {/* dark circle background behind car */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[400px] max-h-[400px] rounded-full bg-[#19191c] opacity-80 z-0"></div>
                
                {/* Car Image with tools */}
                <div className="relative z-20 flex items-center justify-center w-full max-w-[400px]">
                    <img 
                        className="w-full h-auto object-contain" 
                        src={carImage} 
                        alt="White SUV with maintenance tools" 
                    />
                </div>
            </section>
        </div>
    );
}