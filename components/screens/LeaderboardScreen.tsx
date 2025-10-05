import React, { memo, useEffect, useState } from 'react';
import { PublicUser, getTopUsers, upsertUser, sendFriendRequest, getUserById, getFriendshipStatus, acceptFriendRequest } from '../../services/firestore';
import { subscribeAuth, mockFirebase } from '../../services/firebase';
import type { AuthUser, UserData } from '../../types';
import { achievementsData } from '../../constants';
import { iconMap } from '../icons';

const LeaderboardScreen: React.FC = () => {
    const [users, setUsers] = useState<PublicUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [auth, setAuth] = useState<AuthUser | null>(null);
    const [publishing, setPublishing] = useState(false);
    const [info, setInfo] = useState('');

    const [selected, setSelected] = useState<PublicUser | null>(null);
    const [selectedLoading, setSelectedLoading] = useState(false);
    const [friendLoading, setFriendLoading] = useState(false);
    const [friendMsg, setFriendMsg] = useState('');
    const [friendState, setFriendState] = useState<'none' | 'outgoing' | 'incoming' | 'friend'>('none');
    const [incomingRequestId, setIncomingRequestId] = useState<string | null>(null);

    useEffect(() => {
        const unsub = subscribeAuth(setAuth);
        return unsub;
    }, []);

    const refresh = async () => {
        setLoading(true);
        setError('');
        setInfo('');
        try {
            const top = await getTopUsers(50);
            setUsers(top);
        } catch (e) {
            setError('No se pudo cargar el ranking.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { refresh(); }, []);

    const handlePublishMe = async () => {
        if (!auth) { setError('Inicia sesión para publicar tu perfil.'); return; }
        setPublishing(true);
        setError('');
        setInfo('');
        try {
            const doc = await mockFirebase.db.getDoc(auth.uid);
            const data = (doc.exists() && doc.data()) ? (doc.data() as UserData) : null;
            await upsertUser(auth.uid, {
                id: auth.uid,
                name: data?.name || 'Jugador',
                avatar: data?.avatar || '🦴',
                xp: data?.xp || 0,
                level: data?.level || 1,
                totalQuizzesCompleted: data?.totalQuizzesCompleted || 0,
                totalCorrectAnswers: data?.totalCorrectAnswers || 0,
                totalQuestionsAnswered: data?.totalQuestionsAnswered || 0,
                unlockedAchievements: data?.unlockedAchievements || {},
            });
            setInfo('Perfil publicado. Actualizando ranking…');
            await refresh();
        } catch {
            setError('No se pudo publicar tu perfil.');
        } finally {
            setPublishing(false);
        }
    };

    const handleOpenUser = async (u: PublicUser) => {
        setSelectedLoading(true);
        setFriendMsg('');
        try {
            const fresh = await getUserById(u.id);
            setSelected(fresh || u);
            if (auth?.uid && u.id) {
                try {
                    const st = await getFriendshipStatus(auth.uid, u.id);
                    setFriendState(st.status);
                    setIncomingRequestId(st.status === 'incoming' ? (st.requestId || null) : null);
                } catch {
                    setFriendState('none');
                    setIncomingRequestId(null);
                }
            } else {
                setFriendState('none');
                setIncomingRequestId(null);
            }
        } catch {
            setSelected(u);
        } finally {
            setSelectedLoading(false);
        }
    };

    const handleAddFriend = async () => {
        if (!auth || !selected) { setFriendMsg('Debes iniciar sesión.'); return; }
        if (auth.uid === selected.id) { setFriendMsg('No puedes agregarte a ti mismo.'); return; }
        setFriendLoading(true);
        setFriendMsg('');
        try {
            if (friendState === 'incoming' && incomingRequestId) {
                await acceptFriendRequest(incomingRequestId);
                setFriendMsg('Ahora son amigos.');
                setFriendState('friend');
            } else if (friendState === 'none') {
                await sendFriendRequest(auth.uid, selected.id);
                setFriendMsg('Solicitud enviada.');
                setFriendState('outgoing');
            }
        } catch {
            setFriendMsg('No se pudo enviar la solicitud.');
        } finally {
            setFriendLoading(false);
        }
    };

    const renderAchievements = (u: PublicUser) => {
        const entries = Object.entries(u.unlockedAchievements || {});
        if (entries.length === 0) return <span className="text-slate-500 text-sm">Sin logros</span>;
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-auto pr-1">
                {entries.map(([id, lvl]) => {
                    const ach = achievementsData.find(a => a.id === id);
                    const Icon = ach ? (iconMap as any)[ach.icon] : null;
                    return (
                        <div key={id} className="relative bg-slate-800/60 border border-slate-700 rounded-xl p-3 flex items-center gap-3 hover:bg-slate-800 transition-colors">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl">
                                    {Icon ? <Icon className="w-6 h-6"/> : <span>🏆</span>}
                                </div>
                                <span className="absolute -top-2 -right-2 bg-amber-400 text-black text-[10px] font-black px-1.5 py-0.5 rounded-full border border-amber-500 shadow">
                                    Lv {lvl as number}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <div className="text-slate-100 text-sm font-bold truncate">{ach?.name || id}</div>
                                <div className="text-slate-400 text-[11px] truncate">{ach?.tiers.find(t=>t.level===1)?.description || 'Logro desbloqueado'}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="p-4 md:p-6 pt-0">
            <div className="text-center mb-6">
                <h2 className="font-graffiti text-4xl md:text-5xl tracking-wide -rotate-1 title-white-clean inline-block transform scale-105">
                    Ranking
                </h2>
            </div>
            {loading ? (
                <div className="text-center text-slate-400">Cargando…</div>
            ) : (
                <div className="max-w-2xl mx-auto space-y-3">
                    {error && <div className="text-center text-red-400">{error}</div>}
                    {info && <div className="text-center text-sky-300">{info}</div>}
                    
                    {/* Botón para publicar/actualizar perfil - siempre visible */}
                    {auth && !users.find(u => u.id === auth.uid) && (
                        <div className="bg-blue-900/30 border-2 border-blue-500 rounded-xl p-4 text-center space-y-2">
                            <p className="text-slate-200 font-semibold">¡Únete al ranking!</p>
                            <p className="text-slate-400 text-sm">Publica tu perfil para aparecer en el leaderboard y competir con otros estudiantes.</p>
                            <button
                                onClick={handlePublishMe}
                                disabled={publishing}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold hover:from-blue-500 hover:to-blue-400 disabled:opacity-60 shadow-lg transition-all active:scale-95"
                            >
                                {publishing ? 'Publicando…' : '🚀 Publicar mi perfil'}
                            </button>
                        </div>
                    )}
                    
                    {/* Botón para actualizar perfil si ya existe */}
                    {auth && users.find(u => u.id === auth.uid) && (
                        <div className="flex justify-end">
                            <button
                                onClick={handlePublishMe}
                                disabled={publishing}
                                className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 text-sm font-semibold hover:bg-slate-600 disabled:opacity-60 transition-all"
                            >
                                {publishing ? 'Actualizando…' : '🔄 Actualizar mi perfil'}
                            </button>
                        </div>
                    )}
                    
                    {users.length === 0 && (
                        <div className="text-center space-y-3 py-8">
                            <div className="text-slate-500 text-lg">Aún no hay jugadores en el ranking.</div>
                            <div className="text-slate-600 text-sm">¡Sé el primero en aparecer!</div>
                        </div>
                    )}
                    {users.map((u, idx) => {
                        const isMe = auth?.uid === u.id;
                        return (
                            <button key={u.id} onClick={() => handleOpenUser(u)} className="w-full text-left">
                                <div className={`flex items-center justify-between rounded-xl p-3 hover:bg-slate-800 border ${isMe ? 'bg-blue-900/30 border-blue-600 shadow-[0_0_0_1px_rgba(59,130,246,0.4)]' : 'bg-slate-800/60 border-slate-700'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 text-center font-black ${isMe ? 'text-blue-300' : 'text-yellow-300'}`}>{idx + 1}</div>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${isMe ? 'bg-blue-800/60' : 'bg-slate-700'}`}>
                                            {u.avatar?.includes('/') ? <img src={u.avatar} alt="avatar" className="w-10 h-10 rounded-full"/> : <span>{u.avatar || '👤'}</span>}
                                        </div>
                                        <div>
                                            <div className="text-slate-100 font-bold">{isMe ? 'Yo' : (u.name || 'Jugador')}</div>
                                            <div className={`text-xs ${isMe ? 'text-blue-300' : 'text-slate-400'}`}>Nivel {u.level}</div>
                                        </div>
                                    </div>
                                    <div className={`font-black ${isMe ? 'text-blue-200' : 'text-slate-200'}`}>{u.xp} XP</div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {(selected || selectedLoading) && (
                <div className="fixed inset-0 z-50 grid place-items-center p-4" onClick={() => setSelected(null)}>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80 backdrop-blur-sm" />
                    <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden border border-slate-700 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 10%, rgba(56,189,248,0.25), transparent 40%), radial-gradient(circle at 80% 30%, rgba(239,68,68,0.18), transparent 45%), radial-gradient(circle at 50% 90%, rgba(250,204,21,0.18), transparent 40%)' }} />
                        <div className="relative bg-slate-900/90">
                            <div className="px-6 pt-5 pb-4 border-b border-slate-700 flex items-center gap-4">
                                {selectedLoading ? (
                                    <div className="text-slate-300">Cargando perfil…</div>
                                ) : selected && (
                                    <>
                                        <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center text-2xl">
                                            {selected.avatar?.includes('/') ? <img src={selected.avatar} alt="avatar" className="w-14 h-14 rounded-full"/> : <span>{selected.avatar || '👤'}</span>}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-white font-black text-2xl truncate">{selected.name || 'Jugador'}</div>
                                            <div className="text-slate-400 text-sm">Nivel {selected.level} • {selected.xp} XP</div>
                                        </div>
                                        <div className="ml-auto flex gap-2">
                                            <button onClick={() => setSelected(null)} className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-200 font-bold hover:bg-slate-600">Cerrar</button>
                                            {auth?.uid !== selected.id && (
                                                <button onClick={handleAddFriend} disabled={friendLoading || friendState === 'friend' || friendState === 'outgoing'} className={`px-3 py-1.5 rounded-lg font-bold disabled:opacity-60 ${friendState === 'incoming' ? 'bg-blue-600 text-white hover:bg-blue-500' : friendState === 'friend' ? 'bg-emerald-700 text-white' : friendState === 'outgoing' ? 'bg-slate-700 text-slate-200' : 'bg-green-600 text-white hover:bg-green-500'}`}>
                                                    {friendLoading ? 'Enviando…' : friendState === 'incoming' ? 'Aceptar' : friendState === 'friend' ? 'Amigo' : friendState === 'outgoing' ? 'Enviado' : 'Agregar amigo'}
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                            {!selectedLoading && selected && (
                                <div className="px-6 py-5 space-y-6">
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-slate-800/60 rounded-xl p-4 text-center border border-slate-700">
                                            <div className="text-slate-400 text-xs">Quizzes</div>
                                            <div className="text-slate-100 font-black text-xl">{selected.totalQuizzesCompleted ?? '—'}</div>
                                        </div>
                                        <div className="bg-slate-800/60 rounded-xl p-4 text-center border border-slate-700">
                                            <div className="text-slate-400 text-xs">Correctas</div>
                                            <div className="text-slate-100 font-black text-xl">{selected.totalCorrectAnswers ?? '—'}</div>
                                        </div>
                                        <div className="bg-slate-800/60 rounded-xl p-4 text-center border border-slate-700">
                                            <div className="text-slate-400 text-xs">Respondidas</div>
                                            <div className="text-slate-100 font-black text-xl">{selected.totalQuestionsAnswered ?? '—'}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-slate-300 font-semibold mb-2">Logros</div>
                                        {renderAchievements(selected)}
                                    </div>
                                    {friendMsg && <div className="text-center text-sky-300 text-sm">{friendMsg}</div>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(LeaderboardScreen);