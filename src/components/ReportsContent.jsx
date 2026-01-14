import React, { useState, useEffect } from 'react'; // Re-saving to trigger build
import { supabase } from '../supabase';
import { Loader2, Download, Trophy, Utensils, Calendar, BarChart3, Users, Clock, AlertTriangle, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNotification } from '../components/NotificationProvider';


const ReportsContent = () => {
    const { showNotification } = useNotification();
    const [activeTab, setActiveTab] = useState('overview'); // overview, events, food, winners
    const [loading, setLoading] = useState(false);

    // Data States
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [eventAttendance, setEventAttendance] = useState([]);
    const [winners, setWinners] = useState([]);
    const [summaryStats, setSummaryStats] = useState({
        totalRevenue: 0,
        paidCount: 0,
        pendingCount: 0,
        totalRegistrations: 0
    });

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        try {
            // Fetch Events
            const { data: eventsData } = await supabase.from('events').select('*');
            setEvents(eventsData || []);

            // Fetch Registrations
            const { data: regData } = await supabase.from('registrations').select('*');
            setRegistrations(regData || []);

            // Calculate Summary Stats
            if (regData) {
                const paid = regData.filter(r => r.payment_status === 'paid');
                const revenue = paid.reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0);
                setSummaryStats({
                    totalRevenue: revenue,
                    paidCount: paid.length,
                    pendingCount: regData.length - paid.length,
                    totalRegistrations: regData.length
                });
            }

            // Fetch Event Attendance
            const { data: attData } = await supabase
                .from('event_attendance')
                .select('*, registrations(full_name, college, id, department), events(title)');
            setEventAttendance(attData || []);

            // Fetch Winners
            const { data: winData } = await supabase
                .from('winners')
                .select('*, events(title), registrations(full_name, college, department)');
            setWinners(winData || []);

        } catch (error) {
            console.error('Error fetching report data:', error);
            showNotification('Failed to load report data', 'error');
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- REPORT GENERATORS ---

    const downloadEventReport = (eventId) => {
        const event = events.find(e => e.id == eventId);
        if (!event) return;

        // Use registrations instead of eventAttendance
        const attendees = registrations.filter(r =>
            r.selected_events && r.selected_events.includes(String(eventId))
        );

        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Event Report: ${event.title}`, 14, 22);
        doc.setFontSize(11);
        doc.text(`Total Nominations: ${attendees.length}`, 14, 30);

        const tableData = attendees.map((a, index) => [
            index + 1,
            a.full_name,
            `Reg-${a.id}`,
            a.college,
            a.phone, // Added phone for utility
            a.payment_status === 'paid' ? 'Paid' : 'Pending'
        ]);

        autoTable(doc, {
            head: [['S.No', 'Name', 'ID', 'College', 'Phone', 'Status']],
            body: tableData,
            startY: 35,
        });

        doc.save(`${event.title.replace(/[^a-z0-9]/gi, '_')}_Nominations.pdf`);
    };

    const downloadFoodReport = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Food Redemption Report', 14, 22);

        // Calculate stats
        let lunchCount = 0;
        let refreshmentCount = 0;
        let dinnerCount = 0;

        registrations.forEach(reg => {
            if (reg.meals_redeemed?.lunch) lunchCount++;
            if (reg.meals_redeemed?.refreshment) refreshmentCount++;
            if (reg.meals_redeemed?.dinner) dinnerCount++;
        });

        const data = [
            ['Lunch', lunchCount],
            ['Refreshment', refreshmentCount],
            ['Dinner', dinnerCount]
        ];

        autoTable(doc, {
            head: [['Meal Type', 'Redeemed Count']],
            body: data,
            startY: 30,
        });

        doc.save('Food_Report.pdf');
    };

    // --- Colleges Logic ---
    const [selectedCollege, setSelectedCollege] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const getCollegeStats = () => {
        const stats = {};
        registrations.forEach(reg => {
            const college = reg.college || 'Unknown';
            if (!stats[college]) {
                stats[college] = { name: college, count: 0, students: [] };
            }
            stats[college].count++;
            stats[college].students.push(reg);
        });
        return Object.values(stats).sort((a, b) => b.count - a.count);
    };

    const downloadCollegeReport = (collegeName, students, statusFilter) => {
        // Filter students based on status
        const filteredStudents = students.filter(s => {
            if (statusFilter === 'paid') return s.payment_status === 'paid';
            if (statusFilter === 'pending') return s.payment_status !== 'paid';
            return true;
        });

        if (filteredStudents.length === 0) {
            showNotification(`No ${statusFilter} registrations found for this college.`, 'error');
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`College Report: ${collegeName} (${statusFilter.toUpperCase()})`, 14, 22);
        doc.setFontSize(11);
        doc.text(`Total Students: ${filteredStudents.length}`, 14, 30);

        const tableData = filteredStudents.map((s, index) => [
            index + 1,
            s.full_name,
            s.department,
            s.year,
            s.phone,
            s.payment_status === 'paid' ? 'Paid' : 'Pending'
        ]);

        autoTable(doc, {
            head: [['S.No', 'Name', 'Department', 'Year', 'Phone', 'Status']],
            body: tableData,
            startY: 35,
        });

        doc.save(`${collegeName.replace(/[^a-z0-9]/gi, '_')}_${statusFilter}_Report.pdf`);
    };

    if (loading) return <div className="text-white text-center py-20"><Loader2 className="animate-spin mx-auto mb-4" />Generating Analytics...</div>;

    return (
        <div className="bg-[#141414] rounded-xl border border-white/10 p-6 min-h-[600px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-cinematic font-bold text-white flex items-center gap-2">
                    <BarChart3 className="text-red-600" /> System Reports
                </h2>
                <div className="flex bg-black/50 rounded-lg p-1 border border-white/10 overflow-x-auto">
                    {['overview', 'events', 'food', 'winners', 'colleges'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setSelectedCollege(null); setSelectedEvent(null); }}
                            className={`px-4 py-2 rounded text-sm font-bold uppercase transition whitespace-nowrap ${activeTab === tab ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div className="animate-fade-in space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-black/30 p-6 rounded-lg border border-white/10">
                            <span className="text-gray-400 text-xs uppercase tracking-wider">Total Revenue</span>
                            <h3 className="text-3xl font-bold text-green-500 mt-2">₹{summaryStats.totalRevenue.toLocaleString()}</h3>
                        </div>
                        <div className="bg-black/30 p-6 rounded-lg border border-white/10">
                            <span className="text-gray-400 text-xs uppercase tracking-wider">Registrations</span>
                            <h3 className="text-3xl font-bold text-white mt-2">{summaryStats.totalRegistrations}</h3>
                        </div>
                        <div className="bg-black/30 p-6 rounded-lg border border-white/10">
                            <span className="text-gray-400 text-xs uppercase tracking-wider">Event Nominations</span>
                            <h3 className="text-3xl font-bold text-yellow-500 mt-2">
                                {registrations.reduce((acc, curr) => acc + (curr.selected_events?.length || 0), 0)}
                            </h3>
                        </div>
                        <div className="bg-black/30 p-6 rounded-lg border border-white/10">
                            <span className="text-gray-400 text-xs uppercase tracking-wider">Winners Declared</span>
                            <h3 className="text-3xl font-bold text-red-500 mt-2">{winners.length}</h3>
                        </div>
                    </div>
                </div>
            )}

            {/* EVENTS TAB */}
            {activeTab === 'events' && (
                <div className="animate-fade-in">
                    {selectedEvent ? (
                        <div className="space-y-6">
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="flex items-center gap-2 text-gray-400 hover:text-white transition group mb-4"
                            >
                                <span className="p-1 rounded-full bg-white/5 group-hover:bg-white/10">←</span> Back to Events
                            </button>

                            <div className="bg-black/30 rounded-lg border border-white/10 overflow-hidden">
                                <div className="p-6 border-b border-white/10 bg-white/5 flex flex-col gap-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                {selectedEvent.title}
                                                <span className="text-sm font-normal text-gray-400 bg-black/20 px-2 py-0.5 rounded">
                                                    {registrations.filter(r => r.selected_events && r.selected_events.includes(String(selectedEvent.id))).length} Pax
                                                </span>
                                            </h3>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Participant List</p>
                                        </div>
                                        <button
                                            onClick={() => downloadEventReport(selectedEvent.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2 transition"
                                        >
                                            <Download size={16} /> Export PDF
                                        </button>
                                    </div>

                                    {/* Add Participant Search */}
                                    <div className="relative">
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                            <input
                                                type="text"
                                                placeholder="Search student by name to add..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-red-600 outline-none transition"
                                            />
                                        </div>
                                        {searchQuery && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                                                {registrations
                                                    .filter(r =>
                                                        r.full_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                                                        (!r.selected_events || !r.selected_events.includes(String(selectedEvent.id)))
                                                    )
                                                    .slice(0, 5) // Limit results
                                                    .map(student => (
                                                        <div key={student.id} className="p-3 hover:bg-white/5 flex justify-between items-center border-b border-white/5 last:border-0">
                                                            <div>
                                                                <p className="font-bold text-white text-sm">{student.full_name}</p>
                                                                <p className="text-xs text-gray-500">{student.college}</p>
                                                            </div>
                                                            <button
                                                                onClick={async () => {
                                                                    const currentEvents = student.selected_events || [];
                                                                    const newEvents = [...currentEvents, String(selectedEvent.id)];

                                                                    // Optimistic API call
                                                                    const { error } = await supabase
                                                                        .from('registrations')
                                                                        .update({ selected_events: newEvents })
                                                                        .eq('id', student.id);

                                                                    if (error) {
                                                                        showNotification('Failed to add participant', 'error');
                                                                    } else {
                                                                        showNotification('Participant added successfully', 'success');
                                                                        // Update local state
                                                                        setRegistrations(prev => prev.map(r =>
                                                                            r.id === student.id ? { ...r, selected_events: newEvents } : r
                                                                        ));
                                                                        setSearchQuery(''); // Clear search
                                                                    }
                                                                }}
                                                                className="text-xs bg-green-600/20 text-green-500 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded transition"
                                                            >
                                                                + Add
                                                            </button>
                                                        </div>
                                                    ))}
                                                {registrations.filter(r =>
                                                    r.full_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                                                    (!r.selected_events || !r.selected_events.includes(String(selectedEvent.id)))
                                                ).length === 0 && (
                                                        <div className="p-4 text-center text-gray-500 text-sm">No matching students found</div>
                                                    )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-gray-300">
                                        <thead className="bg-black/50 text-xs uppercase text-gray-400 sticky top-0 bg-[#0a0a0a]">
                                            <tr>
                                                <th className="px-6 py-3">S.No</th>
                                                <th className="px-6 py-3">Name</th>
                                                <th className="px-6 py-3">College</th>
                                                <th className="px-6 py-3">Dept</th>
                                                <th className="px-6 py-3">Phone</th>
                                                <th className="px-6 py-3">Status</th>
                                                <th className="px-6 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {registrations
                                                .filter(r => r.selected_events && r.selected_events.includes(String(selectedEvent.id)))
                                                .map((student, index) => (
                                                    <tr key={student.id} className="hover:bg-white/5 transition border-b border-white/5 last:border-0">
                                                        <td className="px-6 py-3 font-mono text-gray-500">{index + 1}</td>
                                                        <td className="px-6 py-3 font-bold text-white">{student.full_name}</td>
                                                        <td className="px-6 py-3 text-xs">{student.college}</td>
                                                        <td className="px-6 py-3 text-xs">{student.department}</td>
                                                        <td className="px-6 py-3 font-mono text-xs">{student.phone}</td>
                                                        <td className="px-6 py-3">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${student.payment_status === 'paid' ? 'text-green-500' : 'text-yellow-500'
                                                                }`}>
                                                                {student.payment_status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-3 text-right">
                                                            <button
                                                                onClick={async () => {
                                                                    if (!window.confirm(`Are you sure you want to remove ${student.full_name} from this event?`)) return;

                                                                    const currentEvents = student.selected_events || [];
                                                                    const newEvents = currentEvents.filter(id => id !== String(selectedEvent.id));

                                                                    // Optimistic API call
                                                                    const { error } = await supabase
                                                                        .from('registrations')
                                                                        .update({ selected_events: newEvents })
                                                                        .eq('id', student.id);

                                                                    if (error) {
                                                                        showNotification('Failed to remove participant', 'error');
                                                                    } else {
                                                                        showNotification('Participant removed', 'success');
                                                                        // Update local state
                                                                        setRegistrations(prev => prev.map(r =>
                                                                            r.id === student.id ? { ...r, selected_events: newEvents } : r
                                                                        ));
                                                                    }
                                                                }}
                                                                className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition"
                                                                title="Remove from event"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            {registrations.filter(r => r.selected_events && r.selected_events.includes(String(selectedEvent.id))).length === 0 && (
                                                <tr>
                                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500 italic">
                                                        No nominations for this event yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map(event => {
                                // Count from selected_events
                                const count = registrations.filter(r =>
                                    r.selected_events && r.selected_events.includes(String(event.id))
                                ).length;

                                return (
                                    <div
                                        key={event.id}
                                        onClick={() => setSelectedEvent(event)}
                                        className="bg-black/30 p-6 rounded-lg border border-white/10 hover:border-red-600/50 transition group cursor-pointer relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/5 transition-colors pointer-events-none" />
                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <h4 className="font-bold text-lg text-white group-hover:text-red-500 transition-colors">{event.title}</h4>
                                            <span className="bg-red-600/20 text-red-500 text-xs px-2 py-1 rounded font-mono">#{event.id}</span>
                                        </div>
                                        <div className="flex items-end justify-between relative z-10">
                                            <div>
                                                <span className="block text-3xl font-bold text-white">{count}</span>
                                                <span className="text-xs text-gray-500 uppercase">Nominations</span>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    downloadEventReport(event.id);
                                                }}
                                                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition z-20 relative"
                                                title="Download Report"
                                            >
                                                <Download size={20} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* FOOD TAB */}
            {activeTab === 'food' && (
                <div className="animate-fade-in">
                    <div className="bg-black/30 p-8 rounded-lg border border-white/10 border-l-4 border-l-orange-500 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Utensils className="text-orange-500" /> Meal Redemption Stats
                            </h3>
                            <button
                                onClick={downloadFoodReport}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2"
                            >
                                <Download size={16} /> Export Report
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-8 text-center">
                            <div className="p-4 bg-white/5 rounded-lg">
                                <span className="block text-gray-400 text-sm mb-2">Lunch</span>
                                <span className="text-4xl font-bold text-white">
                                    {registrations.filter(r => r.meals_redeemed?.lunch).length}
                                </span>
                            </div>
                            <div className="p-4 bg-white/5 rounded-lg">
                                <span className="block text-gray-400 text-sm mb-2">Refreshment</span>
                                <span className="text-4xl font-bold text-white">
                                    {registrations.filter(r => r.meals_redeemed?.refreshment).length}
                                </span>
                            </div>
                            <div className="p-4 bg-white/5 rounded-lg">
                                <span className="block text-gray-400 text-sm mb-2">Dinner</span>
                                <span className="text-4xl font-bold text-white">
                                    {registrations.filter(r => r.meals_redeemed?.dinner).length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* WINNERS TAB */}
            {activeTab === 'winners' && (
                <div className="animate-fade-in">
                    <div className="overflow-x-auto bg-black/30 rounded-lg border border-white/10">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-white/5 text-xs uppercase text-gray-400">
                                <tr>
                                    <th className="px-6 py-4">Event</th>
                                    <th className="px-6 py-4">Position</th>
                                    <th className="px-6 py-4">Winner Name</th>
                                    <th className="px-6 py-4">College</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {winners.length === 0 ? (
                                    <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No winners declared yet.</td></tr>
                                ) : (
                                    winners.map(win => (
                                        <tr key={win.id} className="hover:bg-white/5">
                                            <td className="px-6 py-4 font-bold text-white">{win.events?.title}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${win.position === '1st' ? 'bg-yellow-500/20 text-yellow-500' :
                                                    win.position === '2nd' ? 'bg-gray-400/20 text-gray-300' :
                                                        'bg-orange-700/20 text-orange-600'
                                                    }`}>
                                                    {win.position} Place
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-white">{win.registrations?.full_name}</td>
                                            <td className="px-6 py-4 text-gray-500">{win.registrations?.college}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* COLLEGES TAB */}
            {activeTab === 'colleges' && (
                <div className="animate-fade-in">
                    {!selectedCollege ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {getCollegeStats().map((collegeData, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedCollege(collegeData)}
                                    className="bg-black/30 p-6 rounded-lg border border-white/10 hover:border-red-600/50 hover:bg-white/5 transition cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-lg text-white line-clamp-2 mb-2">{collegeData.name}</h4>
                                        <span className="bg-white/10 text-white text-xs px-2 py-1 rounded font-mono">
                                            {collegeData.count}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 group-hover:text-red-400 transition">Click to view students</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    onClick={() => setSelectedCollege(null)}
                                    className="text-gray-400 hover:text-white flex items-center gap-2 transition"
                                >
                                    ← Back to Colleges
                                </button>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => downloadCollegeReport(selectedCollege.name, selectedCollege.students, 'paid')}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2 transition"
                                    >
                                        <Download size={16} /> Paid List
                                    </button>
                                    <button
                                        onClick={() => downloadCollegeReport(selectedCollege.name, selectedCollege.students, 'pending')}
                                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2 transition"
                                    >
                                        <Download size={16} /> Pending List
                                    </button>
                                </div>
                            </div>

                            <div className="bg-black/30 rounded-lg border border-white/10 overflow-hidden">
                                <div className="p-6 border-b border-white/10 bg-white/5">
                                    <h3 className="text-xl font-bold text-white">{selectedCollege.name}</h3>
                                    <p className="text-sm text-gray-400">{selectedCollege.count} Students Registered</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-gray-300">
                                        <thead className="bg-black/50 text-xs uppercase text-gray-400">
                                            <tr>
                                                <th className="px-6 py-4">Name</th>
                                                <th className="px-6 py-4">Department</th>
                                                <th className="px-6 py-4">Year</th>
                                                <th className="px-6 py-4">Phone</th>
                                                <th className="px-6 py-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {selectedCollege.students.map((student) => (
                                                <tr key={student.id} className="hover:bg-white/5 transition">
                                                    <td className="px-6 py-4 font-bold text-white">{student.full_name}</td>
                                                    <td className="px-6 py-4">{student.department}</td>
                                                    <td className="px-6 py-4">{student.year}</td>
                                                    <td className="px-6 py-4 font-mono text-xs">{student.phone}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${student.payment_status === 'paid' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                                            {student.payment_status === 'paid' ? 'PAID' : 'PENDING'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReportsContent;
