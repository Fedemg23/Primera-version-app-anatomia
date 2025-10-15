import { getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp, getDocs, collection, query, orderBy, limit, Firestore, addDoc, getDoc, where, updateDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { getDb } from './firebase';

export type PublicUser = {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  updatedAt?: any;
  active?: boolean;
  lastSeenAt?: any;
  // Extras para perfil público
  totalQuizzesCompleted?: number;
  totalCorrectAnswers?: number;
  totalQuestionsAnswered?: number;
  unlockedAchievements?: { [id: string]: number };
  // Marcos de ranked
  activeFrame?: any; // League | null
  unlockedFrames?: any[]; // League[]
};

export type FriendRequest = {
  id: string;
  fromUid: string;
  toUid: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: any;
};

export type FriendLink = {
  id: string; // sorted pair id: `${min}_${max}`
  userA: string;
  userB: string;
  createdAt: any;
};

const resolveDb = (): Firestore | null => {
  try {
    return getDb() || getFirestore(getApp());
  } catch (error) {
    console.warn('No se pudo resolver Firestore:', error);
    return null;
  }
};

export const upsertUser = async (uid: string, data: PublicUser & { id?: string }) => {
  try {
    const { id, ...rest } = data;
    const db = resolveDb();
    if (!db) {
      console.warn('Firestore no disponible, saltando actualización de usuario público');
      return;
    }
    await setDoc(doc(db, 'users', uid), { ...rest, active: true, lastSeenAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.warn('Error actualizando usuario público:', error);
  }
};

export const setUserActive = async (uid: string, active: boolean) => {
  try {
    const db = resolveDb();
    if (!db) {
      console.warn('Firestore no disponible, saltando actualización de estado activo');
      return;
    }
    await setDoc(doc(db, 'users', uid), { active, lastSeenAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.warn('Error actualizando estado activo:', error);
  }
};

export const getTopUsers = async (max = 50): Promise<PublicUser[]> => {
  try {
    const db = resolveDb();
    if (!db) {
      console.warn('Firestore no disponible, devolviendo lista vacía de usuarios');
      return [];
    }
    
    // Trae un lote amplio ordenado por XP
    const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(Math.max(max, 200)));
    const snap = await getDocs(q);
    const all = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<PublicUser, 'id'>) }));
    
    // Filtro más permisivo: usuarios activos en los últimos 30 días (o sin timestamp = recién creados)
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 días
    const filtered = all.filter(u => {
      const anyU = u as any;
      
      // Si no tiene lastSeenAt, es un usuario nuevo que aún no se ha sincronizado, inclúyelo
      if (!anyU.lastSeenAt) return true;
      
      // Si tiene lastSeenAt, verifica que esté dentro de los últimos 30 días
      const ts = anyU.lastSeenAt;
      const ms = ts?.toMillis?.() ? ts.toMillis() : (typeof ts?.seconds === 'number' ? ts.seconds * 1000 : 0);
      
      // Incluir usuarios activos en los últimos 30 días
      return ms >= cutoff;
    });
    
    return filtered.slice(0, max);
  } catch (error) {
    console.warn('Error obteniendo top usuarios:', error);
    return [];
  }
};

export const getUserById = async (uid: string): Promise<PublicUser | null> => {
  try {
    const db = resolveDb();
    if (!db) {
      console.warn('Firestore no disponible, no se puede obtener usuario');
      return null;
    }
    
    const ref = await getDoc(doc(db, 'users', uid));
    if (!ref.exists()) return null;
    return { id: ref.id, ...(ref.data() as Omit<PublicUser, 'id'>) };
  } catch (error) {
    console.warn('Error obteniendo usuario por ID:', error);
    return null;
  }
};

