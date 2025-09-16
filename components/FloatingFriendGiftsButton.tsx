import React, { useState, useEffect, memo } from 'react';
import { UserData, AuthUser } from '../types';
import { getPendingGifts } from '../services/firestore';
import { Gift } from './icons';

interface FloatingFriendGiftsButtonProps {
    userData: UserData;
    auth: AuthUser | null;
    onClick: () => void;
}

const FloatingFriendGiftsButton: React.FC<FloatingFriendGiftsButtonProps> = ({ 
    userData, 
    auth, 
    onClick 
}) => {
    const [pendingCount, setPendingCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (auth?.uid) {
            checkPendingGifts();
            // Check every 30 seconds for new gifts
            const interval = setInterval(checkPendingGifts, 30000);
            return () => clearInterval(interval);
        }
    }, [auth?.uid]);

    const checkPendingGifts = async () => {
        if (!auth?.uid || loading) return;
        
        try {
            setLoading(true);
            const gifts = await getPendingGifts(auth.uid);
            setPendingCount(gifts.length);
        } catch (error) {
            console.error('Error checking pending gifts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Don't show if no pending gifts
    if (pendingCount === 0) return null;

    return (
        <button
            onClick={onClick}
            className="fixed bottom-28 right-4 z-40 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-2xl shadow-purple-500/30 flex items-center justify-center text-white hover:scale-110 transition-all duration-300 animate-bounce"
            title="Regalos de amigos"
        >
            <Gift className="w-7 h-7" />
            {pendingCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
                    {pendingCount > 9 ? '9+' : pendingCount}
                </span>
            )}
        </button>
    );
};

export default memo(FloatingFriendGiftsButton);
