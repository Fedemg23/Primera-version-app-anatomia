import React, { useState, useEffect, memo } from 'react';
import { UserData, AuthUser } from '../types';
import { getIncomingFriendRequests } from '../services/firestore';
import { UserPlus } from './icons';

interface FriendRequestNotificationProps {
    userData: UserData;
    auth: AuthUser | null;
    onClick: () => void;
}

const FriendRequestNotification: React.FC<FriendRequestNotificationProps> = ({ 
    userData, 
    auth, 
    onClick 
}) => {
    const [requestCount, setRequestCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (auth?.uid) {
            checkPendingRequests();
            // Check every 60 seconds for new requests
            const interval = setInterval(checkPendingRequests, 60000);
            return () => clearInterval(interval);
        }
    }, [auth?.uid]);

    const checkPendingRequests = async () => {
        if (!auth?.uid || loading) return;
        
        try {
            setLoading(true);
            const requests = await getIncomingFriendRequests(auth.uid);
            setRequestCount(requests.length);
        } catch (error) {
            console.error('Error checking pending friend requests:', error);
        } finally {
            setLoading(false);
        }
    };

    // Don't show if no pending requests
    if (requestCount === 0) return null;

    return (
        <button
            onClick={onClick}
            className="fixed bottom-44 right-4 z-40 w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full shadow-2xl shadow-blue-500/30 flex items-center justify-center text-white hover:scale-110 transition-all duration-300 animate-pulse"
            title="Solicitudes de amistad"
        >
            <UserPlus className="w-7 h-7" />
            {requestCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-bounce">
                    {requestCount > 9 ? '9+' : requestCount}
                </span>
            )}
        </button>
    );
};

export default memo(FriendRequestNotification);
