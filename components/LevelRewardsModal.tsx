

import React, { memo } from 'react';
import { LEVEL_REWARDS, AVATAR_DATA } from '../constants';
import { Lock, CheckCircle, Star, iconMap } from './icons';
import { LevelRewardsModalProps } from '../types';

const isImageAvatar = (value: string) => typeof value === 'string' && /(png|webp|jpg|jpeg|svg)$/i.test(value);

const LevelRewardsModal: React.FC<LevelRewardsModalProps> = ({ isOpen, userLevel, claimedLevelRewards, onClose, onClaimReward }) => {
    if (!isOpen) return null;

    const Bones = iconMap['bones'];

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in p-4"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
                    <h2 className="text-2xl font-black text-center text-gray-100">Recompensas de Nivel</h2>
                    <button 
                        onClick={onClose} 
                        className="absolute top-3 right-3 text-gray-400 hover:text-white z-10 touch-manipulation"
                        aria-label="Cerrar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div className="overflow-y-auto p-6 space-y-4">
                    {LEVEL_REWARDS.map((reward) => {
                        const isUnlocked = userLevel >= reward.level;
                        const isClaimed = claimedLevelRewards.includes(reward.level);
                        const isClaimable = isUnlocked && !isClaimed;
                        const avatar = AVATAR_DATA.find(a => a.id === reward.avatarId);
                        
                        return (
                            <div key={reward.level} className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${isClaimable ? 'border-amber-500 bg-amber-900/20' : isClaimed ? 'border-transparent bg-slate-800/50' : 'border-transparent bg-gray-800'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center font-black text-2xl ${isUnlocked ? 'bg-gradient-to-br from-slate-600 to-slate-800 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                        {reward.level}
                                    </div>
                                    <div className="flex-grow space-y-1">
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold w-fit ${isUnlocked ? 'bg-slate-700 text-slate-200' : 'bg-slate-700/50 text-slate-500'}`}>
                                            <Bones className="w-4 h-4" />
                                            <span>+{reward.bones} Huesitos</span>
                                        </div>
                                        {avatar && (
                                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold w-fit ${isUnlocked ? 'bg-slate-700 text-slate-200' : 'bg-slate-700/50 text-slate-500'}`}>
                                                <span className="inline-flex items-center justify-center w-6 h-6 overflow-hidden">
                                                    {isImageAvatar(avatar.emoji) ? (
                                                        <img src={avatar.emoji} alt={avatar.name} className={`w-6 h-6 object-contain ${!isUnlocked ? 'grayscale opacity-70' : ''}`} />
                                                    ) : (
                                                        <span className={`${!isUnlocked ? 'filter grayscale' : ''}`}>{avatar.emoji}</span>
                                                    )}
                                                </span>
                                                <span>{avatar.name}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-shrink-0 w-28 text-right">
                                        {isClaimable ? (
                                            <button 
                                                onClick={(e) => onClaimReward(reward.level, e.currentTarget)}
                                                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 animate-shine touch-manipulation"
                                            >
                                                Reclamar
                                            </button>
                                        ) : isClaimed ? (
                                            <div className="flex items-center justify-center text-green-500 font-semibold">
                                                <CheckCircle className="w-6 h-6" />
                                            </div>
                                        ) : (
                                            <Lock className="w-8 h-8 text-slate-500 mx-auto" />
                                        )}
                                    </div>
                                </div>
                                {reward.lifelines && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {(() => {
                                            const iconKeyByLifeline: Record<string, string> = {
                                                fiftyFifty: 'lifeline_fifty_fifty',
                                                quickReview: 'lifeline_quick_review',
                                                secondChance: 'lifeline_second_chance',
                                                adrenaline: 'lifeline_adrenaline',
                                                skip: 'lifeline_skip',
                                                double: 'lifeline_double',
                                                immunity: 'lifeline_immunity',
                                            };
                                            const labelByLifeline: Record<string, string> = {
                                                fiftyFifty: '50/50',
                                                quickReview: 'Pista',
                                                secondChance: 'Revivir',
                                                adrenaline: 'Adrenalina',
                                                skip: 'Salta',
                                                double: 'Duplica',
                                                immunity: 'Inmunidad',
                                            };
                                            return Object.entries(reward.lifelines).map(([key, val]) => {
                                                if (!val || val <= 0) return null;
                                                const iconKey = iconKeyByLifeline[key] || '';
                                                const Label = labelByLifeline[key] || key;
                                                const Icon = iconMap[iconKey] || null;
                                                return (
                                                    <div key={key} className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-200`}>
                                                        {Icon ? <Icon className="w-4 h-4" /> : null}
                                                        <span>{Label}</span>
                                                        <span className="ml-1 font-black">x{val}</span>
                                                    </div>
                                                );
                                            });
                                        })()}
                                    </div>
                                )}
                                {userLevel === reward.level && <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center border-4 border-gray-800 shadow-lg"><Star className="w-5 h-5 fill-current"/></div>}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default memo(LevelRewardsModal);