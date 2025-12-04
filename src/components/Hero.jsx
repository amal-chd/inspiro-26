
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroVideo from '../assets/hero-video.mp4';
import logo from '../assets/logo.png';

const Hero = () => {
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef(null);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <section className="relative h-[100dvh] w-full overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/50 z-10" />

                <video
                    ref={videoRef}
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    className="w-full h-full object-cover opacity-60"
                >
                    <source src={heroVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Mute Toggle Button */}
            <div className="absolute top-24 right-4 z-30 md:top-32 md:right-12">
                <button
                    onClick={toggleMute}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/10 transition"
                >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
            </div>

            <div className="relative z-20 h-full flex items-end justify-center md:justify-start px-4 sm:px-6 lg:px-12 pb-20 md:pb-32">
                <div className="max-w-2xl w-full flex flex-col items-center md:items-start text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5 }}
                        className="mb-4 md:mb-6"
                    >
                        {/* Stranger Things Style Title */}
                        <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-cinematic font-black text-transparent bg-clip-text bg-gradient-to-b from-primary to-black stroke-red-600 tracking-tighter drop-shadow-[0_0_15px_rgba(229,9,20,0.8)] leading-[0.9]"
                            style={{ WebkitTextStroke: '1px #E50914' }}>
                            INSPIRO<br />
                            <span className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl">26</span>
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="w-full flex flex-col items-center md:items-start"
                    >
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4 mb-4 md:mb-6 text-white font-medium text-xs md:text-base">
                            <span className="text-green-400 font-bold">98% Match</span>
                            <span className="text-gray-400">2026</span>
                            <span className="border border-gray-500 px-1 text-[10px] md:text-xs">U/A 16+</span>
                            <span className="text-gray-400">1 Season</span>
                            <span className="border border-white/40 px-1 text-[10px] md:text-xs rounded">HD</span>
                        </div>

                        <p className="text-sm md:text-xl text-white drop-shadow-md mb-6 md:mb-8 max-w-lg line-clamp-3 leading-snug">
                            When a young developer vanishes into the code, a small town uncovers a mystery involving secret experiments, terrifying bugs, and one strange IT Fest.
                        </p>

                        <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4">
                            <Link to="/episodes" className="flex items-center gap-2 px-4 py-2 md:px-8 md:py-3 bg-white text-black rounded hover:bg-white/90 transition font-bold text-sm md:text-lg">
                                <Play className="fill-black w-4 h-4 md:w-6 md:h-6" /> Play
                            </Link>
                            <Link to="/more-info" className="flex items-center gap-2 px-4 py-2 md:px-8 md:py-3 bg-gray-500/70 text-white rounded hover:bg-gray-500/50 transition font-bold text-sm md:text-lg backdrop-blur-sm">
                                <Info className="w-4 h-4 md:w-6 md:h-6" /> More Info
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
