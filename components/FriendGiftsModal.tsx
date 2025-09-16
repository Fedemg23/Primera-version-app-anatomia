import React, { useState, useEffect, memo } from 'react';
import { UserData, AuthUser } from '../types';
import { 
    FriendGift, 
    getPendingGifts, 
    claimFriendGift, 
    getUserById, 
    PublicUser 
} from '../services/firestore';
import { Heart, Zap, Lightbulb, Gift, X } from './icons';

interface FriendGiftsModalProps {
    userData: UserData;
    auth: AuthUser | null;
    isOpen: boolean;
    onClose: () => void;
    onGiftClaimed: (type: FriendGift['type'], amount: number) => void;
}

interface GiftWithSender extends FriendGift {
    sender?: PublicUser;
}

const FriendGiftsModal: React.FC<FriendGiftsModalProps> = ({ 
    userData, 
    auth, 
    isOpen, 
    onClose, 
    onGiftClaimed 
}) => {
    const [gifts, setGifts] = useState<GiftWithSender[]>([]);
    const [loading, setLoading] = useState(false);
    const [claiming, setClaiming] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && auth?.uid) {
            loadPendingGifts();
        }
    }, [isOpen, auth?.uid]);

    const loadPendingGifts = async () => {
        if (!auth?.uid) return;
        
        try {
            setLoading(true);
            const pendingGifts = await getPendingGifts(auth.uid);
            
            // Load sender information for each gift
            const giftsWithSenders = await Promise.all(
                pendingGifts.map(async (gift) => {
                    const sender = await getUserById(gift.fromUid);
                    return { ...gift, sender };
                })
            );
            
            setGifts(giftsWithSenders.filter(gift => gift.sender));
        } catch (error) {
            console.error('Error loading pending gifts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClaimGift = async (gift: GiftWithSender) => {
        if (!auth?.uid || claiming) return;
        
        try {
            setClaiming(gift.id);
            await claimFriendGift(gift.id);
            onGiftClaimed(gift.type, gift.amount);
            
            // Remove from local state
            setGifts(prev => prev.filter(g => g.id !== gift.id));
        } catch (error) {
            console.error('Error claiming gift:', error);
        } finally {
            setClaiming(null);
        }
    };

    const getGiftIcon = (type: FriendGift['type']) => {
        switch (type) {
            case 'heart':
                return <Heart className="w-8 h-8 text-red-400" />;
            case 'xp_boost':
                return <Zap className="w-8 h-8 text-yellow-400" />;
            case 'hint':
                return <Lightbulb className="w-8 h-8 text-blue-400" />;
            default:
                return <Gift className="w-8 h-8 text-purple-400" />;
        }
    };

    const getGiftDescription = (gift: GiftWithSender) => {
        const { type, amount, sender } = gift;
        const senderName = sender?.name || 'Amigo';
        
        switch (type) {
            case 'heart':
                return `${senderName} te envió ${amount} corazón${amount > 1 ? 'es' : ''}`;
            case 'xp_boost':
                return `${senderName} te envió un boost de XP`;
            case 'hint':
                return `${senderName} te envió ${amount} pista${amount > 1 ? 's' : ''}`;
            default:
                return `${senderName} te envió un regalo`;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Gift className="w-8 h-8 text-purple-400" />
                        <h2 className="text-2xl font-bold text-white">Regalos de Amigos</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="text-slate-400">Cargando regalos...</div>
                        </div>
                    ) : gifts.length === 0 ? (
                        <div className="text-center py-8 space-y-4">
                            <Gift className="w-16 h-16 mx-auto text-slate-500" />
                            <p className="text-slate-400">No tienes regalos pendientes</p>
                            <p className="text-sm text-slate-500">¡Tus amigos pueden enviarte corazones y otros regalos!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {gifts.map(gift => (
                                <div
                                    key={gift.id}
                                    className="bg-slate-700/50 rounded-xl p-4 border border-slate-600"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center">
                                                {gift.sender?.avatar?.includes('/') ? 
                                                    <img src={gift.sender.avatar} alt="avatar" className="w-12 h-12 rounded-full" /> : 
                                                    <span className="text-2xl">{gift.sender?.avatar || '👤'}</span>
                                                }
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {getGiftIcon(gift.type)}
                                                    <span className="font-bold text-white text-sm">
                                                        {getGiftDescription(gift)}
                                                    </span>
                                                </div>
                                                {gift.message && (
                                                    <p className="text-sm text-slate-300 italic">
                                                        "{gift.message}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleClaimGift(gift)}
                                            disabled={claiming === gift.id}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500 disabled:opacity-50 transition-colors"
                                        >
                                            {claiming === gift.id ? 'Reclamando...' : 'Reclamar'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {gifts.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-slate-700">
                        <button
                            onClick={async () => {
                                // Claim all gifts
                                for (const gift of gifts) {
                                    await handleClaimGift(gift);
                                }
                            }}
                            disabled={claiming !== null}
                            className="w-full px-4 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-500 disabled:opacity-50 transition-colors"
                        >
                            Reclamar Todos los Regalos
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(FriendGiftsModal);
