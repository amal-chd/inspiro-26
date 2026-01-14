import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../supabase';
import { Trophy, Loader2, Medal, School } from 'lucide-react';
import { motion } from 'framer-motion';

const Champions = () => {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChampions();
    }, []);

    const fetchChampions = async () => {
        try {
            // Fetch all winners with their positions and college info
            const { data: winners, error } = await supabase
                .from('winners')
                .select('position, registrations(college)');

            if (error) throw error;

            // Calculate points
            const collegePoints = {};

            winners.forEach(winner => {
                const college = winner.registrations?.college;
                if (!college) return;

                if (!collegePoints[college]) {
                    collegePoints[college] = {
                        name: college,
                        points: 0,
                        wins: { '1st': 0, '2nd': 0, '3rd': 0 }
                    };
                }

                let points = 0;
                if (winner.position === '1st') points = 5;
                if (winner.position === '2nd') points = 3;
                if (winner.position === '3rd') points = 1;

                collegePoints[college].points += points;
                collegePoints[college].wins[winner.position] = (collegePoints[college].wins[winner.position] || 0) + 1;
            });

            // Convert to array and sort
            const sortedRankings = Object.values(collegePoints).sort((a, b) => b.points - a.points);
            setRankings(sortedRankings);
        } catch (error) {
            console.error('Error fetching champions:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-500/30 overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <div className="pt-36 pb-8 px-6 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/20 blur-[100px] rounded-full pointer-events-none z-0"></div>

                <h1 className="text-4xl md:text-8xl font-cinematic font-black mb-4 tracking-tighter relative z-10 w-full break-words">
                    CHAMPIONS <span className="text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900 block md:inline">LEAGUE</span>
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-medium relative z-10">
                    The ultimate battle for glory. Which college will conquer the Upside Down?
                </p>
            </div>

            <div className="max-w-5xl mx-auto px-6 pb-24 relative z-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 size={48} className="animate-spin text-red-600 mb-4" />
                        <p className="text-red-500 font-mono text-sm animate-pulse">CALCULATING POINTS...</p>
                    </div>
                ) : rankings.length > 0 ? (
                    <div className="space-y-4">
                        {/* Top 3 Podium (Optional Visual) */}

                        {/* Desktop View (Table) */}
                        <div className="hidden md:block bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-red-900/20 text-red-500 uppercase text-xs font-bold tracking-wider">
                                            <th className="p-6 text-center w-24">Rank</th>
                                            <th className="p-6">College</th>
                                            <th className="p-6 text-center">Gold (5 pts)</th>
                                            <th className="p-6 text-center">Silver (3 pts)</th>
                                            <th className="p-6 text-center">Bronze (1 pt)</th>
                                            <th className="p-6 text-right w-32">Total Points</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {rankings.map((college, index) => (
                                            <motion.tr
                                                key={college.name}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={`group hover:bg-white/5 transition-colors ${index < 3 ? 'bg-gradient-to-r from-red-900/5 to-transparent' : ''}`}
                                            >
                                                <td className="p-6 text-center">
                                                    {index === 0 && <Trophy className="w-8 h-8 text-yellow-500 mx-auto drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />}
                                                    {index === 1 && <Trophy className="w-7 h-7 text-gray-300 mx-auto" />}
                                                    {index === 2 && <Trophy className="w-6 h-6 text-orange-700 mx-auto" />}
                                                    {index > 2 && <span className="font-mono text-gray-500 text-lg">#{index + 1}</span>}
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${index === 0 ? 'bg-yellow-500 text-black' :
                                                            index === 1 ? 'bg-gray-300 text-black' :
                                                                index === 2 ? 'bg-orange-700 text-white' :
                                                                    'bg-white/10 text-gray-400'
                                                            }`}>
                                                            {college.name.charAt(0)}
                                                        </div>
                                                        <span className={`font-bold text-lg ${index === 0 ? 'text-yellow-500' : 'text-gray-200'}`}>
                                                            {college.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-center">
                                                    {college.wins['1st'] > 0 ? (
                                                        <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-sm font-bold border border-yellow-500/20">
                                                            {college.wins['1st']} <Medal size={14} />
                                                        </span>
                                                    ) : <span className="text-gray-600">-</span>}
                                                </td>
                                                <td className="p-6 text-center">
                                                    {college.wins['2nd'] > 0 ? (
                                                        <span className="inline-flex items-center gap-1 bg-gray-400/10 text-gray-400 px-3 py-1 rounded-full text-sm font-bold border border-gray-400/20">
                                                            {college.wins['2nd']} <Medal size={14} />
                                                        </span>
                                                    ) : <span className="text-gray-600">-</span>}
                                                </td>
                                                <td className="p-6 text-center">
                                                    {college.wins['3rd'] > 0 ? (
                                                        <span className="inline-flex items-center gap-1 bg-orange-700/10 text-orange-700 px-3 py-1 rounded-full text-sm font-bold border border-orange-700/20">
                                                            {college.wins['3rd']} <Medal size={14} />
                                                        </span>
                                                    ) : <span className="text-gray-600">-</span>}
                                                </td>
                                                <td className="p-6 text-right">
                                                    <span className="text-3xl font-black text-white font-cinematic tracking-wide">
                                                        {college.points}
                                                    </span>
                                                    <span className="text-xs text-gray-500 block uppercase">Points</span>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile View (Cards) */}
                        <div className="md:hidden space-y-4">
                            {rankings.map((college, index) => (
                                <motion.div
                                    key={college.name}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`bg-[#141414] border border-white/10 rounded-xl p-6 relative overflow-hidden ${index < 3 ? 'bg-gradient-to-br from-red-900/10 to-transparent' : ''
                                        }`}
                                >
                                    {/* Rank Badge */}
                                    <div className="absolute top-4 right-4">
                                        {index === 0 && <Trophy className="w-8 h-8 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />}
                                        {index === 1 && <Trophy className="w-7 h-7 text-gray-300" />}
                                        {index === 2 && <Trophy className="w-6 h-6 text-orange-700" />}
                                        {index > 2 && <span className="font-mono text-gray-500 text-xl font-bold">#{index + 1}</span>}
                                    </div>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 ${index === 0 ? 'bg-yellow-500 text-black' :
                                            index === 1 ? 'bg-gray-300 text-black' :
                                                index === 2 ? 'bg-orange-700 text-white' :
                                                    'bg-white/10 text-gray-400'
                                            }`}>
                                            {college.name.charAt(0)}
                                        </div>
                                        <h3 className={`font-bold text-lg leading-tight pr-8 ${index === 0 ? 'text-yellow-500' : 'text-gray-200'}`}>
                                            {college.name}
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase mb-2">Medals</p>
                                            <div className="flex gap-2">
                                                {college.wins['1st'] > 0 && (
                                                    <span className="bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded text-xs font-bold border border-yellow-500/20 flex items-center gap-1">
                                                        {college.wins['1st']} <Medal size={10} />
                                                    </span>
                                                )}
                                                {college.wins['2nd'] > 0 && (
                                                    <span className="bg-gray-400/10 text-gray-400 px-2 py-1 rounded text-xs font-bold border border-gray-400/20 flex items-center gap-1">
                                                        {college.wins['2nd']} <Medal size={10} />
                                                    </span>
                                                )}
                                                {college.wins['3rd'] > 0 && (
                                                    <span className="bg-orange-700/10 text-orange-700 px-2 py-1 rounded text-xs font-bold border border-orange-700/20 flex items-center gap-1">
                                                        {college.wins['3rd']} <Medal size={10} />
                                                    </span>
                                                )}
                                                {college.wins['1st'] === 0 && college.wins['2nd'] === 0 && college.wins['3rd'] === 0 && (
                                                    <span className="text-gray-600 text-xs">-</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase mb-1">Total Points</p>
                                            <span className="text-4xl font-black text-white font-cinematic tracking-wide">
                                                {college.points}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-32 border border-dashed border-white/10 rounded-2xl bg-white/5">
                        <School className="w-20 h-20 text-gray-600 mx-auto mb-6 opacity-50" />
                        <h2 className="text-3xl font-bold text-gray-400 mb-2">No Champions Yet</h2>
                        <p className="text-gray-500 max-w-md mx-auto">
                            The arena is silent. Once the games begin, the strongest colleges will rise to the top.
                        </p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Champions;
