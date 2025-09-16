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
    FriendChallenge as FirestoreFriendChallenge
} from '../../services/firestore';
import { Users, UserPlus, Search, Crown, Zap, Trophy, Heart, Gift, UserCheck, UserX, Clock } from '../icons';

interface FriendsScreenProps {
    userData: UserData;
    auth: AuthUser | null;
    onBack: () => void;
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
    type: 'weekly_score' | 'quiz_streak' | 'accuracy_battle';
    status: 'active' | 'completed';
    startDate: string;
    endDate: string;
    fromUserScore: number;
    toUserScore: number;
}

const FriendsScreen: React.FC<FriendsScreenProps> = ({ userData, auth, onBack }) => {
    const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search' | 'challenges'>('friends');
    const [friends, setFriends] = useState<PublicUser[]>([]);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<PublicUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);
    const [challenges, setChallenges] = useState<FriendChallenge[]>([]);

    useEffect(() => {
        if (auth?.uid) {
            loadFriends();
            loadFriendRequests();
            loadChallenges();
        }
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

    const loadChallenges = async () => {
        if (!auth?.uid) return;
        
        try {
            const activeChallenges = await getActiveChallenges(auth.uid);
            
            // Convert Firestore challenges to UI challenges with user data
            const challengesWithUsers = await Promise.all(
                activeChallenges.map(async (challenge) => {
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
                        toUserScore: challenge.toUserScore
                    };
                })
            );
            
            setChallenges(challengesWithUsers.filter(Boolean) as FriendChallenge[]);
        } catch (error) {
            console.error('Error loading challenges:', error);
            // Fallback to mock data
            const mockChallenges: FriendChallenge[] = [
                {
                    id: '1',
                    fromUser: { id: 'user1', name: 'Ana García', avatar: '🧠', xp: 2150, level: 15 },
                    toUser: { id: auth?.uid || '', name: userData.name, avatar: userData.avatar, xp: userData.xp, level: userData.level },
                    type: 'weekly_score',
                    status: 'active',
                    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
                    fromUserScore: 850,
                    toUserScore: userData.xp % 1000
                }
            ];
            setChallenges(mockChallenges);
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

    const handleSendHearts = async (friend: PublicUser) => {
        if (!auth?.uid) return;
        
        try {
            await sendFriendGift(auth.uid, friend.id, 'heart', 1, '¡Aquí tienes un corazón! 💖');
            setToast({ message: `❤️ Corazón enviado a ${friend.name}!`, type: 'success' });
        } catch (error) {
            setToast({ message: 'Error al enviar corazón', type: 'error' });
        }
    };

    const handleChallengeFreind = async (friend: PublicUser) => {
        if (!auth?.uid) return;
        
        try {
            await challengeFriend(auth.uid, friend.id, 'weekly_score');
            setToast({ message: `🏆 Desafío enviado a ${friend.name}!`, type: 'success' });
            loadChallenges(); // Reload challenges
        } catch (error) {
            setToast({ message: 'Error al enviar desafío', type: 'error' });
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

    const renderFriendsTab = () => (
        <div className="space-y-4">
            {loading ? (
                <div className="text-center text-slate-400 py-8">Cargando amigos...</div>
            ) : friends.length === 0 ? (
                <div className="text-center py-8 space-y-4">
                    <Users className="w-16 h-16 mx-auto text-slate-500" />
                    <p className="text-slate-400">Aún no tienes amigos</p>
                    <p className="text-sm text-slate-500">¡Busca usuarios y envía solicitudes!</p>
                </div>
            ) : (
                friends.map(friend => (
                    <div key={friend.id} className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-2xl">
                                    {friend.avatar?.includes('/') ? 
                                        <img src={friend.avatar} alt="avatar" className="w-12 h-12 rounded-full" /> : 
                                        <span>{friend.avatar || '👤'}</span>
                                    }
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{friend.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <Crown className="w-4 h-4" />
                                        <span>Nivel {friend.level}</span>
                                        <Zap className="w-4 h-4 ml-2" />
                                        <span>{friend.xp} XP</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleSendHearts(friend)}
                                    className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                                    title="Enviar corazón"
                                >
                                    <Heart className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleChallengeFreind(friend)}
                                    className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
                                    title="Desafiar"
                                >
                                    <Trophy className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        
                        {/* Stats comparison */}
                        <div className="mt-3 pt-3 border-t border-slate-700/50">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="text-center">
                                    <p className="text-slate-400">Quizzes completados</p>
                                    <p className="font-bold text-white">{friend.totalQuizzesCompleted || 0}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-slate-400">Precisión</p>
                                    <p className="font-bold text-white">
                                        {friend.totalCorrectAnswers && friend.totalQuestionsAnswered ? 
                                            Math.round((friend.totalCorrectAnswers / friend.totalQuestionsAnswered) * 100) : 0}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    const renderRequestsTab = () => (
        <div className="space-y-4">
            {friendRequests.length === 0 ? (
                <div className="text-center py-8 space-y-4">
                    <UserPlus className="w-16 h-16 mx-auto text-slate-500" />
                    <p className="text-slate-400">No hay solicitudes pendientes</p>
                </div>
            ) : (
                friendRequests.map(request => (
                    <div key={request.id} className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-2xl">
                                    {request.user?.avatar?.includes('/') ? 
                                        <img src={request.user.avatar} alt="avatar" className="w-12 h-12 rounded-full" /> : 
                                        <span>{request.user?.avatar || '👤'}</span>
                                    }
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{request.user?.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <Crown className="w-4 h-4" />
                                        <span>Nivel {request.user?.level}</span>
                                        <Zap className="w-4 h-4 ml-2" />
                                        <span>{request.user?.xp} XP</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAcceptRequest(request.id)}
                                    className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors"
                                    title="Aceptar"
                                >
                                    <UserCheck className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleRejectRequest(request.id)}
                                    className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                                    title="Rechazar"
                                >
                                    <UserX className="w-5 h-5" />
                                </button>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Buscar usuarios por nombre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                <button
                    onClick={searchUsers}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-500"
                >
                    Buscar
                </button>
            </div>
            
            {loading ? (
                <div className="text-center text-slate-400 py-8">Buscando...</div>
            ) : searchResults.length === 0 && searchQuery ? (
                <div className="text-center py-8">
                    <p className="text-slate-400">No se encontraron usuarios</p>
                </div>
            ) : (
                searchResults.map(user => (
                    <div key={user.id} className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-2xl">
                                    {user.avatar?.includes('/') ? 
                                        <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full" /> : 
                                        <span>{user.avatar || '👤'}</span>
                                    }
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{user.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <Crown className="w-4 h-4" />
                                        <span>Nivel {user.level}</span>
                                        <Zap className="w-4 h-4 ml-2" />
                                        <span>{user.xp} XP</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleSendFriendRequest(user.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 transition-colors"
                            >
                                <UserPlus className="w-5 h-5 inline mr-2" />
                                Agregar
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    const renderChallengesTab = () => (
        <div className="space-y-4">
            {challenges.length === 0 ? (
                <div className="text-center py-8 space-y-4">
                    <Trophy className="w-16 h-16 mx-auto text-slate-500" />
                    <p className="text-slate-400">No hay desafíos activos</p>
                    <p className="text-sm text-slate-500">¡Desafía a tus amigos a batallas de conocimiento!</p>
                </div>
            ) : (
                challenges.map(challenge => {
                    const daysLeft = Math.ceil((new Date(challenge.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    const isWinning = challenge.toUserScore > challenge.fromUserScore;
                    
                    return (
                        <div key={challenge.id} className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Trophy className={`w-6 h-6 ${isWinning ? 'text-yellow-400' : 'text-slate-400'}`} />
                                    <h3 className="font-bold text-white">Desafío Semanal</h3>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-slate-400">
                                    <Clock className="w-4 h-4" />
                                    <span>{daysLeft} días restantes</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="text-center">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg mx-auto mb-1">
                                        {challenge.fromUser.avatar}
                                    </div>
                                    <p className="text-sm font-bold text-white">{challenge.fromUser.name}</p>
                                    <p className="text-xl font-bold text-blue-400">{challenge.fromUserScore}</p>
                                </div>
                                
                                <div className="text-center flex items-center justify-center">
                                    <span className="text-2xl font-bold text-slate-500">VS</span>
                                </div>
                                
                                <div className="text-center">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg mx-auto mb-1">
                                        {userData.avatar}
                                    </div>
                                    <p className="text-sm font-bold text-white">Tú</p>
                                    <p className={`text-xl font-bold ${isWinning ? 'text-green-400' : 'text-red-400'}`}>
                                        {challenge.toUserScore}
                                    </p>
                                </div>
                            </div>
                            
                            <div className={`text-center text-sm font-bold ${isWinning ? 'text-green-400' : 'text-red-400'}`}>
                                {isWinning ? '¡Vas ganando! 🏆' : '¡Puedes alcanzarlo! 💪'}
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
        </div>
    );
};

export default memo(FriendsScreen);
