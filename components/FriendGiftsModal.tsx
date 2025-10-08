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
                return <Heart className="w-3 h-3 text-red-300" />;
            case 'xp_boost':
                return <Zap className="w-3 h-3 text-yellow-300" />;
            case 'hint':
                return <Lightbulb className="w-3 h-3 text-blue-300" />;
            default:
                return <Gift className="w-3 h-3 text-purple-300" />;
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
        <div className="fixed inset-0 z-50 grid place-items-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80 backdrop-blur-sm" />
            <div className="relative w-full max-w-lg max-h-[85vh] rounded-3xl overflow-hidden border-2 border-purple-500/30 shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-slate-900/90 to-pink-900/40" />
                
                {/* Header */}
                <div className="relative px-6 pt-6 pb-4 border-b border-slate-700/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border-2 border-purple-500/30">
                                <Gift className="w-7 h-7 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white">Regalos de Amigos</h2>
                                <p className="text-sm text-slate-400">{gifts.length > 0 ? `${gifts.length} regalo${gifts.length > 1 ? 's' : ''} pendiente${gifts.length > 1 ? 's' : ''}` : 'No hay regalos'}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="relative flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                            <div className="text-slate-400 font-semibold">Cargando regalos...</div>
                        </div>
                    ) : gifts.length === 0 ? (
                        <div className="text-center py-12 space-y-4">
                            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border-2 border-slate-700/50">
                                <Gift className="w-10 h-10 text-slate-500" />
                            </div>
                            <div>
                                <p className="text-slate-300 font-bold text-lg">No tienes regalos pendientes</p>
                                <p className="text-sm text-slate-500 mt-1">¡Tus amigos pueden enviarte corazones y otros regalos!</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {gifts.map(gift => (
                                <div
                                    key={gift.id}
                                    className="relative group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                                    <div className="relative bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300">
                                        <div className="flex items-start gap-3">
                                            <div className="relative flex-shrink-0">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border-2 border-slate-600 shadow-inner overflow-hidden">
                                                    {gift.sender?.avatar?.includes('/') ? 
                                                        <img src={gift.sender.avatar} alt="avatar" className="w-full h-full object-cover" /> : 
                                                        <span className="text-xl">{gift.sender?.avatar || '👤'}</span>
                                                    }
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-2 border-slate-800 shadow-lg">
                                                    {getGiftIcon(gift.type)}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-black text-white text-sm truncate">{getGiftDescription(gift)}</p>
                                                        {gift.message && (
                                                            <p className="text-xs text-slate-400 italic mt-1 line-clamp-2">
                                                                "{gift.message}"
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleClaimGift(gift)}
                                                    disabled={claiming === gift.id}
                                                    className="mt-2 w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-black text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 shadow-lg"
                                                >
                                                    {claiming === gift.id ? (
                                                        <span className="flex items-center justify-center gap-2">
                                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                            Reclamando...
                                                        </span>
                                                    ) : (
                                                        '✓ Reclamar Regalo'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {gifts.length > 0 && (
                    <div className="relative px-6 pb-6 pt-4 border-t border-slate-700/50">
                        <button
                            onClick={async () => {
                                // Claim all gifts
                                for (const gift of gifts) {
                                    await handleClaimGift(gift);
                                }
                            }}
                            disabled={claiming !== null}
                            className="w-full px-4 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 shadow-lg text-lg"
                        >
                            🎁 Reclamar Todos los Regalos
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(FriendGiftsModal);
