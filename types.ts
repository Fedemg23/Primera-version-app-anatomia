

import { SVGProps, FC, ReactNode } from "react";
import { Chat } from "@google/genai";

// NUEVA ESTRUCTURA DE DATOS PRINCIPAL
export interface QuestionData {
  id: string;
  textoPregunta: string;
  opciones: [string, string, string, string];
  indiceRespuestaCorrecta: number;
  explicacion: string;
  urlImagen?: string;
  tags: {
    regionId: string; // ID de la región, ej: 'miembro-superior'
    tema: string;   // Nombre del tema, ej: 'Huesos'
    subtema: string; // Nombre del subtema, ej: 'Húmero'
  };
  dificultad: 'Fácil' | 'Media' | 'Difícil';
}

// Para construir la UI de navegación en Modo Estudio
export interface NavigationSubtema {
    id: string; // ej: 'miembro-superior-Huesos-Húmero'
    name: string;
    questionCount: number;
}

export interface NavigationTema {
    id: string;
    name: string;
    subtemas: NavigationSubtema[];
}

export interface NavigationRegion {
    id: string;
    name: string;
    description: string;
    visuals: {
        gradient: string;
    };
    temas: NavigationTema[];
}

export interface UserProgress {
  [subtemaId: string]: {
    bestScore: number; // from 0 to 1
    passed: boolean;
  };
}

export interface DailyStats {
  quizzesCompleted: number;
  xpEarned: number;
  perfectQuizzes: number;
  lastReset: string;
}

export interface LifelineData {
    fiftyFifty: number;      // Descarte (50/50)
    quickReview: number;     // La Pista
    secondChance: number;    // Revivir
    adrenaline: number;      // Adrenalina (tiempo extra)
    skip: number;            // Salta
    double: number;          // Duplica
    immunity: number;        // Inmunidad
}

export interface MasterNote {
    id: string;
    title: string;
    content: string;
    maestroId: AIOpponent['id'];
    maestroName: string;
    maestroAvatar: string;
    timestamp: number;
}

export interface UserNote {
    id: string;
    title: string;
    textContent: string; // base64 data URL
    drawingContent: string; // base64 data URL
    timestamp: number;
}


export interface UserData {
  name: string;
  hearts: number;
  nextHeartAt: number;
  bones: number;
  streak: number;
  streakFreezeActive: boolean;
  xp: number;
  level: number;
  xpBoostUntil: number;
  doubleOrNothingActive: boolean;
  unlockedAchievements: {
    [achievementId: string]: number; // key: achievement.id, value: level
  };
  unclaimedAchievementRewards: string[]; // e.g., ['quiz_master:1', 'quiz_master:2']
  progress: UserProgress; // Progreso por subtema
  dailyStats: DailyStats;
  claimedChallenges: string[];
  totalQuizzesCompleted: number;
  totalCorrectAnswers: number;
  totalQuestionsAnswered: number;
  avatar: string;
  weakPoints: string[]; // IDs de QuestionData
  purchases: {
    [itemId: string]: number;
  };
  lastLoginDate: string;
  theme: 'dark';
  totalPerfectQuizzes: number;
  totalBonesSpent: number;
  unlockedAvatars: string[];
  lifelineData: LifelineData;
  claimedLevelRewards: number[];
  lastDailyShopRewardClaim?: string;
  masterNotes: MasterNote[];
  userNotes: UserNote[];
  perfectStreak?: number;
}

// TIPOS GENÉRICOS Y DE LA APP
export type IconComponent = FC<SVGProps<SVGSVGElement>>;

export type AnimationType = 'xp' | 'bone' | 'heart';

export interface AnimationConfig {
    type: AnimationType;
    count: number;
    startElement?: HTMLElement | null;
    startRect?: DOMRect | { top: number, left: number, width: number, height: number };
}

export interface ShopItem {
  id: 'buy_one_heart' | 'streak_freeze' | 'xp_boost' | 'double_or_nothing' | 'xp_pack' | 'mystery_box'
    | 'lifeline_fifty_fifty' | 'lifeline_quick_review' | 'lifeline_second_chance'
    | 'lifeline_adrenaline' | 'lifeline_skip' | 'lifeline_double' | 'lifeline_immunity';
  name: string;
  description: string;
  price: number;
  icon: string;
  imageUrl?: string; // opcional: imagen PNG en public/images
}

export interface ShopScreenProps {
    userData: UserData;
    onPurchase: (itemId: ShopItem['id'], startElement: HTMLElement) => void;
    onClaimDailyReward: (startElement: HTMLElement) => void;
}

export interface AchievementTier {
  level: number;
  description: string;
  target: number;
  reward?: {
      bones?: number;
      xp?: number;
  };
}

export type View = 'home' | 'play' | 'shop' | 'achievements' | 'profile' | 'challenges' | 'atlas' | 'study' | 'exam' | 'practice' | 'quiz' | 'quiz_summary' | 'exam_results' | 'duel_lobby' | 'duel' | 'duel_summary';


export interface Achievement {
  id: string;
  name: string;
  description: string; // General description
  icon: string;
  tiers: AchievementTier[];
  progress: (userData: UserData) => number;
  action?: {
    type: 'view';
    value: View;
  };
}

export interface AchievementsScreenProps {
    userData: UserData;
    onClaimReward: (achievementId: string, level: number, startElement: HTMLElement) => void;
    onAction: (action: Achievement['action']) => void;
    animatingAchievementId: string | null;
}


export interface DailyChallenge {
  id: 'complete_3' | 'earn_150_xp' | 'perfect_1';
  title: string;
  target: number;
  reward: number;
  condition: (stats: DailyStats) => boolean;
  icon: string;
}

