import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import logo from '../assets/logo-final.png';
import footerBg from '../assets/footer-bg.jpg';

const Footer = () => {
    return (
        <footer className="relative text-[#808080] py-12 px-4 sm:px-6 lg:px-12 border-t border-[#333] overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img src={footerBg} alt="Footer Background" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-[#141414]/80 to-[#141414]/40" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                    <img src={logo} alt="Inspiro 26" className="h-12 md:h-16 w-auto opacity-80 hover:opacity-100 transition" />
                    <div className="flex space-x-6 text-white">
                        <a href="https://instagram.com/inspiro.26" target="_blank" rel="noopener noreferrer">
                            <Instagram className="w-6 h-6 cursor-pointer hover:text-red-600 transition" />
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm mb-12 text-gray-400">
                    <ul className="space-y-3">
                        <li className="font-bold text-white mb-2">Navigation</li>
                        <li><a href="/" className="hover:text-red-500 transition">Home</a></li>
                        <li><a href="/episodes" className="hover:text-red-500 transition">Episodes</a></li>
                        <li><a href="/more-info" className="hover:text-red-500 transition">Classified Info</a></li>
                    </ul>
                    <ul className="space-y-3">
                        <li className="font-bold text-white mb-2">Events</li>
                        <li><a href="/episodes" className="hover:text-red-500 transition">Stranger Bugs</a></li>
                        <li><a href="/episodes" className="hover:text-red-500 transition">Mindflayer Cup</a></li>
                        <li><a href="/episodes" className="hover:text-red-500 transition">Upsidedown Vision</a></li>
                        <li><a href="/episodes" className="hover:text-red-500 transition">Hawkins Mystery Trail</a></li>
                    </ul>
                    <ul className="space-y-3">
                        <li className="font-bold text-white mb-2">Coordinators</li>
                        <li className="text-xs">
                            <span className="block text-gray-300 font-semibold">Staff:</span>
                            Mr. Kevinson Kurian: +91 9207669030<br />
                            Mrs. Sruthi N: +91 7356709963
                        </li>
                        <li className="text-xs mt-2">
                            <span className="block text-gray-300 font-semibold">Student:</span>
                            Abin B Paul: +91 9778104186<br />
                            Hisham Mohamed: +91 7511163610
                        </li>
                    </ul>
                    <ul className="space-y-3">
                        <li className="font-bold text-white mb-2">Location</li>
                        <li className="text-xs leading-relaxed">
                            Don Bosco Arts & Science College<br />
                            Angadikadavu, Iritty<br />
                            Kannur, Kerala - 670706
                        </li>
                    </ul>
                </div>

                <div className="border-t border-[#333] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500">
                        © 2026 Dept. of Computer Application, Don Bosco Arts & Science College.
                    </p>
                    <p className="text-xs text-gray-600">
                        Designed for Inspiro 26
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
