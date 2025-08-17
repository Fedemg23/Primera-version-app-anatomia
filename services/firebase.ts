
import { AuthUser, UserData } from '../types';
import type { FirebaseApp } from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut as firebaseSignOut } from 'firebase/auth';

interface MockAuth {
    currentUser: AuthUser | null;
    signIn: () => Promise<{ user: AuthUser }>;
    signOut: () => Promise<void>;
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

let firebaseApp: FirebaseApp | null = null;
let provider: GoogleAuthProvider | null = null;

const { hasAll: hasFirebaseConfig, config: firebaseConfig } = readFirebaseEnv();
if (hasFirebaseConfig) {
    try {
        firebaseApp = initializeApp(firebaseConfig as any);
        provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
    } catch {
        firebaseApp = null;
        provider = null;
    }
}

export const mockFirebase: MockFirebase = {
    auth: {
        currentUser: null,
        signIn: async () => {
            // Si hay config de Firebase, usamos Google Sign-In real
            if (firebaseApp && provider) {
                const auth = getAuth(firebaseApp);
                try {
                    // Intentar completar un redirect previo si lo hubo
                    const redirectResult = await getRedirectResult(auth).catch(() => null);
                    if (redirectResult?.user) {
                        const uid = redirectResult.user.uid;
                        mockFirebase.auth.currentUser = { uid };
                        return { user: { uid } };
                    }

                    // Intentar popup
                    const result = await signInWithPopup(auth, provider);
                    const uid = result.user.uid;
                    mockFirebase.auth.currentUser = { uid };
                    return { user: { uid } };
                } catch (err: any) {
                    // Fallback a redirect si popup está bloqueado
                    try {
                        await signInWithRedirect(auth, provider);
                        // La promesa no resuelve con el usuario aquí; se completará tras redirect
                        // Devolvemos un usuario temporal para no romper el flujo; App volverá a cargar
                        const uid = auth.currentUser?.uid || 'redirecting';
                        if (uid !== 'redirecting') {
                            mockFirebase.auth.currentUser = { uid };
                        }
                        return { user: { uid: uid as string } } as { user: AuthUser };
                    } catch {
                        // Como último recurso: modo simulado
                        const uid = 'testUser123';
                        mockFirebase.auth.currentUser = { uid };
                        return { user: { uid } };
                    }
                }
            }

            // Sin config de Firebase: modo simulado
            const uid = 'testUser123';
            mockFirebase.auth.currentUser = { uid };
            return { user: { uid } };
        },
        signOut: async () => {
            if (firebaseApp) {
                try {
                    const auth = getAuth(firebaseApp);
                    await firebaseSignOut(auth);
                } catch {}
            }
            mockFirebase.auth.currentUser = null;
        }
    },
    db: {
        // Mantenemos localStorage para persistencia simple en este proyecto
        getDoc: async (userId: string) => {
            const data = localStorage.getItem(`userData_${userId}`);
            return {
                exists: () => data !== null,
                data: () => (data ? JSON.parse(data) : null),
            };
        },
        setDoc: async (userId: string, data: UserData) => {
            localStorage.setItem(`userData_${userId}`, JSON.stringify(data));
        }
    }
};