export interface Avatar {
  id: string;
  emoji: string;
  name: string;
  unlockCondition: {
    type: 'level' | 'achievement' | 'exam_speed';
    value: number | string;
    description: string;
  };
}


export interface LevelReward {
    level: number;
    xp: number;
    bones: number;
    avatarId: string | null;
    lifelines?: Partial<LifelineData>;
}

export interface LevelRewardsModalProps {
    isOpen: boolean;
    userLevel: number;
    claimedLevelRewards: number[];
    onClose: () => void;
    onClaimReward: (level: number, startElement: HTMLElement) => void;
}

export interface LeveledUpAchievement {
    id: string;
    name: string;
    icon: string;
    newLevel: number;
    type: 'achievement' | 'user_level';
    rewards?: {
        xp?: number;
        bones?: number;
    };
}

export interface LastQuizResult {
    earnedXp: number;
    earnedBones: number;
    isPerfect: boolean;
    wasChallenge: boolean;
    mistakes: number;
    questionIds: string[];
    answers: (number | string)[];
    leveledUpItems?: LeveledUpAchievement[];
}

export interface QuizSummaryScreenProps extends LastQuizResult {
    onContinue: (rewardPositions: { xp: DOMRect | null; bones: DOMRect | null; }) => void;
    onReviewMistakes: (mistakenQuestions: QuestionData[]) => void;
    onViewLeveledUp?: () => void;
}


export interface QuizScreenProps {
    quizQuestions: QuestionData[];
    onQuizComplete: (answers: (number | string)[]) => void;
    onBack: () => void;
    onMistake: (questionId: string) => void;
    immediateFeedback: boolean;
    title?: string;
    timeLimit?: number; // Optional time limit in seconds
    lifelines: LifelineData;
    onUseLifeline: (lifelineId: keyof LifelineData) => void;
}


export interface ExamResult {
    score: number;
    total: number;
    percentage: number;
    time: number;
    breakdown: { [tema: string]: { correct: number; total: number } };
    questions: QuestionData[];
    userAnswers: (number | string)[];
}

export interface ExamConfigSelection {
    [regionId: string]: {
        selected: boolean;
        temas: {
            [temaId: string]: boolean;
        };
    };
}

export interface AuthUser {
    uid: string;
}

export type MysteryReward = {
    type: 'bones' | 'xp_boost' | 'streak_freeze' | 'heart' | 'avatar'
      | 'lifeline_fifty_fifty' | 'lifeline_quick_review' | 'lifeline_second_chance'
      | 'lifeline_adrenaline' | 'lifeline_skip' | 'lifeline_double' | 'lifeline_immunity';
    amount?: number;
    name: string;
    icon: string;
    avatarId?: string;
};

export interface StatusBarProps {
    userData: UserData;
    xpInCurrentLevel: number;
    xpForNextLevel: number;
    onOpenSettings: () => void;
    onOpenRewardsModal: () => void;
    onOpenInfoTooltip: (type: 'streak' | 'bones' | 'hearts') => void;
    levelUpAnimationKey: number;
    isSaving: boolean;
    pendingLevelRewards: boolean;
    onBack: () => void;
    onNavigateToProfile: () => void;
    showBackButton: boolean;
}

export interface SettingsPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    isDevMode: boolean;
    onUnlockAll: () => void;
    onSignOut: () => void;
    onToggleDevMode: () => void;
    onResetData?: () => void;
}

export interface HomeScreenProps {
    onSelectMode: (mode: 'study' | 'exam' | 'duel') => void;
    userData: UserData;
    onNavigate: (view: View) => void;
    notifications: {
        shop: boolean;
        achievements: boolean;
        challenges: boolean;
    };
}

export interface ProfileScreenProps {
    userData: UserData;
    onAvatarChange: (avatar: string) => void;
    onNameChange: (newName: string) => void;
    xpInCurrentLevel: number;
    xpNeededForNextLevel: number;
    onSignOut: () => void;
}

// --- DUEL MODE TYPES (REWORKED) ---

export interface AIOpponent {
    id: 'cartografo' | 'clinico' | 'disector';
    name: string;
    avatar: string;
    bio: string;
    specialty: string;
    unlockLevel: number;
    systemInstruction: string;
    initialPrompt: string;
}

export type DuelMessageSender = 'player' | 'ai' | 'system';
export interface DuelMessage {
    id: string;
    sender: DuelMessageSender;
    text: string;
}

export interface DuelState {
    maestro: AIOpponent;
    messages: DuelMessage[];
    status: 'intro' | 'player_turn' | 'ai_thinking' | 'finished';
    geminiChat: Chat | null;
    currentTopic: string;
    startTime: number;
    correctAnswersInARow: number;
    totalTurns: number;
    totalCorrectAnswers?: number; // deprecated; usamos ref interno
}

export interface DuelLobbyScreenProps {
    userData: UserData;
    onSelectOpponent: (opponent: AIOpponent) => void;
}

export interface DuelScreenProps {
    duelState: DuelState;
    playerAvatar: string;
    onSendMessage: (message: string) => void;
}

export interface DuelSummaryScreenProps {
    unlockedNote: MasterNote | null;
    stars: number;
    maestro: AIOpponent;
    reward: { xp: number; bones: number; } | null;
    onPlayAgain: () => void;
    onContinue: (note: MasterNote | null) => void;
}

export interface BibliographyEntry {
    key: string;
    author: string;
    year: number;
    title: string;
    publisher: string;
}

export interface CreateNoteScreenProps {
    onSave: (note: Omit<UserNote, 'id' | 'timestamp'>) => void;
    onBack: () => void;
}