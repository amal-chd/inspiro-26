import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import aboutContent from '../assets/about-content.jpg';
import upsideDownBg from '../assets/upside-down-bg.jpg';

const About = () => {
    return (
        <section id="about" className="relative py-20 bg-[#141414] text-white overflow-hidden">
            {/* Upside Down Background */}
            <div className="absolute inset-0 z-0">
                <img src={upsideDownBg} alt="Upside Down" className="w-full h-full object-cover opacity-20 rotate-180" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#141414] via-[#141414]/90 to-[#141414]" />
                {/* Floating Particles/Spores Effect Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="w-full md:w-1/2">
                        <h2 className="text-4xl md:text-6xl font-cinematic font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#E50914] to-black drop-shadow-[0_0_10px_rgba(229,9,20,0.5)]" style={{ WebkitTextStroke: '1px #E50914' }}>
                            THE OTHER SIDE
                        </h2>
                        <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                            Welcome to Inspiro 26. A dimension where code meets creativity, and innovation knows no bounds.
                            Step into a world of endless possibilities, where the only limit is your imagination.
                        </p>
                        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                            Join us for 2 days of intense competition, mind-bending puzzles, and groundbreaking tech talks.
                            Are you ready to turn your world upside down?
                        </p>
                        <Link to="/episodes">
                            <button className="px-8 py-3 bg-[#E50914] text-white font-bold rounded hover:bg-[#b2070f] transition shadow-[0_0_15px_rgba(229,9,20,0.4)] hover:shadow-[0_0_25px_rgba(229,9,20,0.6)]">
                                Explore The Fest
                            </button>
                        </Link>
                    </div>

                    <div className="w-full md:w-1/2 relative group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#E50914]/20 to-transparent rounded-lg z-10 pointer-events-none" />
                        <motion.img
                            whileHover={{ scale: 1.02, rotate: 1 }}
                            transition={{ duration: 0.5 }}
                            src={aboutContent}
                            alt="The Other Side"
                            className="w-full rounded-lg shadow-2xl shadow-red-900/20 grayscale group-hover:grayscale-0 transition duration-700 border border-white/10"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