export const sendFriendRequest = async (fromUid: string, toUid: string) => {
  try {
    const db = resolveDb();
    if (!db) {
      throw new Error('Firestore no disponible, no se puede enviar solicitud de amistad');
    }
    
    await addDoc(collection(db, 'friendRequests'), {
      fromUid,
      toUid,
      status: 'pending',
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.warn('Error enviando solicitud de amistad:', error);
    throw error;
  }
};

// --- Friends API ---
export const getIncomingFriendRequests = async (uid: string): Promise<FriendRequest[]> => {
  try {
    const db = resolveDb();
    if (!db) {
      console.warn('Firestore no disponible, devolviendo lista vacía de solicitudes');
      return [];
    }
    
    const q = query(
      collection(db, 'friendRequests'),
      where('toUid', '==', uid),
      where('status', '==', 'pending')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<FriendRequest, 'id'>) }));
  } catch (error) {
    console.warn('Error obteniendo solicitudes de amistad:', error);
    return [];
  }
};

export const acceptFriendRequest = async (requestId: string): Promise<void> => {
  try {
    const db = resolveDb();
    if (!db) {
      throw new Error('Firestore no disponible');
    }
    
    const reqRef = doc(db, 'friendRequests', requestId);
    const reqSnap = await getDoc(reqRef);
    if (!reqSnap.exists()) return;
    const data = reqSnap.data() as Omit<FriendRequest, 'id'>;
    const a = data.fromUid;
    const b = data.toUid;
    const pairId = [a, b].sort().join('_');
    await Promise.all([
      updateDoc(reqRef, { status: 'accepted' }),
      setDoc(doc(db, 'friends', pairId), { userA: a, userB: b, createdAt: serverTimestamp() }, { merge: true })
    ]);
  } catch (error) {
    console.warn('Error aceptando solicitud de amistad:', error);
    throw error;
  }
};

export const rejectFriendRequest = async (requestId: string): Promise<void> => {
  try {
    const db = resolveDb();
    if (!db) return;
    
    const reqRef = doc(db, 'friendRequests', requestId);
    await updateDoc(reqRef, { status: 'rejected' });
  } catch (error) {
    console.warn('Error rechazando solicitud de amistad:', error);
  }
};

export const listFriendsUserIds = async (uid: string): Promise<string[]> => {
  try {
    const db = resolveDb();
    if (!db) {
      console.warn('Firestore no disponible, devolviendo lista vacía de amigos');
      return [];
    }
    
    // Query both sides
    const qA = query(collection(db, 'friends'), where('userA', '==', uid));
    const qB = query(collection(db, 'friends'), where('userB', '==', uid));
    const [snapA, snapB] = await Promise.all([getDocs(qA), getDocs(qB)]);
    const idsA = snapA.docs.map(d => (d.data() as any).userB as string);
    const idsB = snapB.docs.map(d => (d.data() as any).userA as string);
    return Array.from(new Set([...idsA, ...idsB]));
  } catch (error) {
    console.warn('Error obteniendo lista de amigos:', error);
    return [];
  }
};

export const listFriendsPublic = async (uid: string): Promise<PublicUser[]> => {
  try {
    const userIds = await listFriendsUserIds(uid);
    const results = await Promise.all(userIds.map(id => getUserById(id)));
    return results.filter(Boolean) as PublicUser[];
  } catch (error) {
    console.warn('Error obteniendo amigos públicos:', error);
    return [];
  }
};

export const getFriendshipStatus = async (
  myUid: string,
  otherUid: string
): Promise<{ status: 'friend' | 'outgoing' | 'incoming' | 'none'; requestId?: string }> => {
  try {
    const db = resolveDb();
    if (!db) {
      console.warn('Firestore no disponible, devolviendo estado none');
      return { status: 'none' };
    }
    
    // Friend link exists?
    const pairId = [myUid, otherUid].sort().join('_');
    const pairSnap = await getDoc(doc(db, 'friends', pairId));
    if (pairSnap.exists()) return { status: 'friend' };
    
    // Outgoing pending?
    const qOut = query(
      collection(db, 'friendRequests'),
      where('fromUid', '==', myUid),
      where('toUid', '==', otherUid),
      where('status', '==', 'pending'),
      limit(1)
    );
    const outSnap = await getDocs(qOut);
    if (!outSnap.empty) return { status: 'outgoing', requestId: outSnap.docs[0].id };
    
    // Incoming pending?
    const qIn = query(
      collection(db, 'friendRequests'),
      where('fromUid', '==', otherUid),
      where('toUid', '==', myUid),
      where('status', '==', 'pending'),
      limit(1)
    );
    const inSnap = await getDocs(qIn);
    if (!inSnap.empty) return { status: 'incoming', requestId: inSnap.docs[0].id };
    
    return { status: 'none' };
  } catch (error) {
    console.warn('Error obteniendo estado de amistad:', error);
    return { status: 'none' };
  }
};

