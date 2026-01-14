// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Preloader = ({ progress = 0 }) => {
    // Timer removed; controlled by parent App.jsx

    // Ensure exit animation completes if needed, but AnimatePresence handles it mostly.
    // The component is now just a presentation layer.

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                transition: { duration: 0.8 }
            }}
            className="fixed inset-0 bg-black z-[9999] flex items-center justify-center overflow-hidden"
        >
            {/* Minimal Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,0,0,0.4)_0%,black_100%)]" />

            {/* Glowing Text Container */}
            <div className="relative z-10 flex flex-col items-center gap-4">
                {/* Main Title Pulse */}
                <motion.h1
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="font-cinematic text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] tracking-widest uppercase"
                >
                    Inspiro 26
                </motion.h1>

                {/* Loading Bar Container */}
                <div className="w-64 h-1 bg-red-900/30 rounded-full overflow-hidden relative">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1, ease: "linear" }}
                        className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"
                    />
                </div>

                {/* Percentage Text */}
                <span className="font-mono text-red-500 text-xs tracking-widest">
                    LOADING_ASSETS... {Math.round(progress)}%
                </span>
            </div>

            {/* Vignette & Grain */}
            <div className="absolute inset-0 pointer-events-none film-grain opacity-30 mix-blend-overlay"></div>
        </motion.div>
    );
};

export default Preloader;
