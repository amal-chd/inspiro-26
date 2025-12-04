import React from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import event1 from '../assets/event-1.png';
import event2 from '../assets/event-2.png';
import event3 from '../assets/event-3.png';
import event4 from '../assets/event-4.png';
import event5 from '../assets/event-5.png';

const Events = () => {
    const events = [
        { title: "CodeWar", match: "98% Match", age: "16+", duration: "24h", image: event1 },
        { title: "CyberHunt", match: "95% Match", age: "18+", duration: "12h", image: event2 },
        { title: "RoboRace", match: "99% Match", age: "All", duration: "4h", image: event3 },
        { title: "PixelPerfect", match: "94% Match", age: "13+", duration: "6h", image: event4 },
        { title: "Valorant Cup", match: "97% Match", age: "16+", duration: "48h", image: event5 },
        { title: "IdeaPitch", match: "89% Match", age: "18+", duration: "3h", image: event1 },
    ];

    return (
        <section id="events" className="py-12 bg-[#141414] relative z-10 -mt-20">
            <div className="px-4 sm:px-6 lg:px-12">
                <h2 className="text-3xl md:text-5xl font-cinematic font-black text-transparent bg-clip-text bg-gradient-to-b from-[#E50914] to-black stroke-red-600 drop-shadow-[0_0_10px_rgba(229,9,20,0.5)] mb-6 tracking-wide"
                    style={{ WebkitTextStroke: '1px #E50914' }}>
                    Events Happening in Hawkins
                </h2>

                <div className="flex overflow-x-auto pb-8 gap-4 md:gap-6 scrollbar-hide snap-x snap-mandatory">
                    {events.map((event, index) => (
                        <Link to="/episodes" key={index}>
                            <motion.div
                                whileHover={{ scale: 1.05, zIndex: 50 }}
                                transition={{ duration: 0.3 }}
                                className="relative flex-shrink-0 w-[280px] md:w-auto bg-[#181818] rounded-md overflow-hidden cursor-pointer group hover:shadow-[0_0_20px_rgba(229,9,20,0.6)] hover:ring-2 hover:ring-[#E50914] transition-all duration-300 snap-center border border-white/5"
                            >
                                <div className="relative">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full aspect-video object-cover rounded-t-md group-hover:sepia-[.5] group-hover:contrast-125 transition duration-500"
                                    />
                                    {/* CRT Scanline Overlay on Hover */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 crt-overlay transition-opacity duration-300" />

                                    {/* New/Trending Badge */}
                                    {index < 3 && (
                                        <div className="absolute top-2 left-2 bg-[#E50914] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md">
                                            NEW EPISODE
                                        </div>
                                    )}
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition scale-0 group-hover:scale-100 duration-300 delay-100">
                                            <Play className="fill-black w-4 h-4" />
                                        </div>
                                        <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white transition scale-0 group-hover:scale-100 duration-300 delay-150">
                                            <Plus className="text-white w-4 h-4" />
                                        </div>
                                        <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white transition ml-auto scale-0 group-hover:scale-100 duration-300 delay-200">
                                            <ChevronDown className="text-white w-4 h-4" />
                                        </div>
                                    </div>

                                    <h3 className="text-white font-cinematic font-bold text-lg mb-1 tracking-wide">{event.title}</h3>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-300 font-medium">
                                        <span className="text-green-400 font-bold">{event.match}</span>
                                        <span className="border border-gray-500 px-1">{event.age}</span>
                                        <span>{event.duration}</span>
                                        <span className="border border-white/40 px-1 rounded text-[8px]">HD</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 text-[10px] text-white">
                                        <span className="text-gray-400">Sci-Fi</span>
                                        <span className="text-gray-600">•</span>
                                        <span className="text-gray-400">Thriller</span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Events;