// --- FRIEND GIFTS & CHALLENGES ---
export type FriendGift = {
  id: string;
  fromUid: string;
  toUid: string;
  type: 'heart' | 'xp_boost' | 'hint';
  amount: number;
  message?: string;
  status: 'pending' | 'claimed';
  createdAt: any;
};

export type FriendChallenge = {
  id: string;
  fromUid: string;
  toUid: string;
  type: 'weekly_score' | 'quiz_streak' | 'accuracy_battle' | 'speed_run';
  status: 'pending' | 'active' | 'completed' | 'expired';
  createdAt: any;
  endDate: any;
  fromUserScore: number;
  toUserScore: number;
  // Para accuracy_battle: tracking de correctas/totales
  fromUserCorrect?: number;
  fromUserTotal?: number;
  toUserCorrect?: number;
  toUserTotal?: number;
  targetScore?: number;
  winner?: string; // uid del ganador, o 'tie' si empate
  rewardClaimed?: boolean; // si el ganador ya reclamó su recompensa
  rules?: {
    timeLimit?: number;
    questionCount?: number;
    region?: string;
  };
};

export const sendFriendGift = async (fromUid: string, toUid: string, type: FriendGift['type'], amount: number = 1, message?: string) => {
  try {
    const db = resolveDb();
    if (!db) {
      throw new Error('Firestore no disponible');
    }
    
    await addDoc(collection(db, 'friendGifts'), {
      fromUid,
      toUid,
      type,
      amount,
      message,
      status: 'pending',
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.warn('Error enviando regalo a amigo:', error);
    throw error;
  }
};

export const getPendingGifts = async (uid: string): Promise<FriendGift[]> => {
  try {
    const db = resolveDb();
    if (!db) {
      return [];
    }
    
    const q = query(
      collection(db, 'friendGifts'),
      where('toUid', '==', uid),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<FriendGift, 'id'>) }));
  } catch (error: any) {
    // Silenciar errores de permisos - funcionalidad opcional
    if (error?.code === 'permission-denied' || error?.message?.includes('permission')) {
      return [];
    }
    console.warn('Error obteniendo regalos pendientes:', error);
    return [];
  }
};

export const claimFriendGift = async (giftId: string): Promise<void> => {
  try {
    const db = resolveDb();
    if (!db) return;
    
    await updateDoc(doc(db, 'friendGifts', giftId), { 
      status: 'claimed',
      claimedAt: serverTimestamp()
    });
  } catch (error) {
    console.warn('Error reclamando regalo:', error);
    throw error;
  }
};

export const challengeFriend = async (fromUid: string, toUid: string, challengeType: FriendChallenge['type'], rules?: FriendChallenge['rules']) => {
  try {
    const db = resolveDb();
    if (!db) {
      throw new Error('Firestore no disponible');
    }
    
    // Todos los desafíos duran 3 minutos
    const now = new Date();
    const endDate = new Date(now.getTime() + 3 * 60 * 1000); // 3 minutos
    
    await addDoc(collection(db, 'friendChallenges'), {
      fromUid,
      toUid,
      type: challengeType,
      status: 'active', // Cambiar a 'active' inmediatamente
      createdAt: serverTimestamp(),
      endDate: endDate,
      fromUserScore: 0,
      toUserScore: 0,
      rules: rules || {}
    });
  } catch (error) {
    console.warn('Error enviando desafío a amigo:', error);
    throw error;
  }
};

