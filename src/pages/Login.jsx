import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../components/NotificationProvider';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import logo from '../assets/logo-final.png';

const Login = () => {
    const [identifier, setIdentifier] = useState(''); // Email or Phone
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Check for admin/organizer login (Secret backdoor or explicitly typed)
            if (identifier === 'inspiro' || identifier === 'admin') {
                navigate('/admin'); // Admin.jsx handles the password check
                return;
            }

            // check in registrations table
            const { data, error } = await supabase
                .from('registrations')
                .select('*')
                .or(`email.eq.${identifier},phone.eq.${identifier}`)
                .maybeSingle();

            if (error) throw error;

            if (data) {
                // Found a registration!
                localStorage.setItem('userRegistration', JSON.stringify(data));
                showNotification(`Welcome back, ${data.full_name}!`, 'success');
                navigate('/dashboard');
            } else {
                // Not found
                showNotification('No registration found with this credentials.', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showNotification('Error checking credentials. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="film-grain opacity-40"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-3xl animate-pulse"></div>
            </div>

            <div
                className="w-full max-w-md bg-[#141414] border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10"
            >
                <div className="flex justify-center mb-8">
                    <img src={logo} alt="Inspiro 26" className="w-40" />
                </div>

                <h2 className="text-2xl font-bold text-white text-center mb-2">
                    Access Dashboard
                </h2>
                <p className="text-gray-400 text-center mb-8 text-sm">
                    Enter your Registered Email or Phone Number to view your ticket.
                </p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email or Phone</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-red-600 outline-none transition"
                                placeholder="jane@hawkins.com or 9876543210"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#E50914] hover:bg-[#b2070f] text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 group"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                Access Dashboard
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        Not registered yet?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="text-white hover:underline font-bold"
                        >
                            Register Now
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
