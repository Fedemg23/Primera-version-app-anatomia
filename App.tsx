import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { GoogleGenAI, Chat, Type } from "@google/genai";

import { 
    UserData, AuthUser, LastQuizResult, QuestionData, DailyChallenge, ShopItem, MysteryReward, Avatar, ExamResult, LifelineData, View, ExamConfigSelection, LeveledUpAchievement, Achievement, SettingsPopoverProps, AnimationType, AIOpponent, DuelState, DuelSummaryScreenProps, DuelMessage, MasterNote, UserNote
} from './types';
import { 
    LEVEL_REWARDS, MAX_LEVEL, achievementsData, shopItems, questionBank, PASS_THRESHOLD, AVATAR_DATA, dailyChallengesData, navigationData, HEART_REGEN_TIME, aiOpponentsData
} from './constants';
import { mockFirebase, subscribeAuth, subscribeUserData } from './services/firebase';
import { ChevronsUp, Award, Shield, Zap, Heart, Store, XCircle, HeartCrack, CheckCircle, Split, Lightbulb, Undo2, LogOut, Swords, BookOpen, Gift } from './components/icons';
import { useAnimation } from './components/AnimationProvider';
import { iconMap } from './components/icons';

import StatusBar from './components/Header';
import Background from './components/Background';
import Toast from './components/Toast';
import DailyBonusModal from './components/DailyBonusModal';
import MysteryBoxModal from './components/MysteryBoxModal';
import OrientationLock from './components/OrientationLock';
import LoginScreen from './components/screens/LoginScreen';
import HomeScreen from './components/screens/HomeScreen';
import RegionScreen from './components/screens/RegionScreen';
import QuizScreen from './components/screens/QuizScreen';
import QuizSummaryScreen from './components/screens/QuizSummaryScreen';
import AchievementsScreen from './components/screens/AchievementsScreen';
import ShopScreen from './components/screens/ShopScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import ExamConfigScreen from './components/screens/ExamConfigScreen';
import ExamResultScreen from './components/screens/ExamResultScreen';
import SettingsPopover from './components/SettingsPopover';
import TourGuide from './components/TourGuide';
import DailyChallenges from './components/DailyChallenges';
import InfoTooltip from './components/InfoTooltip';
import AchievementUnlockedModal from './components/AchievementUnlockedModal';
import DuelLobbyScreen from './components/screens/DuelLobbyScreen';
import DuelScreen from './components/screens/DuelScreen';
import DuelSummaryScreen from './components/screens/DuelSummaryScreen';
import CreateNoteScreen from './components/screens/CreateNoteScreen'; 
import LoadingScreen from './components/LoadingScreen';
import LevelRewardsScreen from './components/screens/LevelRewardsScreen';
import { preloadImages } from './src/utils';
import { imageAvatars } from './src/avatarLoader';
import { getWeightedReward } from './src/features/rewards';
import { AudioProvider, useAudio } from './src/contexts/AudioProvider';
import { AnimationProvider } from './components/AnimationProvider';
import { upsertUser, setUserActive, updateChallengeScore } from './services/firestore';
import { getIncomingFriendRequests } from './services/firestore';
import LeaderboardScreen from './components/screens/LeaderboardScreen';
import FriendsScreen from './components/screens/FriendsScreen';
import ErrorBoundary from './components/ErrorBoundary';
import WelcomeModal from './components/WelcomeModal';
import FriendGiftsModal from './components/FriendGiftsModal';
import FloatingFriendGiftsButton from './components/FloatingFriendGiftsButton';
import FriendRequestNotification from './components/FriendRequestNotification';
import BottomNav from './components/BottomNav';


type ModalType = 'dailyBonus' | 'mysteryBox' | 'settings' | 'noLives' | 'friendGifts';


const toLocalDateString = (date: Date) => {
    if (!date || isNaN(new Date(date).getTime())) {
        return new Date(0).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-CA', options); // YYYY-MM-DD format
}

const NoLivesModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onGoToShop: () => void;
}> = memo(({ isOpen, onClose, onGoToShop }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#121212] bg-opacity-80 flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-auto transform animate-scale-in w-full">
                {(() => { const H = iconMap['heart_img']; return <H className="w-24 h-24 mx-auto mb-4" /> })()}
                <h2 className="text-4xl font-black tracking-tighter text-gray-100">¡Sin Vidas!</h2>
                <p className="text-gray-300 text-lg mt-2 mb-8">
                    Necesitas más vidas para continuar. ¡Consíguelas en la tienda!
                </p>
                
                <div className="space-y-3">
                    <button
                        onClick={onGoToShop}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-shadow active:scale-95 flex items-center justify-center gap-2 touch-manipulation"
                    >
                        <Store className="w-5 h-5"/>
                        Ir a la Tienda
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-slate-700 text-slate-200 font-bold py-3 px-4 rounded-xl text-lg shadow-md hover:shadow-lg transition-shadow active:scale-95 touch-manipulation"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
});