export const getActiveChallenges = async (uid: string): Promise<FriendChallenge[]> => {
  try {
    const db = resolveDb();
    if (!db) {
      console.warn('Firestore no disponible, devolviendo lista vacía de desafíos');
      return [];
    }
    
    // Get challenges where user is either sender or receiver (incluye 'completed' para recompensas)
    const qSent = query(
      collection(db, 'friendChallenges'),
      where('fromUid', '==', uid),
      where('status', 'in', ['pending', 'active', 'completed'])
    );
    const qReceived = query(
      collection(db, 'friendChallenges'),
      where('toUid', '==', uid),
      where('status', 'in', ['pending', 'active', 'completed'])
    );
    
    const [sentSnap, receivedSnap] = await Promise.all([getDocs(qSent), getDocs(qReceived)]);
    
    const sentChallenges = sentSnap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<FriendChallenge, 'id'>) }));
    const receivedChallenges = receivedSnap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<FriendChallenge, 'id'>) }));
    
    return [...sentChallenges, ...receivedChallenges];
  } catch (error) {
    console.warn('Error obteniendo desafíos activos:', error);
    return [];
  }
};

// Listener en tiempo real para desafíos activos
export const subscribeToActiveChallenges = (
  uid: string, 
  onUpdate: (challenges: FriendChallenge[]) => void
): Unsubscribe => {
  const db = resolveDb();
  if (!db) {
    console.warn('Firestore no disponible');
    return () => {};
  }

  const unsubscribers: Unsubscribe[] = [];

  // Query para desafíos enviados (incluye 'completed' para poder reclamar recompensas)
  const qSent = query(
    collection(db, 'friendChallenges'),
    where('fromUid', '==', uid),
    where('status', 'in', ['pending', 'active', 'completed'])
  );

  // Query para desafíos recibidos (incluye 'completed' para poder reclamar recompensas)
  const qReceived = query(
    collection(db, 'friendChallenges'),
    where('toUid', '==', uid),
    where('status', 'in', ['pending', 'active', 'completed'])
  );

  let sentChallenges: FriendChallenge[] = [];
  let receivedChallenges: FriendChallenge[] = [];

  const updateChallenges = () => {
    const allChallenges = [...sentChallenges, ...receivedChallenges];
    // Eliminar duplicados por ID
    const uniqueChallenges = Array.from(
      new Map(allChallenges.map(c => [c.id, c])).values()
    );
    onUpdate(uniqueChallenges);
  };

  // Listener para desafíos enviados
  const unsubSent = onSnapshot(qSent, (snapshot) => {
    sentChallenges = snapshot.docs.map(d => ({ 
      id: d.id, 
      ...(d.data() as Omit<FriendChallenge, 'id'>) 
    }));
    updateChallenges();
  }, (error) => {
    console.warn('Error en listener de desafíos enviados:', error);
  });

  // Listener para desafíos recibidos
  const unsubReceived = onSnapshot(qReceived, (snapshot) => {
    receivedChallenges = snapshot.docs.map(d => ({ 
      id: d.id, 
      ...(d.data() as Omit<FriendChallenge, 'id'>) 
    }));
    updateChallenges();
  }, (error) => {
    console.warn('Error en listener de desafíos recibidos:', error);
  });

  unsubscribers.push(unsubSent, unsubReceived);

  // Retornar función para cancelar todas las suscripciones
  return () => {
    unsubscribers.forEach(unsub => unsub());
  };
};

