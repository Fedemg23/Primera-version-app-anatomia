
import { AuthUser, UserData } from '../types';

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

export const mockFirebase: MockFirebase = {
    auth: {
        currentUser: null,
        signIn: () => {
            const uid = 'testUser123';
            mockFirebase.auth.currentUser = { uid };
            return Promise.resolve({ user: { uid } });
        },
        signOut: () => {
            mockFirebase.auth.currentUser = null;
            return Promise.resolve();
        }
    },
    db: {
        getDoc: (userId: string) => {
            const data = localStorage.getItem(`userData_${userId}`);
            return Promise.resolve({
                exists: () => data !== null,
                data: () => data ? JSON.parse(data) : null
            });
        },
        setDoc: (userId: string, data: UserData) => {
            localStorage.setItem(`userData_${userId}`, JSON.stringify(data));
            return Promise.resolve();
        }
    }
};
