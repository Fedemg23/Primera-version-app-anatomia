import React, { useState, useEffect, memo } from 'react';
import { UserData, AuthUser } from '../../types';
import { 
    PublicUser, 
    getIncomingFriendRequests, 
    acceptFriendRequest, 
    rejectFriendRequest, 
    listFriendsPublic, 
    sendFriendRequest, 
    getUserById, 
    getFriendshipStatus,
    sendFriendGift,
    challengeFriend,
    getActiveChallenges,
    subscribeToActiveChallenges,
    cleanupExpiredChallenges,
    claimChallengeReward,
    FriendChallenge as FirestoreFriendChallenge
} from '../../services/firestore';
import { Users, UserPlus, Search, Crown, Zap, Trophy, Heart, Gift, UserCheck, UserX, Clock, Swords, X, Check } from '../icons';
import { achievementsData } from '../../constants';
import { iconMap } from '../icons';

// Lista de logros que tienen imagen completa (sin emoji)
// Agrega aquí el ID de nuevos logros cuando tengan imágenes completas
const ACHIEVEMENTS_WITH_FULL_IMAGE = ['quiz_completer'];

interface FriendsScreenProps {
    userData: UserData;
    auth: AuthUser | null;
    onBack: () => void;
    onClaimChallengeReward?: (challengeId: string) => void;
}

interface FriendRequest {
    id: string;
    fromUid: string;
    toUid: string;
    status: 'pending' | 'accepted' | 'rejected';
    user?: PublicUser;
}

interface FriendChallenge {
    id: string;
    fromUser: PublicUser;
    toUser: PublicUser;
    type: 'weekly_score' | 'quiz_streak' | 'accuracy_battle' | 'speed_run';
    status: 'active' | 'completed' | 'expired';
    startDate: string;
    endDate: string;
    fromUserScore: number;
    toUserScore: number;
    winner?: string;
    rewardClaimed?: boolean;
}

