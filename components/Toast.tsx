import React, { memo } from 'react';

interface ToastProps {
    message: string | null;
    type: 'success' | 'error' | 'achievement' | 'challenge';
    icon: React.ReactNode;
}

const Toast: React.FC<ToastProps> = ({ message, type, icon }) => {
    if (!message) return null;

    let bgClass = 'bg-green-500';
    if (type === 'error') bgClass = 'bg-red-500';
    if (type === 'achievement') bgClass = 'bg-gradient-to-r from-green-500 to-emerald-600';
    if (type === 'challenge') bgClass = 'bg-gradient-to-r from-gray-700 to-gray-900';

    return (
        <div
            className={`fixed top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg font-bold text-white shadow-lg z-50 flex items-center gap-3 w-auto max-w-[90%] animate-toast-in ${bgClass}`}
        >
            {icon}
            <span>{message}</span>
        </div>
    );
};

export default memo(Toast);