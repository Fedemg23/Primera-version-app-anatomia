import React, { memo } from 'react';
import { LeveledUpAchievement } from '../types';
import { iconMap } from './icons';

const RewardItem: React.FC<{ achievement: LeveledUpAchievement, delay: number }> = ({ achievement, delay }) => {
    return (
        <div
            className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 animate-reward-item-bounce"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="w-14 h-14 flex-shrink-0 rounded-full bg-slate-700 flex items-center justify-center text-4xl">{achievement.icon}</div>
            <div className="flex-grow text-left">
                <p className="font-extrabold text-slate-100 text-base leading-tight">{achievement.name}</p>
                <p className="text-sm text-slate-400">Nivel {achievement.newLevel} alcanzado</p>
            </div>
            <div className="text-right flex-shrink-0">
                {achievement.rewards?.xp && <p className="font-extrabold text-base text-sky-300">+{achievement.rewards.xp} XP</p>}
                {achievement.rewards?.bones && <p className="font-extrabold text-base text-amber-300">+{achievement.rewards.bones} 🦴</p>}
            </div>
        </div>
    );
};

const UserLevelUpBanner: React.FC<{ level: number, delay: number }> = ({ level, delay }) => (
    <div
        className="text-center p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-xl shadow-blue-500/30 animate-reward-item-bounce"
        style={{ animationDelay: `${delay}ms` }}
    >
        <p className="text-sm font-bold uppercase tracking-widest text-blue-200">Subida de Nivel</p>
        <h3 className="text-5xl font-black text-white tracking-tighter">¡Nivel {level}!</h3>
    </div>
);

interface AchievementUnlockedModalProps {
    isOpen: boolean;
    onClose: () => void;
    achievements: LeveledUpAchievement[];
}

const AchievementUnlockedModal: React.FC<AchievementUnlockedModalProps> = ({ isOpen, onClose, achievements }) => {
    if (!isOpen) return null;
    
    const userLevelUp = achievements.find(a => a.type === 'user_level');
    const achievementUnlocks = achievements.filter(a => a.type === 'achievement');

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <div
                className="relative bg-slate-900 border border-slate-700/50 p-6 rounded-2xl shadow-2xl text-center w-full max-w-sm max-h-[90vh] flex flex-col animate-scale-in reward-celebration"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-shrink-0">
                    <h2 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-300 title-glow-amber">
                        ¡Recompensas!
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Tu esfuerzo ha dado sus frutos.</p>
                </div>
                
                <div className="my-6 space-y-3 overflow-y-auto px-1 flex-grow">
                    {userLevelUp && (
                        <UserLevelUpBanner level={userLevelUp.newLevel} delay={100} />
                    )}
                    {achievementUnlocks.map((ach, index) => (
                        <RewardItem key={`${ach.id}-${index}`} achievement={ach} delay={200 + index * 100} />
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-slate-200 text-black font-bold py-3 px-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-shadow active:scale-95 mt-auto flex-shrink-0 touch-manipulation"
                >
                    ¡Genial!
                </button>
            </div>
        </div>
    );
};

export default memo(AchievementUnlockedModal);