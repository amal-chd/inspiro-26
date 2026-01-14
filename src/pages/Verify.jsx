import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { CheckCircle, XCircle, Loader2, ShieldCheck, Trophy, User, School } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('verifying'); // verifying, valid, invalid
    const [data, setData] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const id = searchParams.get('id');
    const type = searchParams.get('type') || 'participation';

    useEffect(() => {
        const verifyCertificate = async () => {
            if (!id) {
                setStatus('invalid');
                setErrorMsg('No Certificate ID provided.');
                setLoading(false);
                return;
            }

            try {
                if (type === 'merit') {
                    // Verify Merit Certificate (Winner)
                    // We need to check if this user is a winner. 
                    // The ID passed in certificate is typically the REG ID (registration.id)
                    // But merit certificates are specific to a win.
                    // Let's assume the QR code for merit passes registration ID + type=merit.
                    // We should find *all* wins for this user or specific one if we passed a winner ID.
                    // Current generation logic passes REG ID. 
                    // So we verify if this REG ID has ANY wins.

                    const { data: regData, error: regError } = await supabase
                        .from('registrations')
                        .select('*, winners(*, events(title))')
                        .eq('id', id)
                        .single();

                    if (regError || !regData) {
                        throw new Error('Registration not found.');
                    }

                    if (!regData.winners || regData.winners.length === 0) {
                        setStatus('invalid');
                        setErrorMsg('No merit records found for this registration ID.');
                    } else {
                        setStatus('valid');
                        setData({ ...regData, type: 'merit' });
                    }

                } else {
                    // Verify Participation
                    const { data: regData, error: regError } = await supabase
                        .from('registrations')
                        .select('*')
                        .eq('id', id)
                        .single();

                    if (regError || !regData) {
                        throw new Error('Registration not found.');
                    }

                    if (regData.payment_status !== 'paid') {
                        setStatus('invalid');
                        setErrorMsg('Registration payment is pending or invalid.');
                    } else {
                        setStatus('valid');
                        setData({ ...regData, type: 'participation' });
                    }
                }
            } catch (error) {
                setStatus('invalid');
                setErrorMsg(error.message || 'Certificate ID invalid or not found.');
            } finally {
                setLoading(false);
            }
        };

        verifyCertificate();
    }, [id, type]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center p-4 pt-24 pb-20">
                <div className="max-w-md w-full bg-[#141414] border border-white/10 rounded-2xl shadow-2xl p-8 text-center relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-600/20 blur-[80px] rounded-full pointer-events-none"></div>

                    {loading ? (
                        <div className="py-12">
                            <Loader2 size={48} className="animate-spin text-red-600 mx-auto mb-4" />
                            <h2 className="text-xl font-bold animate-pulse">Verifying Certificate...</h2>
                        </div>
                    ) : status === 'valid' ? (
                        <div className="relative z-10 animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                                <ShieldCheck size={40} className="text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-green-500 mb-2">Verified Successfully</h2>
                            <p className="text-gray-400 text-sm mb-8">This certificate is authentic and valid.</p>

                            <div className="bg-white/5 rounded-xl p-6 text-left space-y-4 border border-white/5">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Candidate</p>
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-red-500" />
                                        <span className="font-bold text-lg">{data.full_name}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Institution</p>
                                    <div className="flex items-center gap-2">
                                        <School size={16} className="text-gray-400" />
                                        <span className="text-gray-300">{data.college}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Certificate Type</p>
                                    <div className="flex items-center gap-2">
                                        {data.type === 'merit' ? <Trophy size={16} className="text-yellow-500" /> : <CheckCircle size={16} className="text-blue-500" />}
                                        <span className={`font-bold ${data.type === 'merit' ? 'text-yellow-500' : 'text-blue-500'}`}>
                                            {data.type === 'merit' ? 'Merit / Excellence' : 'Participation'}
                                        </span>
                                    </div>
                                </div>

                                {data.type === 'merit' && data.winners && data.winners.length > 0 && (
                                    <div className="pt-2 border-t border-white/10">
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-2">Achievements</p>
                                        <ul className="space-y-2">
                                            {data.winners.map((win, idx) => (
                                                <li key={idx} className="text-sm flex justify-between">
                                                    <span className="text-gray-300">{win.events?.title}</span>
                                                    <span className="text-yellow-500 font-bold">{win.position}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="pt-4 mt-2 border-t border-white/10 text-center">
                                    <p className="text-xs text-gray-600 font-mono">ID: {id}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative z-10 animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                                <XCircle size={40} className="text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-red-500 mb-2">Verification Failed</h2>
                            <p className="text-gray-400 text-sm mb-6">We could not verify this certificate.</p>

                            <div className="bg-red-900/10 border border-red-500/20 rounded-lg p-4 mb-6">
                                <p className="text-red-400 text-sm font-mono">{errorMsg}</p>
                            </div>

                            <Link to="/" className="text-sm text-gray-500 hover:text-white underline">
                                Return to Home
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Verify;