// Listener en tiempo real para regalos pendientes
export const subscribeToPendingGifts = (
  uid: string,
  onUpdate: (gifts: FriendGift[]) => void
): Unsubscribe => {
  const db = resolveDb();
  if (!db) {
    console.warn('Firestore no disponible');
    return () => {};
  }

  const q = query(
    collection(db, 'friendGifts'),
    where('toUid', '==', uid),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const gifts = snapshot.docs.map(d => ({ 
      id: d.id, 
      ...(d.data() as Omit<FriendGift, 'id'>) 
    }));
    onUpdate(gifts);
  }, (error) => {
    if (error?.code === 'permission-denied' || error?.message?.includes('permission')) {
      // Silenciar errores de permisos
      return;
    }
    console.warn('Error en listener de regalos:', error);
  });
};

// Limpiar desafíos finalizados (más de 8 horas después de expirar)
export const cleanupExpiredChallenges = async (uid: string): Promise<void> => {
  try {
    const db = resolveDb();
    if (!db) return;

    const now = Date.now();
    const eightHoursAgo = now - 8 * 60 * 60 * 1000;

    // Buscar desafíos donde el usuario participa
    const qSent = query(
      collection(db, 'friendChallenges'),
      where('fromUid', '==', uid)
    );
    const qReceived = query(
      collection(db, 'friendChallenges'),
      where('toUid', '==', uid)
    );

    const [sentSnap, receivedSnap] = await Promise.all([getDocs(qSent), getDocs(qReceived)]);
    
    const deletions: Promise<void>[] = [];
    
    // Primero marcar ganadores de desafíos que acaban de expirar
    const updates: Promise<void>[] = [];
    
    [...sentSnap.docs, ...receivedSnap.docs].forEach(docSnap => {
      const challenge = docSnap.data() as FriendChallenge;
      
      // Verificar si el desafío ha expirado
      let endTime: number;
      if (challenge.endDate?.toMillis) {
        endTime = challenge.endDate.toMillis();
      } else if (challenge.endDate instanceof Date) {
        endTime = challenge.endDate.getTime();
      } else if (typeof challenge.endDate === 'string') {
        endTime = new Date(challenge.endDate).toMillis();
      } else {
        return; // No se puede determinar la fecha
      }
      
      // Si está activo y ya expiró, determinar ganador
      if (challenge.status === 'active' && endTime < now) {
        let winner: string | undefined;
        
        if (challenge.fromUserScore > challenge.toUserScore) {
          winner = challenge.fromUid;
        } else if (challenge.toUserScore > challenge.fromUserScore) {
          winner = challenge.toUid;
        } else {
          winner = 'tie';
        }
        
        updates.push(
          updateDoc(doc(db, 'friendChallenges', docSnap.id), {
            status: 'completed',
            winner: winner,
            rewardClaimed: false
          })
        );
      }
      
      // Si ha expirado hace más de 8 horas O si ya se reclamó la recompensa, marcarlo como expired
      if (endTime < eightHoursAgo || (challenge.status === 'completed' && challenge.rewardClaimed)) {
        deletions.push(
          updateDoc(doc(db, 'friendChallenges', docSnap.id), {
            status: 'expired'
          })
        );
      }
    });
    
    await Promise.all([...updates, ...deletions]);
  } catch (error) {
    console.warn('Error limpiando desafíos expirados:', error);
  }
};

