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

const resolveDb = (): Firestore => {
  return getDb() || getFirestore(getApp());
};

export const upsertUser = async (uid: string, data: PublicUser & { id?: string }) => {
  const { id, ...rest } = data;
  const db = resolveDb();
  await setDoc(doc(db, 'users', uid), { ...rest, active: true, lastSeenAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
};

export const setUserActive = async (uid: string, active: boolean) => {
  const db = resolveDb();
  await setDoc(doc(db, 'users', uid), { active, lastSeenAt: serverTimestamp() }, { merge: true });
};

export const getTopUsers = async (max = 50): Promise<PublicUser[]> => {
  const db = resolveDb();
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
};

export const getUserById = async (uid: string): Promise<PublicUser | null> => {
  const db = resolveDb();
  const ref = await getDoc(doc(db, 'users', uid));
  if (!ref.exists()) return null;
  return { id: ref.id, ...(ref.data() as Omit<PublicUser, 'id'>) };
};

export const sendFriendRequest = async (fromUid: string, toUid: string) => {
  const db = resolveDb();
  await addDoc(collection(db, 'friendRequests'), {
    fromUid,
    toUid,
    status: 'pending',
    createdAt: serverTimestamp()
  });
};

// --- Friends API ---
export const getIncomingFriendRequests = async (uid: string): Promise<FriendRequest[]> => {
  const db = resolveDb();
  const q = query(
    collection(db, 'friendRequests'),
    where('toUid', '==', uid),
    where('status', '==', 'pending')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<FriendRequest, 'id'>) }));
};

export const acceptFriendRequest = async (requestId: string): Promise<void> => {
  const db = resolveDb();
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
};

export const rejectFriendRequest = async (requestId: string): Promise<void> => {
  const db = resolveDb();
  const reqRef = doc(db, 'friendRequests', requestId);
  try {
    await updateDoc(reqRef, { status: 'rejected' });
  } catch {}
};

export const listFriendsUserIds = async (uid: string): Promise<string[]> => {
  const db = resolveDb();
  // Query both sides
  const qA = query(collection(db, 'friends'), where('userA', '==', uid));
  const qB = query(collection(db, 'friends'), where('userB', '==', uid));
  const [snapA, snapB] = await Promise.all([getDocs(qA), getDocs(qB)]);
  const idsA = snapA.docs.map(d => (d.data() as any).userB as string);
  const idsB = snapB.docs.map(d => (d.data() as any).userA as string);
  return Array.from(new Set([...idsA, ...idsB]));
};

export const listFriendsPublic = async (uid: string): Promise<PublicUser[]> => {
  const userIds = await listFriendsUserIds(uid);
  const results = await Promise.all(userIds.map(id => getUserById(id)));
  return results.filter(Boolean) as PublicUser[];
};

export const getFriendshipStatus = async (
  myUid: string,
  otherUid: string
): Promise<{ status: 'friend' | 'outgoing' | 'incoming' | 'none'; requestId?: string }> => {
  const db = resolveDb();
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
};
