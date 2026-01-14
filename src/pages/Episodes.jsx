import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, ThumbsUp, Share2, ChevronLeft, ArrowDownToLine, Users, Trophy, AlertCircle, ChevronDown, ChevronUp, Check, FileText, Play, Pause, Download, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import heroVideo from '../assets/hero-video.mp4';
import event1 from '../assets/event-1.png';
import event2 from '../assets/event-2.png';
import event3 from '../assets/event-3.png';
import event4 from '../assets/event-4.png';
import event5 from '../assets/event-5.png';
import logo from '../assets/logo-final.png';

// ... imports
import { useNotification } from '../components/NotificationProvider';

const Episodes = () => {
    const [activeTab, setActiveTab] = useState('episodes');
    const [expandedEventId, setExpandedEventId] = useState(null);
    const [inList, setInList] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedRuleEvent, setSelectedRuleEvent] = useState(null);
    const [winners, setWinners] = useState([]);

    // Fetch winners
    useEffect(() => {
        const fetchWinners = async () => {
            const { data } = await supabase
                .from('winners')
                .select('*, events(title), registrations(full_name, college)');
            if (data) setWinners(data);
        };
        fetchWinners();
    }, []);

    // ... existing state
    const { showNotification } = useNotification();

    // Video Control - AutoPlay only
    const videoRef = useRef(null);

    const handleMyList = () => {
        setInList(!inList);
        if (!inList) {
            showNotification("Added to your Watch List", "success");
        } else {
            showNotification("Removed from your Watch List", "info");
        }
    };

    const handleRate = () => {
        setIsLiked(!isLiked);
        if (!isLiked) {
            showNotification("Rated: I like this!", "success");
        } else {
            showNotification("Rating removed", "info");
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Inspiro 26',
                    text: 'Check out the events happening at Inspiro 26!',
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            showNotification("Link copied to clipboard!", "success");
        }
    };

    // Static data definition
    const staticEvents = [
        {
            id: 1,
            title: "Stranger Bugs",
            description: "Debugging unravel the code, unleash the bug! Participate in the debugging contest at Inspiro'26, And showcase your coding prowess.",
            duration: "2h",
            image: event1,
            date: "Day 1",
            rules: ["Team Size: 1 Member", "No external libraries allowed", "Plagiarism check enabled"],
            prize: "₹5,000 & ₹3,000",
            coordinators: "Alan Biju, Nihal V",
            ruleBookUrl: "/rule-books/debugging.pdf"
        },
        {
            id: 2,
            title: "Mindflayer Cup",
            description: "Get ready to level up E-Gaming! Join the ultimate gaming showdown at Inspiro'26 And battle your way to glory!",
            duration: "2h",
            image: event2,
            date: "Day 1",
            rules: ["Team Size: 3 Members", "Bring your own laptop", "Kali Linux recommended"],
            prize: "₹5,000 & ₹3,000",
            coordinators: "Ashwin, Juwal"
        },
        {
            id: 3,
            title: "Upsidedown Vision",
            description: "Create innovative Prompts and Impress! Showcase your Prompting skills at Inspiro'26 Communicating precise, complex, or imaginative instructions to the AI.",
            duration: "2h",
            image: event3,
            date: "Day 2",
            rules: ["Individual/Duo Participation", "Tools: Midjourney/ChatGPT (Provided)", "Time limit: 1h"],
            prize: "₹5,000 & ₹3,000",
            coordinators: "Alan Kurian, Abdul Hadi"
        },
        {
            id: 5,
            title: "Stranger Sites",
            description: "Create innovative Website and impress! Showcase your web designing skills at Inspiro'26.",
            duration: "2h",
            image: event5,
            date: "Day 1-2",
            rules: ["Team Size: 2 Members", "Stack: HTML/CSS/JS", "Responsive Design mandatory"],
            prize: "₹5,000 & ₹3,000",
            coordinators: "Alok , Afra",
            ruleBookUrl: "/rule-books/web-design.pdf"
        },
        {
            id: 4,
            title: "The Hawkins Mystery Trail",
            description: "Unravel the clues, uncover the treasure! Embark on a thrilling adventure at Inspiro'26 Treasure Hunt contest!",
            duration: "2h",
            image: event4,
            date: "Day 2",
            rules: ["Team Participation", "Clues driven", "Campus-wide"],
            prize: "₹7,000",
            coordinators: "Nivedya , Riya"
        },
        {
            id: 6,
            title: "Strange Shorts",
            description: "Freeze moments that feel eerie, unreal, and cinematic. Use your lens to capture the thrill of the unknown event inspiro'26 Every shot tells a mysterious story.",
            duration: "2h",
            image: event1, // Placeholder reusing event1
            date: "Day 1-2",
            rules: ["Individual", "Original content only", "Cinematic theme"],
            prize: "₹2,000",
            coordinators: "Abi Juan"
        }
    ];

    const [events, setEvents] = useState(staticEvents);

    // Fetch dynamic rules
    useEffect(() => {
        const fetchRules = async () => {
            const { data, error } = await supabase
                .from('events')
                .select('id, rules');

            if (data && !error) {
                setEvents(prev => prev.map(staticEvent => {
                    const dynamicEvent = data.find(d => d.id === staticEvent.id);
                    // Only override if we have valid rules
                    if (dynamicEvent && dynamicEvent.rules && dynamicEvent.rules.length > 0) {
                        return { ...staticEvent, rules: dynamicEvent.rules };
                    }
                    return staticEvent;
                }));
            }
        };
        fetchRules();
    }, []);

    // Countdown Logic
    // Timer Logic
    useEffect(() => {
        const targetDate = new Date('2026-01-13T00:00:00').getTime();

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                };
            }
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        };

        // Initial set (wrapped in timeout to avoid sync warning if needed, or rely on interval)
        const initialTimer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 0);

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(timer);
        };
    }, []);

    const toggleEvent = (id) => {
        if (expandedEventId === id) {
            setExpandedEventId(null);
        } else {
            setExpandedEventId(id);
        }
    };


    // Handlers moved to top with notification support




    return (
        <div className="min-h-screen bg-[#000] text-white font-sans pb-20">

            {/* Hero / Video Preview Section */}
            <div
                className="relative w-full h-[50vh] md:h-[60vh] mt-0 group overflow-hidden"
            >
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src={heroVideo} type="video/mp4" />
                </video>

                {/* Back Button Overlay - Always visible on hover or when controls are active */}
                <div
                    className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-20 bg-gradient-to-b from-black/60 to-transparent transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                >
                    <Link to="/" className="p-1 pointer-events-auto">
                        <ChevronLeft size={28} className="text-white" />
                    </Link>
                    <div className="flex items-center gap-4 pointer-events-auto">
                        <Share2 size={24} className="text-white cursor-pointer" onClick={handleShare} />
                        <div className="w-6 h-6 rounded-full bg-gray-500 overflow-hidden cursor-pointer border border-white/50 hover:border-red-600 transition" onClick={() => setIsProfileOpen(true)}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                {/* Hawkins Lab ID Card Modal */}
                <AnimatePresence>
                    {isProfileOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                            onClick={() => setIsProfileOpen(false)}
                        >
                            {/* ... (Modal Content Preserved) ... */}
                            <motion.div
                                initial={{ scale: 0.8, rotateY: 90, opacity: 0 }}
                                animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                                exit={{ scale: 0.8, rotateY: -90, opacity: 0 }}
                                transition={{ type: "spring", damping: 12 }}
                                className="bg-[#f0f0f0] w-full max-w-sm rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative font-mono text-black transform rotate-1"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* ID Card Header */}
                                <div className="bg-[#1a1a1a] text-white p-4 flex items-center justify-between border-b-4 border-red-600">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] tracking-widest opacity-70">DEPARTMENT OF ENERGY</span>
                                        <span className="font-bold text-lg leading-none">HAWKINS LAB</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center">
                                        <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse" />
                                    </div>
                                </div>

                                {/* ID Card Body */}
                                <div className="p-6 relative">
                                    {/* Watermark */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                                        <img src={logo} alt="Watermark" className="w-48 grayscale" />
                                    </div>

                                    <div className="flex gap-4 mb-6">
                                        <div className="w-24 h-32 bg-gray-300 border-2 border-black/20 shadow-inner flex-shrink-0">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="Subject" className="w-full h-full object-cover grayscale contrast-125" />
                                        </div>
                                        <div className="flex flex-col justify-between py-1">
                                            <div>
                                                <span className="block text-[10px] text-gray-500 uppercase">Subject Name</span>
                                                <span className="font-bold text-xl font-serif">GUEST_USER</span>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] text-gray-500 uppercase">ID Number</span>
                                                <span className="font-bold text-red-700 text-lg">011-345-89</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm border-t border-black/10 pt-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">CLEARANCE:</span>
                                            <span className="font-bold">LEVEL 4 (RESTRICTED)</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">STATUS:</span>
                                            <span className="font-bold text-green-700">ACTIVE / MONITORING</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">ASSIGNMENT:</span>
                                            <span className="font-bold">INSPIRO_26_OBSERVER</span>
                                        </div>
                                    </div>

                                    {/* Stamp */}
                                    <div className="absolute bottom-4 right-4 border-4 border-red-600/30 text-red-600/30 font-black text-2xl px-2 py-1 -rotate-12 pointer-events-none">
                                        CLASSIFIED
                                    </div>
                                </div>

                                {/* ID Card Footer */}
                                <div className="bg-[#e0e0e0] p-2 text-[8px] text-center text-gray-500 border-t border-gray-300">
                                    PROPERTY OF HAWKINS NATIONAL LABORATORY. IF FOUND, RETURN IMMEDIATELY.
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>


                {/* Gradient Overlay for smooth transition */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#000] z-10 pointer-events-none" />

                {/* Desktop Scroll Hint */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2 pointer-events-none"
                >
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Scroll for Episodes</span>
                    <ChevronDown className="text-white/50 w-6 h-6 animate-bounce" />
                </motion.div>
            </div>

            <div className="px-4 py-8 max-w-7xl mx-auto relative z-10 -mt-20 md:-mt-32">
                {/* Series Title & Metadata */}
                <div className="mb-8 flex flex-col items-center text-center">
                    <img src={logo} alt="Inspiro 26" className="w-48 md:w-96 mb-4 object-contain drop-shadow-lg" />

                    <div className="flex items-center gap-4 text-sm md:text-base text-gray-400 mb-6 bg-black/40 px-6 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                        <span className="text-green-400 font-bold">98% Match</span>
                        <span>2026</span>
                        <span className="bg-[#333] px-2 py-0.5 rounded text-xs text-white">U/A 16+</span>
                        <span className="text-gray-200">Season 1</span>
                        <span className="border border-gray-500 px-1.5 rounded text-xs">HD</span>
                    </div>

                    <div className="font-bold text-white text-base md:text-xl mb-6 tracking-wide">
                        New Episodes January 13, 2026 at 9:00 am IST
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8 w-full max-w-2xl">
                        <Link
                            to="/register"
                            className="flex-1 bg-white text-black font-bold py-3 md:py-4 px-6 rounded hover:bg-gray-200 transition flex items-center justify-center gap-3"
                        >
                            <Play className="fill-black" size={24} /> Register Now
                        </Link>
                        <a
                            href="/brochure.pdf"
                            download="Inspiro26_Brochure.pdf"
                            className="flex-1 bg-[#333]/80 backdrop-blur-md text-white font-bold py-3 md:py-4 px-6 rounded hover:bg-[#444] transition flex items-center justify-center gap-3"
                        >
                            <Download size={24} /> Download Brochure
                        </a>
                    </div>

                    <div className="text-lg text-white mb-2 font-cinematic">
                        <span className="font-bold">S1:E1 "Chapter One: The Algorithm"</span>
                    </div>

                    {/* Countdown Information as text instead of bar for cleaner desktop look */}
                    <div className="flex items-center justify-center gap-2 text-sm md:text-base font-medium text-red-500 mt-1 bg-red-500/10 px-4 py-1 rounded border border-red-500/20">
                        <span>Premiering in:</span>
                        <span className="text-white font-mono">{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
                    </div>

                    <p className="text-base md:text-lg text-gray-300 my-6 leading-relaxed max-w-3xl text-center">
                        When a young developer vanishes into the code, a small town uncovers a mystery involving secret experiments, terrifying bugs, and one strange IT Fest.
                    </p>

                    <p className="text-sm text-gray-400">
                        <span className="text-gray-200">Starring:</span> You, Your Team, The Competition...
                    </p>
                </div>

                {/* Action Icons Row */}
                {/* Action Icons Row */}
                <div className="flex items-center justify-center gap-16 mb-12 px-4 border-b border-white/10 pb-8 w-full max-w-3xl mx-auto">
                    <div className="flex flex-col items-center gap-2 cursor-pointer group transition-transform hover:scale-110" onClick={handleMyList}>
                        {inList ? (
                            <Check size={28} className="text-[#E50914]" />
                        ) : (
                            <Plus size={28} className="text-white group-hover:text-gray-300" />
                        )}
                        <span className={`text-xs uppercase tracking-widest ${inList ? 'text-[#E50914]' : 'text-gray-400'}`}>My List</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 cursor-pointer group transition-transform hover:scale-110" onClick={handleRate}>
                        <ThumbsUp size={28} className={`${isLiked ? 'text-[#E50914] fill-[#E50914]' : 'text-white group-hover:text-gray-300'}`} />
                        <span className={`text-xs uppercase tracking-widest ${isLiked ? 'text-[#E50914]' : 'text-gray-400'}`}>Rate</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 cursor-pointer group transition-transform hover:scale-110" onClick={handleShare}>
                        <Share2 size={28} className="text-white group-hover:text-gray-300" />
                        <span className="text-xs text-gray-400 uppercase tracking-widest">Share</span>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center gap-8 mb-8 border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('episodes')}
                        className={`pb-4 text-sm font-bold uppercase tracking-widest transition border-b-2 ${activeTab === 'episodes' ? 'text-red-600 border-red-600' : 'text-gray-400 border-transparent hover:text-white'}`}
                    >
                        Events
                    </button>
                    <button
                        onClick={() => setActiveTab('results')}
                        className={`pb-4 text-sm font-bold uppercase tracking-widest transition border-b-2 ${activeTab === 'results' ? 'text-red-600 border-red-600' : 'text-gray-400 border-transparent hover:text-white'}`}
                    >
                        Results
                    </button>
                </div>

                {activeTab === 'results' && (
                    <div className="animate-fade-in max-w-5xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-cinematic font-bold mb-4 text-white">
                                Hall of <span className="text-yellow-500">Fame</span>
                            </h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                The champions of Inspiro '26. These legends have proven their mettle in the upside down.
                            </p>
                        </div>

                        {winners.length === 0 ? (
                            <div className="text-center py-20 border border-white/10 rounded-xl bg-[#141414]">
                                <Trophy size={48} className="mx-auto text-gray-600 mb-4 opacity-50" />
                                <h3 className="text-xl font-bold text-gray-500">No Results Announced Yet</h3>
                                <p className="text-sm text-gray-600 mt-2">Check back later as events conclude.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {events.map(event => {
                                    const eventWinners = winners.filter(w => w.event_id === event.id).sort((a, b) => a.position.localeCompare(b.position));
                                    if (eventWinners.length === 0) return null;

                                    return (
                                        <div key={event.id} className="bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden group hover:border-red-600/50 transition duration-500">
                                            <div className="h-32 overflow-hidden relative">
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent z-10" />
                                                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-60" />
                                                <h3 className="absolute bottom-4 left-4 z-20 font-bold text-xl text-white shadow-black drop-shadow-lg">{event.title}</h3>
                                            </div>
                                            <div className="p-6 space-y-4">
                                                {eventWinners.map((win) => (
                                                    <div key={win.id} className="flex items-center gap-4">
                                                        <div className={`
                                                            w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border
                                                            ${win.position === '1st' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500' :
                                                                win.position === '2nd' ? 'bg-gray-400/20 text-gray-400 border-gray-400' :
                                                                    'bg-orange-700/20 text-orange-700 border-orange-700'}
                                                        `}>
                                                            {win.position === '1st' ? '1' : win.position === '2nd' ? '2' : '3'}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-white text-sm">{win.registrations.full_name}</p>
                                                            <p className="text-xs text-gray-500">{win.registrations.college}</p>
                                                        </div>
                                                        {win.position === '1st' && <Trophy size={16} className="ml-auto text-yellow-500" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'episodes' && (
                    <div className="animate-fade-in">
                        <div className="flex items-center justify-between mb-6 px-1 border-b border-gray-800 pb-2">
                            <span className="text-gray-400 text-sm border border-gray-600 rounded px-3 py-1 bg-black/50">Season 1</span>
                            <span className="text-xs text-gray-500">{events.length} Events</span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {events.map((event, index) => (
                                <div key={event.id} className="group">
                                    <motion.div
                                        onClick={() => toggleEvent(event.id)}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`flex gap-4 items-center py-2 rounded p-2 transition cursor-pointer ${expandedEventId === event.id ? 'bg-[#1a1a1a]' : 'hover:bg-[#1a1a1a]'}`}
                                    >
                                        <div className="relative w-32 aspect-video flex-shrink-0 rounded overflow-hidden">
                                            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center bg-black/40">
                                                    <Play className="fill-white ml-0.5" size={14} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-sm font-bold text-white">{index + 1}. {event.title}</h3>
                                            </div>
                                            <p className="text-xs text-gray-400 line-clamp-2">{event.description}</p>
                                        </div>

                                        <div className="flex-shrink-0">
                                            {expandedEventId === event.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                        </div>
                                    </motion.div>

                                    <AnimatePresence>
                                        {expandedEventId === event.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden bg-[#1a1a1a] rounded-b px-4 pb-4 mb-2"
                                            >
                                                <div className="pt-2 border-t border-gray-700 space-y-3 text-sm text-gray-300">
                                                    {/* Check for Winners */}
                                                    {(() => {
                                                        const eventWinners = winners.filter(w => w.event_id === event.id).sort((a, b) => a.position.localeCompare(b.position));

                                                        if (eventWinners.length > 0) {
                                                            return (
                                                                <div className="bg-gradient-to-br from-yellow-900/10 to-transparent p-4 rounded-lg border border-yellow-500/20">
                                                                    <div className="flex items-center gap-2 mb-3 text-yellow-500 font-bold border-b border-yellow-500/20 pb-2">
                                                                        <Trophy size={16} /> Winners Board
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        {eventWinners.map((win) => (
                                                                            <div key={win.id} className="flex items-center justify-between text-xs">
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className={`
                                                                                        w-5 h-5 flex items-center justify-center rounded-full font-bold text-[10px]
                                                                                        ${win.position === '1st' ? 'bg-yellow-500 text-black' :
                                                                                            win.position === '2nd' ? 'bg-gray-400 text-black' :
                                                                                                'bg-orange-700 text-white'}
                                                                                    `}>
                                                                                        {win.position === '1st' ? '1' : win.position === '2nd' ? '2' : '3'}
                                                                                    </span>
                                                                                    <span className="text-white font-bold">{win.registrations.full_name}</span>
                                                                                </div>
                                                                                <span className="text-gray-500 italic truncate max-w-[80px]">{win.registrations.college}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }

                                                        // Default View (Rules & Button)
                                                        return (
                                                            <>
                                                                <div className="flex items-center gap-2">
                                                                    <Trophy size={16} className="text-[#E50914]" />
                                                                    <span className="font-bold text-white">Prize Pool:</span> {event.prize}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Users size={16} className="text-[#E50914]" />
                                                                    <span className="font-bold text-white">Coordinators:</span> {event.coordinators}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <AlertCircle size={16} className="text-[#E50914]" />
                                                                        <span className="font-bold text-white">Rules:</span>
                                                                    </div>
                                                                    <ul className="list-disc list-inside pl-5 text-xs text-gray-400 space-y-1">
                                                                        {event.rules.slice(0, 3).map((rule, idx) => (
                                                                            <li key={idx}>{rule}</li>
                                                                        ))}
                                                                        {event.rules.length > 3 && (
                                                                            <li className="text-gray-500 italic pt-1">+ {event.rules.length - 3} additional rules...</li>
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                                <button
                                                                    onClick={() => setSelectedRuleEvent(event)}
                                                                    className="block w-full mt-4 bg-[#262626] text-white font-bold py-2 rounded hover:bg-[#333] transition text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2"
                                                                >
                                                                    <FileText size={14} className="text-gray-400" /> View Rule Book
                                                                </button>
                                                            </>
                                                        );
                                                    })()}

                                                    <Link to="/register" className="block w-full mt-2 bg-[#E50914] text-white font-bold py-2 rounded hover:bg-[#b2070f] transition text-xs uppercase tracking-wider text-center">
                                                        Register Now
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sponsors Tab Content Removed */}
            </div>

            {/* Rule Book Modal */}
            <AnimatePresence>
                {selectedRuleEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedRuleEvent(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#1a1a1a] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden border border-red-600/30 shadow-[0_0_50px_rgba(220,38,38,0.2)] flex flex-col"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Trophy size={20} className="text-red-500" />
                                        {selectedRuleEvent.title}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Official Rule Book</p>
                                </div>
                                <button
                                    onClick={() => setSelectedRuleEvent(null)}
                                    className="p-2 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white"
                                >
                                    <ChevronDown size={24} className="rotate-180" /> {/* Close icon */}
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                <div className="space-y-6">
                                    <div className="bg-black/30 p-4 rounded border border-white/5">
                                        <h4 className="text-red-500 font-bold text-sm mb-2 uppercase tracking-wide">Event Description</h4>
                                        <p className="text-gray-300 text-sm leading-relaxed">{selectedRuleEvent.description}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-red-500 font-bold text-sm mb-3 uppercase tracking-wide border-b border-red-500/20 pb-2">Rules & Regulations</h4>
                                        <ul className="space-y-3">
                                            {selectedRuleEvent.rules && selectedRuleEvent.rules.map((rule, idx) => (
                                                <li key={idx} className="flex gap-3 text-sm text-gray-300">
                                                    <span className="text-red-600 font-mono opacity-60">{(idx + 1).toString().padStart(2, '0')}</span>
                                                    <span>{rule}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-black/30 p-3 rounded border border-white/5">
                                            <span className="block text-xs text-gray-500 uppercase">Prize Pool</span>
                                            <span className="text-white font-bold">{selectedRuleEvent.prize}</span>
                                        </div>
                                        <div className="bg-black/30 p-3 rounded border border-white/5">
                                            <span className="block text-xs text-gray-500 uppercase">Coordinators</span>
                                            <span className="text-white font-bold">{selectedRuleEvent.coordinators}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-white/10 bg-black/50 flex justify-end">
                                <button
                                    onClick={() => setSelectedRuleEvent(null)}
                                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-sm transition uppercase tracking-wider"
                                >
                                    Close Protocol
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Episodes;