// Actualizar puntuación de desafíos activos
export const updateChallengeScore = async (uid: string, scoreToAdd: number, quizzesCompleted: number = 0, correctAnswers: number = 0, questionsAnswered: number = 0): Promise<void> => {
  try {
    const db = resolveDb();
    if (!db) {
      console.warn('Firestore no disponible');
      return;
    }

    // Obtener desafíos activos donde el usuario participa
    const qSent = query(
      collection(db, 'friendChallenges'),
      where('fromUid', '==', uid),
      where('status', '==', 'active')
    );
    const qReceived = query(
      collection(db, 'friendChallenges'),
      where('toUid', '==', uid),
      where('status', '==', 'active')
    );

    const [sentSnap, receivedSnap] = await Promise.all([getDocs(qSent), getDocs(qReceived)]);
    
    // Actualizar todos los desafíos activos
    const updates: Promise<void>[] = [];
    
    sentSnap.docs.forEach(docSnap => {
      const challenge = docSnap.data() as FriendChallenge;
      const currentScore = challenge.fromUserScore || 0;
      
      // Calcular puntuación según el tipo de desafío
      let newScore = currentScore;
      const updateData: any = {};
      
      switch (challenge.type) {
        case 'weekly_score':
          // Sumar XP directamente
          newScore = currentScore + scoreToAdd;
          updateData.fromUserScore = newScore;
          break;
        case 'quiz_streak':
          // Contar quizzes perfectos (solo si accuracy es 100%)
          const isPerfect = questionsAnswered > 0 && correctAnswers === questionsAnswered;
          newScore = currentScore + (isPerfect ? 1 : 0);
          updateData.fromUserScore = newScore;
          break;
        case 'accuracy_battle':
          // Calcular porcentaje de aciertos
          const newCorrect = (challenge.fromUserCorrect || 0) + correctAnswers;
          const newTotal = (challenge.fromUserTotal || 0) + questionsAnswered;
          newScore = newTotal > 0 ? Math.round((newCorrect / newTotal) * 100) : 0;
          updateData.fromUserScore = newScore;
          updateData.fromUserCorrect = newCorrect;
          updateData.fromUserTotal = newTotal;
          break;
        case 'speed_run':
          // Sumar preguntas respondidas (velocidad)
          newScore = currentScore + questionsAnswered;
          updateData.fromUserScore = newScore;
          break;
      }
      
      updates.push(
        updateDoc(doc(db, 'friendChallenges', docSnap.id), updateData)
      );
    });
    
    receivedSnap.docs.forEach(docSnap => {
      const challenge = docSnap.data() as FriendChallenge;
      const currentScore = challenge.toUserScore || 0;
      
      // Calcular puntuación según el tipo de desafío
      let newScore = currentScore;
      const updateData: any = {};
      
      switch (challenge.type) {
        case 'weekly_score':
          newScore = currentScore + scoreToAdd;
          updateData.toUserScore = newScore;
          break;
        case 'quiz_streak':
          // Contar quizzes perfectos (solo si accuracy es 100%)
          const isPerfect = questionsAnswered > 0 && correctAnswers === questionsAnswered;
          newScore = currentScore + (isPerfect ? 1 : 0);
          updateData.toUserScore = newScore;
          break;
        case 'accuracy_battle':
          // Calcular porcentaje de aciertos
          const newCorrect = (challenge.toUserCorrect || 0) + correctAnswers;
          const newTotal = (challenge.toUserTotal || 0) + questionsAnswered;
          newScore = newTotal > 0 ? Math.round((newCorrect / newTotal) * 100) : 0;
          updateData.toUserScore = newScore;
          updateData.toUserCorrect = newCorrect;
          updateData.toUserTotal = newTotal;
          break;
        case 'speed_run':
          newScore = currentScore + questionsAnswered;
          updateData.toUserScore = newScore;
          break;
      }
      
      updates.push(
        updateDoc(doc(db, 'friendChallenges', docSnap.id), updateData)
      );
    });

    await Promise.all(updates);
  } catch (error) {
    console.warn('Error actualizando puntuación de desafíos:', error);
  }
};

// Reclamar recompensa de un desafío ganado
export const claimChallengeReward = async (challengeId: string, uid: string): Promise<void> => {
  try {
    const db = resolveDb();
    if (!db) {
      throw new Error('Firestore no disponible');
    }
    
    // Obtener el desafío
    const challengeDoc = await getDoc(doc(db, 'friendChallenges', challengeId));
    if (!challengeDoc.exists()) {
      throw new Error('Desafío no encontrado');
    }
    
    const challenge = challengeDoc.data() as FriendChallenge;
    
    // Verificar que el usuario es el ganador y no ha reclamado aún
    if (challenge.winner !== uid) {
      throw new Error('No eres el ganador de este desafío');
    }
    
    if (challenge.rewardClaimed) {
      throw new Error('Ya reclamaste la recompensa de este desafío');
    }
    
    // Marcar como reclamado
    await updateDoc(doc(db, 'friendChallenges', challengeId), {
      rewardClaimed: true
    });
  } catch (error) {
    console.warn('Error reclamando recompensa de desafío:', error);
    throw error;
  }
};

