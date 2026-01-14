import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import { scheduleData } from '../data/scheduleData';

const Schedule = () => {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 relative overflow-hidden">
                {/* Background Effects */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_70%)]" />
                    <div className="absolute w-full h-full opacity-20"
                        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
                    />
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-cinematic font-bold mb-4 tracking-wider">
                            EVENT <span className="text-red-600">SCHEDULE</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Navigate through the timeline of events. From technical showdowns to cultural extravaganzas, stay tuned to the rhythm of Inspiro '26.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-600/0 via-red-600/50 to-red-600/0 md:-ml-[1px]" />

                        <div className="space-y-12">
                            {scheduleData.map((event, index) => {
                                const Icon = event.icon;
                                return (
                                    <div
                                        key={event.id}
                                        className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                            }`}
                                    >
                                        {/* Timeline Node */}
                                        <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-red-600 rounded-full border-4 border-[#0a0a0a] shadow-[0_0_10px_rgba(220,38,38,0.5)] transform -translate-x-1.5 md:-translate-x-2 mt-6 z-10" />

                                        {/* Content Card */}
                                        <div className={`flex-1 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
                                            }`}>
                                            <div className="bg-[#1a1a1a]/50 backdrop-blur-sm border border-white/5 rounded-xl p-6 hover:border-red-600/30 transition-colors group">
                                                <div className={`flex items-center gap-3 mb-2 text-red-500 font-mono text-sm tracking-widest ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'
                                                    }`}>
                                                    <Clock size={14} />
                                                    <span>{event.time}</span>
                                                </div>

                                                <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-red-500 transition-colors">
                                                    {event.title}
                                                </h3>

                                                <div className={`flex items-center gap-2 text-gray-400 text-sm ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'
                                                    }`}>
                                                    <MapPin size={14} />
                                                    <span>{event.venue}</span>
                                                </div>

                                                {/* Mobile-only visible icon for decoration */}
                                                <div className={`absolute top-6 right-6 text-white/5 md:hidden ${event.iconClassName || ''}`}>
                                                    <Icon size={48} strokeWidth={1} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Desktop Space Filler */}
                                        <div className="flex-1 hidden md:block" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Schedule;