const App: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const { playMusic, stopMusic } = useAudio();
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    
    // User & Data State
    const [auth, setAuth] = useState<AuthUser | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    // Study/Exam Flow State
    const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
    const [selectedTemaId, setSelectedTemaId] = useState<string | null>(null);

    // Quiz State
    const [currentQuiz, setCurrentQuiz] = useState<{ id: string, questions: QuestionData[], xp: { base: number, bonus: number } }>({ id: '', questions: [], xp: { base: 20, bonus: 10 } });
    const [examResult, setExamResult] = useState<ExamResult | null>(null);
    const [examStartTime, setExamStartTime] = useState(0);
    const [lastQuizResult, setLastQuizResult] = useState<LastQuizResult | null>(null);
    const [examNumQuestions, setExamNumQuestions] = useState(20);
    const [examSelection, setExamSelection] = useState<ExamConfigSelection>(() => {
        const initialState: ExamConfigSelection = {};
        navigationData.forEach(region => {
            initialState[region.id] = {
                selected: true,
                temas: {}
            };
            region.temas.forEach(tema => {
                initialState[region.id].temas[tema.id] = true;
            });
        });
        return initialState;
    });

    // Duel State
    const [duelState, setDuelState] = useState<DuelState | null>(null);
    const [duelSummary, setDuelSummary] = useState<Omit<DuelSummaryScreenProps, 'onPlayAgain' | 'onContinue'> | null>(null);

    // Modals & UI Feedback State
    const [activeModal, setActiveModal] = useState<ModalType | null>(null);
    const [infoTooltipType, setInfoTooltipType] = useState<'streak' | 'bones' | 'hearts' | null>(null);
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [dailyBonus, setDailyBonus] = useState<{reward: number, streak: number}>({reward: 0, streak: 0});
    const [mysteryBoxReward, setMysteryBoxReward] = useState<MysteryReward | null>(null);
    const [levelUpAnimationKey, setLevelUpAnimationKey] = useState(0);
    const [toast, setToast] = useState<{ message: string | null; type: 'success' | 'error' | 'achievement' | 'challenge'; icon: React.ReactNode | null; }>({ message: null, type: 'success', icon: null });
    const [leveledUpItemsToShow, setLeveledUpItemsToShow] = useState<LeveledUpAchievement[] | null>(null);
    const [pendingQuizResult, setPendingQuizResult] = useState<LastQuizResult | null>(null);
    const [isUiLocked, setIsUiLocked] = useState(false);
    
    // Dev Mode
    const [isDevMode, setIsDevMode] = useState(false);
    
    // Animation
    const { triggerAnimation } = useAnimation();
    const [animatingAchievementId, setAnimatingAchievementId] = useState<string | null>(null);
    const [friendRequestsCount, setFriendRequestsCount] = useState<number>(0);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    
    // Refs
    const hasInitialDataLoaded = useRef(false);
    const applyingRemoteRef = useRef(false);
    const dailyBonusRewardRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLElement>(null);
    const [view, setView] = useState<View>('home');
    const viewHistory = useRef<View[]>(['home']);

    const defaultUserData: UserData = {
        name: 'AnatomyGO',
        hearts: 5, 
        nextHeartAt: 0,
        bones: 250, 
        streak: 3, 
        streakFreezeActive: false, 
        xp: 0, 
        level: 1,
        xpBoostUntil: 0, 
        doubleOrNothingActive: false, 
        unlockedAchievements: {}, 
        unclaimedAchievementRewards: [],
        progress: {},
        dailyStats: { quizzesCompleted: 0, xpEarned: 0, perfectQuizzes: 0, lastReset: new Date(0).toDateString() },
        claimedChallenges: [],
        totalQuizzesCompleted: 0, 
        totalCorrectAnswers: 0, 
        totalQuestionsAnswered: 0,
        avatar: AVATAR_DATA.find(a => a.unlockCondition.type === 'level' && a.unlockCondition.value === 1)!.emoji,
        weakPoints: [],
        purchases: {},
        lastLoginDate: new Date(0).toISOString(),
        theme: 'dark',
        totalPerfectQuizzes: 0,
        totalBonesSpent: 0,
        unlockedAvatars: ['novice'],
        lifelineData: { fiftyFifty: 1, quickReview: 1, secondChance: 1, adrenaline: 0, skip: 0, double: 0, immunity: 0 },
        claimedLevelRewards: [],
        lastDailyShopRewardClaim: new Date(0).toISOString(),
        masterNotes: [],
        userNotes: [],
        perfectStreak: 0,
        lastUpdated: new Date().toISOString(),
        syncedFromDevice: false,
        migratedFromLocal: false,
        isNewUser: true,
        hasCompletedWelcome: false,
        accountEmail: undefined,
    };
    
    // --- Data Persistence & Initial Load ---


    useEffect(() => {
        if (userData && !hasInitialDataLoaded.current) {
            hasInitialDataLoaded.current = true;
        }
    }, [userData]);
    
    
    const handleCloseBonusModal = useCallback(() => {
        setActiveModal(null);
        if (dailyBonus.reward > 0 && dailyBonusRewardRef.current) {
            triggerAnimation({
                type: 'bone',
                count: 8,
                startElement: dailyBonusRewardRef.current
            });
        }
    }, [dailyBonus, triggerAnimation]);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'achievement' | 'challenge' = 'success', icon: React.ReactNode = null) => {
        setIsUiLocked(true);
        setToast({ message, type, icon });
        setTimeout(() => {
            setToast(prevToast => (prevToast.message === message ? { message: null, type: 'success', icon: null } : prevToast));
            setIsUiLocked(false);
        }, 3000);
    }, []);
    
    const saveData = useCallback(async (dataToSave: UserData) => {
        if (!auth) return;
        setIsSaving(true);
        try {
            // Agregar timestamp de actualización
            const dataWithTimestamp = {
                ...dataToSave,
                lastUpdated: new Date().toISOString(),
                syncedFromDevice: true
            };
            await mockFirebase.db.setDoc(auth.uid, dataWithTimestamp);
        } catch (error) {
            console.error('Error al guardar datos:', error);
            showToast('Error al guardar progreso. Reintentando...', 'error');
        } finally {
            setTimeout(() => setIsSaving(false), 500);
        }
    }, [auth, showToast]);
    
    useEffect(() => {
        if (hasInitialDataLoaded.current && userData && !applyingRemoteRef.current) {
            saveData(userData);
        }
    }, [userData, saveData]);
    
    // Guardado automático periódico como respaldo adicional
    useEffect(() => {
        if (!userData || !auth) return;
        
        const autoSaveInterval = setInterval(() => {
            if (userData && !applyingRemoteRef.current) {
                saveData(userData);
            }
        }, 60000); // Guardar cada minuto
        
        return () => clearInterval(autoSaveInterval);
    }, [userData, auth, saveData]);
    
    const handleNavigate = useCallback((newView: View) => {
        viewHistory.current.push(newView);
        setView(newView);
        // Scroll to top cuando se cambia de página
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    const handleBack = useCallback(() => {
        if (viewHistory.current.length <= 1) return;
    
        const currentView = viewHistory.current.pop();
        const newView = viewHistory.current[viewHistory.current.length - 1];
    
        if (currentView === 'quiz') {
            const quizSourceView = viewHistory.current[viewHistory.current.length - 1];
            if (quizSourceView === 'study' || quizSourceView?.startsWith('study')) {
                setUserData(p => p ? { ...p, hearts: Math.min(5, p.hearts + 1) } : null);
            }
        }
        
        // Si estamos volviendo desde Logros, redirigir a inicio
        if (currentView === 'achievements') {
            viewHistory.current = ['home'];
            setView('home');
            // Scroll to top cuando se cambia de página
            window.scrollTo({ top: 0, behavior: 'instant' });
            return;
        }
        setView(newView);
        // Siempre resetea scroll al volver
        try {
            if (mainRef.current) mainRef.current.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        } catch {}
        requestAnimationFrame(() => {
            try {
                if (mainRef.current) mainRef.current.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            } catch {}
        });
    }, []);
    
    const handleSignIn = useCallback(async () => {
        // Si ya hay un usuario autenticado (p.ej., desde LoginScreen), no dispares otro login
        const existing = mockFirebase.auth.currentUser;
        if (existing) {
            setAuth(existing);
            return;
        }
        const { user } = await mockFirebase.auth.signIn();
        setAuth(user);
    }, []);

    const handleSignOut = useCallback(async () => {
        if (userData) await saveData(userData);
        try { if (auth?.uid) await setUserActive(auth.uid, false); } catch {}
        await mockFirebase.auth.signOut();
        setAuth(null);
        stopMusic();
    }, [userData, saveData, stopMusic]);

    const handleCompleteWelcome = useCallback((name: string) => {
        if (!userData) return;
        
        const updatedData = {
            ...userData,
            name: name,
            hasCompletedWelcome: true,
            isNewUser: false
        };
        
        setUserData(updatedData);
        setShowWelcomeModal(false);
        
        // Mostrar mensaje de bienvenida personalizado
        showToast(`¡Bienvenido, ${name}! Tu aventura comienza ahora`, 'success', <Award className="w-5 h-5 text-white" />);
    }, [userData, showToast]);

    useEffect(() => {
        if (!auth) {
            setIsLoading(true);
            setUserData(null);
            return;
        }

        const loadAppData = async () => {
            const startTime = Date.now();
            
            // Timeout para evitar que se quede atascado en la carga
            const loadingTimeout = setTimeout(() => {
                console.warn('⏰ Timeout de carga alcanzado - usando datos por defecto');
                setUserData(defaultUserData);
                setIsLoading(false);
                showToast('Cargando en modo offline', 'success');
            }, 10000); // 10 segundos de timeout
            
            try {
                const criticalImages = [
                    '/images/Emoji hueso png.png',
                    '/images/Modo estudio.png',
                    '/images/Modo examen.png',
                    '/images/Tienda.png',
                    '/images/Logros.png',
                    '/images/Heart.png',
                    '/images/huesitos.png'
                ];
                
                // Agregar timeout a la promesa de datos
                const docPromise = Promise.race([
                    mockFirebase.db.getDoc(auth.uid),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout obteniendo datos de usuario')), 8000)
                    )
                ]);
                
                const preloadPromise = preloadImages(criticalImages);

                const [docResult] = await Promise.all([docPromise, preloadPromise]);
                
                // Limpiar timeout si llegamos hasta aquí
                clearTimeout(loadingTimeout);

                const doc = docResult as { exists: () => boolean; data: () => UserData | null };
                const isExistingUser = doc.exists() && doc.data();
                let loadedData: UserData = isExistingUser ? doc.data()! : defaultUserData;
                
                // Detectar si es un usuario nuevo
                const isNewUser = !isExistingUser;
                
                loadedData = { ...defaultUserData, ...loadedData };
                loadedData.lifelineData = { ...defaultUserData.lifelineData, ...(loadedData as any).lifelineData };
                if (!loadedData.unlockedAchievements || Array.isArray(loadedData.unlockedAchievements)) {
                    loadedData.unlockedAchievements = defaultUserData.unlockedAchievements;
                }
                
                // Configurar datos para usuarios nuevos
                if (isNewUser) {
                    loadedData.isNewUser = true;
                    loadedData.hasCompletedWelcome = false;
                    loadedData.accountEmail = auth.email || undefined;
                } else {
                    // Para usuarios existentes, asegurar que tengan el email actualizado
                    if (!loadedData.accountEmail && auth.email) {
                        loadedData.accountEmail = auth.email;
                    }
                }
        
                const today = toLocalDateString(new Date());
                const lastLogin = toLocalDateString(new Date(loadedData.lastLoginDate));
        
                const showBonus = today !== lastLogin;
        
                if (showBonus) {
                    const yesterday = toLocalDateString(new Date(new Date().setDate(new Date().getDate() - 1)));
                    
                    if (lastLogin === yesterday) {
                        loadedData.streak += 1;
                    } else {
                        if (loadedData.streak > 1 && loadedData.streakFreezeActive) {
                            loadedData.streakFreezeActive = false;
                            setTimeout(() => showToast("¡Protector de racha usado!", "success", <Shield className="w-5 h-5 text-white" />), 500);
                        } else {
                            loadedData.streak = 1;
                        }
                    }
        
                    const reward = 10 + Math.min(loadedData.streak, 7) * 5;
                    loadedData.bones += reward;
                    loadedData.lastLoginDate = new Date().toISOString();
                    
                    setDailyBonus({ reward, streak: loadedData.streak });
                    setActiveModal('dailyBonus');
                }
                
                if (loadedData.dailyStats && loadedData.dailyStats.lastReset !== today) {
                    loadedData.dailyStats = { quizzesCompleted: 0, xpEarned: 0, perfectQuizzes: 0, lastReset: today };
                    loadedData.claimedChallenges = [];
                }

                setUserData(loadedData);
                
                // Mostrar modal de bienvenida para usuarios nuevos
                if (isNewUser && !loadedData.hasCompletedWelcome) {
                    setShowWelcomeModal(true);
                }
                
                // Sincronizar perfil público del usuario en Firestore
                try {
                    await upsertUser(auth.uid, {
                        id: auth.uid,
                        name: loadedData.name,
                        avatar: loadedData.avatar,
                        xp: loadedData.xp,
                        level: loadedData.level,
                        totalQuizzesCompleted: loadedData.totalQuizzesCompleted,
                        totalCorrectAnswers: loadedData.totalCorrectAnswers,
                        totalQuestionsAnswered: loadedData.totalQuestionsAnswered,
                        unlockedAchievements: loadedData.unlockedAchievements
                    });
                } catch (error) {
                    console.warn('No se pudo sincronizar perfil público:', error);
                }
            } catch (error: any) {
                clearTimeout(loadingTimeout);
                console.error("Failed to load app data:", error);
                
                // Detectar errores críticos de Firestore
                const errorMessage = error?.message || error?.toString() || '';
                const isCriticalFirestoreError = [
                    'FIRESTORE (12.2.0) INTERNAL ASSERTION FAILED',
                    'Unexpected state (ID: b815)',
                    'Unexpected state (ID: ca9)',
                    'Timeout obteniendo datos de usuario'
                ].some(pattern => errorMessage.includes(pattern));
                
                if (isCriticalFirestoreError) {
                    console.warn('🚨 Error crítico detectado - cargando en modo offline');
                    setUserData(defaultUserData);
                    showToast('Cargando en modo offline debido a errores de conectividad', 'success');
                } else {
                    setUserData(defaultUserData);
                    showToast("Cargando datos por defecto", "success");
                }
            } finally {
                const elapsedTime = Date.now() - startTime;
                const remainingTime = 5000 - elapsedTime;

                const finishLoading = () => {
                    setIsLoading(false);
                    setIsInitialLoad(false); // Marcar que la carga inicial ha terminado
                };

                if (remainingTime > 0) {
                    setTimeout(finishLoading, remainingTime);
                } else {
                    finishLoading();
                }
            }
        };

        loadAppData();
    }, [auth, showToast]);

    // Suscripción en tiempo real a los datos del usuario
    useEffect(() => {
        if (!auth?.uid) return;
        const unsubscribe = subscribeUserData(auth.uid, (remote) => {
            if (!remote || !hasInitialDataLoaded.current || applyingRemoteRef.current) return;
            
            let loadedData: UserData = { ...defaultUserData, ...remote };
            loadedData.lifelineData = { ...defaultUserData.lifelineData, ...(remote as any).lifelineData };
            if (!loadedData.unlockedAchievements || Array.isArray(loadedData.unlockedAchievements)) {
                loadedData.unlockedAchievements = defaultUserData.unlockedAchievements;
            }
            
            // Comparar datos remotos con locales para sincronización inteligente
            if (userData && loadedData) {
                const remoteLastUpdated = loadedData.lastUpdated ? new Date(loadedData.lastUpdated).getTime() : 0;
                const localLastUpdated = userData.lastUpdated ? new Date(userData.lastUpdated).getTime() : 0;
                
                // Solo actualizar si los datos remotos son más recientes
                if (remoteLastUpdated <= localLastUpdated) {
                    return;
                }
                
                // Verificar si hay conflictos significativos en el progreso
                const remoteProgress = loadedData.xp || 0;
                const localProgress = userData.xp || 0;
                
                if (localProgress > remoteProgress && (localLastUpdated > remoteLastUpdated - 10000)) {
                    // Los datos locales tienen más progreso y son recientes, no sobrescribir
                    console.log('Datos locales tienen más progreso, manteniendo locales');
                    return;
                }
                
            }
            
            applyingRemoteRef.current = true;
            setUserData(loadedData);
            setTimeout(() => { applyingRemoteRef.current = false; }, 0);
        });
        return unsubscribe;
    }, [auth?.uid, userData, showToast]);

    // Cargar conteo de solicitudes de amistad periódicamente
    useEffect(() => {
        let timer: any = null;
        const load = async () => {
            try {
                if (!auth?.uid) { setFriendRequestsCount(0); return; }
                const reqs = await getIncomingFriendRequests(auth.uid);
                setFriendRequestsCount(reqs.length);
            } catch {
                // ignore
            }
        };
        load();
        timer = setInterval(load, 15000);
        return () => { if (timer) clearInterval(timer); };
    }, [auth?.uid]);

    useEffect(() => {
        if (!userData) return;

        const timer = setInterval(() => {
            setUserData(prev => {
                if (!prev || prev.hearts >= 5 || !prev.nextHeartAt || prev.nextHeartAt === 0 || Date.now() < prev.nextHeartAt) {
                    return prev;
                }
                
                const newHearts = prev.hearts + 1;
                const newNextHeartAt = newHearts < 5 ? Date.now() + HEART_REGEN_TIME : 0;
                
                return {
                    ...prev,
                    hearts: newHearts,
                    nextHeartAt: newNextHeartAt,
                };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [userData?.hearts, userData?.nextHeartAt]);
    
    useEffect(() => {
        // Se intenta de varias formas por consistencia entre navegadores y escenarios
        try {
            if (mainRef.current) {
                mainRef.current.scrollTo({ top: 0, behavior: 'instant' });
            }
            window.scrollTo({ top: 0, behavior: 'instant' });
        } catch (e) {
            console.warn("Failed to scroll to top", e);
        }
    }, [view]);

    useEffect(() => {
        const isAnyModalOpen = activeModal !== null || infoTooltipType !== null || leveledUpItemsToShow !== null || lastQuizResult !== null || examResult !== null || duelSummary !== null;
        // Solo bloquear scroll en pantallas de pantalla completa (quiz y duel)
        const lockForView = ['quiz', 'duel'].includes(view);
        const shouldLockScroll = isAnyModalOpen || lockForView;

        if (shouldLockScroll) {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        } else {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        }

        return () => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        };
    }, [activeModal, infoTooltipType, leveledUpItemsToShow, lastQuizResult, examResult, duelSummary, view]);

    useEffect(() => {
        document.documentElement.classList.add('dark');
    }, []);

    // Efecto para iniciar la música cuando la carga termina
    useEffect(() => {
        // Solo iniciar la música si no es la carga inicial y la carga ha terminado.
        if (!isLoading && !isInitialLoad) {
            playMusic();
        }
    }, [isLoading, isInitialLoad, playMusic]);
    
    const handleQuizCompletionAchievements = useCallback((oldUserData: UserData, newUserData: UserData) => {
        const leveledUpItems: LeveledUpAchievement[] = [];
        const newUnclaimedRewardIds: string[] = [];
    
        // 1. Check for user level up
        let newLevel = oldUserData.level;
        for (const levelData of LEVEL_REWARDS) {
            if (newUserData.xp >= levelData.xp) {
                newLevel = levelData.level;
            } else {
                break;
            }
        }

        if (newLevel > oldUserData.level) {
            for (let level = oldUserData.level + 1; level <= newLevel; level++) {
                const reward = LEVEL_REWARDS.find(r => r.level === level);
                leveledUpItems.push({
                    id: `user_level_${level}`,
                    name: '¡Subida de Nivel!',
                    icon: '🌟',
                    newLevel: level,
                    type: 'user_level',
                    rewards: { xp: reward?.xp, bones: reward?.bones }
                });
            }
            setLevelUpAnimationKey(key => key + 1);
        }
    
        // 2. Check for achievement level ups
        achievementsData.forEach(ach => {
            const oldAchLevel = oldUserData.unlockedAchievements[ach.id] || 0;
            const newProgress = ach.id === 'level_achiever' ? newLevel : ach.progress(newUserData);
            const newAchLevel = ach.tiers.slice().reverse().find(t => newProgress >= t.target)?.level || 0;

            if (newAchLevel > oldAchLevel) {
                for (let level = oldAchLevel + 1; level <= newAchLevel; level++) {
                    const tier = ach.tiers.find(t => t.level === level);
                    const rewardId = `${ach.id}:${level}`;

                    // Si ya está en no reclamadas, no volver a mostrar en la modal
                    const alreadyUnclaimed = oldUserData.unclaimedAchievementRewards.includes(rewardId);
                    if (!alreadyUnclaimed) {
                        leveledUpItems.push({
                            id: ach.id,
                            name: ach.name,
                            icon: ach.icon,
                            newLevel: level,
                            type: 'achievement',
                            rewards: tier?.reward
                        });
                        if (tier?.reward) {
                            newUnclaimedRewardIds.push(rewardId);
                        }
                    }
                }
            }
        });
        
        return {
            leveledUpItems,
            newUnclaimedRewards: newUnclaimedRewardIds,
            finalLevel: newLevel
        };
    }, []);

    
    const toggleDevMode = useCallback(() => {
        setIsDevMode(prev => {
            const newMode = !prev;
            showToast(`Modo desarrollador ${newMode ? 'activado' : 'desactivado'}`, 'success');
            return newMode;
        });
    }, [showToast]);

    // Exponer apertura de tour para el botón en Ajustes
    useEffect(() => {
        (window as any).__OPEN_TOUR__ = () => setIsTourOpen(true);
        (window as any).__NAVIGATE__ = (v: View) => {
            setView(v);
            // Scroll to top cuando se cambia de página desde el tour
            window.scrollTo({ top: 0, behavior: 'instant' });
        };
        (window as any).__SCROLL_TO__ = (selector: string) => {
            try {
                const el = document.querySelector(selector) as HTMLElement | null;
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } catch {}
        };
        return () => { delete (window as any).__OPEN_TOUR__; };
    }, []);

    const handleUnlockAll = useCallback(() => {
        setUserData(prev => {
            if (!prev) return null;
            
            const maxedOutUserData = JSON.parse(JSON.stringify(prev));
            maxedOutUserData.totalQuizzesCompleted = 9999;
            maxedOutUserData.totalPerfectQuizzes = 9999;
            maxedOutUserData.level = MAX_LEVEL;
            maxedOutUserData.streak = 999;
            maxedOutUserData.totalBonesSpent = 999999;
            maxedOutUserData.totalCorrectAnswers = 99999;
            maxedOutUserData.unlockedAvatars = AVATAR_DATA.map(a => a.id);
            maxedOutUserData.claimedChallenges = dailyChallengesData.map(c => c.id);
            maxedOutUserData.purchases = { 'double_or_nothing': 100, 'neural_eraser': 50 };
            
            // Max out all resources
            maxedOutUserData.bones = 99999;
            maxedOutUserData.hearts = 5;
            maxedOutUserData.streakFreezeActive = true;
            maxedOutUserData.xpBoostUntil = Date.now() + 365 * 24 * 60 * 60 * 1000; // 1 year
            maxedOutUserData.lifelineData = { 
                fiftyFifty: 50, 
                quickReview: 50, 
                secondChance: 50, 
                adrenaline: 50, 
                skip: 50, 
                double: 50, 
                immunity: 50 
            };

            const allPassedProgress: { [key: string]: { bestScore: number; passed: boolean } } = {};
            navigationData.forEach(region => {
                region.temas.forEach(tema => {
                    tema.subtemas.forEach(subtema => {
                        allPassedProgress[subtema.id] = { bestScore: 1, passed: true };
                    });
                });
            });
            maxedOutUserData.progress = allPassedProgress;

            const newUnlockedAchievements: { [key: string]: number } = {};
            const newUnclaimedRewards: string[] = [];

            achievementsData.forEach(ach => {
                const progress = ach.progress(maxedOutUserData);
                const highestLevel = ach.tiers.slice().reverse().find(t => progress >= t.target)?.level || 0;
                
                if (highestLevel > 0) {
                    // Mostrar TODO como no reclamado: nivel reclamado = 0, recompensas pendientes 1..highestLevel
                    newUnlockedAchievements[ach.id] = 0;
                    for (let level = 1; level <= highestLevel; level++) {
                        const tier = ach.tiers.find(t => t.level === level);
                        if (tier?.reward) {
                            newUnclaimedRewards.push(`${ach.id}:${level}`);
                        }
                    }
                } else {
                    newUnlockedAchievements[ach.id] = 0;
                }
            });

            maxedOutUserData.unlockedAchievements = newUnlockedAchievements;
            maxedOutUserData.unclaimedAchievementRewards = newUnclaimedRewards;

            showToast('¡Todo Desbloqueado para Pruebas!', 'success');
            setActiveModal(null);
            return maxedOutUserData;
        });
    }, [showToast]);

    const handleStartPractice = useCallback((practiceQuestions: QuestionData[]) => {
        if (practiceQuestions.length === 0) {
            showToast("¡No tienes puntos débiles para repasar!", "success", <CheckCircle />);
            return;
        }
        setCurrentQuiz({
            id: 'practice',
            questions: practiceQuestions.sort(() => 0.5 - Math.random()).slice(0, 10),
            xp: { base: 5, bonus: 0 }
        });
        handleNavigate('quiz');
    }, [showToast, handleNavigate]);

    const handleSelectMode = useCallback((mode: 'study' | 'exam' | 'duel') => {
        if (mode === 'study') {
            setSelectedRegionId(null);
            setSelectedTemaId(null);
            handleNavigate('study');
        } else {
            const view = mode === 'duel' ? 'duel_lobby' : mode;
            handleNavigate(view);
        }
    }, [handleNavigate]);
    
    const handleSelectRegion = useCallback((regionId: string) => {
        setSelectedRegionId(regionId);
    }, []);

    const handleSelectTema = useCallback((temaId: string) => {
        setSelectedTemaId(temaId);
    }, []);

    const handleNoLivesAttempt = useCallback(() => setActiveModal('noLives'), []);

    const handleStartStudyQuiz = useCallback((subtemaId: string) => {
        setUserData(prev => {
            if (!prev || prev.hearts <= 0) {
                handleNoLivesAttempt();
                return prev;
            }

            const allQuestionsForSubtema = questionBank.filter(q => {
                const currentSubtemaId = `${q.tags.regionId}-${q.tags.tema.replace(/\s+/g, '_')}-${q.tags.subtema.replace(/\s+/g, '_')}`;
                return currentSubtemaId === subtemaId;
            });

            const shuffledQuestions = allQuestionsForSubtema.sort(() => 0.5 - Math.random());
            const selectedQuestions = shuffledQuestions.slice(0, 5);

            setCurrentQuiz({ id: subtemaId, questions: selectedQuestions, xp: { base: 20, bonus: 10 } });
            handleNavigate('quiz');
            
            const wasAtMaxHearts = prev.hearts === 5;
            return { 
                ...prev, 
                hearts: prev.hearts - 1,
                nextHeartAt: wasAtMaxHearts ? Date.now() + HEART_REGEN_TIME : prev.nextHeartAt
            };
        });
    }, [handleNoLivesAttempt, handleNavigate]);


    const handleStartExam = useCallback((questionIds: string[]) => {
        const questions = questionBank.filter(q => questionIds.includes(q.id));
        setCurrentQuiz({ id: 'exam', questions, xp: { base: 0, bonus: 0 } });
        setExamStartTime(Date.now());
        handleNavigate('quiz');
    }, [handleNavigate]);

    const handleStartAtlasQuiz = useCallback((regionId: string) => {
        setUserData(prev => {
            if (!prev || prev.hearts <= 0) {
                handleNoLivesAttempt();
                return prev;
            }

            const allQuestionsForRegion = questionBank.filter(q => q.tags.regionId === regionId);
            const shuffled = allQuestionsForRegion.sort(() => 0.5 - Math.random());
            const selectedQuestions = shuffled.slice(0, 10);
            
            if (selectedQuestions.length === 0) {
                showToast("No hay preguntas para esta región todavía.", 'error');
                return prev;
            }

            setCurrentQuiz({
                id: `study_${regionId}`,
                questions: selectedQuestions,
                xp: { base: 15, bonus: 5 }
            });
            handleNavigate('quiz');

            const wasAtMaxHearts = prev.hearts === 5;
            return { 
                ...prev, 
                hearts: prev.hearts - 1,
                nextHeartAt: wasAtMaxHearts ? Date.now() + HEART_REGEN_TIME : prev.nextHeartAt
            };
        });
    }, [handleNoLivesAttempt, showToast, handleNavigate]);

    const handleNavigateToStudyFromAtlas = useCallback((regionId: string) => {
        setSelectedRegionId(regionId);
        setSelectedTemaId(null);
        handleNavigate('study');
    }, [handleNavigate]);

    const handleMistake = useCallback((questionId: string) => {
        setUserData(prev => {
            if (!prev) return null;
            const newWeakPoints = prev.weakPoints.includes(questionId)
                ? prev.weakPoints
                : [...prev.weakPoints, questionId];
            return { ...prev, weakPoints: newWeakPoints };
        });
    }, []);

    const handleQuizSessionEnd = useCallback((answers: (number | string)[]) => {
        if (!userData || !currentQuiz.questions.length) return;
    
        const oldUserData = { ...userData };
        const { questions, id: quizId } = currentQuiz;
    
        let correctCount = 0;
        const newWeakPoints = [...oldUserData.weakPoints];
    
        questions.forEach((q, i) => {
            const isFillInTheBlank = q.textoPregunta.includes('____');
            const answer = answers[i];
            
            if (answer === null || answer === undefined || answer === 'timeout') {
                if (!newWeakPoints.includes(q.id)) newWeakPoints.push(q.id);
                return;
            }
            
            const isCorrect = isFillInTheBlank 
                ? typeof answer === 'string' && answer.trim().toLowerCase() === q.opciones[q.indiceRespuestaCorrecta].trim().toLowerCase()
                : answer === q.indiceRespuestaCorrecta;
    
            if (isCorrect) {
                correctCount++;
                const weakPointIndex = newWeakPoints.indexOf(q.id);
                if (weakPointIndex > -1) newWeakPoints.splice(weakPointIndex, 1);
            } else {
                if (!newWeakPoints.includes(q.id)) newWeakPoints.push(q.id);
            }
        });
        
        const newUserData: UserData = JSON.parse(JSON.stringify(oldUserData));
        newUserData.weakPoints = newWeakPoints;
        
        newUserData.totalQuizzesCompleted++;
        newUserData.totalCorrectAnswers += correctCount;
        newUserData.totalQuestionsAnswered += questions.length;
    
        const isPractice = quizId === 'practice';
        const isExam = quizId === 'exam';
        
        if (isExam) {
            const endTime = Date.now();
            const timeTaken = Math.round((endTime - examStartTime) / 1000);
            const breakdown: { [tema: string]: { correct: number; total: number } } = {};
            
            questions.forEach((q, i) => {
                const temaName = q.tags.tema;
                if (!breakdown[temaName]) breakdown[temaName] = { correct: 0, total: 0 };
                breakdown[temaName].total++;
                const isFillInTheBlank = q.textoPregunta.includes('____');
                const isCorrect = isFillInTheBlank ? (answers[i] as string).trim().toLowerCase() === q.opciones[q.indiceRespuestaCorrecta].trim().toLowerCase() : answers[i] === q.indiceRespuestaCorrecta;
                if (isCorrect) breakdown[temaName].correct++;
            });
    
            const score = correctCount;
            const total = questions.length;
            const percentage = total > 0 ? (score / total) * 100 : 0;
            
            setExamResult({ score, total, percentage, time: timeTaken, breakdown, questions, userAnswers: answers });
            setUserData(prev => ({ ...(prev as UserData), ...newUserData }));
    
        } else {
            let earnedXp = 0;
            let earnedBones = 0;
            let wasChallenge = false;
            const score = questions.length > 0 ? correctCount / questions.length : 0;
            const isPerfect = score === 1;
    
            if (isPractice) {
                earnedXp = correctCount * 5;
                earnedBones = correctCount * 1;
            } else { 
                const streakBonus = 1 + Math.min(oldUserData.streak, 7) * 0.05;
                const xpBoostMultiplier = oldUserData.xpBoostUntil > Date.now() ? 2 : 1;
                earnedXp = Math.round(correctCount * 10 * xpBoostMultiplier * streakBonus);
                earnedBones = Math.round(correctCount * 1.5 * streakBonus);
                if (isPerfect) earnedBones += 10;
                
                wasChallenge = oldUserData.doubleOrNothingActive;
                if (wasChallenge) {
                    earnedBones = isPerfect ? 100 : 0;
                    newUserData.doubleOrNothingActive = false;
                }
        
                if (quizId.includes('-') && !quizId.startsWith('study_')) {
                    const wasPassed = score >= PASS_THRESHOLD;
                    const existingProgress = newUserData.progress[quizId] || { bestScore: 0, passed: false };
                    newUserData.progress[quizId] = {
                        bestScore: Math.max(existingProgress.bestScore, score),
                        passed: existingProgress.passed || wasPassed,
                    };
                }
            }
            
            newUserData.xp += earnedXp;
            newUserData.bones += earnedBones;
            if (isPerfect && !isPractice) newUserData.totalPerfectQuizzes++;
            // Actualizar racha perfecta
            if (!isPractice) {
                if (isPerfect) newUserData.perfectStreak = (oldUserData.perfectStreak || 0) + 1;
                else newUserData.perfectStreak = 0;
            }
            
            newUserData.dailyStats = {
                ...oldUserData.dailyStats,
                quizzesCompleted: oldUserData.dailyStats.quizzesCompleted + 1,
                xpEarned: oldUserData.dailyStats.xpEarned + earnedXp,
                perfectQuizzes: oldUserData.dailyStats.perfectQuizzes + (isPerfect && !isPractice ? 1 : 0),
            };

            // Actualizar puntuaciones de desafíos activos
            if (auth?.uid && !isPractice) {
                updateChallengeScore(
                    auth.uid,
                    earnedXp, // XP ganado
                    isPerfect ? 1 : 0, // Quizzes perfectos
                    correctCount, // Respuestas correctas
                    questions.length // Total de preguntas respondidas
                ).catch(err => console.warn('Error actualizando desafíos:', err));
            }
            
            const { leveledUpItems, newUnclaimedRewards, finalLevel } = handleQuizCompletionAchievements(oldUserData, newUserData);
            newUserData.level = finalLevel;
            
            if (leveledUpItems.length > 0) {
                // NO actualizamos niveles aquí. Solo agregamos recompensas pendientes.
                newUserData.unclaimedAchievementRewards = [...new Set([...oldUserData.unclaimedAchievementRewards, ...newUnclaimedRewards])];
            }
    
            const result: LastQuizResult = {
                earnedXp,
                earnedBones,
                isPerfect,
                wasChallenge,
                mistakes: questions.length - correctCount,
                questionIds: questions.map(q => q.id),
                answers,
            };
            
            setUserData(prev => ({ ...(prev as UserData), ...newUserData }));
        
            if (leveledUpItems.length > 0) {
                // Mostrar también en el resumen
                result.leveledUpItems = leveledUpItems;
                setLastQuizResult(result);
            } else {
                setLastQuizResult(result);
            }
        }
    }, [userData, currentQuiz, examStartTime, handleQuizCompletionAchievements, handleBack]);

    // --- DUEL LOGIC (REWORKED) ---
    const ai = useMemo(() => {
        const apiKey = (import.meta as any)?.env?.VITE_GEMINI_API_KEY || localStorage.getItem('VITE_GEMINI_API_KEY');
        try {
            return apiKey ? new GoogleGenAI({ apiKey }) : null;
        } catch {
            return null;
        }
    }, []);

    const duelCorrectRef = useRef(0);

    const handleStartDuel = useCallback(async (maestro: AIOpponent) => {
        const apiKey = (import.meta as any)?.env?.VITE_GEMINI_API_KEY || localStorage.getItem('VITE_GEMINI_API_KEY');
        if (!userData || !ai || !apiKey) {
            showToast('Configura tu API Key de Gemini en VITE_GEMINI_API_KEY.', 'error');
            return;
        }

        if (userData.hearts <= 0) {
            handleNoLivesAttempt();
            return;
        }

        const wasAtMaxHearts = userData.hearts === 5;
        setUserData(prev => prev ? {
            ...prev,
            hearts: prev.hearts - 1,
            nextHeartAt: wasAtMaxHearts ? Date.now() + HEART_REGEN_TIME : prev.nextHeartAt,
        } : null);

        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction: maestro.systemInstruction }
        });

        const initialMessage: DuelMessage = { id: 'intro-1', sender: 'ai', text: maestro.initialPrompt };

        duelCorrectRef.current = 0;
        setDuelState({
            maestro,
            messages: [initialMessage],
            status: 'player_turn',
            geminiChat: chat,
            currentTopic: 'Introducción',
            startTime: Date.now(),
            correctAnswersInARow: 0,
            totalTurns: 0,
            totalCorrectAnswers: 0,
        });

        handleNavigate('duel');

    }, [userData, ai, showToast, handleNoLivesAttempt, handleNavigate]);

    const handleEndDuel = useCallback((finalState: DuelState) => {
        const timeTaken = (Date.now() - finalState.startTime) / 1000;
        const avgTimePerTurn = finalState.totalTurns > 0 ? timeTaken / finalState.totalTurns : 0;
        const accuracy = finalState.totalTurns > 0 ? duelCorrectRef.current / finalState.totalTurns : 0;

        let stars = 0;
        if (accuracy >= 0.5) stars = 1;
        if (accuracy >= 0.8 && avgTimePerTurn < 30) stars = 2;
        if (accuracy >= 0.95 && avgTimePerTurn < 20) stars = 3;

        const playerWon = stars > 0;
        const duelReward = playerWon ? { xp: stars * 25, bones: stars * 15 } : null;
        let unlockedNote: MasterNote | null = null;

        if (playerWon && duelReward) {
            const lastMessage = finalState.messages[finalState.messages.length - 1]?.text || '';
            const noteParts = lastMessage.split('###');
            if (noteParts.length > 1) {
                const noteContent = noteParts[1].split('\n\n');
                const title = noteContent.shift()?.trim() || 'Apunte del Maestro';
                const content = noteContent.join('\n\n').trim();
                unlockedNote = {
                    id: `note-${Date.now()}`,
                    title,
                    content,
                    maestroId: finalState.maestro.id,
                    maestroName: finalState.maestro.name,
                    maestroAvatar: finalState.maestro.avatar,
                    timestamp: Date.now(),
                };
            }

            setUserData(prev => {
                if (!prev) return null;
                const newMasterNotes = unlockedNote ? [...prev.masterNotes, unlockedNote] : prev.masterNotes;
                return { ...prev, xp: prev.xp + duelReward!.xp, bones: prev.bones + duelReward!.bones, masterNotes: newMasterNotes };
            });
        }

        setDuelSummary({ unlockedNote, stars, maestro: finalState.maestro, reward: duelReward });
        handleNavigate('duel_summary');
    }, [handleNavigate]);

    const handleSendDuelMessage = useCallback(async (message: string) => {
        if (!duelState || duelState.status !== 'player_turn' || !ai || !duelState.geminiChat) return;

        const updatedMessages: DuelMessage[] = [...duelState.messages, { id: `player-${Date.now()}`, sender: 'player', text: message }];
        setDuelState(prev => prev ? { ...prev, messages: updatedMessages, status: 'ai_thinking' } : null);

        const duelResponseSchema = {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN },
            responseText: { type: Type.STRING },
            isDuelOver: { type: Type.BOOLEAN },
            topic: { type: Type.STRING }
          },
          required: ["isCorrect", "responseText", "isDuelOver", "topic"]
        };

        try {
            const resp = await duelState.geminiChat.sendMessage({
                message,
                config: { responseMimeType: 'application/json', responseSchema: duelResponseSchema },
            });

            let parsed: any = null;
            try {
                parsed = JSON.parse(resp.text);
            } catch {
                parsed = { isCorrect: false, responseText: resp.text || '...', isDuelOver: false, topic: 'General' };
            }

            const aiResponse: DuelMessage = { id: `ai-${Date.now()}`, sender: 'ai', text: parsed.responseText };

            setDuelState(prev => {
                if (!prev) return null;

                const newTotalTurns = prev.totalTurns + 1;
                const incrementCorrect = parsed.isCorrect ? 1 : 0;
                const newCorrectRow = parsed.isCorrect ? prev.correctAnswersInARow + 1 : 0;
                if (incrementCorrect) duelCorrectRef.current += 1;

                // Forzar fin a los 5 turnos máximo
                const shouldEndByTurns = newTotalTurns >= 5;
                const isOver = parsed.isDuelOver || shouldEndByTurns;

                const nextState: DuelState = {
                    ...prev,
                    messages: [...updatedMessages, aiResponse],
                    status: isOver ? 'finished' : 'player_turn',
                    currentTopic: parsed.topic || prev.currentTopic,
                    correctAnswersInARow: newCorrectRow,
                    totalTurns: newTotalTurns,
                };

                if (isOver) handleEndDuel(nextState);
                return nextState;
            });

        } catch (error) {
            console.error('Error in duel interaction:', error);
            showToast('Hubo un error con el Maestro. Inténtalo de nuevo.', 'error');
            setDuelState(prev => prev ? { ...prev, status: 'player_turn' } : null);
        }
    }, [duelState, ai, showToast, handleEndDuel]);
    
    const handleLeveledUpItemsModalClose = useCallback(() => {
        setLeveledUpItemsToShow(null);
        if (pendingQuizResult) {
            setLastQuizResult(pendingQuizResult);
            setPendingQuizResult(null);
        }
    }, [pendingQuizResult]);

    const handleClaimReward = (reward: MysteryReward) => {
        setUserData(prev => {
            if (!prev) return null;
            const newUserData = JSON.parse(JSON.stringify(prev));

            switch (reward.type) {
                case 'bones':
                    newUserData.bones += reward.amount;
                    break;
                case 'heart':
                    // Exception: Hearts from Mystery Box can overflow the normal cap
                    newUserData.hearts += (reward.amount || 1);
                    break;
                case 'streak_freeze':
                    newUserData.streakFreezeActive = true;
                    break;
                case 'xp_boost':
                    newUserData.xpBoostUntil = Date.now() + 15 * 60 * 1000;
                    break;
                case 'avatar':
                    if (reward.avatarId && !newUserData.unlockedAvatars.includes(reward.avatarId)) {
                        newUserData.unlockedAvatars.push(reward.avatarId);
                    }
                    break;
                default: // Lifelines
                    if (reward.type.startsWith('lifeline')) {
                        const lifelineKey = reward.type.replace('lifeline_', '') as keyof UserData['lifelineData'];
                        if (typeof newUserData.lifelineData[lifelineKey] === 'number') {
                            newUserData.lifelineData[lifelineKey] = newUserData.lifelineData[lifelineKey] + 1;
                        }
                    }
                    break;
            }
            return newUserData;
        });
        setActiveModal(null); // Close the modal after claiming
    };

    const handleClaimChallengeReward = useCallback((challengeId: string) => {
        // Generar una recompensa aleatoria
        const chosenReward = getWeightedReward();
        setMysteryBoxReward(chosenReward);
        
        // Mostrar la animación de Mystery Box
        setTimeout(() => setActiveModal('mysteryBox'), 100);
    }, []);

    const handlePurchase = useCallback((itemId: ShopItem['id'], startElement: HTMLElement) => {
        setUserData(prev => {
            if (!prev) return null;
            
            const item = shopItems.find(i => i.id === itemId);
            if (!item) return prev;

            let cost = item.price;
            if (itemId === 'double_or_nothing') cost = 50;

            if (prev.bones < cost) {
                showToast('¡No tienes suficientes huesitos!', 'error', (() => { const B = iconMap['bones']; return <B className="w-5 h-5" /> })());
                return prev;
            }

            const newUserData: UserData = JSON.parse(JSON.stringify(prev)); // Deep copy
            newUserData.bones -= cost;
            newUserData.purchases[itemId] = (newUserData.purchases[itemId] || 0) + 1;
            newUserData.totalBonesSpent += cost;

            let toastMessage = '¡Compra realizada!';
            let toastIcon: React.ReactNode = <Award className="w-5 h-5 text-white"/>;

            switch(itemId) {
                case 'buy_one_heart':
                    newUserData.hearts = Math.min(5, newUserData.hearts + 1);
                    toastMessage = '¡Vida comprada!';
                    toastIcon = (() => { const H = iconMap['heart_img']; return <H className="w-5 h-5" /> })();
                    triggerAnimation({ type: 'heart', count: 1, startElement });
                    break;
                case 'streak_freeze':
                    newUserData.streakFreezeActive = true;
                    toastMessage = '¡Protector de racha equipado!';
                    { const S = Shield; toastIcon = <S className="w-5 h-5 text-cyan-500" />; }
                    break;
                case 'xp_boost':
                    newUserData.xpBoostUntil = Date.now() + 15 * 60 * 1000;
                    toastMessage = '¡Boost de XP activado!';
                    { const Z = Zap; toastIcon = <Z className="w-5 h-5 text-yellow-400" />; }
                    break;
                case 'double_or_nothing':
                    newUserData.doubleOrNothingActive = true;
                    toastMessage = '¡Apuesta realizada! ¡Haz un test perfecto para ganar!';
                    toastIcon = <ChevronsUp className="w-5 h-5 text-white" />;
                    break;
                 case 'lifeline_fifty_fifty':
                    newUserData.lifelineData.fiftyFifty++;
                    toastMessage = '¡Comodín 50/50 comprado!';
                    toastIcon = (() => { const I = iconMap['lifeline_fifty_fifty']; return <I className="w-5 h-5" /> })();
                    break;
                case 'lifeline_quick_review':
                    newUserData.lifelineData.quickReview++;
                    toastMessage = '¡Repaso Rápido comprado!';
                    toastIcon = (() => { const I = iconMap['lifeline_quick_review']; return <I className="w-5 h-5" /> })();
                    break;
                case 'lifeline_second_chance':
                    newUserData.lifelineData.secondChance++;
                    toastMessage = '¡Segunda Oportunidad comprada!';
                    toastIcon = (() => { const I = iconMap['lifeline_second_chance']; return <I className="w-5 h-5" /> })();
                    break;
                case 'lifeline_adrenaline':
                    newUserData.lifelineData.adrenaline++;
                    toastMessage = '¡Adrenalina comprada!';
                    toastIcon = (() => { const I = iconMap['lifeline_adrenaline']; return <I className="w-5 h-5" /> })();
                    break;
                case 'lifeline_skip':
                    newUserData.lifelineData.skip++;
                    toastMessage = '¡Salto comprado!';
                    toastIcon = (() => { const I = iconMap['lifeline_skip']; return <I className="w-5 h-5" /> })();
                    break;
                case 'lifeline_double':
                    newUserData.lifelineData.double++;
                    toastMessage = '¡Duplica comprado!';
                    toastIcon = (() => { const I = iconMap['lifeline_double']; return <I className="w-5 h-5" /> })();
                    break;
                case 'lifeline_immunity':
                    newUserData.lifelineData.immunity++;
                    toastMessage = '¡Inmunidad comprada!';
                    toastIcon = (() => { const I = iconMap['lifeline_immunity']; return <I className="w-5 h-5" /> })();
                    break;
                case 'mystery_box': {
                    const chosenReward = getWeightedReward();
                    setMysteryBoxReward(chosenReward);
                    
                    toastMessage = '¡Caja Misteriosa abierta!';
                    toastIcon = <Gift className="w-5 h-5 text-white"/>;
                    setTimeout(() => setActiveModal('mysteryBox'), 100);
                    break;
                }
                case 'xp_pack':
                    newUserData.xp += 50;
                    toastMessage = "+50 XP añadidos!";
                    toastIcon = <Zap className="w-5 h-5 text-yellow-400" />;
                    triggerAnimation({ type: 'xp', count: 5, startElement });
                    break;
            }
            
            showToast(toastMessage, 'success', toastIcon);
            return newUserData;
        });
    }, [showToast, triggerAnimation]);

    const handleClaimAchievementReward = useCallback((achievementId: string, rank: any, level: number, startElement: HTMLElement) => {
        if (animatingAchievementId) return;

        setAnimatingAchievementId(achievementId);

        let leveledUpFromClaim: LeveledUpAchievement[] = [];
        let bonesReward = 0;
        let xpReward = 0;
        
        setUserData(prev => {
            if (!prev) return null;
    
            const newUserData = JSON.parse(JSON.stringify(prev));
            
            const rewardId = `${achievementId}:${level}`;
            const hasReward = newUserData.unclaimedAchievementRewards.includes(rewardId);
    
            if (!hasReward) return prev;
    
            const achievement = achievementsData.find(a => a.id === achievementId);
            if (!achievement) return prev;
    
            const tier = achievement.tiers.find(t => t.level === level);
            bonesReward = tier?.reward?.bones || 0;
            xpReward = tier?.reward?.xp || 0;
            const avatarRewardId = (tier?.reward as { bones?: number; xp?: number; avatarId?: string } | undefined)?.avatarId;
            
            // Unlock avatar if it's part of the achievement reward
            if (avatarRewardId && !newUserData.unlockedAvatars.includes(avatarRewardId)) {
                newUserData.unlockedAvatars.push(avatarRewardId);
                const avatar = AVATAR_DATA.find(a => a.id === avatarRewardId);
                if (avatar) {
                   const icon = avatar.emoji.includes('/') 
                        ? <img src={avatar.emoji} alt={avatar.name} className="w-8 h-8 rounded-full" />
                        : <span>{avatar.emoji}</span>;
                   showToast(`Avatar desbloqueado: ${avatar.name}`, 'success', icon);
                }
            }
    
            newUserData.bones += bonesReward;
            newUserData.xp += xpReward;
            newUserData.unclaimedAchievementRewards = newUserData.unclaimedAchievementRewards.filter((r: string) => r !== rewardId);
            // Subir nivel SOLO al reclamar
            const currentLevel = newUserData.unlockedAchievements[achievementId] || 0;
            if (level > currentLevel) {
                newUserData.unlockedAchievements[achievementId] = level;
            }

            // Recalcular nivel y logros por subida de nivel tras ganar XP al reclamar
            const { leveledUpItems, newUnclaimedRewards, finalLevel } = handleQuizCompletionAchievements(prev, newUserData);
            newUserData.level = finalLevel;
            if (newUnclaimedRewards.length > 0) {
                newUserData.unclaimedAchievementRewards = [...new Set([...
                    newUserData.unclaimedAchievementRewards,
                    ...newUnclaimedRewards
                ])];
            }
            if (leveledUpItems.length > 0) {
                leveledUpFromClaim = leveledUpItems;
            }

            return newUserData;
        });
        
        // Trigger animations AFTER state update
        if (bonesReward > 0) triggerAnimation({ type: 'bone', count: 8, startElement });
        if (xpReward > 0) triggerAnimation({ type: 'xp', count: Math.min(10, Math.ceil(xpReward / 20)), startElement });
        
        setTimeout(() => {
            setAnimatingAchievementId(null);
        }, 800);

        // Mostrar modal de subidas de nivel si las hubo por la reclamación
        if (leveledUpFromClaim.length > 0) {
            setLeveledUpItemsToShow(leveledUpFromClaim);
        }
    }, [triggerAnimation, animatingAchievementId, showToast]);

    const handleAchievementAction = useCallback((action: Achievement['action']) => {
        if (action) {
            handleNavigate(action.value);
        }
    }, [handleNavigate]);

     const handleUseLifeline = useCallback((lifelineId: keyof LifelineData) => {
        setUserData(prev => {
            if (!prev || prev.lifelineData[lifelineId] <= 0) return prev;
            
            const newLifelineData = {
                ...prev.lifelineData,
                [lifelineId]: prev.lifelineData[lifelineId] - 1,
            };

            return { ...prev, lifelineData: newLifelineData };
        });
    }, []);

    const handleClaimChallenge = useCallback((challenge: DailyChallenge) => {
        setUserData(prev => {
            if (!prev || prev.claimedChallenges.includes(challenge.id)) return prev;
            
            showToast(`+${challenge.reward} Huesitos!`, 'challenge', (() => { const B = iconMap['bones']; return <B className="w-5 h-5" /> })());
            
            return {
                ...prev,
                bones: prev.bones + challenge.reward,
                claimedChallenges: [...prev.claimedChallenges, challenge.id],
            };
        });
    }, [showToast]);

    const handleClaimDailyShopReward = useCallback((startElement: HTMLElement) => {
        setUserData(prev => {
            if (!prev) return null;
    
            const today = toLocalDateString(new Date());
            const lastClaimDate = prev.lastDailyShopRewardClaim ? toLocalDateString(new Date(prev.lastDailyShopRewardClaim)) : today;
    
            if (today === lastClaimDate) {
                showToast("Ya has reclamado la recompensa de hoy.", "error");
                return prev;
            }
    
            const possibleRewards: MysteryReward[] = [
                { type: 'bones', amount: 50, name: '50 Huesitos', icon: 'bones' },
                { type: 'bones', amount: 100, name: '100 Huesitos', icon: 'bones' },
                { type: 'lifeline_fifty_fifty', name: 'Comodín 50/50', icon: 'lifeline_fifty_fifty' },
                { type: 'lifeline_quick_review', name: 'Repaso Rápido', icon: 'lifeline_quick_review' },
                { type: 'lifeline_second_chance', name: 'Segunda Oportunidad', icon: 'lifeline_second_chance' },
                { type: 'lifeline_adrenaline', name: 'Adrenalina', icon: 'lifeline_adrenaline' },
                { type: 'lifeline_skip', name: 'Salta', icon: 'lifeline_skip' },
                { type: 'lifeline_double', name: 'Duplica', icon: 'lifeline_double' },
                { type: 'lifeline_immunity', name: 'Inmunidad', icon: 'lifeline_immunity' },
                { type: 'heart', name: '1 Vida', icon: 'buy_one_heart' }
            ];
            const reward = possibleRewards[Math.floor(Math.random() * possibleRewards.length)];
            
            const newUserData: UserData = JSON.parse(JSON.stringify(prev));
            newUserData.lastDailyShopRewardClaim = new Date().toISOString();
    
            let toastMessage = "";
            let toastIcon: React.ReactNode = null;
            let animationType: AnimationType | null = null;
            let animationCount = 0;
    
            switch (reward.type) {
                case 'bones':
                    newUserData.bones += reward.amount!;
                    toastMessage = `¡Has ganado ${reward.amount} Huesitos!`;
                    toastIcon = (() => { const B = iconMap['bones']; return <B className="w-5 h-5" /> })();
                    animationType = 'bone';
                    animationCount = Math.min(10, Math.ceil(reward.amount! / 10));
                    break;
                case 'lifeline_fifty_fifty':
                    newUserData.lifelineData.fiftyFifty++;
                    toastMessage = '¡Has ganado un Comodín 50/50!';
                    toastIcon = (() => { const I = iconMap['lifeline_fifty_fifty']; return <I className="w-5 h-5" /> })();
                    break;
                case 'lifeline_quick_review':
                    newUserData.lifelineData.quickReview++;
                    toastMessage = '¡Has ganado un Repaso Rápido!';
                    toastIcon = (() => { const I = iconMap['lifeline_quick_review']; return <I className="w-5 h-5" /> })();
                    break;
                case 'lifeline_second_chance':
                    newUserData.lifelineData.secondChance++;
                    toastMessage = '¡Has ganado una Segunda Oportunidad!';
                    toastIcon = (() => { const I = iconMap['lifeline_second_chance']; return <I className="w-5 h-5" /> })();
                    break;
                case 'lifeline_adrenaline':
                    newUserData.lifelineData.adrenaline++;
                    toastMessage = '¡Has ganado Adrenalina!';
                    toastIcon = (() => { const I = iconMap['lifeline_adrenaline']; return <I className="w-5 h-5" /> })();
                    break;
                case 'lifeline_skip':
                    newUserData.lifelineData.skip++;
                    toastMessage = '¡Has ganado Salta!';
                    toastIcon = (() => { const I = iconMap['lifeline_skip']; return <I className="w-5 h-5" /> })();
                    break;
                case 'lifeline_double':
                    newUserData.lifelineData.double++;
                    toastMessage = '¡Has ganado Duplica!';
                    toastIcon = (() => { const I = iconMap['lifeline_double']; return <I className="w-5 h-5" /> })();
                    break;
                case 'lifeline_immunity':
                    newUserData.lifelineData.immunity++;
                    toastMessage = '¡Has ganado Inmunidad!';
                    toastIcon = (() => { const I = iconMap['lifeline_immunity']; return <I className="w-5 h-5" /> })();
                    break;
                case 'heart':
                    newUserData.hearts = Math.min(5, newUserData.hearts + 1);
                    toastMessage = '¡Has ganado una vida!';
                    toastIcon = (() => { const H = iconMap['heart_img']; return <H className="w-5 h-5" /> })();
                    animationType = 'heart';
                    animationCount = 1;
                    break;
            }
            
            showToast(toastMessage, 'success', toastIcon);
            if (animationType) {
                triggerAnimation({ type: animationType, count: animationCount, startElement });
            }
    
            return newUserData;
        });
    }, [showToast, triggerAnimation]);

    const handleOpenInfoTooltip = useCallback((type: 'streak' | 'bones' | 'hearts') => {
        setInfoTooltipType(type);
    }, []);

    const pendingLevelRewards = useMemo(() => {
        if (!userData) return false;
        for (let i = 1; i <= userData.level; i++) {
            if (!userData.claimedLevelRewards.includes(i)) {
                return true;
            }
        }
        return false;
    }, [userData?.level, userData?.claimedLevelRewards]);

    const handleClaimLevelReward = useCallback((level: number, startElement: HTMLElement) => {
        setUserData(prev => {
            if (!prev || prev.claimedLevelRewards.includes(level) || level > prev.level) {
                return prev;
            }
            const reward = LEVEL_REWARDS.find(r => r.level === level);
            if (!reward) return prev;

            const newUserData = JSON.parse(JSON.stringify(prev));
            newUserData.bones += reward.bones;
            if (reward.avatarId && !newUserData.unlockedAvatars.includes(reward.avatarId)) {
                newUserData.unlockedAvatars.push(reward.avatarId);
                const avatar = AVATAR_DATA.find(a => a.id === reward.avatarId);
                if (avatar) {
                   const icon = avatar.emoji.includes('/') 
                        ? <img src={avatar.emoji} alt={avatar.name} className="w-8 h-8 rounded-full" />
                        : <span>{avatar.emoji}</span>;
                   showToast(`Avatar desbloqueado: ${avatar.name}`, 'success', icon);
                }
            }
            if (reward.lifelines) {
                const ll = reward.lifelines;
                newUserData.lifelineData = {
                    ...newUserData.lifelineData,
                    fiftyFifty: newUserData.lifelineData.fiftyFifty + (ll.fiftyFifty || 0),
                    quickReview: newUserData.lifelineData.quickReview + (ll.quickReview || 0),
                    secondChance: newUserData.lifelineData.secondChance + (ll.secondChance || 0),
                    adrenaline: newUserData.lifelineData.adrenaline + (ll.adrenaline || 0),
                    skip: newUserData.lifelineData.skip + (ll.skip || 0),
                    double: newUserData.lifelineData.double + (ll.double || 0),
                    immunity: newUserData.lifelineData.immunity + (ll.immunity || 0),
                };
            }
            newUserData.claimedLevelRewards.push(level);
            
            if (reward.bones > 0) {
                triggerAnimation({ type: 'bone', count: 8, startElement });
            }

            return newUserData;
        });
    }, [triggerAnimation, showToast]);

    const notifications = useMemo(() => {
        if (!userData) return { shop: false, achievements: false, challenges: false, study: false, levelRewards: false };
        
        const today = toLocalDateString(new Date());
        
        const hasUnclaimedAchievements = userData.unclaimedAchievementRewards.length > 0;
        
        const hasUnclaimedChallenges = dailyChallengesData.some(challenge => 
            challenge.condition(userData.dailyStats) && !userData.claimedChallenges.includes(challenge.id)
        );
        
        const lastClaimDate = userData.lastDailyShopRewardClaim ? toLocalDateString(new Date(userData.lastDailyShopRewardClaim)) : today;
        const canClaimDailyShopReward = today !== lastClaimDate;

        const hasWeakPoints = userData.weakPoints.length > 0;

        const hasUnclaimedLevelRewards = pendingLevelRewards;

        return {
            shop: canClaimDailyShopReward,
            achievements: hasUnclaimedAchievements,
            challenges: hasUnclaimedChallenges,
            study: hasWeakPoints,
            levelRewards: hasUnclaimedLevelRewards,
        };
    }, [userData, pendingLevelRewards]);

    const handleStudyBack = useCallback(() => {
        if (selectedTemaId) {
            setSelectedTemaId(null);
        } else if (selectedRegionId) {
            setSelectedRegionId(null);
        } else {
            handleBack();
        }
    }, [selectedTemaId, selectedRegionId, handleBack]);

    const onStudySummaryContinue = useCallback((rewardPositions: { xp: DOMRect | null, bones: DOMRect | null }) => {
        if (lastQuizResult?.earnedXp && rewardPositions.xp) {
            triggerAnimation({ type: 'xp', count: Math.min(10, Math.ceil(lastQuizResult.earnedXp / 10)), startRect: rewardPositions.xp });
        }
        if (lastQuizResult?.earnedBones && rewardPositions.bones) {
            triggerAnimation({ type: 'bone', count: 8, startRect: rewardPositions.bones });
        }
        setLastQuizResult(null);
        setView('home');
        viewHistory.current = ['home'];
        // Scroll to top cuando se cambia de página
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [lastQuizResult, triggerAnimation]);

    const handleExamResultContinue = useCallback(() => {
        setExamResult(null);
        setView('home');
        viewHistory.current = ['home'];
        // Scroll to top cuando se cambia de página
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    const handleSaveUserNote = useCallback((note: Omit<UserNote, 'id' | 'timestamp'>) => {
        setUserData(prev => {
            if (!prev) return null;
            const newNote = { ...note, id: `user-note-${Date.now()}`, timestamp: Date.now() };
            const newUserNotes = [...prev.userNotes, newNote];
            return { ...prev, userNotes: newUserNotes };
        });
        handleBack();
        showToast('Nota guardada!', 'success', <BookOpen className="w-5 h-5"/>);
    }, [handleBack, showToast]);

    const handleDeleteUserNote = useCallback((noteId: string) => {
        setUserData(prev => {
            if (!prev) return null;
            const newUserNotes = prev.userNotes.filter(n => n.id !== noteId);
            return { ...prev, userNotes: newUserNotes };
        });
        showToast('Nota eliminada.', 'success');
    }, [showToast]);
    
    const handleResetToBaseline = useCallback(() => {
        if (!auth) return;
        const baseline: UserData = JSON.parse(JSON.stringify(defaultUserData));
        // asegurar timestamps basales
        baseline.lastLoginDate = new Date(0).toISOString();
        setUserData(baseline);
        showToast('Datos reiniciados.', 'success');
    }, [auth, showToast]);

    useEffect(() => {
        const criticalImages = [
            '/images/Emoji hueso png.png',
            '/images/Modo estudio.png',
            '/images/Modo examen.png',
            '/images/Tienda.png',
            '/images/Logros.png',
            '/images/Heart.png',
            '/images/huesitos.png'
        ];
        preloadImages(criticalImages)
            .catch(err => console.error("Error preloading images:", err));
    }, []);

    useEffect(() => {
        // Sincroniza el estado de la app con Firebase (popup o redirect)
        const unsubscribe = subscribeAuth((user) => {
            setAuth(user);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!auth) return;
        // Si hay datos de perfil pendientes (guardados durante registro), mézclalos una sola vez
        try {
            const pendingRaw = localStorage.getItem('pending_profile');
            if (pendingRaw) {
                const pending = JSON.parse(pendingRaw || '{}');
                if (!pending.email || (auth as any).email === pending.email) {
                    setUserData(prev => {
                        if (!prev) return prev;
                        const merged = { ...prev } as UserData;
                        if (typeof pending.age === 'number') merged.age = pending.age;
                        if (typeof pending.occupation === 'string') merged.occupation = pending.occupation;
                        return merged;
                    });
                    localStorage.removeItem('pending_profile');
                }
            }
        } catch {}
    }, [auth]);

    useEffect(() => {
        if (!auth || !userData) return;
        // Public ladder sync (best-effort; ignora errores)
        upsertUser(auth.uid, {
            id: auth.uid,
            name: userData.name || 'AnatomyGO',
            avatar: userData.avatar || '🦴',
            xp: userData.xp || 0,
            level: userData.level || 1,
            totalQuizzesCompleted: userData.totalQuizzesCompleted || 0,
            totalCorrectAnswers: userData.totalCorrectAnswers || 0,
            totalQuestionsAnswered: userData.totalQuestionsAnswered || 0,
            unlockedAchievements: userData.unlockedAchievements || {},
        }).catch(() => {});
    }, [auth?.uid, userData?.name, userData?.avatar, userData?.xp, userData?.level, userData?.totalQuizzesCompleted, userData?.totalCorrectAnswers, userData?.totalQuestionsAnswered, userData?.unlockedAchievements]);

    // Presencia activa para ranking: heartbeat periódico y limpieza al salir
    useEffect(() => {
        if (!auth?.uid) return;
        let timer: any = null;
        const beat = async () => {
            try { await setUserActive(auth.uid!, true); } catch {}
        };
        beat();
        timer = setInterval(beat, 60 * 1000);
        const handleBeforeUnload = () => {
            try { navigator.sendBeacon?.('/noop'); } catch {}
            setUserActive(auth.uid!, false).catch(() => {});
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            if (timer) clearInterval(timer);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            setUserActive(auth.uid!, false).catch(() => {});
        };
    }, [auth?.uid]);

    // --- Guards and Early returns ---
    if (!auth) {
        return (
            <OrientationLock>
                <Background />
                <LoginScreen onSignIn={handleSignIn} />
            </OrientationLock>
        );
    }

    if (isLoading) {
        return (
            <OrientationLock>
                <Background />
                <LoadingScreen />
            </OrientationLock>
        );
    }

    if (!userData) {
        return (
            <OrientationLock>
                <div className="bg-[#121212] min-h-screen w-screen flex items-center justify-center">
                    <div className="text-white text-lg font-semibold">Error al cargar datos del usuario.</div>
                </div>
            </OrientationLock>
        );
    }
    
    const renderContent = () => {
        switch (view) {
            case 'home':
                return <HomeScreen onSelectMode={handleSelectMode} userData={userData} onNavigate={handleNavigate} notifications={notifications} />;
            case 'study':
                return <RegionScreen 
                    onStartQuiz={handleStartStudyQuiz} 
                    onBack={handleStudyBack} 
                    userData={userData} 
                    selectedRegionId={selectedRegionId} 
                    selectedTemaId={selectedTemaId} 
                    onSelectRegion={handleSelectRegion}
                    onSelectTema={handleSelectTema} 
                />;
            case 'exam':
                return <ExamConfigScreen onStartExam={handleStartExam} onBack={handleBack} numQuestions={examNumQuestions} onNumQuestionsChange={setExamNumQuestions} selection={examSelection} onSelectionChange={setExamSelection} />;
            
            case 'shop':
                return <ShopScreen userData={userData} onPurchase={handlePurchase} onClaimDailyReward={handleClaimDailyShopReward} />;
            case 'achievements':
                return <AchievementsScreen userData={userData} onClaimReward={handleClaimAchievementReward} onAction={handleAchievementAction} animatingAchievementId={animatingAchievementId} />;
            case 'level_rewards':
                return <LevelRewardsScreen userData={userData} onBack={handleBack} onClaimReward={handleClaimLevelReward} />;
            case 'profile':
                return <ProfileScreen userData={userData} onAvatarChange={(avatar) => setUserData(p => p ? { ...p, avatar } : null)} onNameChange={(name) => setUserData(p => p ? { ...p, name } : null)} xpInCurrentLevel={xpInCurrentLevel} xpNeededForNextLevel={xpForNextLevel} onSignOut={handleSignOut} onClaimChallengeReward={handleClaimChallengeReward} />;
            case 'quiz': {
                const isExam = currentQuiz.id === 'exam';
                const isPractice = currentQuiz.id === 'practice';
                const timePerQuestion = isExam ? 15 : 20;
                const timeLimit = timePerQuestion * currentQuiz.questions.length;
            
                return <QuizScreen 
                    quizQuestions={currentQuiz.questions} 
                    onQuizComplete={handleQuizSessionEnd}
                    onBack={handleBack} 
                    onMistake={handleMistake} 
                    immediateFeedback={!isExam}
                    lifelines={isPractice ? { fiftyFifty: 0, quickReview: 0, secondChance: 0, adrenaline: 0, skip: 0, double: 0, immunity: 0 } : userData.lifelineData}
                    onUseLifeline={handleUseLifeline}
                    title={isExam ? 'Modo Examen' : isPractice ? 'Modo Práctica' : 'Modo Estudio'}
                    timeLimit={timeLimit}
                />
            }
            case 'challenges':
                return <DailyChallenges dailyStats={userData.dailyStats} onClaimChallenge={handleClaimChallenge} claimedChallenges={userData.claimedChallenges} />;
            case 'duel_lobby':
                 return <DuelLobbyScreen userData={userData} onSelectOpponent={handleStartDuel} />;
            case 'duel':
                return duelState ? <DuelScreen duelState={duelState} playerAvatar={userData.avatar} onSendMessage={handleSendDuelMessage} /> : null;
            case 'leaderboard':
                return <LeaderboardScreen />;
            default:
                return <HomeScreen onSelectMode={handleSelectMode} userData={userData} onNavigate={handleNavigate} notifications={notifications}/>;
        }
    };

    const xpForLevel = (level: number): number => {
        if (level <= 1) return 0;
        const reward = LEVEL_REWARDS.find(r => r.level === level);
        return reward ? reward.xp : 0;
    };
    const baseXpThisLevel = xpForLevel(userData.level);
    const baseXpNextLevel = xpForLevel(userData.level + 1);
    const xpInCurrentLevel = Math.max(0, userData.xp - baseXpThisLevel);
    const xpForNextLevel = Math.max(1, baseXpNextLevel - baseXpThisLevel);

    const isFullScreenView = ['quiz', 'duel'].includes(view);
    const isHomeView = view === 'home';
    const showBottomNav = !isFullScreenView;

    return (
        <ErrorBoundary>
            <OrientationLock>
                <div className="relative min-h-screen w-full overflow-x-hidden text-[#3A3A3A] flex flex-col">
                <Background />
            {!isFullScreenView && (
                <header className="sticky top-0 left-0 right-0 z-40 flex-shrink-0">
                    <StatusBar
                        userData={userData}
                        xpInCurrentLevel={xpInCurrentLevel}
                        xpForNextLevel={xpForNextLevel}
                        onOpenSettings={() => setActiveModal(prev => prev === 'settings' ? null : 'settings')}
                        onOpenInfoTooltip={handleOpenInfoTooltip}
                        levelUpAnimationKey={levelUpAnimationKey}
                        isSaving={isSaving}
                        pendingLevelRewards={pendingLevelRewards}
                        onBack={handleBack}
                        onNavigateToProfile={() => handleNavigate('profile')}
                        showBackButton={view === 'study' || view === 'exam'}
                        onNavigate={handleNavigate}
                        friendRequestsCount={friendRequestsCount}
                    />
                </header>
            )}

            <main 
                ref={mainRef}
                className={`flex-grow overflow-x-hidden overflow-y-auto`}
                style={{
                    minHeight: '100vh',
                    paddingBottom: showBottomNav ? 'calc(4rem + env(safe-area-inset-bottom))' : '0',
                    scrollbarGutter: 'stable both-edges'
                }}
            >
                {renderContent()}
            </main>
            
            <Toast message={toast.message} type={toast.type} icon={toast.icon}/>

            {/* Global Modals & Overlays */}
            <SettingsPopover isOpen={activeModal === 'settings'} onClose={() => setActiveModal(null)} onSignOut={handleSignOut} isDevMode={isDevMode} onUnlockAll={handleUnlockAll} onToggleDevMode={toggleDevMode} onResetData={handleResetToBaseline} userData={userData}/>
            <TourGuide isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
            <InfoTooltip isOpen={!!infoTooltipType} onClose={() => setInfoTooltipType(null)} type={infoTooltipType} hearts={userData.hearts} nextHeartAt={userData.nextHeartAt} />
            <NoLivesModal isOpen={activeModal === 'noLives'} onClose={() => setActiveModal(null)} onGoToShop={() => { setActiveModal(null); handleNavigate('shop'); }} />
            
            {activeModal === 'mysteryBox' && mysteryBoxReward && (
                <MysteryBoxModal 
                    isOpen={true} 
                    onClose={() => setActiveModal(null)} 
                    reward={mysteryBoxReward}
                    onClaim={handleClaimReward}
                    userData={userData}
                />
            )}

            <AchievementUnlockedModal isOpen={!!leveledUpItemsToShow} onClose={handleLeveledUpItemsModalClose} achievements={leveledUpItemsToShow || []} />
            
            <FriendGiftsModal 
                isOpen={activeModal === 'friendGifts'}
                onClose={() => setActiveModal(null)}
                userData={userData}
                auth={auth}
                onGiftClaimed={(type, amount) => {
                    // Handle gift claiming
                    setUserData(prev => {
                        const newUserData = { ...prev };
                        switch (type) {
                            case 'heart':
                                newUserData.hearts = Math.min(newUserData.hearts + amount, 5);
                                break;
                            case 'xp_boost':
                                newUserData.xpBoostUntil = Date.now() + 15 * 60 * 1000;
                                break;
                            case 'hint':
                                // Add hints to lifeline data
                                newUserData.lifelineData.quickReview = newUserData.lifelineData.quickReview + amount;
                                break;
                        }
                        return newUserData;
                    });
                    
                    // Show toast based on gift type
                    switch (type) {
                        case 'heart':
                            setToast({ message: `¡Recibiste ${amount} corazón${amount > 1 ? 'es' : ''}! ❤️`, type: 'success', icon: <Heart className="w-5 h-5 text-red-400" /> });
                            break;
                        case 'xp_boost':
                            setToast({ message: '¡Boost de XP activado! ⚡', type: 'success', icon: <Zap className="w-5 h-5 text-yellow-400" /> });
                            break;
                        case 'hint':
                            setToast({ message: `¡Recibiste ${amount} pista${amount > 1 ? 's' : ''}! 💡`, type: 'success', icon: <Lightbulb className="w-5 h-5 text-blue-400" /> });
                            break;
                    }
                }}
            />
            {lastQuizResult ? (
                <QuizSummaryScreen 
                    {...lastQuizResult} 
                    onContinue={(rewardPositions) => { 
                        onStudySummaryContinue(rewardPositions); 
                        setLastQuizResult(null);
                    }} 
                    onViewLeveledUp={() => { setLastQuizResult(null); handleNavigate('achievements'); }}
                    onReviewMistakes={(qs) => { setLastQuizResult(null); handleStartPractice(qs); }} 
                />
            ) : null}
            {examResult && <ExamResultScreen result={examResult} onContinue={handleExamResultContinue} />}
            {duelSummary && (
                <DuelSummaryScreen
                    {...duelSummary}
                    onPlayAgain={() => { setDuelSummary(null); handleNavigate('duel_lobby'); }}
                    onContinue={() => { setDuelSummary(null); handleBack(); }}
                />
            )}
            
            {/* Floating Settings Button */}
            
            {/* Floating Friend Gifts Button */}
            {!isFullScreenView && auth && (
                <FloatingFriendGiftsButton 
                    userData={userData}
                    auth={auth}
                    onClick={() => setActiveModal('friendGifts')}
                />
            )}
            
            {/* Friend Request Notification */}
            {!isFullScreenView && auth && (
                <FriendRequestNotification 
                    userData={userData}
                    auth={auth}
                    onClick={() => handleNavigate('profile')}
                />
            )}
            
            {/* Modal de bienvenida para nuevos usuarios */}
            <WelcomeModal 
                isOpen={showWelcomeModal}
                onComplete={handleCompleteWelcome}
                userEmail={auth?.email}
            />
            
            {/* Barra de navegación inferior */}
            {showBottomNav && (
                <BottomNav 
                    activeTab={view}
                    onTabChange={handleNavigate}
                    onOpenSettings={() => setActiveModal(prev => prev === 'settings' ? null : 'settings')}
                    notifications={notifications}
                />
            )}
            
        </div>
            </OrientationLock>
        </ErrorBoundary>
    );
}

const MemoizedApp = memo(App);

const AppContainer: React.FC = () => {
  const backgroundMusicPlaylist = [
    'serene-background-music-for-gaming-sessions.mp3',
    'smooth-gaming-atmosphere-.mp3',
    'smooth-and-mellow-beats-for-gaming-.mp3',
    'relaxed-gaming-vibes-.mp3',
    'cozy-game-beats-.mp3',
    'chill-gaming-soundscape-.mp3',
    'calm-beats-for-gaming-.mp3',
    'chill-gaming-session-.mp3',
    'chill-gaming-relaxing-ambient-background-.mp3',
    'chill-gaming-beats-.mp3',
    'calm-gaming-flow-.mp3'
  ]; 

  return (
    <AudioProvider playlist={backgroundMusicPlaylist}>
      <AnimationProvider>
        <MemoizedApp />
      </AnimationProvider>
    </AudioProvider>
  );
};

export default AppContainer;