// --- RANKED MODE API ---

import { RankedProfile, MatchRecord, RankedLeaderboardEntry, League, MatchMode } from '../types';
import { getLeagueFromRating } from '../utils/rankedElo';

const CURRENT_SEASON_ID = 'season_7'; // Actualizar cada temporada

/**
 * Obtiene o crea el perfil ranked del usuario
 */
export const getRankedProfile = async (uid: string): Promise<RankedProfile> => {
  try {
    const db = resolveDb();
    if (!db) {
      throw new Error('Firestore no disponible');
    }

    const profileRef = doc(db, 'rankedProfiles', uid);
    const profileSnap = await getDoc(profileRef);

    if (profileSnap.exists()) {
      return profileSnap.data() as RankedProfile;
    }

    // Crear perfil inicial
    const initialProfile: RankedProfile = {
      userId: uid,
      rating: 1000, // Rating inicial
      league: 'Bronce',
      provisionalGames: 10,
      streak: 0,
      seasonId: CURRENT_SEASON_ID,
      currencyBalance: 1000,
      lastMatchAt: new Date().toISOString(),
      bestRating: 1000,
      totalMatches: 0,
      wins: 0,
      losses: 0,
      draws: 0
    };

    await setDoc(profileRef, initialProfile);
    return initialProfile;
  } catch (error) {
    console.warn('Error obteniendo perfil ranked:', error);
    throw error;
  }
};

/**
 * Actualiza el perfil ranked después de un match
 */
export const updateRankedProfile = async (
  uid: string,
  updates: Partial<RankedProfile>
): Promise<void> => {
  try {
    const db = resolveDb();
    if (!db) {
      throw new Error('Firestore no disponible');
    }

    const profileRef = doc(db, 'rankedProfiles', uid);
    
    // Actualizar liga si el rating cambió
    if (updates.rating !== undefined) {
      updates.league = getLeagueFromRating(updates.rating);
    }

    await updateDoc(profileRef, { ...updates, lastMatchAt: new Date().toISOString() });
  } catch (error) {
    console.warn('Error actualizando perfil ranked:', error);
    throw error;
  }
};

/**
 * Registra un match completado
 */
export const recordMatch = async (match: MatchRecord): Promise<void> => {
  try {
    const db = resolveDb();
    if (!db) {
      throw new Error('Firestore no disponible');
    }

    await setDoc(doc(db, 'rankedMatches', match.matchId), match);
  } catch (error) {
    console.warn('Error registrando match:', error);
    throw error;
  }
};

/**
 * Obtiene el historial de matches del usuario
 */
export const getMatchHistory = async (uid: string, limitCount: number = 20): Promise<MatchRecord[]> => {
  try {
    const db = resolveDb();
    if (!db) {
      return [];
    }

    // Buscar matches donde el usuario es p1 o p2
    const q1 = query(
      collection(db, 'rankedMatches'),
      where('p1.userId', '==', uid),
      orderBy('finishedAt', 'desc'),
      limit(limitCount)
    );

    const q2 = query(
      collection(db, 'rankedMatches'),
      where('p2.userId', '==', uid),
      orderBy('finishedAt', 'desc'),
      limit(limitCount)
    );

    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

    const matches = [
      ...snap1.docs.map(d => d.data() as MatchRecord),
      ...snap2.docs.map(d => d.data() as MatchRecord)
    ];

    // Ordenar por fecha y limitar
    matches.sort((a, b) => new Date(b.finishedAt).getTime() - new Date(a.finishedAt).getTime());

    return matches.slice(0, limitCount);
  } catch (error) {
    console.warn('Error obteniendo historial de matches:', error);
    return [];
  }
};

