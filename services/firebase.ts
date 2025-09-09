
import { AuthUser, UserData } from '../types';
import type { FirebaseApp } from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithRedirect, 
    getRedirectResult, 
    signOut as firebaseSignOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    sendPasswordResetEmail
} from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { initializeFirestore, getFirestore, doc as fbDoc, getDoc as fbGetDoc, setDoc as fbSetDoc, onSnapshot as fbOnSnapshot } from 'firebase/firestore';

interface MockAuth {
    currentUser: AuthUser | null;
    signIn: () => Promise<{ user: AuthUser }>;
    signOut: () => Promise<void>;
    signUpWithEmail: (email: string, pass: string) => Promise<{ user: AuthUser }>;
    signInWithEmail: (email: string, pass: string) => Promise<{ user: AuthUser }>;
    resendVerification: (email: string, pass: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

interface MockDb {
    getDoc: (userId: string) => Promise<{
        exists: () => boolean;
        data: () => UserData | null;
    }>;
    setDoc: (userId: string, data: UserData) => Promise<void>;
}

interface MockFirebase {
    auth: MockAuth;
    db: MockDb;
}

const readFirebaseEnv = () => {
    const env = (import.meta as any)?.env || {};
    const cfg = {
        apiKey: env.VITE_FIREBASE_API_KEY,
        authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: env.VITE_FIREBASE_PROJECT_ID,
        appId: env.VITE_FIREBASE_APP_ID,
    } as { [k: string]: string | undefined };
    const hasAll = !!(cfg.apiKey && cfg.authDomain && cfg.projectId && cfg.appId);
    return { hasAll, config: cfg };
};

// Fallback directo con tus claves (se usa si no hay variables Vite)
const FALLBACK_FIREBASE_CONFIG = {
    apiKey: 'AIzaSyBhYx0uzbqxgQeEaKCuCGmR-cqZOwFXnno',
    authDomain: 'anatomygo-beta-1.firebaseapp.com',
    projectId: 'anatomygo-beta-1',
    appId: '1:310809460030:web:5965bd0e08fd3faf2e806f',
};

let firebaseApp: FirebaseApp | null = null;
let provider: GoogleAuthProvider | null = null;
let dbInstance: Firestore | null = null;

const { hasAll: hasFirebaseConfig, config: firebaseConfig } = readFirebaseEnv();

try {
    const cfgToUse = hasFirebaseConfig ? (firebaseConfig as any) : (FALLBACK_FIREBASE_CONFIG as any);
    firebaseApp = initializeApp(cfgToUse);
    // Inicializar Firestore con long-polling para evitar problemas de canal Web (400)
    try {
        dbInstance = initializeFirestore(firebaseApp, {
            experimentalForceLongPolling: true,
            experimentalAutoDetectLongPolling: true,
        });
    } catch {
        // Si ya está inicializado, obtener la instancia por defecto
        dbInstance = getFirestore(firebaseApp);
    }
    provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
} catch {
    firebaseApp = null;
    provider = null;
}

export const getDb = (): Firestore | null => dbInstance;

export const subscribeAuth = (cb: (user: AuthUser | null) => void) => {
    if (!firebaseApp) return () => {};
    const auth = getAuth(firebaseApp);
    const unsub = onAuthStateChanged(auth, (user) => {
        if (user?.uid) {
            const u = { uid: user.uid, email: user.email || undefined } as AuthUser;
            mockFirebase.auth.currentUser = u;
            cb(u);
        } else {
            mockFirebase.auth.currentUser = null;
            cb(null);
        }
    });
    return unsub;
};

export const mockFirebase: MockFirebase = {
    auth: {
        currentUser: null,
        signIn: async () => {
            if (firebaseApp && provider) {
                const auth = getAuth(firebaseApp);
                try {
                    const redirectResult = await getRedirectResult(auth).catch(() => null);
                    if (redirectResult?.user) {
                        const uid = redirectResult.user.uid;
                        mockFirebase.auth.currentUser = { uid };
                        return { user: { uid } };
                    }

                    try {
                        const result = await signInWithPopup(auth, provider);
                        const uid = result.user.uid;
                        mockFirebase.auth.currentUser = { uid };
                        return { user: { uid } };
                    } catch (popupErr: any) {
                        if (popupErr?.code === 'auth/popup-blocked' || popupErr?.message?.includes('popup')) {
                            await signInWithRedirect(auth, provider);
                            const uid = auth.currentUser?.uid || 'redirecting';
                            if (uid !== 'redirecting') {
                                mockFirebase.auth.currentUser = { uid };
                            }
                            return { user: { uid: uid as string } } as { user: AuthUser };
                        }
                        throw popupErr;
                    }
                } catch {
                    throw new Error('Login cancelado o fallido');
                }
            }

            throw new Error('Auth no disponible');
        },
        signOut: async () => {
            if (firebaseApp) {
                try {
                    const auth = getAuth(firebaseApp);
                    await firebaseSignOut(auth);
                } catch {}
            }
            mockFirebase.auth.currentUser = null;
        },
        signUpWithEmail: async (email, password) => {
            if (firebaseApp) {
                const auth = getAuth(firebaseApp);
                const result = await createUserWithEmailAndPassword(auth, email, password);
                try { await sendEmailVerification(result.user); } catch {}
                try { await firebaseSignOut(auth); } catch {}
                throw { code: 'auth/email-verification-sent' } as any;
            }
            throw new Error('Auth no disponible');
        },
        signInWithEmail: async (email, password) => {
            if (firebaseApp) {
                const auth = getAuth(firebaseApp);
                const result = await signInWithEmailAndPassword(auth, email, password);
                if (!result.user.emailVerified) {
                    try { await sendEmailVerification(result.user); } catch {}
                    try { await firebaseSignOut(auth); } catch {}
                    throw { code: 'auth/email-not-verified' } as any;
                }
                const uid = result.user.uid;
                mockFirebase.auth.currentUser = { uid, email: result.user.email || undefined };
                return { user: { uid } };
            }
            throw new Error('Auth no disponible');
        },
        resendVerification: async (email, password) => {
            if (!firebaseApp) return;
            const auth = getAuth(firebaseApp);
            const result = await signInWithEmailAndPassword(auth, email, password);
            try { await sendEmailVerification(result.user); } finally {
                try { await firebaseSignOut(auth); } catch {}
            }
        },
        resetPassword: async (email) => {
            if (!firebaseApp) return;
            const auth = getAuth(firebaseApp);
            await sendPasswordResetEmail(auth, email);
        }
    },
    db: {
        getDoc: async (userId: string) => {
            try {
                const db = getDb();
                if (db) {
                    const ref = fbDoc(db, 'userData', userId);
                    const snap = await fbGetDoc(ref);
                    return {
                        exists: () => snap.exists(),
                        data: () => (snap.exists() ? (snap.data() as UserData) : null),
                    };
                }
            } catch {
                // fallback abajo
            }
            const data = localStorage.getItem(`userData_${userId}`);
            return {
                exists: () => data !== null,
                data: () => (data ? JSON.parse(data) : null),
            };
        },
        setDoc: async (userId: string, data: UserData) => {
            try {
                const db = getDb();
                if (db) {
                    await fbSetDoc(fbDoc(db, 'userData', userId), data, { merge: true });
                    return;
                }
            } catch {
                // fallback abajo
            }
            localStorage.setItem(`userData_${userId}`, JSON.stringify(data));
        }
    }
};

export const subscribeUserData = (userId: string, cb: (data: UserData | null) => void): (() => void) => {
    try {
        const db = getDb();
        if (db) {
            const ref = fbDoc(db, 'userData', userId);
            const unsub = fbOnSnapshot(ref, (snap) => {
                if (snap.exists()) cb(snap.data() as UserData);
                else cb(null);
            }, () => {});
            return unsub;
        }
    } catch {
        // fallback abajo
    }
    // Fallback: escuchar cambios de localStorage entre pestañas/ventanas
    const key = `userData_${userId}`;
    const handler = (e: StorageEvent) => {
        if (e.key === key) {
            try { cb(e.newValue ? JSON.parse(e.newValue) : null); } catch { cb(null); }
        }
    };
    try { window.addEventListener('storage', handler); } catch {}
    // Emitir valor inicial del fallback
    try {
        const raw = localStorage.getItem(key);
        cb(raw ? JSON.parse(raw) : null);
    } catch { cb(null); }
    return () => { try { window.removeEventListener('storage', handler); } catch {} };
};
