import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Mail, Phone, School, BookOpen, Calendar, CreditCard, ChevronRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useNotification } from '../components/NotificationProvider';
import { keralaColleges } from '../data/keralaColleges';

const Register = () => {
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        college: '',
        department: '',
        year: '',
        paymentMethod: 'college', // Default to Pay at College
        selectedEvents: []
    });

    const [collegeSearch, setCollegeSearch] = useState('');
    const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
    const [filteredColleges, setFilteredColleges] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const eventList = React.useMemo(() => [
        { id: 'all_access', title: 'All Access Pass (Includes All Events)', price: 250, type: 'mandatory' },
    ], []);

    const [totalPrice, setTotalPrice] = useState(250); // Initial price (All Access)

    // Initialize with mandatory base entry
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            selectedEvents: ['all_access']
        }));

        // Check for logged-in user
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setFormData(prev => ({
                    ...prev,
                    email: user.email,
                    fullName: user.user_metadata?.full_name || '', // Note: trigger creates profile, but metadata might be empty if signed up via email/pass only
                }));
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const total = formData.selectedEvents.reduce((sum, eventId) => {
            const event = eventList.find(e => e.id === eventId);
            return sum + (event ? event.price : 0);
        }, 0);
        setTotalPrice(total);
    }, [formData.selectedEvents, eventList]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEventToggle = (eventId) => {
        // Prevent unchecking mandatory events
        const event = eventList.find(e => e.id === eventId);
        if (event.type === 'mandatory') return;

        setFormData(prev => {
            const isSelected = prev.selectedEvents.includes(eventId);
            if (isSelected) {
                return {
                    ...prev,
                    selectedEvents: prev.selectedEvents.filter(id => id !== eventId)
                };
            } else {
                return {
                    ...prev,
                    selectedEvents: [...prev.selectedEvents, eventId]
                };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);



        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase
                .from('registrations')
                .insert([
                    {
                        user_id: user?.id || null, // Link to user if logged in
                        full_name: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        college: formData.college,
                        department: formData.department,
                        year: formData.year,
                        selected_events: formData.selectedEvents,
                        total_amount: totalPrice,
                        payment_method: formData.paymentMethod
                    }
                ]);

            if (error) throw error;

            setIsSubmitting(false);
            setIsSubmitted(true);
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Error submitting registration:', error);
            setIsSubmitting(false);
            showNotification('Error submitting registration. Please try again.', 'error');
        }
    };

    if (isSubmitted) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-[#0a0a0a] pt-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_70%)] opacity-80"></div>
                        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-3xl animate-pulse"></div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-black/80 border border-green-500/30 p-8 rounded-xl max-w-md w-full text-center relative z-10 shadow-[0_0_50px_rgba(34,197,94,0.1)]"
                    >
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-3xl font-cinematic text-white mb-4">REGISTRATION SUCCESSFUL</h2>
                        <p className="text-gray-300 mb-8">
                            Welcome to the Upside Down, Agent <span className="text-red-500 font-bold">{formData.fullName}</span>.
                            <br /><br />
                            <span className="block text-xl font-bold text-white mb-2">Total: ₹{totalPrice}</span>
                            {formData.paymentMethod === 'college' ? (
                                <span className="text-yellow-500 font-medium border border-yellow-500/30 px-3 py-1 rounded bg-yellow-500/10 inline-block mt-2">
                                    Status: Payment Pending at College Desk
                                </span>
                            ) : (
                                <span className="text-green-500">Payment Confirmed</span>
                            )}
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-[#E50914] hover:bg-[#b00710] text-white px-8 py-3 rounded font-bold transition-all hover:scale-105"
                        >
                            Return to Base
                        </Link>
                    </motion.div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
                {/* Background Grain & Fog */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="film-grain opacity-50"></div>
                    <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-b from-red-900/10 to-transparent blur-3xl"></div>
                </div>

                <div className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                        {/* Left Side: Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-white space-y-8 lg:sticky lg:top-32"
                        >
                            <div>
                                <h1 className="text-5xl md:text-7xl font-cinematic font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-black stroke-white mb-6" style={{ WebkitTextStroke: '1px #E50914' }}>
                                    JOIN THE<br />REVOLUTION
                                </h1>
                                <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                                    Select your events and gear up for the challenge. Your total fee depends on the missions you choose.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-red-500/50 transition duration-300">
                                    <div className="p-3 rounded-full bg-red-600/20 text-red-500">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Event Dates</h3>
                                        <p className="text-gray-400">Jan 13, 2026</p>
                                    </div>
                                </div>


                            </div>
                        </motion.div>

                        {/* Right Side: Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="bg-black/50 backdrop-blur-md border border-red-900/30 p-6 md:p-8 rounded-2xl shadow-[0_0_30px_rgba(229,9,20,0.15)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                            <User size={14} /> Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            required
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                                            placeholder="Jane Hopper"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                            <Phone size={14} /> Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <Mail size={14} /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                                        placeholder="jane@hawkins.com"
                                    />
                                </div>

                                <div className="space-y-2 relative">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <School size={14} /> College Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="college"
                                            required
                                            value={formData.college}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                handleChange(e);
                                                setCollegeSearch(value);
                                                setShowCollegeDropdown(true);
                                                setFilteredColleges(
                                                    keralaColleges.filter(c =>
                                                        c.toLowerCase().includes(value.toLowerCase())
                                                    )
                                                );
                                            }}
                                            onFocus={() => {
                                                setShowCollegeDropdown(true);
                                                setFilteredColleges(
                                                    keralaColleges.filter(c =>
                                                        c.toLowerCase().includes(formData.college.toLowerCase())
                                                    )
                                                );
                                            }}
                                            onBlur={() => {
                                                // Delay to allow dropdown click to register
                                                setTimeout(() => {
                                                    if (!keralaColleges.includes(formData.college)) {
                                                        setFormData(prev => ({ ...prev, college: '' }));
                                                        setCollegeSearch('');
                                                    }
                                                    setShowCollegeDropdown(false);
                                                }, 200);
                                            }}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                                            placeholder="Search College"
                                            autoComplete="off"
                                        />
                                        {showCollegeDropdown && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50 custom-scrollbar">
                                                {filteredColleges.length > 0 ? (
                                                    filteredColleges.map((college, idx) => (
                                                        <div
                                                            key={idx}
                                                            onMouseDown={(e) => {
                                                                e.preventDefault(); // Prevent input blur
                                                                setFormData(prev => ({ ...prev, college: college }));
                                                                setCollegeSearch(college);
                                                                setShowCollegeDropdown(false);
                                                            }}
                                                            className="px-4 py-3 hover:bg-white/10 cursor-pointer text-sm text-gray-300 border-b border-white/5 last:border-none"
                                                        >
                                                            {college}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-sm text-gray-500">
                                                        No matches found. Please select from the list.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {/* Overlay to close dropdown on outside click */}
                                    {showCollegeDropdown && (
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowCollegeDropdown(false)}
                                        ></div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                            <BookOpen size={14} /> Department
                                        </label>
                                        <input
                                            type="text"
                                            name="department"
                                            required
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                                            placeholder="Computer Science"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                            <Calendar size={14} /> Year of Study
                                        </label>
                                        <select
                                            name="year"
                                            required
                                            value={formData.year}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition [&>option]:bg-black"
                                        >
                                            <option value="">Select Year</option>
                                            <option value="1">1st Year</option>
                                            <option value="2">2nd Year</option>
                                            <option value="3">3rd Year</option>
                                            <option value="4">4th Year</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Event Selection Section */}
                                <div className="space-y-3 pt-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        Select Events to Participate
                                    </label>
                                    <div className="bg-white/5 border border-white/10 rounded-lg p-2 max-h-60 overflow-y-auto custom-scrollbar">
                                        {eventList.map((event) => (
                                            <div
                                                key={event.id}
                                                onClick={() => handleEventToggle(event.id)}
                                                className={`flex items-center justify-between p-3 rounded cursor-pointer transition-all mb-1 ${formData.selectedEvents.includes(event.id)
                                                    ? 'bg-red-900/30 border-l-2 border-red-600'
                                                    : 'hover:bg-white/5 border-l-2 border-transparent'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.selectedEvents.includes(event.id)
                                                        ? 'bg-red-600 border-red-600'
                                                        : 'border-gray-500'
                                                        }`}>
                                                        {formData.selectedEvents.includes(event.id) && <Check size={14} className="text-white" />}
                                                    </div>
                                                    <span className={`text-sm font-medium ${formData.selectedEvents.includes(event.id) ? 'text-white' : 'text-gray-300'}`}>
                                                        {event.title}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-bold text-red-500">₹{event.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block mb-4">
                                        Payment Method
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Pay at College Option */}
                                        <div
                                            onClick={() => setFormData({ ...formData, paymentMethod: 'college' })}
                                            className={`cursor-pointer p-4 rounded-lg border flex items-center gap-3 transition-all ${formData.paymentMethod === 'college'
                                                ? 'bg-red-900/20 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.2)]'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'college' ? 'border-red-600' : 'border-gray-500'}`}>
                                                {formData.paymentMethod === 'college' && <div className="w-2.5 h-2.5 rounded-full bg-red-600"></div>}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm">Pay at College</h4>
                                                <p className="text-xs text-gray-400 mt-1">Pay cash at the registration desk</p>
                                            </div>
                                        </div>

                                        {/* Online Payment (Mock) */}
                                        <div
                                            className="opacity-50 cursor-not-allowed p-4 rounded-lg border bg-white/5 border-white/10 flex items-center gap-3"
                                            title="Coming Soon"
                                        >
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                                            <div>
                                                <h4 className="font-bold text-gray-400 text-sm">Pay Online</h4>
                                                <p className="text-xs text-gray-500 mt-1">Currently Unavailable</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#E50914] hover:bg-[#b00710] text-white font-bold py-4 rounded text-lg uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2 mt-4"
                                >
                                    {isSubmitting ? (
                                        <span className="animate-pulse">Processing...</span>
                                    ) : (
                                        <>Register Now <ChevronRight size={20} /></>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Register;
