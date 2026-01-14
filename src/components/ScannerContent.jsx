import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Loader2, CheckCircle2, User, Calendar, AlertTriangle, Utensils, Search, XCircle } from 'lucide-react';
import { useNotification } from '../components/NotificationProvider';

const ScannerContent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [userData, setUserData] = useState(null);
    const [searchResults, setSearchResults] = useState([]); // For multiple name matches
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { showNotification } = useNotification();

    const [mode, setMode] = useState('food'); // 'food' or 'event'
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase.from('events').select('*');
            if (error) throw error;
            setEvents(data || []);
        } catch (err) {
            console.error('Error fetching events:', err);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError(null);
        setUserData(null);
        setSearchResults([]);

        try {
            let query = supabase.from('registrations').select('*');
            let input = searchQuery.trim();

            // Check if input is in "Name [ID]" format (from datalist selection)
            const bracketMatch = input.match(/\[(.*?)\]$/);
            if (bracketMatch) {
                const extractedId = bracketMatch[1];
                query = query.eq('id', extractedId);
            } else {
                // Heuristic: If input is purely numeric or starts with specific prefixes, treat as ID
                // Otherwise treat as Name
                const isIdLike = /^(REG-|GUEST-)?\d+$/.test(input) || /^[0-9a-fA-F-]{36}$/.test(input); // numeric or UUID-ish

                if (isIdLike) {
                    let searchId = input;
                    if (input.startsWith('REG-')) searchId = input.replace('REG-', '');
                    else if (input.startsWith('GUEST-')) searchId = input.replace('GUEST-', '');

                    query = query.eq('id', searchId);
                } else {
                    // Search by name (case insensitive partial match)
                    query = query.ilike('full_name', `%${input}%`);
                }
            }

            const { data, error } = await query;

            if (error) throw error;

            if (!data || data.length === 0) {
                throw new Error('User not found');
            }

            if (data.length === 1) {
                setUserData(data[0]);
                showNotification('User found!', 'success');
            } else {
                // Multiple matches found (likely by name)
                setSearchResults(data);
                showNotification(`Found ${data.length} users matching "${input}"`, 'info');
            }

        } catch (err) {
            console.error(err);
            setError('User not found or invalid ID.');
            showNotification('Search failed or user not found', 'error');
        } finally {
            setLoading(false);
        }
    };

    const [allRegistrations, setAllRegistrations] = useState([]);

    useEffect(() => {
        const fetchRegistrations = async () => {
            const { data } = await supabase
                .from('registrations')
                .select('id, full_name, email, meals_redeemed, selected_events')
                .order('full_name');
            if (data) setAllRegistrations(data);
        };
        fetchRegistrations();
    }, []);

    const handleInputChange = async (e) => {
        const val = e.target.value;
        setSearchQuery(val);

        // Check if value matches "Name [ID]" format from datalist
        const match = val.match(/\[(.*?)\]$/);
        if (match) {
            const extractedId = match[1];
            // Fetch full user details to get year, department, etc.
            try {
                setLoading(true);
                // eslint-disable-next-line eqeqeq
                const { data } = await supabase
                    .from('registrations')
                    .select('*')
                    .eq('id', extractedId)
                    .single();

                if (data) {
                    selectUserConfig(data);
                }
            } catch (err) {
                console.error("Error fetching user details:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    const selectUserConfig = (user) => {
        setUserData(user);
        setSearchResults([]); // Clear list once selected
    };

    const redeemMeal = async (mealType) => {
        if (!userData) return;
        try {
            const currentMeals = userData.meals_redeemed || { lunch: false, refreshment: false, dinner: false };
            if (currentMeals[mealType]) { // Check if already redeemed
                showNotification('Already Redeemed!', 'error');
                return;
            }

            const updatedMeals = { ...currentMeals, [mealType]: true };

            const { error } = await supabase
                .from('registrations')
                .update({ meals_redeemed: updatedMeals })
                .eq('id', userData.id);

            if (error) throw error;
            setUserData({ ...userData, meals_redeemed: updatedMeals });
            showNotification(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)} redeemed!`, 'success');
        } catch (error) {
            console.error('Error redeeming meal:', error);
            showNotification('Failed to redeem meal', 'error');
        }
    };

    const verifyEventParticipation = async () => {
        if (!userData || !selectedEventId) return;

        // userData.selected_events seems to be the array of IDs
        const selectedEventIdNum = parseInt(selectedEventId);
        const userEvents = userData.selected_events || [];

        // Check if user has this event OR has all_access pass
        if (userEvents.includes('all_access') || userEvents.includes(selectedEventIdNum) || userEvents.includes(selectedEventId)) {
            try {
                // Check for existing verification
                const { data: existing } = await supabase
                    .from('event_attendance')
                    .select('id')
                    .eq('registration_id', userData.id)
                    .eq('event_id', selectedEventIdNum)
                    .single();

                if (existing) {
                    showNotification('User ALREADY verified for this event!', 'warning');
                    return;
                }

                // Log attendance
                const { error } = await supabase
                    .from('event_attendance')
                    .insert([
                        {
                            registration_id: userData.id,
                            event_id: selectedEventIdNum,
                            verified_by: 'admin' // Simple logging
                        }
                    ]);

                if (error) {
                    console.error('Error logging attendance:', error);
                    // We don't block verification on log error, but good to know
                }

                showNotification('Verified: User is registered for this event.', 'success');
            } catch (err) {
                console.error('Error logging attendance:', err);
                showNotification('Verified (Log failed)', 'warning');
            }
        } else {
            showNotification('Access Denied: User NOT registered for this event.', 'error');
        }
    };

    return (
        <div className="max-w-lg mx-auto p-4 border border-dashed border-white/20 rounded-xl relative">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Search className="text-red-500" /> User Check-in
            </h2>

            {/* Mode Switcher */}
            <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-lg border border-white/10">
                <button
                    onClick={() => setMode('food')}
                    className={`flex-1 py-2 rounded-md font-bold transition text-sm flex items-center justify-center gap-2 ${mode === 'food' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <Utensils size={16} /> Food
                </button>
                <button
                    onClick={() => setMode('event')}
                    className={`flex-1 py-2 rounded-md font-bold transition text-sm flex items-center justify-center gap-2 ${mode === 'event' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <Calendar size={16} /> Event
                </button>
            </div>

            {/* Event Selector */}
            {mode === 'event' && (
                <div className="mb-6 animate-fade-in">
                    <select
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(e.target.value)}
                        className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:border-red-600 outline-none [&>option]:bg-black"
                    >
                        <option value="">-- Select Event to Verify --</option>
                        {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                    </select>
                </div>
            )}

            {/* ERROR DISPLAY */}
            {error && (
                <div className="bg-red-900/50 border border-red-500 text-white p-3 rounded mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <AlertTriangle size={16} /> {error}
                    </span>
                    <button onClick={() => setError(null)}><XCircle size={16} /></button>
                </div>
            )}

            {/* SEARCH INPUT */}
            {!userData && (
                <div className="mb-6">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                list="students-list"
                                type="text"
                                placeholder="Search Name or ID..."
                                className="w-full bg-black/50 border border-white/20 rounded-lg p-3 pl-10 text-white focus:border-red-600 outline-none transition-all placeholder:text-gray-600"
                                value={searchQuery}
                                onChange={handleInputChange}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />

                            <datalist id="students-list">
                                {allRegistrations.map(reg => (
                                    <option key={reg.id} value={`${reg.full_name} [${reg.id}]`}>
                                        {reg.email}
                                    </option>
                                ))}
                            </datalist>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 rounded-lg font-bold transition disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'GO'}
                        </button>
                    </form>
                </div>
            )}



            {/* MULTIPLE RESULTS LIST */}
            {
                searchResults.length > 0 && !userData && (
                    <div className="bg-[#141414] border border-white/20 rounded-xl p-4 mb-6 max-h-60 overflow-y-auto">
                        <h3 className="text-gray-400 text-sm mb-2">Select a user:</h3>
                        <div className="space-y-2">
                            {searchResults.map(user => (
                                <button
                                    key={user.id}
                                    onClick={() => selectUserConfig(user)}
                                    className="w-full text-left p-3 hover:bg-white/5 rounded border border-transparent hover:border-white/10 transition flex justify-between items-center"
                                >
                                    <div>
                                        <p className="font-bold text-white">{user.full_name}</p>
                                        <p className="text-xs text-gray-500">{user.college}</p>
                                    </div>
                                    <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded">#{user.id}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )
            }

            {/* USER RESULT CARD */}
            {
                userData && (
                    <div className="bg-[#141414] border border-white/20 rounded-xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 relative">
                        <button
                            onClick={() => { setUserData(null); setSearchQuery(''); setSearchResults([]); }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <XCircle size={24} />
                        </button>

                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">{userData.full_name}</h2>
                                <p className="text-gray-400 text-sm">{userData.college}</p>
                                <p className="text-xs text-gray-500 font-mono mt-1">ID: REG-{userData.id}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${userData.payment_status === 'paid' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                {userData.payment_status}
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-2 text-gray-400 mb-4">
                                <User size={16} />
                                <span>
                                    {userData.year ? `${userData.year} Year` : 'Year Not Set'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <Calendar size={16} className="text-red-500" />
                                <span>Events: {Array.isArray(userData.selected_events) ? userData.selected_events.join(', ') : 'None'}</span>
                            </div>
                        </div>

                        {/* ACTIONS BASED ON MODE */}
                        <div className="pt-6 border-t border-white/10">
                            {mode === 'food' ? (
                                userData.payment_status === 'paid' ? (
                                    <div>
                                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                            <Utensils size={18} className="text-yellow-500" /> Meal Coupons
                                        </h3>
                                        <div className="space-y-3">
                                            {['lunch', 'refreshment', 'dinner'].map(meal => (
                                                <div key={meal} className="flex justify-between items-center p-3 bg-black/40 rounded border border-white/5">
                                                    <span className="capitalize font-bold">{meal}</span>
                                                    {userData.meals_redeemed?.[meal] ? (
                                                        <span className="text-xs bg-red-900/50 text-red-500 px-3 py-1 rounded font-bold border border-red-500/20">REDEEMED</span>
                                                    ) : (
                                                        <button onClick={() => redeemMeal(meal)} className="bg-yellow-600 hover:bg-yellow-500 text-black px-4 py-1.5 rounded text-sm font-bold transition">
                                                            Redeem
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-red-500 font-bold p-4 bg-red-500/10 rounded border border-red-500/20">
                                        Payment Pending - No Meals Allowed
                                    </div>
                                )
                            ) : (
                                // EVENT MODE
                                <div>
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <Calendar size={18} className="text-blue-500" /> Event Verification
                                    </h3>
                                    {selectedEventId ? (
                                        <button
                                            onClick={verifyEventParticipation}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                                        >
                                            <CheckCircle2 size={18} /> Verify for Selected Event
                                        </button>
                                    ) : (
                                        <div className="text-center text-yellow-500 p-3 bg-yellow-500/10 rounded border border-yellow-500/20">
                                            Please select an event above to verify.
                                        </div>
                                    )}
                                </div>
                            )}

                            <button onClick={() => { setUserData(null); setSearchQuery(''); setSearchResults([]); }} className="w-full mt-4 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-lg transition">
                                Close / Check Next
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ScannerContent;
