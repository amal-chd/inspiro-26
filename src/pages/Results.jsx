import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../supabase';
import { Trophy, Loader2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';


const Results = () => {
    console.log('Rendering Results Page');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            const { data } = await supabase
                .from('announcements')
                .select('*')
                .eq('type', 'result') // Filter only results
                .order('created_at', { ascending: false });

            if (data) setResults(data);
            setLoading(false);
        };

        fetchResults();
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
            <Navbar />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-cinematic font-bold mb-4 tracking-tighter">
                        HALL OF <span className="text-red-600">VICTORY</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Celebrating the champions of Inspiro 26.
                    </p>
                </div>

                {/* PRELIMS RESULTS SECTION */}
                <div className="mb-20 space-y-16">
                    {/* Stranger Bugs */}
                    <div className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-red-900/20 to-black flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h2 className="text-3xl font-cinematic font-bold text-white flex items-center gap-3">
                                    <span className="text-red-600">STRANGER BUGS</span> PRELIMS
                                </h2>
                                <p className="text-gray-400 text-sm mt-1">Shortlisted Candidates for Finals</p>
                            </div>
                            <div className="px-4 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                                Result Published
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-300">
                                <thead className="bg-black/50 text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Rank</th>
                                        <th className="px-6 py-4 font-bold">ID</th>
                                        <th className="px-6 py-4 font-bold">Name</th>
                                        <th className="px-6 py-4 font-bold">College</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        { id: '36', name: 'Pranav P', college: 'MG College Iritty' },
                                        { id: '91', name: 'Abdul Khadher', college: 'St. Joseph Pilathara College' },
                                        { id: '49', name: 'Abhijith Benny', college: 'Nava Jyothi College Cherupuzha' },
                                        { id: '72', name: 'Navaf V', college: 'Jamia Hamdard College' },
                                        { id: '13', name: 'Ajnas PV', college: 'De Paul College' },
                                        { id: '90', name: 'Arjun PP', college: 'St. Joseph Pilathara College' },
                                        { id: '79', name: 'Jeevan Joy', college: 'Nava Jyothi College Cherupuzha' },
                                        { id: '-', name: 'Afra', college: 'Sir Syed College Thalipparamba' },
                                        { id: '65', name: 'Aromal J Jagan', college: 'De Paul College' },
                                        { id: '47', name: 'Arshawin C Jaison', college: 'Mary Matha College Manathavady' },
                                    ].map((student, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition duration-300">
                                            <td className="px-6 py-4 font-mono text-gray-500">#{idx + 1}</td>
                                            <td className="px-6 py-4 font-mono text-red-500">{student.id}</td>
                                            <td className="px-6 py-4 font-bold text-white">{student.name}</td>
                                            <td className="px-6 py-4 text-gray-400">{student.college}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Upside Down Vision */}
                    <div className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-yellow-900/20 to-black flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h2 className="text-3xl font-cinematic font-bold text-white flex items-center gap-3">
                                    <span className="text-yellow-600">UPSIDE DOWN</span> VISION
                                </h2>
                                <p className="text-gray-400 text-sm mt-1">Shortlisted Candidates for Finals</p>
                            </div>
                            <div className="px-4 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                                Result Published
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-300">
                                <thead className="bg-black/50 text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Rank</th>
                                        <th className="px-6 py-4 font-bold">ID</th>
                                        <th className="px-6 py-4 font-bold">Name</th>
                                        <th className="px-6 py-4 font-bold">College</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        { id: '36', name: 'Pranav P', college: 'MG College Iritty' },
                                        { id: '59', name: 'Adwaith Kumar', college: 'Nava Jyothi College Cherupuzha' },
                                        { id: '63', name: 'Nandana CK', college: 'De Paul College' },
                                        { id: '13', name: 'Ajnas PV', college: 'De Paul College' },
                                        { id: '75', name: 'Muhammed Razin', college: 'Jamia Hamdard College' },
                                        { id: '93', name: 'Rohith Krishna', college: 'St. Joseph Pilathara College' },
                                        { id: '21', name: 'Muhammed Razal', college: 'Mary Matha College Manathavady' },
                                    ].map((student, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition duration-300">
                                            <td className="px-6 py-4 font-mono text-gray-500">#{idx + 1}</td>
                                            <td className="px-6 py-4 font-mono text-yellow-500">{student.id}</td>
                                            <td className="px-6 py-4 font-bold text-white">{student.name}</td>
                                            <td className="px-6 py-4 text-gray-400">{student.college}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 size={48} className="animate-spin text-red-600" />
                    </div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {results.map((result, index) => (
                            <motion.div
                                key={result.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[#141414] border border-white/10 rounded-xl p-8 relative overflow-hidden group hover:border-red-600/50 transition duration-500"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition duration-500 text-yellow-500">
                                    <Trophy size={64} />
                                </div>

                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 text-yellow-500 border border-yellow-500/20">
                                        <Trophy size={24} />
                                    </div>

                                    <h3 className="text-2xl font-bold mb-3 font-cinematic tracking-wide">{result.title}</h3>
                                    <div className="w-12 h-1 bg-red-600 mb-4"></div>
                                    <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                                        {result.message}
                                    </p>

                                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-gray-500">
                                        <Calendar size={12} />
                                        <span>{new Date(result.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                        <Trophy size={48} className="mx-auto text-gray-600 mb-4 opacity-50" />
                        <h2 className="text-2xl font-bold text-gray-400 mb-2">No Results Yet</h2>
                        <p className="text-gray-500">The competitions are heating up! Check back soon for the winners.</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Results;