/**
 * Obtiene el leaderboard ranked
 */
export const getRankedLeaderboard = async (
  scope: 'global' | 'country' | 'friends' = 'global',
  mode?: MatchMode,
  userIds?: string[],
  limitCount: number = 50
): Promise<RankedLeaderboardEntry[]> => {
  try {
    const db = resolveDb();
    if (!db) {
      return [];
    }

    let q = query(
      collection(db, 'rankedProfiles'),
      orderBy('rating', 'desc'),
      limit(limitCount)
    );

    // Filtrar por IDs (para amigos)
    if (scope === 'friends' && userIds && userIds.length > 0) {
      // Firestore no soporta IN con más de 10 elementos, limitar
      const idsToQuery = userIds.slice(0, 10);
      q = query(
        collection(db, 'rankedProfiles'),
        where('userId', 'in', idsToQuery),
        orderBy('rating', 'desc')
      );
    }

    const snap = await getDocs(q);
    const profiles = snap.docs.map(d => d.data() as RankedProfile);

    // Obtener datos públicos de usuarios
    const userDataPromises = profiles.map(p => getUserById(p.userId));
    const usersData = await Promise.all(userDataPromises);

    const leaderboard: RankedLeaderboardEntry[] = profiles.map((profile, idx) => {
      const userData = usersData[idx];
      return {
        userId: profile.userId,
        name: userData?.name || 'Anónimo',
        avatar: userData?.avatar || '👤',
        rating: profile.rating,
        league: profile.league,
        streak: profile.streak,
        country: undefined, // TODO: Agregar país a perfil público
        rank: idx + 1,
        hasRankedProfile: true,
        activeFrame: userData?.activeFrame || null
      };
    });

    // Filtrar provisionales del ranking global
    if (scope === 'global') {
      const filtered = leaderboard.filter((_, idx) => {
        const profile = profiles[idx];
        return profile.provisionalGames === 0;
      });
      return filtered;
    }

    // Para amigos, agregar los que no tienen perfil ranked
    if (scope === 'friends' && userIds && userIds.length > 0) {
      const rankedFriendIds = new Set(profiles.map(p => p.userId));
      const friendsWithoutRanked = userIds.filter(id => !rankedFriendIds.has(id));
      
      // Obtener datos de amigos sin ranked
      const friendsDataPromises = friendsWithoutRanked.map(id => getUserById(id));
      const friendsData = await Promise.all(friendsDataPromises);
      
      const friendsWithoutRankedEntries: RankedLeaderboardEntry[] = friendsData
        .filter(Boolean)
        .map(userData => ({
          userId: userData!.userId,
          name: userData!.name || 'Anónimo',
          avatar: userData!.avatar || '👤',
          rating: 0,
          league: 'Sin Rango' as const,
          streak: 0,
          country: undefined,
          rank: undefined,
          hasRankedProfile: false,
          activeFrame: userData!.activeFrame || null
        }));
      
      // Combinar: primero los que tienen ranked (ordenados por rating), luego los sin ranked
      return [...leaderboard, ...friendsWithoutRankedEntries];
    }

    return leaderboard;
  } catch (error) {
    console.warn('Error obteniendo leaderboard ranked:', error);
    return [];
  }
};

/**
 * Obtiene la posición del usuario en el leaderboard
 */
export const getUserRankedPosition = async (uid: string): Promise<number | null> => {
  try {
    const db = resolveDb();
    if (!db) {
      return null;
    }

    const userProfile = await getRankedProfile(uid);

    // Contar usuarios con rating mayor
    const q = query(
      collection(db, 'rankedProfiles'),
      where('rating', '>', userProfile.rating),
      where('provisionalGames', '==', 0)
    );

    const snap = await getDocs(q);
    return snap.size + 1;
  } catch (error) {
    console.warn('Error obteniendo posición ranked:', error);
    return null;
  }
};
