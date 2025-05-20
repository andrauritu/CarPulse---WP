import React from 'react';

/**
 * Shared background overlay component with decorative circles and gradients
 * Used across the application for consistent UI
 */
export default function BackgroundOverlay() {
    return (
        <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute -top-32 -left-44 w-[38rem] h-[38rem] rounded-full bg-gradient-to-br from-[#18181c] to-[#232328] opacity-60"></div>
            <div className="absolute top-1/3 left-1/2 w-[21rem] h-[21rem] rounded-full bg-[#1b1b1f] opacity-50 blur-xl -translate-x-1/2"></div>
            <div className="absolute bottom-0 right-0 w-[32rem] h-[16rem] rounded-tl-full bg-[#202024] opacity-30"></div>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-bl-full bg-[#161617] opacity-30"></div>
            <div className="absolute bottom-10 left-1/4 w-52 h-52 rounded-full bg-[#141416] opacity-20"></div>
        </div>
    );
} 