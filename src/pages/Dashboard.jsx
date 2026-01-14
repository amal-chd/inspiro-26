import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Calendar, Bell, Loader2, Clock, Download, Utensils, Trophy } from 'lucide-react';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { useNotification } from '../components/NotificationProvider';
import principalSignature from '../assets/signatures/principal.png';
import coordinatorSignature from '../assets/signatures/coordinator.jpg';

const getBase64ImageFromUrl = async (imageUrl) => {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};


const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [registration, setRegistration] = useState(null);
    const [winnings, setWinnings] = useState([]);
    const navigate = useNavigate();

    // Announcements
    const [announcements, setAnnouncements] = useState([]);
    const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Supabase Auth User
                setUser(user);

                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();
                setProfile(profileData);

                const { data: regData } = await supabase
                    .from('registrations')
                    .select('*')
                    .eq('user_id', user.id)
                    .maybeSingle();
                setRegistration(regData);

            } else {
                // Check for Local Storage Registration
                const localReg = localStorage.getItem('userRegistration');
                if (localReg) {
                    const parsedReg = JSON.parse(localReg);

                    // Optimistically set data first
                    setRegistration(parsedReg);
                    setProfile({
                        full_name: parsedReg.full_name,
                        id: 'GUEST-' + parsedReg.id,
                        qr_code_id: 'REG-' + parsedReg.id
                    });
                    setUser({ email: parsedReg.email });

                    // Re-fetch fresh data from server to catch status changes
                    const { data: freshReg } = await supabase
                        .from('registrations')
                        .select('*')
                        .eq('id', parsedReg.id)
                        .maybeSingle();

                    if (freshReg) {
                        setRegistration(freshReg);
                        // Update local storage to keep it fresh
                        localStorage.setItem('userRegistration', JSON.stringify(freshReg));
                    }
                } else {
                    // No access
                    navigate('/login');
                }
            }
        };
        fetchUser();
    }, [navigate]);

    // Fetch winnings
    // Fetch winnings
    useEffect(() => {
        const fetchWinnings = async () => {
            console.log('Fetching winnings...', { user, registration });
            let query = supabase.from('winners').select('*, events(title)');

            if (user?.id) {
                console.log('Querying by user_id:', user.id);
                query = query.eq('user_id', user.id);
            } else if (registration?.id) {
                console.log('Querying by registration_id:', registration.id);
                query = query.eq('registration_id', registration.id);
            } else {
                console.log('No user or registration ID found. Aborting fetch.');
                return;
            }

            const { data, error } = await query;
            if (error) console.error('Error fetching winnings:', error);
            if (data) {
                console.log('Winnings fetched:', data);
                setWinnings(data);
            }
        };

        if (user || (registration && registration.id)) {
            fetchWinnings();
        }
    }, [user, registration]);

    // Fetch announcements separately
    useEffect(() => {
        const fetchAnnouncements = async () => {
            const { data } = await supabase
                .from('announcements')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);
            if (data) setAnnouncements(data);
            setLoadingAnnouncements(false);
        };
        fetchAnnouncements();

        // Realtime subscription
        const channel = supabase
            .channel('public:announcements')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'announcements' }, (payload) => {
                setAnnouncements(prev => [payload.new, ...prev]);
                showNotification(`New Announcement: ${payload.new.title}`, 'info');
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [showNotification]);

    const downloadCertificate = async (type = 'participation', winData = null) => {
        if (!registration || registration.payment_status !== 'paid') {
            showNotification('Registration not confirmed or payment pending', 'error');
            return;
        }

        try {
            const doc = new jsPDF('landscape', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const centerX = pageWidth / 2;

            const isMerit = type === 'merit';

            // Safety check for Merit certificate
            if (isMerit && (!winData || !winData.events)) {
                console.error("Missing winData for Merit Certificate", winData);
                showNotification('Error generating certificate: Missing event data', 'error');
                return;
            }

            // --- Colors & Fonts ---
            const goldColor = [197, 160, 93]; // Luxurious Gold
            const darkGoldColor = [139, 108, 51]; // Darker Gold for accents
            const redColor = [185, 28, 28]; // Deep Red
            const textColor = [40, 40, 40]; // Dark Grey Text
            const bgPatternColor = [252, 252, 250]; // Off-white/Cream Paper background

            // --- Background ---
            doc.setFillColor(...bgPatternColor);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');

            // --- Border Design ---
            // 1. Thick Outer Border
            doc.setDrawColor(...(isMerit ? goldColor : [50, 50, 50]));
            doc.setLineWidth(2);
            doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

            // 2. Inner Decorative Border
            doc.setDrawColor(...(isMerit ? darkGoldColor : redColor));
            doc.setLineWidth(0.5);
            doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

            // 3. Corner Ornaments (Simple geometric for professional look)
            const cornerSize = 15;
            doc.setDrawColor(...(isMerit ? goldColor : [50, 50, 50]));
            doc.setLineWidth(1);

            // Draw Corners Function
            const drawCorner = (x, y, rotate = 0) => {
                const len = 10;
                doc.line(x, y, x + (rotate === 0 || rotate === 3 ? len : -len), y); // Horizontal
                doc.line(x, y, x, y + (rotate === 0 || rotate === 1 ? len : -len)); // Vertical
            };

            // Top-Left
            drawCorner(18, 18, 0);
            // Top-Right
            drawCorner(pageWidth - 18, 18, 3);
            // Bottom-Right
            drawCorner(pageWidth - 18, pageHeight - 18, 2);
            // Bottom-Left
            drawCorner(18, pageHeight - 18, 1);


            // --- Content ---

            // Logo Placeholder / Event Title Setup
            const titleY = 40; // Moved up from 50

            // Main Title
            doc.setFont('times', 'bold');
            doc.setFontSize(isMerit ? 42 : 36);
            doc.setTextColor(...(isMerit ? goldColor : [30, 30, 30]));
            doc.text('CERTIFICATE', centerX, titleY, { align: 'center', charSpace: 2 });

            // Subtitle
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(14);
            doc.setTextColor(100, 100, 100);
            doc.text(isMerit ? 'OF EXCELLENCE' : 'OF PARTICIPATION', centerX, titleY + 10, { align: 'center' });

            // "Presented to" text
            doc.setFont('times', 'italic');
            doc.setFontSize(14);
            doc.setTextColor(80, 80, 80);
            doc.text('This is proudly presented to', centerX, 70, { align: 'center' }); // Moved up from 85

            // Candidate Name
            doc.setFont('times', 'bolditalic');
            doc.setFontSize(isMerit ? 40 : 36);
            doc.setTextColor(...(isMerit ? [185, 28, 28] : [0, 0, 0]));
            doc.text(registration.full_name, centerX, 90, { align: 'center' }); // Moved up from 105

            // Underline for name
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.2);
            const nameWidth = doc.getTextWidth(registration.full_name);
            doc.line(centerX - (nameWidth / 2) - 10, 93, centerX + (nameWidth / 2) + 10, 93);

            // College Info
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(14);
            doc.setTextColor(100, 100, 100);
            doc.text(`of ${registration.college}`, centerX, 105, { align: 'center' }); // Moved up from 120


            // Context / Body Text
            doc.setFont('times', 'normal');
            doc.setFontSize(14);
            doc.setTextColor(60, 60, 60);

            let eventTextY = 125; // Base Y for body text

            if (isMerit && winData) {
                const eventTitle = winData.events?.title || 'Unknown Event';
                // Split for layouts
                doc.text(`for securing`, centerX, 125, { align: 'center' });

                // Position
                doc.setFont('times', 'bold');
                doc.setFontSize(18);
                doc.setTextColor(...goldColor);
                doc.text(`${winData.position} Place`, centerX, 135, { align: 'center' });

                // Event
                doc.setFont('times', 'normal');
                doc.setFontSize(14);
                doc.setTextColor(60, 60, 60);
                doc.text(`in the event '${eventTitle}' during`, centerX, 145, { align: 'center' });
                eventTextY = 145;
            } else {
                const bodyText = 'for their active participation and enthusiastic presence during';
                doc.text(bodyText, centerX, 130, { align: 'center' });
                eventTextY = 130;
            }

            // Inspiro 26 Title
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(24);
            doc.setTextColor(...redColor);
            doc.text('INSPIRO 26', centerX, eventTextY + 15, { align: 'center' });

            // Tagline
            const tagline = 'A NATIONAL LEVEL IT FEST';
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(120, 120, 120);
            doc.text(tagline, centerX, eventTextY + 22, { align: 'center' });


            // --- Footer ---
            const footerY = pageHeight - 25; // 185mm



            // --- Signatures ---
            const sigY = footerY;

            try {
                // Load Signatures
                const principalImgData = await getBase64ImageFromUrl(principalSignature);
                const coordinatorImgData = await getBase64ImageFromUrl(coordinatorSignature);

                // Coordinator (Left)
                // Position: Above the "Event Coordinator" text
                // Text is at sigY + 5. Image should be above.
                // Image ratio preservation is good practice but we can fit to box.
                // Assuming sigY is the line y-position (~272).
                // "Desny" seems taller than wide in aspect, or square-ish.
                // Let's assure a reasonable width, e.g., 30-40mm.
                doc.addImage(coordinatorImgData, 'JPEG', 45, sigY - 15, 40, 20); // x, y, w, h
                doc.text('Event Coordinator', 65, sigY + 5, { align: 'center' });


                // Principal (Right)
                // The image includes "Principal", stamp, and signature.
                // So we do NOT draw the text "Principal" manually.
                // We align the image so the text "Principal" (inside image) is roughly where the text was.
                // Previous text was at x: 297 - 65 = 232.
                // Image should be centered around 232.
                // Image is wide. Let's give it solid width.
                // Moved down slightly as requested (sigY - 25 -> sigY - 20)
                doc.addImage(principalImgData, 'PNG', pageWidth - 90, sigY - 20, 50, 25);

            } catch (imgError) {
                console.error("Error loading signatures:", imgError);
                // Fallback to lines if images fail? Or just leave blank.
                doc.setDrawColor(50, 50, 50);
                doc.setLineWidth(0.5);
                doc.line(40, sigY, 90, sigY);
                doc.text('Event Coordinator', 65, sigY + 5, { align: 'center' });
                doc.line(pageWidth - 90, sigY, pageWidth - 40, sigY);
                doc.text('Principal', pageWidth - 65, sigY + 5, { align: 'center' });
            }


            // --- QR Code ---
            try {
                // Generate QR Code
                const verifyUrl = `https://inspiro26itfest.vercel.app/verify?id=${registration.id}&type=${type}`;
                const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 100, color: { dark: '#000000', light: '#00000000' } });

                // Place Top Right
                const qrSize = 25;
                const qrX = pageWidth - 45; // 297 - 45 = 252
                const qrY = 25;

                doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

                // Verify Text
                doc.setFontSize(7);
                doc.setTextColor(150, 150, 150);
                doc.text('Scan to Verify', qrX + (qrSize / 2), qrY + qrSize + 3, { align: 'center' });
                doc.text(registration.id, qrX + (qrSize / 2), qrY + qrSize + 6, { align: 'center' });
            } catch (qrError) {
                console.warn('QR Code generation failed:', qrError);
                // Continue without QR if it fails
            }

            // Save File
            const fileName = isMerit
                ? `Inspiro26_Merit_${winData?.position || 'Winner'}_${registration.full_name.replace(/\s+/g, '_')}.pdf`
                : `Inspiro26_Participation_${registration.full_name.replace(/\s+/g, '_')}.pdf`;

            doc.save(fileName);
            showNotification('Certificate generated successfully', 'success');

        } catch (error) {
            console.error('Certificate Generation Error:', error);
            showNotification(`Failed to generate PDF: ${error.message || error}`, 'error');
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('userRegistration'); // Clear local session
        showNotification('Logged out successfully', 'info');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
            <Navbar />
            <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">

                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <div>
                        <h1 className="text-3xl font-cinematic font-bold">
                            Welcome, <span className="text-red-600">{profile?.full_name || user?.email || 'Agent'}</span>
                        </h1>
                        <p className="text-gray-400 text-sm">Dashboard & Mission Control</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-2 px-4 py-2 rounded-full border border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-300 text-sm font-medium tracking-wide"
                    >
                        <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span>SIGNOUT</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Col: ID Card & QR */}
                    <div className="space-y-8">
                        <div className="bg-[#141414] border border-white/10 rounded-xl p-6 shadow-2xl relative overflow-hidden group">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <User size={20} className="text-red-600" /> Digital ID
                            </h3>
                            <div className="bg-white p-8 rounded-lg flex flex-col items-center justify-center mb-4 min-h-[200px]">
                                {registration?.id ? (
                                    <div className="text-center">
                                        <p className="text-black font-bold text-lg mb-2 uppercase tracking-widest">USER ID</p>
                                        <h2 className="text-5xl font-black text-red-600 font-mono tracking-tighter">
                                            {registration.id}
                                        </h2>
                                        <p className="text-gray-500 font-mono text-sm mt-2">
                                            REG-{registration.id}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center text-black">
                                        <Loader2 className="animate-spin" size={32} />
                                    </div>
                                )}
                            </div>
                            <p className="text-center text-xs text-gray-500 font-mono">ID: {profile?.id?.slice(0, 8)}...</p>
                        </div>

                        {/* Food Coupon Section - Only for Paid Users */}
                        {registration?.payment_status === 'paid' && (
                            <div className="bg-[#1a1a1a] border border-green-900/30 rounded-xl p-6 relative overflow-hidden">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-500">
                                    <Utensils size={20} /> Food Pass
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-black/40 rounded border border-white/5">
                                        <span className="text-sm font-bold">Lunch</span>
                                        {registration.meals_redeemed?.lunch ? (
                                            <span className="text-xs bg-red-900/50 text-red-500 px-2 py-1 rounded border border-red-500/30">Redeemed</span>
                                        ) : (
                                            <span className="text-xs bg-green-900/50 text-green-500 px-2 py-1 rounded border border-green-500/30">Available</span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-black/40 rounded border border-white/5">
                                        <span className="text-sm font-bold">Refreshment</span>
                                        {registration.meals_redeemed?.refreshment ? (
                                            <span className="text-xs bg-red-900/50 text-red-500 px-2 py-1 rounded border border-red-500/30">Redeemed</span>
                                        ) : (
                                            <span className="text-xs bg-green-900/50 text-green-500 px-2 py-1 rounded border border-green-500/30">Available</span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-black/40 rounded border border-white/5">
                                        <span className="text-sm font-bold">Dinner</span>
                                        {registration.meals_redeemed?.dinner ? (
                                            <span className="text-xs bg-red-900/50 text-red-500 px-2 py-1 rounded border border-red-500/30">Redeemed</span>
                                        ) : (
                                            <span className="text-xs bg-green-900/50 text-green-500 px-2 py-1 rounded border border-green-500/30">Available</span>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4 text-[10px] text-gray-500 text-center">
                                    Show your Digital ID at the food counter.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Col: Events & Announcements */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Registered Events */}
                        <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Calendar size={20} className="text-red-600" /> My Missions
                            </h3>

                            {registration ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-lg mb-1">{registration.college}</h4>
                                                <p className="text-sm text-gray-400">{registration.year} Year, {registration.department}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${registration.payment_status === 'paid' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                                    {registration.payment_status === 'paid' ? 'CONFIRMED' : 'PAYMENT PENDING'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <p className="text-sm font-bold text-gray-400 mb-2">Selected Events:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {Array.isArray(registration.selected_events) && registration.selected_events.map(ev => (
                                                    <span key={ev} className="px-2 py-1 bg-red-900/20 text-red-500 text-xs rounded border border-red-500/30">
                                                        {ev.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {registration.payment_status === 'paid' && (
                                        <button
                                            onClick={() => downloadCertificate('participation')}
                                            className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded flex items-center justify-center gap-2 transition text-sm font-bold"
                                        >
                                            <Download size={16} /> Participation Certificate
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-400 mb-4">You have not registered for any events yet.</p>
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="bg-[#E50914] hover:bg-[#b00710] text-white px-6 py-2 rounded font-bold transition"
                                    >
                                        Register Now
                                    </button>
                                </div>
                            )}
                        </div>



                        {/* Awards & Certificates */}
                        {winnings.length > 0 && (
                            <div className="bg-[#141414] border border-yellow-500/30 rounded-xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Trophy size={64} className="text-yellow-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-yellow-500">
                                    <Trophy size={20} /> Achievements
                                </h3>
                                <div className="space-y-3">
                                    {winnings.map((win) => (
                                        <div key={win.id} className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg flex justify-between items-center group hover:bg-yellow-500/10 transition">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-bold text-white">{win.events.title}</span>
                                                    <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-[10px] uppercase font-bold rounded border border-yellow-500/30">
                                                        {win.position} Place
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400">Merit Certificate Available</p>
                                            </div>
                                            {win.certificate_issued ? (
                                                <button
                                                    onClick={() => downloadCertificate('merit', win)}
                                                    className="p-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded border border-yellow-500/30 transition"
                                                    title="Download Merit Certificate"
                                                >
                                                    <Download size={18} />
                                                </button>
                                            ) : (
                                                <span className="text-[10px] text-gray-500 italic px-2 py-1 bg-white/5 rounded border border-white/5">Pending Approval</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Announcements */}
                        <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Bell size={20} className="text-red-600" /> Live Updates
                            </h3>
                            {loadingAnnouncements ? (
                                <div className="flex justify-center py-4">
                                    <Loader2 size={24} className="animate-spin text-red-600" />
                                </div>
                            ) : announcements.length > 0 ? (
                                announcements.map((msg) => (
                                    <div key={msg.id} className="p-4 bg-[#1a1a1a] border border-white/5 rounded-lg hover:border-red-600/30 transition mb-3 last:mb-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${msg.type === 'delay' ? 'bg-yellow-500/10 text-yellow-500' :
                                                msg.type === 'result' ? 'bg-green-500/10 text-green-500' :
                                                    'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                {msg.type}
                                            </span>
                                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                                <Clock size={10} /> {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-white mb-1 text-sm">{msg.title}</h4>
                                        <p className="text-gray-400 text-xs leading-relaxed">{msg.message}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-3 bg-red-900/10 border-l-2 border-red-600 rounded">
                                    <span className="text-xs font-bold text-red-500 block mb-1">SYSTEM ONLINE</span>
                                    <p className="text-sm text-gray-300">No active broadcasts at this moment.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;
