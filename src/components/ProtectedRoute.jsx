import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, requiredRole = 'participant' }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const localRegistration = localStorage.getItem('userRegistration');

            if (session) {
                setUser(session.user);
                // Fetch user role from profiles
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();
                setRole(profile?.role || 'participant');
            } else if (localRegistration) {
                // Allow access if local registration exists
                setUser({ id: 'local-user', role: 'participant' }); // Mock user object
                setRole('participant');
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
                <Loader2 className="animate-spin text-red-600" size={32} />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role hierarchy check (simple version)
    // Admin can access everything
    if (role === 'admin') {
        return children;
    }

    // specific role checks
    if (requiredRole === 'admin' && role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    if (requiredRole === 'volunteer' && !['admin', 'organizer', 'volunteer'].includes(role)) {
        return <Navigate to="/dashboard" replace />;
    }

    // organizers can access volunteer and organizer stuff
    if (requiredRole === 'organizer' && !['admin', 'organizer'].includes(role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
