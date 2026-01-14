import React from 'react';
import Navbar from '../components/Navbar';
import ScannerContent from '../components/ScannerContent';

const Scanner = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
            <Navbar />
            <div className="pt-24 px-4 pb-12 max-w-lg mx-auto">
                <h1 className="text-3xl font-cinematic font-bold text-center mb-8">
                    Volunteer <span className="text-red-600">Scanner</span>
                </h1>
                <ScannerContent />
            </div>
        </div>
    );
};

export default Scanner;
