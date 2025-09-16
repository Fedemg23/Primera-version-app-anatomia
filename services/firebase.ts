
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
    sendPasswordResetEmail,
    fetchSignInMethodsForEmail
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
    
    // Inicializar Firestore con configuración optimizada
    try {
        dbInstance = getFirestore(firebaseApp);
        console.log('🔥 Firebase y Firestore inicializados correctamente');
    } catch (error) {
        console.warn('Error inicializando Firestore:', error);
        // Intentar con initializeFirestore si getFirestore falla
        try {
            dbInstance = initializeFirestore(firebaseApp, {
                experimentalForceLongPolling: false,
            });
            console.log('🔥 Firestore inicializado con configuración personalizada');
        } catch (fallbackError) {
            console.error('Error con configuración personalizada de Firestore:', fallbackError);
            dbInstance = null;
        }
    }
    
    provider = new GoogleAuthProvider();
    provider.setCustomParameters({ 
        prompt: 'select_account'
    });
    
} catch (initError) {
    console.error('Error inicializando Firebase:', initError);
    firebaseApp = null;
    provider = null;
    dbInstance = null;
}

export const getDb = (): Firestore | null => dbInstance;

// Función para limpiar datos de error (para debugging)
export const clearErrorState = () => {
    localStorage.removeItem('firestoreErrorCount');
    console.log('✅ Estado de errores limpiado');
};

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
                
                // Verificar si ya existe una cuenta con este email
                try {
                    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
                    if (signInMethods && signInMethods.length > 0) {
                        throw { code: 'auth/email-already-in-use' } as any;
                    }
                } catch (error: any) {
                    if (error.code === 'auth/email-already-in-use') {
                        throw error;
                    }
                    // Si hay otro error en la verificación, continuar con el proceso normal
                }
                
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
            const localKey = `userData_${userId}`;
            
            // Siempre usar datos locales como base
            let localData: UserData | null = null;
            try {
                const localDataStr = localStorage.getItem(localKey);
                if (localDataStr) {
                    localData = JSON.parse(localDataStr);
                }
            } catch (e) {
                console.warn('Error obteniendo datos locales:', e);
            }
            
            // Intentar obtener de Firestore solo si no hay datos locales o para sincronización
            let cloudData: UserData | null = null;
            try {
                const db = getDb();
                if (db) {
                    // Usar getDoc simple sin listeners para evitar errores de estado
                    const ref = fbDoc(db, 'userData', userId);
                    const snap = await fbGetDoc(ref);
                    if (snap.exists()) {
                        cloudData = snap.data() as UserData;
                        
                        // Guardar datos de la nube en local automáticamente
                        try {
                            localStorage.setItem(localKey, JSON.stringify(cloudData));
                        } catch {}
                    }
                }
            } catch (e) {
                console.warn('No se pudieron obtener datos de Firestore:', e);
                // Continuar con datos locales
            }
            
            // Priorizar datos con más progreso
            let finalData: UserData | null = null;
            if (cloudData && localData) {
                const cloudXP = cloudData.xp || 0;
                const localXP = localData.xp || 0;
                finalData = cloudXP >= localXP ? cloudData : localData;
            } else {
                finalData = cloudData || localData;
            }
            
            return {
                exists: () => finalData !== null,
                data: () => finalData,
            };
        },
        setDoc: async (userId: string, data: UserData) => {
            // Siempre guardar en localStorage como respaldo
            const localKey = `userData_${userId}`;
            try {
                localStorage.setItem(localKey, JSON.stringify(data));
            } catch (e) {
                console.warn('No se pudo guardar en localStorage:', e);
            }

            // Intentar guardar en Firestore
            try {
                const db = getDb();
                if (db) {
                    // Usar merge: true para no sobrescribir completamente, solo actualizar campos
                    await fbSetDoc(fbDoc(db, 'userData', userId), data, { merge: true });
                    
                    // Marcar timestamp de última actualización
                    await fbSetDoc(fbDoc(db, 'userData', userId), { 
                        lastUpdated: new Date().toISOString(),
                        syncedFromDevice: true 
                    }, { merge: true });
                    return;
                }
            } catch (e) {
                console.warn('No se pudo guardar en Firestore:', e);
                // El localStorage ya tiene los datos como respaldo
            }
        }
    }
};

export const subscribeUserData = (userId: string, cb: (data: UserData | null) => void): (() => void) => {
    const key = `userData_${userId}`;
    
    // Usar solo localStorage para evitar errores de listeners de Firestore
    // La sincronización con Firestore se hace en getDoc y setDoc
    
    const handler = (e: StorageEvent) => {
        if (e.key === key) {
            try { 
                cb(e.newValue ? JSON.parse(e.newValue) : null); 
            } catch (parseError) { 
                console.warn('Error parseando datos de localStorage:', parseError);
                cb(null); 
            }
        }
    };
    
    try { 
        window.addEventListener('storage', handler); 
    } catch (storageError) {
        console.warn('Error configurando listener de storage:', storageError);
    }
    
    // Emitir valor inicial
    try {
        const raw = localStorage.getItem(key);
        cb(raw ? JSON.parse(raw) : null);
    } catch (initialError) { 
        console.warn('Error obteniendo valor inicial de localStorage:', initialError);
        cb(null); 
    }
    
    return () => { 
        try { 
            window.removeEventListener('storage', handler); 
        } catch (cleanupError) {
            console.warn('Error limpiando listener de storage:', cleanupError);
        }
    };
};
