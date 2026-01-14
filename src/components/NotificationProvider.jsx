import React, { createContext, useContext, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, Info } from 'lucide-react';

const NotificationContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const idCounter = React.useRef(0);

    const showNotification = (message, type = 'success', duration = 3000) => {
        const id = ++idCounter.current;
        setNotifications((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            removeNotification(id);
        }, duration);
    };

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {notifications.map((notification) => (
                        <NotificationItem key={notification.id} {...notification} onClose={() => removeNotification(notification.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
};

const NotificationItem = ({ message, type, onClose }) => {
    const variants = {
        initial: { opacity: 0, x: 50, scale: 0.9 },
        animate: { opacity: 1, x: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return <Check size={18} className="text-white bg-green-600 rounded-full p-0.5" />;
            case 'error': return <X size={18} className="text-white bg-red-600 rounded-full p-0.5" />;
            case 'info': return <Info size={18} className="text-white bg-blue-600 rounded-full p-0.5" />;
            case 'warning': return <AlertCircle size={18} className="text-white bg-yellow-600 rounded-full p-0.5" />;
            default: return <Check size={18} className="text-white bg-green-600 rounded-full p-0.5" />;
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success': return 'border-green-600';
            case 'error': return 'border-red-600';
            default: return 'border-gray-600';
        }
    };

    return (
        <motion.div
            layout
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`min-w-[300px] bg-[#141414] border-l-4 ${getBorderColor()} text-white p-4 rounded shadow-2xl flex items-center gap-3 backdrop-blur-md bg-opacity-90 pointer-events-auto relative pr-8`}
        >
            <div className="flex-shrink-0">
                {getIcon()}
            </div>
            <div className="flex-grow font-sans text-sm font-medium">
                {message}
            </div>
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
            >
                <X size={14} />
            </button>
        </motion.div>
    );
};
