import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import jumpscareFace from '../assets/jumpscare_face.jpg'; // New Image
import jumpscareAudio from '../assets/jumpscare.ogg';

// Generate Ash Particles (computed once)
const ashParticles = [...Array(25)].map(() => ({
    width: Math.random() * 4 + 2,
    height: Math.random() * 4 + 2,
    left: `${Math.random() * 100}vw`,
    top: `${Math.random() * 100}vh`,
    x: [(Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80],
    duration: Math.random() * 10 + 5,
    delay: Math.random() * 5
}));

const UpsideDownToggle = () => {
    const [isUpsideDown, setIsUpsideDown] = useState(false);
    const [triggerJumpscare, setTriggerJumpscare] = useState(false);
    const location = useLocation();

    // Audio ref for persistence
    const audioRef = useRef(null);

    // Initialize visible - always true now
    const [isVisible, setIsVisible] = useState(true);

    // Preload audio on mount
    useEffect(() => {
        try {
            audioRef.current = new Audio(jumpscareAudio);
            audioRef.current.preload = 'auto';
            audioRef.current.load();
        } catch (e) {
            console.error("Audio initialization failed:", e);
        }
    }, []);

    // Scroll visibility logic removed - always visible
    useEffect(() => {
        setIsVisible(true);
    }, [location.pathname]);

    useEffect(() => {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        if (isUpsideDown) {
            mainContent.classList.add('upside-down');
        } else {
            mainContent.classList.remove('upside-down');
        }

        return () => {
            if (mainContent) mainContent.classList.remove('upside-down');
        };
    }, [isUpsideDown]);

    const handleToggle = () => {
        if (!isUpsideDown) {
            // Audio Jumpscare
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.volume = 0.5;
                const playPromise = audioRef.current.play();

                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("Audio playback interrupted/failed:", error);
                        // Fallback attempt
                        try {
                            const fallbackAudio = new Audio(jumpscareAudio);
                            fallbackAudio.volume = 0.5;
                            fallbackAudio.play().catch(e => console.error("Fallback failed:", e));
                        } catch (e) {
                            console.error("Fallback creation failed:", e);
                        }
                    });
                }
            } else {
                // Fallback if ref is missing
                try {
                    const fallbackAudio = new Audio(jumpscareAudio);
                    fallbackAudio.volume = 0.5;
                    fallbackAudio.play().catch(e => console.error("Fallback failed:", e));
                } catch (e) {
                    console.error("Fallback creation failed:", e);
                }
            }

            // Visual Jumpscare - 2 SECONDS DURATION
            setTriggerJumpscare(true);
            setTimeout(() => setTriggerJumpscare(false), 2000); // 2000ms duration

            // Violent Shake effect
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                // Reset animation to ensure replay
                mainContent.style.animation = 'none';
                mainContent.offsetHeight; /* trigger reflow */
                mainContent.style.animation = 'shake 0.8s cubic-bezier(.36,.07,.19,.97) both';
            }
        } else {
            // Remove shake when exiting
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.style.animation = '';
        }
        setIsUpsideDown(!isUpsideDown);
    };

    return (
        <>
            {/* Jumpscare Overlay */}
            <AnimatePresence>
                {triggerJumpscare && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.2, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1.5, rotate: 0 }} // Extreme zoom in
                        exit={{ opacity: 0, scale: 2 }}
                        transition={{ duration: 0.15, type: "spring", stiffness: 300, damping: 15 }} // Violent pop
                        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black pointer-events-none overflow-hidden"
                    >
                        <img
                            src={jumpscareFace}
                            alt="JUMPSCARE"
                            className="w-full h-full object-cover object-center"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`fixed bottom-6 right-6 z-[10000] flex flex-col items-center gap-2 no-invert transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <span className={`text-[10px] font-mono tracking-widest ${isUpsideDown ? 'text-blue-400 font-bold' : 'text-gray-500'}`}>
                    {isUpsideDown ? 'UPSIDE DOWN' : 'REALITY'}
                </span>

                <button
                    onClick={handleToggle}
                    className={`relative w-16 h-8 rounded-full border-2 transition-all duration-500 ${isUpsideDown
                        ? 'bg-black border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.6)]'
                        : 'bg-[#1a1a1a] border-gray-600'
                        }`}
                >
                    <motion.div
                        className={`absolute top-0.5 w-6 h-6 rounded-full shadow-md ${isUpsideDown ? 'bg-blue-600' : 'bg-gray-400'
                            }`}
                        animate={{ x: isUpsideDown ? 34 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />

                    {/* Enhanced Ash Particles (Stranger Things Upside Down Style) */}
                    {isUpsideDown && (
                        <div className="fixed inset-0 pointer-events-none z-[90] overflow-hidden">
                            {/* Ash Particles */}
                            {ashParticles.map((style, i) => (
                                <motion.div
                                    key={`ash-${i}`}
                                    className="absolute bg-gray-400/80 rounded-full"
                                    style={{
                                        width: style.width,
                                        height: style.height,
                                        left: style.left,
                                        top: style.top,
                                        filter: 'blur(1px)'
                                    }}
                                    animate={{
                                        y: [0, 150],
                                        x: style.x,
                                        opacity: [0, 1, 0],
                                        rotate: [0, 360]
                                    }}
                                    transition={{
                                        duration: style.duration,
                                        repeat: Infinity,
                                        ease: "linear",
                                        delay: style.delay
                                    }}
                                />
                            ))}

                            {/* Organic Vine/Vein Overlay Warning: Needs to be subtle */}
                            <div className="absolute inset-0 bg-transparent opacity-30 mix-blend-overlay pointer-events-none"></div>
                        </div>
                    )}
                </button>

                <style>{`
                    .upside-down {
                        /*
                           Stronger Blue Tint Logic:
                           1. Desaturate slightly to kill warm colors (sepia/grayscale)
                           2. High contrast for drama
                           3. Hue rotate to shift remaining colors to cool spectrum
                           4. The overlay (::after) will do the heavy lifting for the blue tint
                        */
                        filter: brightness(0.8) contrast(1.5) grayscale(0.2) hue-rotate(200deg);
                        transition: filter 1.5s ease-in-out;
                    }

                    /* Atmosphere Overlay - THE BLUE TINT */
                    .upside-down::after {
                        content: "";
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        pointer-events: none;
                        z-index: 9998;
                        /* Strong Blue Gradient Overlay */
                        background: radial-gradient(circle at center, rgba(14, 28, 65, 0.4) 10%, rgba(5, 10, 30, 0.8) 90%);
                        /* Hard light helps blend the blue into text and images without washing them out */
                        mix-blend-mode: hard-light;
                        animation: pulse-atmosphere 6s infinite alternate;
                        box-shadow: inset 0 0 150px rgba(0,0,0,1);
                    }

                    /* Secondary Cold Overlay for depth */
                    .upside-down::before {
                        content: "";
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        pointer-events: none;
                        z-index: 9998;
                        background: rgba(0, 50, 100, 0.15);
                        mix-blend-mode: overlay;
                    }

                    @keyframes pulse-atmosphere {
                        0% { opacity: 0.8; }
                        50% { opacity: 0.6; }
                        100% { opacity: 0.9; }
                    }

                    @keyframes shake {
                        10%, 90% { transform: translate3d(-2px, 2px, 0); }
                        20%, 80% { transform: translate3d(4px, -4px, 0); }
                        30%, 50%, 70% { transform: translate3d(-8px, 6px, 0); }
                        40%, 60% { transform: translate3d(8px, -6px, 0); }
                    }

                    /* Visibility Overrides */
                    .upside-down img,
                    .upside-down svg {
                        /* Boost logo/image visibility against the dark blue */
                        filter: brightness(1.2) contrast(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.3));
                        position: relative;
                        z-index: 9999;
                    }

                    .upside-down h1,
                    .upside-down h2,
                    .upside-down h3,
                    .upside-down p,
                    .upside-down a,
                    .upside-down span:not(.font-mono) {
                         /* Make text pop with a subtle glow and ensure it's above the overlay if possible */
                         text-shadow: 0 0 5px rgba(255,255,255,0.5);
                         position: relative;
                         z-index: 9999;
                    }
                `}</style>
            </div>
        </>
    );
};

export default UpsideDownToggle;
