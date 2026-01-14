import React, { useEffect, useState } from 'react';
import { keralaColleges } from '../data/keralaColleges';
import Navbar from '../components/Navbar';

import { supabase } from '../supabase';
import { Download, Edit2, Trash2, X, Save, Check, AlertCircle, Filter, Loader2, Clock, CheckCircle2, FileText, Plus, Megaphone, Send, QrCode, Trophy, Search } from 'lucide-react';
import { useNotification } from '../components/NotificationProvider';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ScannerContent from '../components/ScannerContent';
import ReportsContent from '../components/ReportsContent';

const Admin = () => {
    const { showNotification } = useNotification();

    // --- Local Login State ---
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'inspiro' && password === '123456') {
            setIsAuthenticated(true);
            setLoginError('');
        } else {
            setLoginError('Invalid credentials');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUsername('');
        setPassword('');
    };

    // --- State: Registrations ---

    // --- State: Registrations ---
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, paid, pending
    const [updatingStatusId, setUpdatingStatusId] = useState(null);

    // --- State: Edit Registration ---
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    // College Dropdown State for Edit Modal
    const [adminCollegeSearch, setAdminCollegeSearch] = useState('');
    const [showAdminCollegeDropdown, setShowAdminCollegeDropdown] = useState(false);
    const [filteredAdminColleges, setFilteredAdminColleges] = useState([]);

    // --- State: Delete Registration ---
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // --- State: Payment Confirmation ---
    const [isPaymentConfirmOpen, setIsPaymentConfirmOpen] = useState(false);
    const [paymentConfirmId, setPaymentConfirmId] = useState(null);
    const [paymentConfirmCurrentStatus, setPaymentConfirmCurrentStatus] = useState(null);

    // --- State: Event Rules ---
    const [events, setEvents] = useState([]);
    const [activeTab, setActiveTab] = useState('registrations'); // registrations, rules
    const [isRuleEditOpen, setIsRuleEditOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [ruleForm, setRuleForm] = useState({ rules: [] });
    // --- State: Announcements ---
    const [announcements, setAnnouncements] = useState([]);
    const [announcementForm, setAnnouncementForm] = useState({ title: '', message: '', type: 'general' });
    const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);

    // --- State: Results ---
    const [selectedResultsEvent, setSelectedResultsEvent] = useState('');
    const [winnerSearchTerm, setWinnerSearchTerm] = useState('');
    const [winnerSearchResults, setWinnerSearchResults] = useState([]);
    const [winners, setWinners] = useState([]);
    const [loadingWinners, setLoadingWinners] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;
        if (activeTab === 'registrations') {
            fetchRegistrations();
        } else if (activeTab === 'rules') {
            fetchEvents();
        } else if (activeTab === 'announcements') {
            fetchAnnouncements();
        } else if (activeTab === 'results') {
            fetchEvents();
            fetchWinners();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, isAuthenticated]);

    // Prevent body scroll when any modal is open
    useEffect(() => {
        if (isRuleEditOpen || isEditOpen || isDeleteOpen || isPaymentConfirmOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isRuleEditOpen, isEditOpen, isDeleteOpen, isPaymentConfirmOpen]);







    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-[#141414] border border-white/10 p-8 rounded-2xl shadow-2xl">
                    <h2 className="text-2xl font-bold text-white text-center mb-6">Admin Access</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 outline-none"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 outline-none"
                            />
                        </div>
                        {loginError && <p className="text-red-500 text-xs text-center">{loginError}</p>}
                        <button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition"
                        >
                            Enter Console
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('registrations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRegistrations(data);
        } catch (error) {
            console.error('Error fetching registrations:', error);
            showNotification('Failed to load registrations', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('id');
            if (error) throw error;
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
            showNotification('Failed to load events', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setAnnouncements(data);
        } catch {
            showNotification('Failed to load announcements', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePostAnnouncement = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase.rpc('post_announcement_protected', {
                title: announcementForm.title,
                message: announcementForm.message,
                type: announcementForm.type,
                secret_key: password
            });

            if (error) throw error;

            showNotification('Announcement posted!', 'success');
            setAnnouncementForm({ title: '', message: '', type: 'general' });
            setIsAnnouncementOpen(false);
            fetchAnnouncements();
        } catch (error) {
            console.error(error);
            showNotification('Failed to post: ' + error.message, 'error');
        }
    };

    const deleteAnnouncement = async (id) => {
        try {
            const { error } = await supabase.rpc('delete_announcement_protected', {
                announcement_id: id,
                secret_key: password
            });

            if (error) throw error;

            setAnnouncements(prev => prev.filter(p => p.id !== id));
            showNotification('Deleted announcement', 'info');
        } catch (error) {
            console.error(error);
            showNotification('Failed to delete: ' + error.message, 'error');
        }
    };

    // --- Results Actions ---
    const fetchWinners = async () => {
        setLoadingWinners(true);
        try {
            const { data, error } = await supabase
                .from('winners')
                .select('*, events(title), registrations(full_name, college)');
            if (error) throw error;
            setWinners(data);
        } catch (error) {
            console.error(error);
            showNotification('Failed to load winners', 'error');
        } finally {
            setLoadingWinners(false);
        }
    };

    const handleWinnerSearch = async (term) => {
        setWinnerSearchTerm(term);
        if (term.length < 2) {
            setWinnerSearchResults([]);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('registrations')
                .select('id, full_name, college, department, user_id')
                .ilike('full_name', `%${term}%`)
                .limit(5);

            if (error) throw error;
            setWinnerSearchResults(data);
        } catch (error) {
            console.error(error);
        }
    };

    const declareWinner = async (reg, position) => {
        if (!selectedResultsEvent) {
            showNotification('Please select an event first', 'error');
            return;
        }

        try {
            // 1. Insert Winner via RPC (bypasses RLS)
            const { error: winnerError } = await supabase.rpc('declare_winner_protected', {
                p_event_id: selectedResultsEvent,
                p_registration_id: reg.id,
                p_user_id: reg.user_id,
                p_position: position,
                secret_key: password
            });

            if (winnerError) throw winnerError;

            // 2. Post Announcement
            const eventTitle = events.find(e => e.id == selectedResultsEvent)?.title;
            const message = `Congratulations to ${reg.full_name} from ${reg.college} for securing ${position} place in ${eventTitle}!`;

            await supabase.rpc('post_announcement_protected', {
                title: `Result Announced: ${eventTitle}`,
                message: message,
                type: 'result',
                secret_key: password
            });

            showNotification(`Declared ${reg.full_name} as ${position} Winner!`, 'success');
            setWinnerSearchTerm('');
            setWinnerSearchResults([]);
            fetchWinners();
        } catch (error) {
            console.error(error);
            showNotification('Failed to declare winner: ' + error.message, 'error');
        }
    };

    const deleteWinner = async (id) => {
        try {
            const { error } = await supabase.rpc('delete_winner_protected', {
                p_winner_id: id,
                secret_key: password
            });
            if (error) throw error;
            setWinners(prev => prev.filter(w => w.id !== id));
            showNotification('Removed winner', 'success');
        } catch {
            showNotification('Failed to remove winner', 'error');
        }
    };

    const issueCertificate = async (id) => {
        try {
            const { error } = await supabase.rpc('issue_certificate_protected', {
                p_winner_id: id,
                secret_key: password
            });
            if (error) throw error;
            setWinners(prev => prev.map(w => w.id === id ? { ...w, certificate_issued: true } : w));
            showNotification('Certificate Approved', 'success');
        } catch (error) {
            console.error(error);
            showNotification('Failed to approve certificate', 'error');
        }
    };

    // --- Event Rules Actions ---
    const handleEditRuleClick = (event) => {
        setEditingEvent(event);
        setRuleForm({ ...event });
        setIsRuleEditOpen(true);
    };

    const handleRuleChange = (index, value) => {
        const newRules = [...ruleForm.rules];
        newRules[index] = value;
        setRuleForm({ ...ruleForm, rules: newRules });
    };

    const addRuleLine = () => {
        setRuleForm({ ...ruleForm, rules: [...ruleForm.rules, ""] });
    };

    const removeRuleLine = (index) => {
        const newRules = ruleForm.rules.filter((_, i) => i !== index);
        setRuleForm({ ...ruleForm, rules: newRules });
    };

    const saveEventRules = async () => {
        try {
            const cleanRules = ruleForm.rules.filter(r => r.trim() !== "");

            // Use Secure RPC instead of direct update
            const { error } = await supabase.rpc('update_event_rules_protected', {
                event_id: editingEvent.id,
                new_rules: cleanRules,
                secret_key: password // Pass the local password for verification
            });

            if (error) throw error;

            setEvents(prev => prev.map(ev =>
                ev.id === editingEvent.id ? { ...ev, rules: cleanRules } : ev
            ));
            setIsRuleEditOpen(false);
            setEditingEvent(null);
            showNotification('Rules updated successfully', 'success');
        } catch (error) {
            console.error('Error saving rules:', error);
            showNotification('Failed to save rules: ' + error.message, 'error');
        }
    };

    // --- Registration Actions ---
    const handleTogglePaymentClick = (id, currentStatus) => {
        setPaymentConfirmId(id);
        setPaymentConfirmCurrentStatus(currentStatus);
        setIsPaymentConfirmOpen(true);
    };

    const confirmTogglePayment = async () => {
        if (!paymentConfirmId) return;

        const id = paymentConfirmId;
        const currentStatus = paymentConfirmCurrentStatus;
        const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';

        setIsPaymentConfirmOpen(false);
        setUpdatingStatusId(id);

        try {
            const { error } = await supabase
                .from('registrations')
                .update({ payment_status: newStatus })
                .eq('id', id);

            if (error) throw error;

            setRegistrations(regs => regs.map(r =>
                r.id === id ? { ...r, payment_status: newStatus } : r
            ));
        } catch (error) {
            console.error('Error updating payment status:', error);
            showNotification('Failed to update payment status', 'error');
        } finally {
            setUpdatingStatusId(null);
            setPaymentConfirmId(null);
            setPaymentConfirmCurrentStatus(null);
        }
    };

    const handleDeleteClick = (id) => {
        setDeletingId(id);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;

        try {
            const { error } = await supabase
                .from('registrations')
                .delete()
                .eq('id', deletingId);

            if (error) throw error;

            setRegistrations(regs => regs.filter(r => r.id !== deletingId));
            setIsDeleteOpen(false);
            setDeletingId(null);
        } catch (error) {
            console.error('Error deleting registration:', error);
            showNotification('Failed to delete registration', 'error');
        }
    };

    const handleEditClick = (reg) => {
        setEditingId(reg.id);
        setEditForm({ ...reg });
        setIsEditOpen(true);
        // Initialize dropdown state
        setAdminCollegeSearch(reg.college || '');
        setFilteredAdminColleges(keralaColleges);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const saveEdit = async () => {
        try {
            const { error } = await supabase
                .from('registrations')
                .update({
                    full_name: editForm.full_name,
                    email: editForm.email,
                    phone: editForm.phone,
                    college: editForm.college,
                    department: editForm.department,
                    year: editForm.year,
                    payment_method: editForm.payment_method,
                    total_amount: editForm.total_amount
                })
                .eq('id', editingId);

            if (error) throw error;

            setRegistrations(regs => regs.map(r =>
                r.id === editingId ? { ...r, ...editForm } : r
            ));
            setIsEditOpen(false);
            setEditingId(null);
        } catch (error) {
            console.error('Error updating registration:', error);
            showNotification('Failed to update registration', 'error');
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Inspiro 26 - Registration Report', 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

        const totalRev = registrations.filter(r => r.payment_status === 'paid').reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0);
        const paid = registrations.filter(r => r.payment_status === 'paid').length;
        doc.text(`Total Revenue: Rs ${totalRev}  |  Paid: ${paid}  |  Pending: ${registrations.length - paid}`, 14, 38);

        const tableColumn = ["ID", "Name", "Email", "Phone", "College", "Dept", "Year", "Amount", "Method", "Status"];
        const tableRows = [];

        registrations.forEach(reg => {
            const regData = [
                reg.id,
                reg.full_name,
                reg.email,
                reg.phone,
                reg.college,
                reg.department,
                reg.year,
                reg.total_amount,
                reg.payment_method,
                reg.payment_status === 'paid' ? 'PAID' : 'PENDING'
            ];
            tableRows.push(regData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 45,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [220, 38, 38] },
            alternateRowStyles: { fillColor: [245, 245, 245] }
        });

        doc.save('Inspiro26_Registrations.pdf');
    };

    // --- Calculated Stats ---
    const totalRevenue = registrations.filter(r => r.payment_status === 'paid').reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0);
    const paidCount = registrations.filter(r => r.payment_status === 'paid').length;
    const pendingCount = registrations.filter(r => r.payment_status !== 'paid').length;

    const filteredRegistrations = registrations.filter(reg => {
        const matchesSearch =
            reg.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.college?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.id.toString().includes(searchTerm);

        const matchesFilter =
            statusFilter === 'all' ||
            (statusFilter === 'paid' && reg.payment_status === 'paid') ||
            (statusFilter === 'pending' && reg.payment_status !== 'paid');

        return matchesSearch && matchesFilter;
    });

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#0a0a0a] pt-24 px-4 sm:px-6 lg:px-8 pb-12">
                <div className="max-w-7xl mx-auto">

                    {/* Header & Tabs */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-cinematic font-bold text-white mb-1">
                                Admin <span className="text-red-600">Console</span>
                            </h1>
                            <p className="text-gray-400 text-sm">Manage application data</p>
                            {/* Sign Out Button */}
                            <button
                                onClick={handleLogout}
                                className="text-xs text-red-500 hover:text-red-400 underline uppercase cursor-pointer mt-2"
                            >
                                [Sign Out]
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 bg-[#1a1a1a] p-1 rounded border border-white/10">
                            <button
                                onClick={() => setActiveTab('registrations')}
                                className={`flex-1 min-w-[120px] px-4 py-2 rounded text-sm font-bold transition whitespace-nowrap ${activeTab === 'registrations' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                Registrations
                            </button>
                            <button
                                onClick={() => setActiveTab('rules')}
                                className={`flex-1 min-w-[120px] px-4 py-2 rounded text-sm font-bold transition whitespace-nowrap ${activeTab === 'rules' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                Event Rules
                            </button>
                            <button
                                onClick={() => setActiveTab('announcements')}
                                className={`flex-1 min-w-[120px] px-4 py-2 rounded text-sm font-bold transition whitespace-nowrap ${activeTab === 'announcements' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                Broadcasts
                            </button>
                            <button
                                onClick={() => setActiveTab('results')}
                                className={`flex-1 min-w-[120px] px-4 py-2 rounded text-sm font-bold transition whitespace-nowrap ${activeTab === 'results' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                <div className="flex items-center justify-center gap-1">
                                    <Trophy size={16} /> Results
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('scanner')}
                                className={`flex-1 min-w-[120px] px-4 py-2 rounded text-sm font-bold transition whitespace-nowrap ${activeTab === 'scanner' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                <div className="flex items-center justify-center gap-1">
                                    <QrCode size={16} /> Scanner
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('reports')}
                                className={`flex-1 min-w-[120px] px-4 py-2 rounded text-sm font-bold transition whitespace-nowrap ${activeTab === 'reports' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                <div className="flex items-center justify-center gap-1">
                                    <FileText size={16} /> Analytics
                                </div>
                            </button>
                        </div>
                    </div>


                    {activeTab === 'registrations' && (
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                                {/* ... Stats ... */}
                                <div className="bg-[#1a1a1a] border border-white/10 rounded p-4 flex flex-col justify-center">
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Total Revenue</span>
                                    <span className="text-2xl font-bold text-green-500">₹{totalRevenue.toLocaleString()}</span>
                                </div>
                                <div className="bg-[#1a1a1a] border border-white/10 rounded p-4 flex flex-col justify-center">
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Paid / Confirmed</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-white">{paidCount}</span>
                                        <CheckCircle2 size={16} className="text-green-500" />
                                    </div>
                                </div>
                                <div className="bg-[#1a1a1a] border border-white/10 rounded p-4 flex flex-col justify-center">
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Pending Payment</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-white">{pendingCount}</span>
                                        <Clock size={16} className="text-yellow-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-[#1a1a1a] p-4 rounded border border-white/10">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="relative">
                                        <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="bg-black/50 border border-white/10 rounded pl-10 pr-8 py-2 text-white appearance-none focus:outline-none focus:border-red-600 cursor-pointer"
                                        >
                                            <option value="all">All Registrations</option>
                                            <option value="paid">Paid & Confirmed</option>
                                            <option value="pending">Pending Payment</option>
                                        </select>
                                    </div>
                                    <span className="text-sm text-gray-500 hidden sm:inline">
                                        Showing {filteredRegistrations.length} entries
                                    </span>
                                </div>

                                <div className="flex gap-4 w-full md:w-auto">
                                    <input
                                        type="text"
                                        placeholder="Search by name, college, email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="bg-black/50 border border-white/10 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 w-full md:w-64"
                                    />
                                    <button
                                        onClick={fetchRegistrations}
                                        className="bg-white/5 hover:bg-white/10 text-white p-2 rounded transition"
                                        title="Refresh List"
                                    >
                                        <Loader2 size={20} className={loading ? "animate-spin" : ""} />
                                    </button>
                                    <button
                                        onClick={downloadPDF}
                                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition whitespace-nowrap"
                                    >
                                        <FileText size={18} /> Export PDF
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <div className="text-white text-center py-12 flex flex-col items-center">
                                    <Loader2 size={32} className="animate-spin text-red-600 mb-4" />
                                    <p>Loading registrations...</p>
                                </div>
                            ) : (
                                <div className="bg-[#1a1a1a] rounded-lg overflow-x-auto border border-white/10 shadow-xl">
                                    <table className="w-full text-left text-sm text-gray-300">
                                        <thead className="bg-black/50 text-xs uppercase bg-white/5 text-gray-400">
                                            <tr>
                                                <th className="px-6 py-4">ID</th>
                                                <th className="px-6 py-4">Name / Contact</th>
                                                <th className="px-6 py-4">Details</th>
                                                <th className="px-6 py-4">Payment</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/10">
                                            {filteredRegistrations.map((reg) => (
                                                <tr key={reg.id} className="hover:bg-white/5 transition group">
                                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">#{reg.id}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-white">{reg.full_name}</div>
                                                        <div className="text-xs">{reg.email}</div>
                                                        <div className="text-xs text-gray-500">{reg.phone}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-white">{reg.college}</div>
                                                        <div className="text-xs text-gray-500">{reg.department} • Year {reg.year}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-white font-mono">₹{reg.total_amount}</div>
                                                        <div className="text-[10px] text-gray-400 uppercase">{reg.payment_method}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => handleTogglePaymentClick(reg.id, reg.payment_status)}
                                                            disabled={updatingStatusId === reg.id}
                                                            className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 transition ${reg.payment_status === 'paid'
                                                                ? 'bg-green-500/10 border-green-500/50 text-green-500 hover:bg-green-500/20'
                                                                : 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20'
                                                                } ${updatingStatusId === reg.id ? 'opacity-50 cursor-wait' : ''}`}
                                                        >
                                                            {updatingStatusId === reg.id ? (
                                                                <Loader2 size={12} className="animate-spin" />
                                                            ) : reg.payment_status === 'paid' ? (
                                                                <CheckCircle2 size={12} />
                                                            ) : (
                                                                <Clock size={12} />
                                                            )}
                                                            {reg.payment_status === 'paid' ? 'PAID' : 'PENDING'}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleEditClick(reg)}
                                                                className="p-2 hover:bg-white/10 rounded text-blue-400 transition"
                                                                title="Edit"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(reg.id)}
                                                                className="p-2 hover:bg-white/10 rounded text-red-500 transition"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredRegistrations.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                        No registrations found matching your criteria.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'rules' && (
                        <div className="grid grid-cols-1 gap-6">
                            {loading ? (
                                <div className="text-white text-center py-12 flex flex-col items-center">
                                    <Loader2 size={32} className="animate-spin text-red-600 mb-4" />
                                    <p>Loading events data...</p>
                                </div>
                            ) : (
                                events.map((event) => (
                                    <div key={event.id} className="bg-[#1a1a1a] rounded-lg border border-white/10 p-6 shadow-lg hover:border-red-600/30 transition">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                                                <span className="text-xs text-gray-500 uppercase tracking-wider">Event ID: #{event.id}</span>
                                            </div>
                                            <button
                                                onClick={() => handleEditRuleClick(event)}
                                                className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded transition flex items-center gap-2"
                                            >
                                                <Edit2 size={16} /> Manage Rules
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            {event.rules && event.rules.length > 0 ? (
                                                event.rules.map((rule, idx) => (
                                                    <div key={idx} className="flex gap-3 text-sm text-gray-300">
                                                        <span className="text-red-600 font-mono opacity-60">{(idx + 1).toString().padStart(2, '0')}</span>
                                                        <span>{rule}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 italic text-sm">No rules defined yet.</p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'announcements' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Megaphone className="text-red-600" /> Active Announcements
                                </h2>
                                <button
                                    onClick={() => setIsAnnouncementOpen(true)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold flex items-center gap-2 transition"
                                >
                                    <Plus size={18} /> New Broadcast
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {loading ? (
                                    <div className="col-span-full text-center py-12">
                                        <Loader2 size={32} className="animate-spin text-red-600 mx-auto" />
                                    </div>
                                ) : (
                                    announcements.map((msg) => (
                                        <div key={msg.id} className="bg-[#1a1a1a] border border-white/10 rounded-lg p-6 relative group hover:border-red-600/30 transition">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${msg.type === 'delay' ? 'bg-yellow-500/10 text-yellow-500' :
                                                    msg.type === 'result' ? 'bg-green-500/10 text-green-500' :
                                                        'bg-blue-500/10 text-blue-500'
                                                    }`}>
                                                    {msg.type}
                                                </span>
                                                <button
                                                    onClick={() => deleteAnnouncement(msg.id)}
                                                    className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-2">{msg.title}</h3>
                                            <p className="text-gray-400 text-sm mb-4 leading-relaxed">{msg.message}</p>
                                            <span className="text-xs text-gray-600 flex items-center gap-1">
                                                <Clock size={12} /> {new Date(msg.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                    ))
                                )}
                                {announcements.length === 0 && !loading && (
                                    <div className="col-span-full text-center text-gray-500 py-12 bg-[#1a1a1a]/50 rounded-lg border border-white/5 border-dashed">
                                        No active broadcasts.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'scanner' && (
                        <div>
                            <ScannerContent />
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div>
                            <ReportsContent />
                        </div>
                    )}

                    {activeTab === 'results' && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Declare Winner Section */}
                            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Trophy size={20} className="text-yellow-500" /> Declare New Winner
                                </h3>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-xs text-gray-400 uppercase font-bold">1. Select Event</label>
                                        <select
                                            value={selectedResultsEvent}
                                            onChange={(e) => setSelectedResultsEvent(parseInt(e.target.value))}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-600 outline-none transition [&>option]:bg-black"
                                        >
                                            <option value="">-- Choose Event --</option>
                                            {events.map(ev => (
                                                <option key={ev.id} value={ev.id}>{ev.title}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-4 relative">
                                        <label className="text-xs text-gray-400 uppercase font-bold">2. Search Student</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
                                            <input
                                                type="text"
                                                placeholder="Search by name..."
                                                value={winnerSearchTerm}
                                                onChange={(e) => handleWinnerSearch(e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-red-600 outline-none transition"
                                                disabled={!selectedResultsEvent}
                                            />
                                        </div>

                                        {/* Search Results Dropdown */}
                                        {winnerSearchResults.length > 0 && selectedResultsEvent && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-black border border-white/10 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                                                {winnerSearchResults.map(student => (
                                                    <div key={student.id} className="p-3 hover:bg-white/5 border-b border-white/5 flex justify-between items-center group">
                                                        <div>
                                                            <p className="font-bold text-white">{student.full_name}</p>
                                                            <p className="text-xs text-gray-500">{student.college} • {student.department}</p>
                                                        </div>
                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                                            <button
                                                                onClick={() => declareWinner(student, '1st')}
                                                                className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded border border-yellow-500/50 hover:bg-yellow-500/40"
                                                            >
                                                                1ST
                                                            </button>
                                                            <button
                                                                onClick={() => declareWinner(student, '2nd')}
                                                                className="px-2 py-1 bg-gray-400/20 text-gray-400 text-xs font-bold rounded border border-gray-400/50 hover:bg-gray-400/40"
                                                            >
                                                                2ND
                                                            </button>
                                                            <button
                                                                onClick={() => declareWinner(student, '3rd')}
                                                                className="px-2 py-1 bg-orange-700/20 text-orange-700 text-xs font-bold rounded border border-orange-700/50 hover:bg-orange-700/40"
                                                            >
                                                                3RD
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Leaderboard Table */}
                            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden">
                                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-white">Current Leaderboard</h3>
                                    <button onClick={fetchWinners} className="text-gray-400 hover:text-white transition">
                                        <span className="text-xs uppercase flex items-center gap-1"><Loader2 size={12} className={loadingWinners ? 'animate-spin' : ''} /> Refresh</span>
                                    </button>
                                </div>

                                {loadingWinners ? (
                                    <div className="p-12 text-center text-gray-500">Loading winners...</div>
                                ) : winners.length === 0 ? (
                                    <div className="p-12 text-center text-gray-500">No winners declared yet.</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-black/40 text-xs text-gray-400 uppercase">
                                                    <th className="p-4 border-b border-white/10">Position</th>
                                                    <th className="p-4 border-b border-white/10">Event</th>
                                                    <th className="p-4 border-b border-white/10">Winner</th>
                                                    <th className="p-4 border-b border-white/10">College</th>
                                                    <th className="p-4 border-b border-white/10 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {winners.map(win => (
                                                    <tr key={win.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                                        <td className="p-4">
                                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${win.position === '1st' ? 'bg-yellow-500/20 text-yellow-500' :
                                                                win.position === '2nd' ? 'bg-gray-400/20 text-gray-400' :
                                                                    'bg-orange-700/20 text-orange-700'
                                                                }`}>
                                                                {win.position}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-white font-medium">{win.events?.title}</td>
                                                        <td className="p-4 text-gray-300">{win.registrations?.full_name}</td>
                                                        <td className="p-4 text-gray-500">{win.registrations?.college}</td>
                                                        <td className="p-4 text-right flex items-center justify-end gap-2">
                                                            {!win.certificate_issued ? (
                                                                <button
                                                                    onClick={() => issueCertificate(win.id)}
                                                                    className="text-yellow-500 hover:text-yellow-400 transition p-1 border border-yellow-500/20 rounded hover:bg-yellow-500/10"
                                                                    title="Issue Certificate"
                                                                >
                                                                    <CheckCircle2 size={16} />
                                                                </button>
                                                            ) : (
                                                                <span className="text-green-500 text-[10px] font-bold uppercase border border-green-500/20 px-2 py-1 rounded bg-green-500/10">Issued</span>
                                                            )}
                                                            <button
                                                                onClick={() => deleteWinner(win.id)}
                                                                className="text-gray-500 hover:text-red-500 transition p-1"
                                                                title="Delete Result"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div >

            {/* Post Announcement Modal */}
            {
                isAnnouncementOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-[#1a1a1a] border border-white/10 rounded-lg w-full max-w-lg shadow-2xl overflow-hidden p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">New Broadcast</h2>
                                <button onClick={() => setIsAnnouncementOpen(false)}><X className="text-gray-400 hover:text-white" /></button>
                            </div>
                            <form onSubmit={handlePostAnnouncement} className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-400 uppercase block mb-2">Type</label>
                                    <div className="flex gap-2">
                                        {['general', 'delay', 'result'].map(t => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setAnnouncementForm({ ...announcementForm, type: t })}
                                                className={`flex-1 py-2 rounded text-sm capitalize border ${announcementForm.type === t
                                                    ? 'bg-red-600 border-red-600 text-white'
                                                    : 'bg-black/30 border-white/10 text-gray-400 hover:border-white/30'
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase block mb-2">Title</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-red-600 outline-none"
                                        placeholder="e.g., Gaming Event Delayed"
                                        required
                                        value={announcementForm.title}
                                        onChange={e => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase block mb-2">Message</label>
                                    <textarea
                                        className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-red-600 outline-none h-32 resize-none"
                                        placeholder="Enter your message here..."
                                        required
                                        value={announcementForm.message}
                                        onChange={e => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded flex items-center justify-center gap-2">
                                    <Send size={18} /> Broadcast Now
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }


            {/* Edit Rules Modal */}
            {
                isRuleEditOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div
                            className="bg-[#1a1a1a] border border-white/10 rounded-lg w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50">
                                <div>
                                    <h2 className="text-xl font-bold text-white">Manage Event Rules</h2>
                                    <p className="text-sm text-gray-400">{editingEvent?.title}</p>
                                </div>
                                <button onClick={() => setIsRuleEditOpen(false)} className="text-gray-400 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1">
                                <div className="space-y-4">
                                    {ruleForm.rules.map((rule, index) => (
                                        <div key={index} className="flex gap-3 items-start group">
                                            <span className="text-red-600 font-mono py-2 opacity-50">{(index + 1).toString().padStart(2, '0')}</span>
                                            <textarea
                                                value={rule}
                                                onChange={(e) => handleRuleChange(index, e.target.value)}
                                                placeholder="Enter rule text here..."
                                                rows={2}
                                                className="flex-1 bg-black/30 border border-white/10 rounded p-3 text-white text-sm focus:border-red-600 focus:bg-black/80 outline-none transition resize-none"
                                            />
                                            <button
                                                onClick={() => removeRuleLine(index)}
                                                className="p-2 text-gray-500 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                                                title="Remove Rule"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        onClick={addRuleLine}
                                        className="w-full border border-dashed border-white/10 rounded-lg p-3 text-gray-400 hover:text-white hover:border-red-600/50 hover:bg-red-600/5 transition flex items-center justify-center gap-2 text-sm mt-4"
                                    >
                                        <Plus size={16} /> Add New Rule
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-black/50">
                                <button
                                    onClick={() => setIsRuleEditOpen(false)}
                                    className="px-4 py-2 rounded text-gray-400 hover:text-white transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveEventRules}
                                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded flex items-center gap-2 transition"
                                >
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Edit Registration Modal */}

            {
                isEditOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div
                            className="bg-[#1a1a1a] border border-white/10 rounded-lg w-full max-w-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">Edit Registration</h2>
                                <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 uppercase">Full Name</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={editForm.full_name || ''}
                                        onChange={handleEditChange}
                                        className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-red-600 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 uppercase">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editForm.email || ''}
                                        onChange={handleEditChange}
                                        className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-red-600 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 uppercase">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={editForm.phone || ''}
                                        onChange={handleEditChange}
                                        className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-red-600 outline-none"
                                    />
                                </div>
                                <div className="space-y-2 relative">
                                    <label className="text-xs text-gray-400 uppercase">College</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="college"
                                            value={editForm.college || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                handleEditChange(e);
                                                setAdminCollegeSearch(value);
                                                setShowAdminCollegeDropdown(true);
                                                setFilteredAdminColleges(
                                                    keralaColleges.filter(c =>
                                                        c.toLowerCase().includes(value.toLowerCase())
                                                    )
                                                );
                                            }}
                                            onFocus={() => {
                                                setShowAdminCollegeDropdown(true);
                                                setFilteredAdminColleges(
                                                    keralaColleges.filter(c =>
                                                        c.toLowerCase().includes((editForm.college || '').toLowerCase())
                                                    )
                                                );
                                            }}
                                            className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-red-600 outline-none"
                                            autoComplete="off"
                                        />
                                        {showAdminCollegeDropdown && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-white/10 rounded-lg shadow-xl max-h-40 overflow-y-auto z-[60] custom-scrollbar">
                                                {filteredAdminColleges.length > 0 ? (
                                                    filteredAdminColleges.map((college, idx) => (
                                                        <div
                                                            key={idx}
                                                            onClick={() => {
                                                                setEditForm(prev => ({ ...prev, college: college }));
                                                                setAdminCollegeSearch(college);
                                                                setShowAdminCollegeDropdown(false);
                                                            }}
                                                            className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm text-gray-300 border-b border-white/5 last:border-none"
                                                        >
                                                            {college}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-2 text-sm text-gray-500">
                                                        No matches found.
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditForm(prev => ({ ...prev, college: adminCollegeSearch }));
                                                                setShowAdminCollegeDropdown(false);
                                                            }}
                                                            className="block mt-1 text-red-500 hover:text-red-400 text-xs font-bold uppercase"
                                                        >
                                                            Use "{adminCollegeSearch}" anyway
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {/* Overlay to close dropdown on outside click */}
                                    {showAdminCollegeDropdown && (
                                        <div
                                            className="fixed inset-0 z-[55]"
                                            onClick={() => setShowAdminCollegeDropdown(false)}
                                        ></div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 uppercase">Department</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={editForm.department || ''}
                                        onChange={handleEditChange}
                                        className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-red-600 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 uppercase">Year</label>
                                    <input
                                        type="text"
                                        name="year"
                                        value={editForm.year || ''}
                                        onChange={handleEditChange}
                                        className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-red-600 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 uppercase">Payment Method</label>
                                    <select
                                        name="payment_method"
                                        value={editForm.payment_method || ''}
                                        onChange={handleEditChange}
                                        className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-red-600 outline-none [&>option]:bg-black"
                                    >
                                        <option value="college">Pay at College</option>
                                        <option value="online">Online</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 uppercase">Total Amount</label>
                                    <input
                                        type="number"
                                        name="total_amount"
                                        value={editForm.total_amount || ''}
                                        onChange={handleEditChange}
                                        className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-red-600 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsEditOpen(false)}
                                    className="px-4 py-2 rounded text-gray-400 hover:text-white transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveEdit}
                                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded flex items-center gap-2 transition"
                                >
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Payment Confirmation Modal */}
            {
                isPaymentConfirmOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div
                            className="bg-[#1a1a1a] border border-white/10 rounded-lg w-full max-w-sm shadow-2xl p-6 text-center"
                        >
                            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="text-blue-500 w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Change Payment Status?</h3>
                            <p className="text-gray-400 mb-6 text-sm">
                                You are about to change the status from
                                <span className={paymentConfirmCurrentStatus === 'paid' ? ' text-green-500 font-bold mx-1' : ' text-yellow-500 font-bold mx-1'}>
                                    {paymentConfirmCurrentStatus === 'paid' ? 'PAID' : 'PENDING'}
                                </span>
                                to
                                <span className={paymentConfirmCurrentStatus === 'paid' ? ' text-yellow-500 font-bold mx-1' : ' text-green-500 font-bold mx-1'}>
                                    {paymentConfirmCurrentStatus === 'paid' ? 'PENDING' : 'PAID'}
                                </span>.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setIsPaymentConfirmOpen(false)}
                                    className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-white transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmTogglePayment}
                                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center gap-2"
                                >
                                    Confirm Change
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Delete Modal */}
            {
                isDeleteOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div
                            className="bg-[#1a1a1a] border border-red-500/30 rounded-lg w-full max-w-sm shadow-2xl p-6 text-center"
                        >
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="text-red-500 w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete Registration?</h3>
                            <p className="text-gray-400 mb-6 text-sm">
                                This action cannot be undone. The registration record will be permanently removed.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setIsDeleteOpen(false)}
                                    className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-white transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-bold transition flex items-center gap-2"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

        </>
    );
};

export default Admin;
