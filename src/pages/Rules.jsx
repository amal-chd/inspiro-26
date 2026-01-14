import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, AlertCircle, Loader2 } from 'lucide-react';

import { supabase } from '../supabase';

const Rules = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventRules = async () => {
            try {
                // Ensure eventId is a number if your DB uses integer IDs
                const id = parseInt(eventId);
                if (isNaN(id)) throw new Error("Invalid Event ID");

                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setEvent(data);
            } catch (err) {
                console.error("Error fetching rules:", err);
                setError("Could not load rules. The Upside Down has interfered.");
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            fetchEventRules();
        }
    }, [eventId]);

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-black text-red-600 flex flex-col justify-center items-center font-serif relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>
                <Loader2 size={64} className="animate-spin mb-4" />
                <h2 className="text-2xl tracking-widest uppercase animate-pulse">Loading Protocol...</h2>
            </div>
        );
    }

    // Error State
    if (error || !event) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center font-serif">
                <div className="text-center p-8">
                    <AlertCircle size={64} className="mx-auto mb-6 text-red-600 opacity-80" />
                    <h1 className="text-4xl md:text-5xl text-red-600 mb-4 font-bold uppercase tracking-widest">Breach Detected</h1>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">{error || "Event not found."}</p>
                    <Link to="/episodes" className="text-gray-400 hover:text-white underline tracking-wider uppercase text-sm">Return to Safety</Link>
                </div>
            </div>
        );
    }

    // Sort rules if they come as an array, just in case, though usually they are ordered.
    const rulesList = event.rules || [];

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden font-serif">
            {/* Film Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-20 z-10" style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/76/Noise_overlay.png")' }}></div>

            {/* Background Red Glow */}
            <div className="fixed inset-0 bg-gradient-to-b from-black via-transparent to-red-900/20 pointer-events-none"></div>

            <div className="relative z-20 max-w-4xl mx-auto px-6 py-12">
                {/* Back Button */}
                <Link to="/episodes" className="inline-flex items-center gap-2 text-gray-400 hover:text-red-500 transition mb-12 group">
                    <ChevronLeft className="group-hover:-translate-x-1 transition" />
                    <span className="uppercase tracking-widest text-xs">Back to Experiments</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Title Section */}
                    <div className="mb-16 text-center">
                        <h2 className="text-red-600 font-bold tracking-widest text-sm mb-4 uppercase">Confidential File #{event.id.toString().padStart(3, '0')}</h2>
                        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-800 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] font-serif tracking-tighter"
                            style={{ fontFamily: '"ITC Benguiat", serif', textShadow: '0 0 10px rgba(255,0,0,0.5)' }}>
                            {event.title}
                        </h1>
                        <div className="h-1 w-24 bg-red-600 mx-auto mt-6 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
                    </div>

                    {/* Rules Content */}
                    <div className="bg-[#111] border border-red-900/30 p-8 md:p-12 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-600"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-600"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-600"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-600"></div>

                        <h3 className="text-2xl mb-8 font-bold text-gray-200 uppercase tracking-widest border-b border-gray-800 pb-4">
                            Directives & Protocols
                        </h3>

                        <ul className="space-y-6">
                            {rulesList.map((rule, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 + 0.5 }}
                                    className="flex gap-4 items-start group"
                                >
                                    <span className="text-red-600 font-bold font-mono mt-1 opacity-60 group-hover:opacity-100 transition">0{index + 1} //</span>
                                    <span className="text-lg text-gray-300 leading-relaxed font-light tracking-wide group-hover:text-white transition-colors">
                                        {rule}
                                    </span>
                                </motion.li>
                            ))}
                        </ul>

                        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
                            <p className="text-red-800/60 font-mono text-xs uppercase tracking-[0.2em]">
                                Non-compliance will result in immediate disqualification
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Rules;
