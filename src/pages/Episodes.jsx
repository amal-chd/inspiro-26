import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Download, Plus, ThumbsUp, Share2, ChevronLeft, ArrowDownToLine, Users, Trophy, AlertCircle, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroVideo from '../assets/hero-video.mp4';
import event1 from '../assets/event-1.png';
import event2 from '../assets/event-2.png';
import event3 from '../assets/event-3.png';
import event4 from '../assets/event-4.png';
import event5 from '../assets/event-5.png';
import logo from '../assets/logo-final.png';

const Episodes = () => {
    const [activeTab, setActiveTab] = useState('episodes');
    const [expandedEventId, setExpandedEventId] = useState(null);
    const [inList, setInList] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        // Use specific date constructor to avoid parsing issues
        const targetDate = new Date(2026, 0, 5, 0, 0, 0).getTime();

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

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const toggleEvent = (id) => {
        if (expandedEventId === id) {
            setExpandedEventId(null);
        } else {
            setExpandedEventId(id);
        }
    };

    const handleMyList = () => {
        setInList(!inList);
        // In a real app, this would update a backend or local storage
        alert(inList ? "Removed from My List" : "Added to My List");
    };

    const handleRate = () => {
        setIsLiked(!isLiked);
        alert(isLiked ? "Removed rating" : "Rated: I like this!");
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
            alert("Link copied to clipboard!");
        }
    };

    const events = [
        {
            id: 1,
            title: "CodeWar: The Algorithm",
            description: "A 24-hour intense coding battle where participants solve complex algorithmic challenges to save the mainframe from a total shutdown.",
            duration: "24h",
            image: event1,
            date: "Day 1",
            rules: ["Team Size: 2-4 Members", "No external libraries allowed", "Plagiarism check enabled"],
            prize: "₹15,000",
            coordinators: "Mike Wheeler, Dustin Henderson"
        },
        {
            id: 2,
            title: "CyberHunt: The Breach",
            description: "Teams must uncover hidden flags within a compromised system. The clock is ticking, and every second counts in this CTF challenge.",
            duration: "12h",
            image: event2,
            date: "Day 1",
            rules: ["Team Size: 3 Members", "Bring your own laptop", "Kali Linux recommended"],
            prize: "₹10,000",
            coordinators: "Lucas Sinclair, Max Mayfield"
        },
        {
            id: 3,
            title: "RoboRace: Circuit Breaker",
            description: "Autonomous bots race through a maze of obstacles. Will your creation survive the circuit breaker or crash and burn?",
            duration: "4h",
            image: event3,
            date: "Day 2",
            rules: ["Team Size: 2-5 Members", "Bot dimensions: 30x30cm", "Wireless control only"],
            prize: "₹12,000",
            coordinators: "Will Byers, Eleven"
        },
        {
            id: 4,
            title: "PixelPerfect: Glitch Art",
            description: "Designers compete to create the most stunning UI/UX designs. The theme? Retro-futurism and digital decay.",
            duration: "6h",
            image: event4,
            date: "Day 2",
            rules: ["Individual Participation", "Software: Figma/Adobe XD", "Assets provided on spot"],
            prize: "₹8,000",
            coordinators: "Nancy Wheeler, Jonathan Byers"
        },
        {
            id: 5,
            title: "Valorant Cup: Protocol",
            description: "The ultimate tactical shooter tournament. 5v5. One life per round. Defuse the spike or eliminate the enemy team.",
            duration: "48h",
            image: event5,
            date: "Day 1-2",
            rules: ["Team Size: 5 Members", "Map pool: All active maps", "Single Elimination"],
            prize: "₹20,000",
            coordinators: "Steve Harrington, Robin Buckley"
        },
        {
            id: 6,
            title: "IdeaPitch: The Upside",
            description: "Pitch your revolutionary startup idea to a panel of investors. Can you turn the world upside down with your innovation?",
            duration: "3h",
            image: event1,
            date: "Day 2",
            rules: ["Team Size: 1-3 Members", "Presentation time: 5 mins", "Q&A: 3 mins"],
            prize: "₹25,000",
            coordinators: "Jim Hopper, Joyce Byers"
        },
    ];

    return (
        <div className="min-h-screen bg-[#000] text-white font-sans pb-20">

            {/* Hero / Video Preview Section */}
            <div className="relative w-full aspect-video md:aspect-[21/9] mt-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src={heroVideo} type="video/mp4" />
                </video>

                {/* Back Button Overlay */}
                <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-20 bg-gradient-to-b from-black/60 to-transparent">
                    <Link to="/" className="p-1">
                        <ChevronLeft size={28} className="text-white" />
                    </Link>
                    <div className="flex items-center gap-4">
                        <Share2 size={24} className="text-white cursor-pointer" onClick={handleShare} />
                        <div className="w-6 h-6 rounded-full bg-gray-500 overflow-hidden">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                        <Play className="fill-white ml-1" size={32} />
                    </div>
                </div>
            </div>

            <div className="px-4 py-4 max-w-4xl mx-auto">
                {/* Series Title & Metadata */}
                <div className="mb-6 flex flex-col items-center text-center">
                    <img src={logo} alt="Inspiro 26" className="w-48 md:w-72 mb-2 object-contain" />

                    <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                        <span className="text-green-400 font-bold">98% Match</span>
                        <span>2026</span>
                        <span className="bg-[#333] px-1.5 py-0.5 rounded text-xs text-white">U/A 16+</span>
                        <span>2 Days</span>
                        <span className="border border-gray-500 px-1 rounded text-[10px]">HD</span>
                    </div>

                    <div className="font-bold text-white text-sm mb-4">
                        New Episodes December 26 at 9:00 am IST
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 mb-6">
                        <button className="w-full bg-white text-black font-bold py-3 rounded flex items-center justify-center gap-2 hover:bg-gray-200 transition">
                            <Play className="fill-black" size={24} /> Resume
                        </button>
                        <button className="w-full bg-[#262626] text-white font-bold py-3 rounded flex items-center justify-center gap-2 hover:bg-[#333] transition">
                            <Download size={24} /> Download Brochure
                        </button>
                    </div>

                    <div className="text-sm text-white mb-2">
                        <span className="font-bold">S1:E1 "Chapter One: The Algorithm"</span>
                    </div>

                    {/* Countdown Timer */}
                    {/* Netflix-style Timebar Countdown */}
                    <div className="w-full group cursor-pointer mb-4">
                        <div className="w-full h-1.5 bg-[#4d4d4d] rounded-sm relative mb-2">
                            {/* Progress */}
                            <div
                                className="absolute top-0 left-0 h-full bg-[#E50914] rounded-l-sm"
                                style={{ width: `${Math.max(0, Math.min(100, ((new Date() - new Date('2025-11-01')) / (new Date('2026-01-05') - new Date('2025-11-01'))) * 100))}%` }}
                            >
                                {/* Scrubber / Thumb (visible on hover or always if preferred) */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-[#E50914] rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                        <div className="relative flex items-center justify-center text-[10px] font-medium text-gray-400 mt-1">
                            <span className="text-white">{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s remaining</span>
                            <span className="absolute right-0">S1:E1</span>
                        </div>
                    </div>

                    <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                        When a young developer vanishes into the code, a small town uncovers a mystery involving secret experiments, terrifying bugs, and one strange IT Fest.
                    </p>

                    <p className="text-xs text-gray-400">
                        <span className="text-gray-200">Starring:</span> You, Your Team, The Competition... <span className="text-white font-bold">more</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        <span className="text-gray-200">Creator:</span> Department Of Computer Application
                    </p>
                </div>

                {/* Action Icons Row */}
                <div className="flex items-center justify-start gap-12 mb-8 px-4">
                    <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={handleMyList}>
                        {inList ? (
                            <Check size={24} className="text-[#E50914]" />
                        ) : (
                            <Plus size={24} className="text-white group-hover:text-gray-300" />
                        )}
                        <span className={`text-[10px] ${inList ? 'text-[#E50914]' : 'text-gray-400'}`}>My List</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={handleRate}>
                        <ThumbsUp size={24} className={`${isLiked ? 'text-[#E50914] fill-[#E50914]' : 'text-white group-hover:text-gray-300'}`} />
                        <span className={`text-[10px] ${isLiked ? 'text-[#E50914]' : 'text-gray-400'}`}>Rate</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={handleShare}>
                        <Share2 size={24} className="text-white group-hover:text-gray-300" />
                        <span className="text-[10px] text-gray-400">Share</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 cursor-pointer group">
                        <ArrowDownToLine size={24} className="text-white group-hover:text-gray-300" />
                        <span className="text-[10px] text-gray-400">Download Season 1</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-t border-gray-800 pt-4 mb-6">
                    <button
                        onClick={() => setActiveTab('episodes')}
                        className={`text-sm font-bold uppercase pb-2 border-t-4 transition ${activeTab === 'episodes' ? 'border-[#E50914] text-white' : 'border-transparent text-gray-400'}`}
                    >
                        Events
                    </button>
                    <button
                        onClick={() => setActiveTab('collection')}
                        className={`text-sm font-bold uppercase pb-2 border-t-4 transition ${activeTab === 'collection' ? 'border-[#E50914] text-white' : 'border-transparent text-gray-400'}`}
                    >
                        Workshops
                    </button>
                    <button
                        onClick={() => setActiveTab('more')}
                        className={`text-sm font-bold uppercase pb-2 border-t-4 transition ${activeTab === 'more' ? 'border-[#E50914] text-white' : 'border-transparent text-gray-400'}`}
                    >
                        Sponsors
                    </button>
                </div>

                {/* Episodes List */}
                {activeTab === 'episodes' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-400 text-sm border border-gray-600 rounded px-2 py-1">Season 1</span>
                        </div>

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
                                            <span className="text-xs text-gray-400">{event.duration}</span>
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
                                                        {event.rules.map((rule, idx) => (
                                                            <li key={idx}>{rule}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <button className="w-full mt-4 bg-[#E50914] text-white font-bold py-2 rounded hover:bg-[#b2070f] transition text-xs uppercase tracking-wider">
                                                    Register Now
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                )}

                {/* Workshops Tab Content */}
                {activeTab === 'collection' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                        {[1, 2].map((item) => (
                            <div key={item} className="bg-[#181818] p-4 rounded-lg border border-white/10 hover:border-red-600/50 transition cursor-pointer group">
                                <div className="aspect-video bg-[#222] rounded mb-3 overflow-hidden relative">
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-mono text-xs">
                                        [WORKSHOP_DATA_ENCRYPTED]
                                    </div>
                                </div>
                                <h3 className="text-white font-bold mb-1 group-hover:text-red-500 transition">Workshop {item}: Ethical Hacking</h3>
                                <p className="text-xs text-gray-400">Coming Soon • Limited Seats</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Sponsors Tab Content */}
                {activeTab === 'more' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fadeIn">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} className="aspect-square bg-[#181818] rounded-lg border border-white/10 flex items-center justify-center hover:bg-[#222] transition cursor-pointer">
                                <span className="text-gray-600 font-bold text-xl">LOGO</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Episodes;
