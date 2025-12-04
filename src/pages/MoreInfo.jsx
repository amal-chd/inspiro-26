import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Database, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-final.png';

const MoreInfo = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-mono p-4 md:p-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-900/50"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-red-900/50"></div>
                <div className="absolute top-0 left-0 h-full w-1 bg-red-900/50"></div>
                <div className="absolute top-0 right-0 h-full w-1 bg-red-900/50"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            </div>

            <Link to="/" className="absolute top-6 left-6 z-20 text-red-600 hover:text-red-500 transition flex items-center gap-2">
                <ChevronLeft /> BACK_TO_BASE
            </Link>

            <div className="max-w-4xl mx-auto mt-16 border-2 border-red-900/30 bg-black/80 p-8 md:p-12 relative shadow-[0_0_50px_rgba(220,38,38,0.1)]">
                {/* Stamp */}
                <div className="absolute top-8 right-8 border-4 border-red-700 text-red-700 px-4 py-2 font-black text-xl md:text-3xl opacity-70 rotate-[-15deg] tracking-widest uppercase">
                    Top Secret
                </div>

                <div className="text-center mb-12">
                    <img src={logo} alt="Inspiro 26" className="w-48 mx-auto mb-6 opacity-90" />
                    <h1 className="text-2xl md:text-4xl font-bold text-red-600 tracking-tighter mb-2 uppercase">
                        Case File: #INSPIRO-26
                    </h1>
                    <p className="text-xs md:text-sm text-red-800 tracking-[0.2em]">CLASSIFIED LEVEL 5 // EYES ONLY</p>
                </div>

                <div className="space-y-12">
                    {/* Section 1: The Agency */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="border-l-2 border-red-800/50 pl-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="text-red-600" size={24} />
                            <h2 className="text-xl font-bold text-gray-100 uppercase tracking-wider">The Agency</h2>
                        </div>
                        <div className="space-y-4 text-sm md:text-base leading-relaxed">
                            <p>
                                <strong className="text-red-500">OPERATING BASE:</strong> Don Bosco Arts & Science College, Angadikadavu.
                            </p>
                            <p>
                                <strong className="text-red-500">UNIT:</strong> Department of Computer Application (BCA).
                            </p>
                            <p className="text-gray-400">
                                "We don't just write code; we rewrite reality. The Department of Computer Application has been the epicenter of technological anomalies and innovation for years. Our agents are trained in the art of algorithms, system hacking, and digital warfare."
                            </p>
                        </div>
                    </motion.div>

                    {/* Section 2: The Mission */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="border-l-2 border-red-800/50 pl-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="text-red-600" size={24} />
                            <h2 className="text-xl font-bold text-gray-100 uppercase tracking-wider">The Mission</h2>
                        </div>
                        <div className="space-y-4 text-sm md:text-base leading-relaxed">
                            <p>
                                <strong className="text-red-500">CODENAME:</strong> INSPIRO 26
                            </p>
                            <p>
                                <strong className="text-red-500">OBJECTIVE:</strong> To gather the brightest minds from across the region and test their capabilities in a series of high-stakes simulations.
                            </p>
                            <p className="text-gray-400">
                                "This is not just a fest. It is a recruitment drive for the next generation of tech wizards. Participants will face challenges that defy logic, push boundaries, and separate the glitches from the features."
                            </p>
                        </div>
                    </motion.div>

                    {/* Section 3: The Data */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="border-l-2 border-red-800/50 pl-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Database className="text-red-600" size={24} />
                            <h2 className="text-xl font-bold text-gray-100 uppercase tracking-wider">System Logs</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="bg-red-900/10 p-4 border border-red-900/20">
                                <span className="block text-red-500 text-xs mb-1">STATUS</span>
                                <span className="text-white font-bold">ACTIVE</span>
                            </div>
                            <div className="bg-red-900/10 p-4 border border-red-900/20">
                                <span className="block text-red-500 text-xs mb-1">THREAT LEVEL</span>
                                <span className="text-white font-bold">MIDNIGHT</span>
                            </div>
                            <div className="bg-red-900/10 p-4 border border-red-900/20">
                                <span className="block text-red-500 text-xs mb-1">LOCATION</span>
                                <span className="text-white font-bold">SECTOR 7 (CAMPUS)</span>
                            </div>
                            <div className="bg-red-900/10 p-4 border border-red-900/20">
                                <span className="block text-red-500 text-xs mb-1">DATE</span>
                                <span className="text-white font-bold">DECEMBER 26, 2026</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-16 pt-8 border-t border-red-900/30 text-center">
                    <p className="text-xs text-red-900/60 uppercase tracking-widest">
                        Unauthorized access to this file is a federal offense.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MoreInfo;
