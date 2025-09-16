import { getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp, getDocs, collection, query, orderBy, limit, Firestore, addDoc, getDoc, where, updateDoc } from 'firebase/firestore';
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
    
    // Trae un lote amplio y filtra por activos para evitar índices compuestos
    const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(Math.max(max, 200)));
    const snap = await getDocs(q);
    const all = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<PublicUser, 'id'>) }));
    const cutoff = Date.now() - 2 * 60 * 1000; // 2 minutos
    const activeOnly = all.filter(u => {
      const anyU = u as any;
      const isActive = anyU.active === true;
      const ts = anyU.lastSeenAt;
      const ms = ts?.toMillis?.() ? ts.toMillis() : (typeof ts?.seconds === 'number' ? ts.seconds * 1000 : 0);
      return isActive && ms >= cutoff;
    });
    return activeOnly.slice(0, max);
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
  targetScore?: number;
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
      console.warn('Firestore no disponible, devolviendo lista vacía de regalos');
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
  } catch (error) {
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
    
    // Calculate end date based on challenge type
    const now = new Date();
    let endDate: Date;
    
    switch (challengeType) {
      case 'weekly_score':
        endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'quiz_streak':
        endDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        break;
      case 'accuracy_battle':
        endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        break;
      case 'speed_run':
        endDate = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
        break;
      default:
        endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
    
    await addDoc(collection(db, 'friendChallenges'), {
      fromUid,
      toUid,
      type: challengeType,
      status: 'pending',
      createdAt: serverTimestamp(),
      endDate: serverTimestamp(),
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
    
    // Get challenges where user is either sender or receiver
    const qSent = query(
      collection(db, 'friendChallenges'),
      where('fromUid', '==', uid),
      where('status', 'in', ['pending', 'active'])
    );
    const qReceived = query(
      collection(db, 'friendChallenges'),
      where('toUid', '==', uid),
      where('status', 'in', ['pending', 'active'])
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
