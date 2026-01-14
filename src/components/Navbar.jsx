import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, UserPlus } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo-final.png';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isBlasting, setIsBlasting] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'Events', href: '#episodes' },
        { name: 'Schedule', href: '/schedule' },
        { name: 'Prelims', href: '/results' },
        { name: 'Champions', href: '/champions' },
        { name: 'The Other Side', href: '#otherside' },
    ];

    const handleNavClick = (e, href) => {
        e.preventDefault();
        setIsOpen(false); // Close mobile menu if open

        // Check if it's a route navigation (starts with /) or a hash scroll
        if (href.startsWith('/')) {
            navigate(href);
            return;
        }

        if (location.pathname === '/') {
            // If on home page, scroll to section
            if (href === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const id = href.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    setTimeout(() => {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                }
            }
            // Optional: update URL hash without jump
            window.history.pushState(null, '', href === '#' ? '/' : href);
        } else {
            // If on another page, navigate to home with hash
            navigate(`/${href === '#' ? '' : href}`);
        }
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-[#141414] border-b border-[#E50914]/50 shadow-[0_4px_30px_rgba(229,9,20,0.15)]' : 'bg-gradient-to-b from-black/90 via-black/60 to-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-24 transition-all duration-300">
                    <Link to="/" className="flex items-center gap-8 group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="flex-shrink-0">
                            <img src={logo} alt="Inspiro 26" className="h-12 md:h-20 w-auto object-contain transition-all duration-300 group-hover:scale-105" />
                        </div>
                    </Link>

                    <div className="hidden md:block">
                        <div className="flex items-baseline space-x-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className="text-gray-300 hover:text-[#E50914] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:drop-shadow-[0_0_8px_rgba(229,9,20,0.5)] cursor-pointer"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-6 text-white">
                        <Link to="/login" className="text-sm font-bold hover:text-red-500 transition-colors uppercase tracking-wider">
                            Login
                        </Link>
                        <Link to="/register">
                            <button className="bg-[#E50914] hover:bg-[#b00710] text-white px-4 py-2 rounded text-sm font-bold transition-all hover:scale-105 flex items-center gap-2">
                                <UserPlus size={16} /> Register
                            </button>
                        </Link>
                        {/* <Bell className="w-5 h-5 cursor-pointer hover:text-gray-300" /> */}
                        {/* <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center cursor-pointer">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="Profile" className="rounded" />
                        </div> */}
                    </div>

                    <div className="md:hidden flex items-center gap-4 text-white">
                        <Link to="/login" className="text-sm font-bold hover:text-red-500 transition-colors uppercase tracking-wider">
                            Login
                        </Link>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white hover:text-gray-300"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black/95 backdrop-blur-xl border-t border-red-900/50 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.9)]"
                    >
                        <div className="px-4 pt-4 pb-6 space-y-2">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className="block px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-red-500 hover:bg-red-900/10 hover:pl-6 transition-all duration-300 border-l-2 border-transparent hover:border-red-600 cursor-pointer"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <Link
                                to="/register"
                                className="block px-3 py-3 rounded-md text-base font-medium text-white bg-[#E50914] hover:bg-[#b00710] hover:pl-6 transition-all duration-300 border-l-2 border-transparent"
                                onClick={() => setIsOpen(false)}
                            >
                                Register Now
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


        </nav>
    );
};

export default Navbar;