const FriendsScreen: React.FC<FriendsScreenProps> = ({ userData, auth, onBack, onClaimChallengeReward }) => {
    const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search' | 'challenges'>('friends');
    const [friends, setFriends] = useState<PublicUser[]>([]);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<PublicUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);
    const [challenges, setChallenges] = useState<FriendChallenge[]>([]);
    const [selectedFriend, setSelectedFriend] = useState<PublicUser | null>(null);
    const [showGiftModal, setShowGiftModal] = useState<PublicUser | null>(null);
    const [showChallengeModal, setShowChallengeModal] = useState<PublicUser | null>(null);
    const [selectedChallengeType, setSelectedChallengeType] = useState<'weekly_score' | 'quiz_streak' | 'accuracy_battle' | 'speed_run'>('weekly_score');
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        if (auth?.uid) {
            loadFriends();
            loadFriendRequests();
            
            // Limpiar desafíos expirados al cargar
            cleanupExpiredChallenges(auth.uid).catch(err => 
                console.warn('Error limpiando desafíos:', err)
            );
            
            // Suscribirse a desafíos en tiempo real
            const unsubscribe = subscribeToActiveChallenges(auth.uid, async (firestoreChallenges) => {
                // Convertir desafíos de Firestore a desafíos de UI con datos de usuario
                const challengesWithUsers = await Promise.all(
                    firestoreChallenges.map(async (challenge) => {
                        const otherUserId = challenge.fromUid === auth.uid ? challenge.toUid : challenge.fromUid;
                        const otherUser = await getUserById(otherUserId);
                        
                        if (!otherUser) return null;
                        
                        const isFromCurrentUser = challenge.fromUid === auth.uid;
                        
                        return {
                            id: challenge.id,
                            fromUser: isFromCurrentUser ? 
                                { id: auth.uid, name: userData.name, avatar: userData.avatar, xp: userData.xp, level: userData.level } :
                                otherUser,
                            toUser: isFromCurrentUser ? 
                                otherUser :
                                { id: auth.uid, name: userData.name, avatar: userData.avatar, xp: userData.xp, level: userData.level },
                            type: challenge.type,
                            status: challenge.status,
                            startDate: challenge.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                            endDate: challenge.endDate?.toDate?.()?.toISOString() || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                            fromUserScore: challenge.fromUserScore,
                            toUserScore: challenge.toUserScore,
                            winner: challenge.winner,
                            rewardClaimed: challenge.rewardClaimed
                        };
                    })
                );
                
                // Filtrar y ordenar desafíos
                // Excluir desafíos expirados (status === 'expired')
                const validChallenges = challengesWithUsers.filter(c => c && c.status !== 'expired') as FriendChallenge[];
                
                // Ordenar: Activos primero (con más tiempo restante primero), luego finalizados (más recientes primero)
                const sortedChallenges = validChallenges.sort((a, b) => {
                    const aTimeLeft = new Date(a.endDate).getTime() - Date.now();
                    const bTimeLeft = new Date(b.endDate).getTime() - Date.now();
                    
                    const aIsActive = aTimeLeft > 0;
                    const bIsActive = bTimeLeft > 0;
                    
                    // Si uno está activo y otro no, el activo va primero
                    if (aIsActive && !bIsActive) return -1;
                    if (!aIsActive && bIsActive) return 1;
                    
                    // Si ambos están activos, ordenar por tiempo restante (más tiempo = más arriba)
                    if (aIsActive && bIsActive) {
                        return bTimeLeft - aTimeLeft;
                    }
                    
                    // Si ambos están finalizados, ordenar por fecha de finalización (más reciente primero)
                    return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
                });
                
                setChallenges(sortedChallenges);
            });
            
            // Cleanup: cancelar suscripción cuando el componente se desmonte
            return () => {
                unsubscribe();
            };
        }
    }, [auth?.uid, userData.name, userData.avatar, userData.xp, userData.level]);

    // Actualizar el tiempo cada segundo para el temporizador de desafíos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        
        return () => clearInterval(interval);
    }, []);

    // Limpiar desafíos expirados cada 5 minutos
    useEffect(() => {
        if (!auth?.uid) return;
        
        const cleanupInterval = setInterval(() => {
            cleanupExpiredChallenges(auth.uid).catch(err => 
                console.warn('Error limpiando desafíos:', err)
            );
        }, 5 * 60 * 1000); // 5 minutos
        
        return () => clearInterval(cleanupInterval);
    }, [auth?.uid]);

    const loadFriends = async () => {
        if (!auth?.uid) return;
        try {
            setLoading(true);
            const friendsList = await listFriendsPublic(auth.uid);
            setFriends(friendsList);
        } catch (error) {
            console.error('Error loading friends:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadFriendRequests = async () => {
        if (!auth?.uid) return;
        try {
            const requests = await getIncomingFriendRequests(auth.uid);
            const requestsWithUsers = await Promise.all(
                requests.map(async (req) => {
                    const user = await getUserById(req.fromUid);
                    return { ...req, user };
                })
            );
            setFriendRequests(requestsWithUsers.filter(req => req.user));
        } catch (error) {
            console.error('Error loading friend requests:', error);
        }
    };


    const handleAcceptRequest = async (requestId: string) => {
        try {
            await acceptFriendRequest(requestId);
            setToast({ message: '¡Solicitud de amistad aceptada!', type: 'success' });
            loadFriendRequests();
            loadFriends();
        } catch (error) {
            setToast({ message: 'Error al aceptar solicitud', type: 'error' });
        }
    };

    const handleRejectRequest = async (requestId: string) => {
        try {
            await rejectFriendRequest(requestId);
            setToast({ message: 'Solicitud rechazada', type: 'success' });
            loadFriendRequests();
        } catch (error) {
            setToast({ message: 'Error al rechazar solicitud', type: 'error' });
        }
    };

    const handleSendGift = async (friend: PublicUser, giftType: 'heart' | 'xp_boost' | 'hint', amount: number, message: string) => {
        if (!auth?.uid) return;
        
        try {
            await sendFriendGift(auth.uid, friend.id, giftType, amount, message);
            const giftNames = {
                'heart': 'Corazón',
                'xp_boost': 'Boost de XP',
                'hint': 'Pista'
            };
            setToast({ message: `🎁 ${giftNames[giftType]} enviado a ${friend.name}!`, type: 'success' });
            setShowGiftModal(null);
        } catch (error) {
            setToast({ message: 'Error al enviar regalo', type: 'error' });
        }
    };

    const handleSendChallenge = async (friend: PublicUser, challengeType: 'weekly_score' | 'quiz_streak' | 'accuracy_battle' | 'speed_run') => {
        if (!auth?.uid) return;
        
        try {
            await challengeFriend(auth.uid, friend.id, challengeType);
            setToast({ message: `⚔️ Desafío enviado a ${friend.name}!`, type: 'success' });
            setShowChallengeModal(null);
            // Los desafíos se actualizarán automáticamente por el listener en tiempo real
        } catch (error) {
            setToast({ message: 'Error al enviar desafío', type: 'error' });
        }
    };

    const handleClaimReward = async (challengeId: string) => {
        if (!auth?.uid) return;
        
        try {
            await claimChallengeReward(challengeId, auth.uid);
            if (onClaimChallengeReward) {
                onClaimChallengeReward(challengeId);
            }
        } catch (error) {
            setToast({ message: 'Error al reclamar recompensa', type: 'error' });
        }
    };

    const searchUsers = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        
        try {
            setLoading(true);
            // En una implementación real, esto sería una búsqueda en Firebase
            // Por ahora simulamos con usuarios mock
            const mockUsers: PublicUser[] = [
                { id: 'user1', name: 'Ana García', avatar: '🧠', xp: 2150, level: 15, totalQuizzesCompleted: 45 },
                { id: 'user2', name: 'Carlos López', avatar: '⚡', xp: 1800, level: 12, totalQuizzesCompleted: 38 },
                { id: 'user3', name: 'María Silva', avatar: '🔬', xp: 2850, level: 18, totalQuizzesCompleted: 62 }
            ].filter(user => 
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
                user.id !== auth?.uid
            );
            
            setSearchResults(mockUsers);
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendFriendRequest = async (userId: string) => {
        if (!auth?.uid) return;
        
        try {
            await sendFriendRequest(auth.uid, userId);
            setToast({ message: '¡Solicitud de amistad enviada!', type: 'success' });
        } catch (error) {
            setToast({ message: 'Error al enviar solicitud', type: 'error' });
        }
    };

    // Modal de envío de regalos
    const GiftModal = () => {
        if (!showGiftModal) return null;
        
        const [selectedGift, setSelectedGift] = useState<'heart' | 'xp_boost' | 'hint'>('heart');
        const [giftMessage, setGiftMessage] = useState('');
        
        const gifts = [
            { type: 'heart' as const, name: 'Corazón', icon: '❤️', description: 'Envía 1 corazón de vida' },
            { type: 'xp_boost' as const, name: 'Boost XP', icon: '⚡', description: 'Duplica XP por 30 min' },
            { type: 'hint' as const, name: 'Pista', icon: '💡', description: 'Envía 1 pista' }
        ];
        
        return (
            <div className="fixed inset-0 z-50 grid place-items-center p-4 animate-fade-in" onClick={() => setShowGiftModal(null)}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80 backdrop-blur-sm" />
                <div className="relative w-full max-w-md rounded-3xl overflow-hidden border-2 border-purple-500/30 shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-slate-900/90 to-pink-900/40" />
                    <div className="relative">
                        {/* Header */}
                        <div className="px-6 pt-6 pb-4 border-b border-slate-700/50">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                                        <Gift className="w-7 h-7 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white">Enviar Regalo</h3>
                                        <p className="text-sm text-slate-300">A {showGiftModal.name}</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowGiftModal(null)} className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                        </div>
                        
                        {/* Body */}
                        <div className="p-6 space-y-4">
                            <div className="space-y-3">
                                {gifts.map(gift => (
                                    <button
                                        key={gift.type}
                                        onClick={() => setSelectedGift(gift.type)}
                                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                                            selectedGift === gift.type
                                                ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                                                : 'border-slate-700/50 bg-slate-800/40 hover:border-slate-600'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="text-4xl">{gift.icon}</div>
                                            <div className="flex-1 text-left">
                                                <div className="font-bold text-white text-lg">{gift.name}</div>
                                                <div className="text-sm text-slate-400">{gift.description}</div>
                                            </div>
                                            {selectedGift === gift.type && (
                                                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                                                    <Check className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Mensaje opcional</label>
                                <input
                                    type="text"
                                    value={giftMessage}
                                    onChange={(e) => setGiftMessage(e.target.value)}
                                    placeholder="¡Aquí tienes un regalo! 🎁"
                                    maxLength={100}
                                    className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>
                        </div>
                        
                        {/* Footer */}
                        <div className="px-6 pb-6">
                            <button
                                onClick={() => handleSendGift(showGiftModal, selectedGift, 1, giftMessage || '¡Disfruta tu regalo! 🎁')}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-black text-white text-lg shadow-lg hover:shadow-purple-500/50 active:scale-95 transition-all duration-200"
                            >
                                Enviar Regalo 🎁
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    
    // Modal de desafío
    const ChallengeModal = () => {
        if (!showChallengeModal) return null;
        
        const challenges = [
            { type: 'weekly_score' as const, name: 'Batalla de XP', icon: '📊', description: 'Consigue más XP', duration: '3 minutos' },
            { type: 'quiz_streak' as const, name: 'Racha de Quizzes', icon: '🔥', description: 'Más quizzes perfectos', duration: '3 minutos' },
            { type: 'accuracy_battle' as const, name: 'Precisión Máxima', icon: '🎯', description: 'Mayor % de aciertos', duration: '3 minutos' },
            { type: 'speed_run' as const, name: 'Contra el Reloj', icon: '⚡', description: 'Responde más rápido', duration: '3 minutos' }
        ];
        
        return (
            <div className="fixed inset-0 z-50 grid place-items-center p-4 animate-fade-in" onClick={() => setShowChallengeModal(null)}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80 backdrop-blur-sm" />
                <div className="relative w-full max-w-md rounded-3xl overflow-hidden border-2 border-blue-500/30 shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900/90 to-cyan-900/40" />
                    <div className="relative">
                        {/* Header */}
                        <div className="px-6 pt-6 pb-4 border-b border-slate-700/50">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <Swords className="w-7 h-7 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white">Enviar Desafío</h3>
                                        <p className="text-sm text-slate-300">A {showChallengeModal.name}</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowChallengeModal(null)} className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                        </div>
                        
                        {/* Body */}
                        <div className="p-6 space-y-3">
                            {challenges.map(challenge => (
                                <button
                                    key={challenge.type}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedChallengeType(challenge.type);
                                    }}
                                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                                        selectedChallengeType === challenge.type
                                            ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20'
                                            : 'border-slate-700/50 bg-slate-800/40 hover:border-slate-600'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-4xl">{challenge.icon}</div>
                                        <div className="flex-1 text-left">
                                            <div className="font-bold text-white text-lg">{challenge.name}</div>
                                            <div className="text-sm text-slate-400">{challenge.description}</div>
                                            <div className="text-xs text-blue-400 font-semibold mt-1">⏱️ {challenge.duration}</div>
                                        </div>
                                        {selectedChallengeType === challenge.type && (
                                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                        
                        {/* Footer */}
                        <div className="px-6 pb-6">
                            <button
                                onClick={() => handleSendChallenge(showChallengeModal, selectedChallengeType)}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-black text-white text-lg shadow-lg hover:shadow-blue-500/50 active:scale-95 transition-all duration-200"
                            >
                                Enviar Desafío ⚔️
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const getFrameUrl = (achievementId: string, rank: 'bronze' | 'silver' | 'gold' | 'ruby' | 'emerald' | 'diamond'): string => {
        if (achievementId === 'quiz_completer') {
            const specialNames: Record<string, string> = {
                'bronze': 'Maestro_De_Los_Quizzes_Bronce',
                'silver': 'Maestro_De_Quizzes_Plata',
                'gold': 'Maestro_De_Quizzes_Oro',
                'ruby': 'Maestro_De_Los_Quizzes_Rubi_',
                'emerald': 'Maestro_De_Los_Quizzes_Esmeralda',
                'diamond': 'Maestro_De_Los_Quizzes_Diamante'
            };
            return `/images/Achievements/${specialNames[rank]}.png`;
        } else {
            const genericNames: Record<string, string> = {
                'bronze': 'Logros_Bronce',
                'silver': 'Logros_Plata',
                'gold': 'Logros_Oro',
                'ruby': 'Logros_Rubí',
                'emerald': 'Logros_Esmeralda',
                'diamond': 'Logros_Diamante_'
            };
            return `/images/Achievements/${genericNames[rank]}.png`;
        }
    };

    const renderAchievements = (u: PublicUser) => {
        // Mostrar todos los logros, tanto desbloqueados como bloqueados
        const allAchievements = achievementsData;
        
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-auto pr-1">
                {allAchievements.map((ach) => {
                    const unlockedLevel = u.unlockedAchievements?.[ach.id] || 0;
                    const isLocked = unlockedLevel === 0;
                    const Icon = (iconMap as any)[ach.icon];
                    
                    // Determinar el rango según el nivel desbloqueado
                    const tier = ach.tiers.find(t => t.level === unlockedLevel);
                    const rank = tier?.rank || 'bronze';
                    const frameUrl = getFrameUrl(ach.id, rank);
                    
                    // Verificar si el logro tiene imagen completa (sin emoji)
                    const hasFullImage = ACHIEVEMENTS_WITH_FULL_IMAGE.includes(ach.id);
                    
                    return (
                        <div key={ach.id} className={`relative bg-slate-800/60 border border-slate-700 rounded-xl p-3 flex items-center gap-3 transition-colors ${isLocked ? 'opacity-60' : 'hover:bg-slate-800'}`}>
                            <div className="relative">
                                <div 
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl relative"
                                    style={{
                                        backgroundImage: `url("${frameUrl}")`,
                                        backgroundSize: 'contain',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                        filter: isLocked ? 'grayscale(100%) brightness(0.6)' : 'none',
                                        opacity: isLocked ? 0.7 : 1
                                    }}
                                >
                                    {!hasFullImage && (
                                        <span style={{
                                            filter: isLocked ? 'grayscale(100%) brightness(0.6)' : 'none',
                                            opacity: isLocked ? 0.7 : 1
                                        }}>
                                            {Icon ? <Icon className="w-6 h-6"/> : <span>🏆</span>}
                                        </span>
                                    )}
                                </div>
                                {!isLocked && (
                                    <span className="absolute -top-2 -right-2 bg-amber-400 text-black text-[10px] font-black px-1.5 py-0.5 rounded-full border border-amber-500 shadow">
                                        Lv {unlockedLevel}
                                    </span>
                                )}
                            </div>
                            <div className="min-w-0">
                                <div className={`text-sm font-bold truncate ${isLocked ? 'text-slate-500' : 'text-slate-100'}`}>
                                    {isLocked ? '???' : ach.name}
                                </div>
                                <div className="text-slate-400 text-[11px] truncate">
                                    {isLocked ? 'Logro bloqueado' : (ach.tiers.find(t=>t.level===1)?.description || 'Logro desbloqueado')}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderFriendsTab = () => (
        <div className="space-y-3">
            {loading ? (
                <div className="text-center text-slate-400 py-8">Cargando amigos...</div>
            ) : friends.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border-2 border-slate-700/50">
                        <Users className="w-10 h-10 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-slate-300 font-bold text-lg">Aún no tienes amigos</p>
                        <p className="text-sm text-slate-500 mt-1">¡Busca usuarios y envía solicitudes!</p>
                    </div>
                </div>
            ) : (
                friends.map(friend => (
                    <div key={friend.id} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                        <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 shadow-lg hover:shadow-xl hover:border-slate-600 transition-all duration-300 cursor-pointer" onClick={() => setSelectedFriend(friend)}>
                            <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-3xl border-2 border-slate-600 shadow-inner overflow-hidden">
                                        {friend.avatar?.includes('/') ? 
                                            <img src={friend.avatar} alt="avatar" className="w-full h-full object-cover" /> : 
                                            <span>{friend.avatar || '👤'}</span>
                                        }
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center border-2 border-slate-800 shadow-lg">
                                        <span className="text-white text-[10px] font-black">{friend.level}</span>
                                    </div>
                                </div>
                                
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-black text-white text-lg truncate">{friend.name}</h3>
                                        <Crown className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Zap className="w-3.5 h-3.5 text-purple-400" />
                                            <span className="font-semibold">{friend.xp.toLocaleString()} XP</span>
                                        </div>
                                        <span className="text-slate-600">•</span>
                                        <div className="flex items-center gap-1">
                                            <Trophy className="w-3.5 h-3.5 text-blue-400" />
                                            <span className="font-semibold">{friend.totalQuizzesCompleted || 0} quizzes</span>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setShowGiftModal(friend); }}
                                            className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/30 rounded-xl text-purple-300 font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95"
                                            title="Enviar regalo"
                                        >
                                            <Gift className="w-4 h-4" />
                                            <span>Regalo</span>
                                        </button>
                                        <button
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                setSelectedChallengeType('weekly_score'); 
                                                setShowChallengeModal(friend); 
                                            }}
                                            className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 border border-blue-500/30 rounded-xl text-blue-300 font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95"
                                            title="Desafiar"
                                        >
                                            <Swords className="w-4 h-4" />
                                            <span>Duelo</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Stats bar */}
                            <div className="mt-3 pt-3 border-t border-slate-700/30">
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="bg-slate-900/50 rounded-lg p-2 text-center border border-slate-700/30">
                                        <p className="text-slate-500 font-semibold mb-0.5">Precisión</p>
                                        <p className="font-black text-white text-sm">
                                            {friend.totalCorrectAnswers && friend.totalQuestionsAnswered ? 
                                                Math.round((friend.totalCorrectAnswers / friend.totalQuestionsAnswered) * 100) : 0}%
                                        </p>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-lg p-2 text-center border border-slate-700/30">
                                        <p className="text-slate-500 font-semibold mb-0.5">Correctas</p>
                                        <p className="font-black text-white text-sm">{friend.totalCorrectAnswers || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    const renderRequestsTab = () => (
        <div className="space-y-3">
            {friendRequests.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border-2 border-slate-700/50">
                        <UserPlus className="w-10 h-10 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-slate-300 font-bold text-lg">No hay solicitudes pendientes</p>
                        <p className="text-sm text-slate-500 mt-1">Las solicitudes de amistad aparecerán aquí</p>
                    </div>
                </div>
            ) : (
                friendRequests.map(request => (
                    <div key={request.id} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                        <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="relative flex-shrink-0">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-2xl border-2 border-slate-600 shadow-inner overflow-hidden">
                                            {request.user?.avatar?.includes('/') ? 
                                                <img src={request.user.avatar} alt="avatar" className="w-full h-full object-cover" /> : 
                                                <span>{request.user?.avatar || '👤'}</span>
                                            }
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center border-2 border-slate-800">
                                            <span className="text-white text-[9px] font-black">{request.user?.level}</span>
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-black text-white truncate">{request.user?.name}</h3>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Zap className="w-3 h-3 text-purple-400" />
                                            <span className="font-semibold">{request.user?.xp} XP</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleAcceptRequest(request.id)}
                                        className="p-2.5 bg-gradient-to-br from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border border-green-500/30 rounded-xl text-green-300 transition-all duration-200 active:scale-95"
                                        title="Aceptar"
                                    >
                                        <UserCheck className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleRejectRequest(request.id)}
                                        className="p-2.5 bg-gradient-to-br from-red-600/20 to-rose-600/20 hover:from-red-600/30 hover:to-rose-600/30 border border-red-500/30 rounded-xl text-red-300 transition-all duration-200 active:scale-95"
                                        title="Rechazar"
                                    >
                                        <UserX className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    const renderSearchTab = () => (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Buscar usuarios por nombre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                    className="w-full pl-12 pr-28 py-4 bg-slate-800/80 backdrop-blur-sm border-2 border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all shadow-lg"
                />
                <button
                    onClick={searchUsers}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-sm font-black hover:from-blue-500 hover:to-cyan-500 active:scale-95 transition-all shadow-lg"
                >
                    Buscar
                </button>
            </div>
            
            {loading ? (
                <div className="text-center text-slate-400 py-8">Buscando...</div>
            ) : searchResults.length === 0 && searchQuery ? (
                <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-slate-700/20 to-slate-800/20 flex items-center justify-center border-2 border-slate-700/50 mb-4">
                        <Search className="w-10 h-10 text-slate-500" />
                    </div>
                    <p className="text-slate-400 font-bold">No se encontraron usuarios</p>
                    <p className="text-sm text-slate-500 mt-1">Intenta con otro nombre</p>
                </div>
            ) : searchResults.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border-2 border-slate-700/50 mb-4">
                        <Search className="w-10 h-10 text-slate-500" />
                    </div>
                    <p className="text-slate-300 font-bold text-lg">Busca nuevos amigos</p>
                    <p className="text-sm text-slate-500 mt-1">Escribe un nombre y presiona Enter</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {searchResults.map(user => (
                        <div key={user.id} className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                            <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-2xl border-2 border-slate-600 shadow-inner overflow-hidden">
                                                {user.avatar?.includes('/') ? 
                                                    <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" /> : 
                                                    <span>{user.avatar || '👤'}</span>
                                                }
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center border-2 border-slate-800">
                                                <span className="text-white text-[9px] font-black">{user.level}</span>
                                            </div>
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-black text-white truncate">{user.name}</h3>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Zap className="w-3 h-3 text-purple-400" />
                                                <span className="font-semibold">{user.xp.toLocaleString()} XP</span>
                                                <span className="text-slate-600">•</span>
                                                <Trophy className="w-3 h-3 text-blue-400" />
                                                <span className="font-semibold">{user.totalQuizzesCompleted || 0} quizzes</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSendFriendRequest(user.id)}
                                        className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-black text-sm transition-all duration-200 active:scale-95 shadow-lg flex items-center gap-2 flex-shrink-0"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        <span className="hidden sm:inline">Agregar</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderChallengesTab = () => (
        <div className="space-y-3">
            {challenges.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border-2 border-slate-700/50">
                        <Trophy className="w-10 h-10 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-slate-300 font-bold text-lg">No hay desafíos activos</p>
                        <p className="text-sm text-slate-500 mt-1">¡Desafía a tus amigos a batallas de conocimiento!</p>
                    </div>
                </div>
            ) : (
                challenges.map(challenge => {
                    const timeLeft = new Date(challenge.endDate).getTime() - currentTime;
                    const minutesLeft = Math.floor(timeLeft / (1000 * 60));
                    const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);
                    const timeDisplay = timeLeft > 0 
                        ? `${minutesLeft}m ${secondsLeft}s` 
                        : 'Finalizado';
                    
                    // Determinar quién es el usuario actual y quién es el oponente
                    const isCurrentUserToUser = challenge.toUser.id === auth?.uid;
                    const currentUserScore = isCurrentUserToUser ? challenge.toUserScore : challenge.fromUserScore;
                    const opponentScore = isCurrentUserToUser ? challenge.fromUserScore : challenge.toUserScore;
                    const currentUserData = isCurrentUserToUser ? challenge.toUser : challenge.fromUser;
                    const opponentData = isCurrentUserToUser ? challenge.fromUser : challenge.toUser;
                    
                    const isWinning = currentUserScore > opponentScore;
                    const isTie = currentUserScore === opponentScore;
                    
                    const challengeTypeNames: Record<string, string> = {
                        'weekly_score': 'Batalla de XP',
                        'quiz_streak': 'Racha de Quizzes',
                        'accuracy_battle': 'Precisión Máxima',
                        'speed_run': 'Contra el Reloj'
                    };
                    
                    const challengeIcons: Record<string, string> = {
                        'weekly_score': '📊',
                        'quiz_streak': '🔥',
                        'accuracy_battle': '🎯',
                        'speed_run': '⚡'
                    };
                    
                    // Función para formatear el score según el tipo de desafío
                    const formatScore = (score: number, type: string) => {
                        switch (type) {
                            case 'weekly_score':
                                return `${score} XP`;
                            case 'quiz_streak':
                                return `${score} perfectos`;
                            case 'accuracy_battle':
                                return `${score}%`;
                            case 'speed_run':
                                return `${score} preguntas`;
                            default:
                                return `${score}`;
                        }
                    };
                    
                    return (
                        <div key={challenge.id} className="relative group">
                            <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl ${
                                isWinning ? 'bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10' :
                                isTie ? 'bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10' :
                                'bg-gradient-to-r from-red-500/10 via-rose-500/10 to-pink-500/10'
                            }`} />
                            <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{challengeIcons[challenge.type] || '⚔️'}</span>
                                        <div>
                                            <h3 className="font-black text-white text-sm">{challengeTypeNames[challenge.type] || 'Desafío'}</h3>
                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                <Clock className="w-3 h-3" />
                                                <span>{timeDisplay}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-black ${
                                        timeLeft <= 0 && isWinning ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                        timeLeft <= 0 && isTie ? 'bg-slate-500/20 text-slate-300 border border-slate-500/30' :
                                        timeLeft <= 0 ? 'bg-slate-500/20 text-slate-300 border border-slate-500/30' :
                                        isWinning ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                        isTie ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                                        'bg-red-500/20 text-red-300 border border-red-500/30'
                                    }`}>
                                        {timeLeft <= 0 && isWinning ? '🏆 Ganaste' : 
                                         timeLeft <= 0 && isTie ? '⚖️ Empate' : 
                                         timeLeft <= 0 ? '❌ Perdiste' :
                                         isWinning ? '🏆 Ganando' : 
                                         isTie ? '⚖️ Empate' : 
                                         '💪 Perdiendo'}
                                    </div>
                                </div>
                                
                                {/* Battle View */}
                                <div className="relative">
                                    <div className="grid grid-cols-3 gap-4 items-center">
                                        {/* Opponent */}
                                        <div className="text-center">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xl mx-auto mb-2 border-2 border-slate-600 shadow-inner overflow-hidden">
                                                {opponentData.avatar?.includes('/') ? 
                                                    <img src={opponentData.avatar} alt="avatar" className="w-full h-full object-cover" /> : 
                                                    <span>{opponentData.avatar || '👤'}</span>
                                                }
                                            </div>
                                            <p className="text-xs font-bold text-slate-300 truncate">{opponentData.name}</p>
                                            <div className="mt-2 px-2 py-1 bg-slate-900/50 rounded-lg border border-slate-700/30">
                                                <p className="text-base font-black text-blue-400">{formatScore(opponentScore, challenge.type)}</p>
                                            </div>
                                        </div>
                                        
                                        {/* VS */}
                                        <div className="text-center flex flex-col items-center justify-center">
                                            <Swords className="w-8 h-8 text-slate-500 mb-1" />
                                            <span className="text-xs font-black text-slate-600">VS</span>
                                        </div>
                                        
                                        {/* You */}
                                        <div className="text-center">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xl mx-auto mb-2 border-2 border-purple-500/50 shadow-lg shadow-purple-500/20 overflow-hidden">
                                                {userData.avatar?.includes('/') ? 
                                                    <img src={userData.avatar} alt="avatar" className="w-full h-full object-cover" /> : 
                                                    <span>{userData.avatar || '👤'}</span>
                                                }
                                            </div>
                                            <p className="text-xs font-bold text-white truncate">Tú</p>
                                            <div className="mt-2 px-2 py-1 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-lg border border-purple-500/30">
                                                <p className={`text-base font-black ${
                                                    isWinning ? 'text-green-400' : isTie ? 'text-yellow-400' : 'text-red-400'
                                                }`}>
                                                    {formatScore(currentUserScore, challenge.type)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="mt-4">
                                    <div className="relative w-full h-2 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/30">
                                        <div 
                                            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                                                isWinning ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                                isTie ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                                'bg-gradient-to-r from-red-500 to-rose-500'
                                            }`}
                                            style={{ 
                                                width: `${Math.min(100, (currentUserScore / Math.max(opponentScore, currentUserScore, 1)) * 100)}%` 
                                            }}
                                        />
                                    </div>
                                </div>
                                
                                {/* Botón de reclamar recompensa */}
                                {timeLeft <= 0 && challenge.status === 'completed' && challenge.winner === auth?.uid && !challenge.rewardClaimed && (
                                    <div className="mt-4">
                                        <button
                                            onClick={() => handleClaimReward(challenge.id)}
                                            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black rounded-xl shadow-lg hover:shadow-amber-500/50 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
                                        >
                                            <Trophy className="w-5 h-5" />
                                            ¡Reclamar Recompensa!
                                        </button>
                                    </div>
                                )}
                                
                                {/* Mensaje de recompensa reclamada */}
                                {challenge.rewardClaimed && challenge.winner === auth?.uid && (
                                    <div className="mt-4 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl text-center">
                                        <p className="text-green-300 text-sm font-bold">✅ Recompensa reclamada</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );

    return (
        <div className="min-h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onBack}
                            className="text-blue-400 hover:text-blue-300 font-bold"
                        >
                            ← Volver
                        </button>
                        <h1 className="text-2xl font-black text-white">Amigos</h1>
                        <div className="w-16"></div>
                    </div>
                </div>
                
                {/* Tabs */}
                <div className="flex border-t border-slate-700/50">
                    {[
                        { key: 'friends', label: 'Amigos', icon: Users, count: friends.length },
                        { key: 'requests', label: 'Solicitudes', icon: UserPlus, count: friendRequests.length },
                        { key: 'search', label: 'Buscar', icon: Search },
                        { key: 'challenges', label: 'Desafíos', icon: Trophy, count: challenges.length }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={`flex-1 py-3 px-2 text-sm font-bold transition-colors relative ${
                                activeTab === tab.key 
                                    ? 'text-blue-400 bg-blue-600/10' 
                                    : 'text-slate-400 hover:text-slate-300'
                            }`}
                        >
                            <div className="flex items-center justify-center gap-1">
                                <tab.icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{tab.label}</span>
                                {tab.count !== undefined && tab.count > 0 && (
                                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-1">
                                        {tab.count}
                                    </span>
                                )}
                            </div>
                            {activeTab === tab.key && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 pb-20">
                <div className="max-w-2xl mx-auto">
                    {activeTab === 'friends' && renderFriendsTab()}
                    {activeTab === 'requests' && renderRequestsTab()}
                    {activeTab === 'search' && renderSearchTab()}
                    {activeTab === 'challenges' && renderChallengesTab()}
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
                    <div className={`px-6 py-3 rounded-lg shadow-lg text-white font-bold ${
                        toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                        <div className="flex items-center gap-2">
                            <span>{toast.message}</span>
                            <button 
                                onClick={() => setToast(null)}
                                className="ml-2 text-white hover:text-gray-300"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <GiftModal />
            <ChallengeModal />

            {/* Friend Profile Modal */}
            {selectedFriend && (
                <div className="fixed inset-0 z-50 grid place-items-center p-4" onClick={() => setSelectedFriend(null)}>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80 backdrop-blur-sm" />
                    <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden border-2 border-purple-500/20 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 10%, rgba(139,92,246,0.3), transparent 40%), radial-gradient(circle at 80% 30%, rgba(59,130,246,0.25), transparent 45%), radial-gradient(circle at 50% 90%, rgba(236,72,153,0.2), transparent 40%)' }} />
                        <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-900/95 backdrop-blur-xl">
                            <div className="px-6 pt-5 pb-4 border-b border-slate-700/50 flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-3xl border-2 border-slate-600 shadow-lg overflow-hidden">
                                    {selectedFriend.avatar?.includes('/') ? <img src={selectedFriend.avatar} alt="avatar" className="w-full h-full object-cover"/> : <span>{selectedFriend.avatar || '👤'}</span>}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-white font-black text-2xl truncate">{selectedFriend.name || 'Jugador'}</div>
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <Crown className="w-4 h-4 text-yellow-400" />
                                        <span>Nivel {selectedFriend.level}</span>
                                        <span className="text-slate-600">•</span>
                                        <Zap className="w-4 h-4 text-purple-400" />
                                        <span>{selectedFriend.xp.toLocaleString()} XP</span>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedFriend(null)} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-300 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="px-6 py-5 space-y-6">
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-slate-800/60 rounded-xl p-4 text-center border border-slate-700">
                                        <div className="text-slate-400 text-xs">Quizzes</div>
                                        <div className="text-slate-100 font-black text-xl">{selectedFriend.totalQuizzesCompleted ?? '—'}</div>
                                    </div>
                                    <div className="bg-slate-800/60 rounded-xl p-4 text-center border border-slate-700">
                                        <div className="text-slate-400 text-xs">Correctas</div>
                                        <div className="text-slate-100 font-black text-xl">{selectedFriend.totalCorrectAnswers ?? '—'}</div>
                                    </div>
                                    <div className="bg-slate-800/60 rounded-xl p-4 text-center border border-slate-700">
                                        <div className="text-slate-400 text-xs">Respondidas</div>
                                        <div className="text-slate-100 font-black text-xl">{selectedFriend.totalQuestionsAnswered ?? '—'}</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-slate-300 font-semibold mb-2">Logros</div>
                                    {renderAchievements(selectedFriend)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(FriendsScreen);

