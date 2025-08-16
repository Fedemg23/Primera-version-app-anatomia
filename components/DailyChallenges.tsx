import React, { memo } from 'react';
import { DailyStats, DailyChallenge } from '../types';
import { dailyChallengesData } from '../constants';
import { ChecklistBold, ChallengeBoltBold, ChallengeTargetBold, CheckCircle } from './icons';
import { iconMap } from './icons';

const challengeIcons: { [key: string]: React.FC<any> } = {
  'CheckSquare': ChecklistBold,
  'Zap': ChallengeBoltBold,
  'Target': ChallengeTargetBold,
};

interface DailyChallengesProps {
    dailyStats: DailyStats;
    onClaimChallenge: (challenge: DailyChallenge) => void;
    claimedChallenges: string[];
}

const DailyChallenges: React.FC<DailyChallengesProps> = ({ dailyStats, onClaimChallenge, claimedChallenges }) => {

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-center items-center gap-4 mb-12 text-center">
                <h2 className="font-graffiti text-4xl md:text-5xl tracking-wide -rotate-1 title-white-clean inline-block transform scale-105">
                    Desafíos Diarios
                </h2>
            </div>
            <div className="max-w-md mx-auto space-y-4">
                {dailyChallengesData.map((challenge) => {
                    const Icon = challengeIcons[challenge.icon];
                    const progress = challenge.id === 'complete_3' ? dailyStats.quizzesCompleted : challenge.id === 'earn_150_xp' ? dailyStats.xpEarned : dailyStats.perfectQuizzes;
                    const progressPercentage = Math.min(100, (progress / challenge.target) * 100);
                    const isCompleted = progress >= challenge.target;
                    const isClaimed = claimedChallenges.includes(challenge.id);
                    const Bones = iconMap['bones'];

                    return (
                        <div key={challenge.id} className={`p-4 rounded-xl flex items-center gap-4 transition-all duration-300 ${isClaimed ? 'bg-slate-800/30' : 'bg-slate-800/50'}`}>
                            {Icon && 
                                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-slate-800 shadow-sm">
                                    <Icon className={`w-7 h-7 ${isClaimed ? 'text-slate-500' : 'text-green-300'}`} />
                                </div>
                            }
                            <div className="flex-grow">
                                <p className={`font-bold text-slate-100 ${isClaimed ? 'line-through text-slate-500' : ''}`}>{challenge.title}</p>
                                <div className="relative w-full bg-slate-600 rounded-full h-5 mt-1 overflow-hidden shadow-inner">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-500 ease-out ${isClaimed ? 'bg-slate-500' : 'bg-gradient-to-r from-green-400 to-green-500'}`}
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-white text-xs font-black drop-shadow-md">
                                            {Math.min(progress, challenge.target).toLocaleString()} / {challenge.target.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => onClaimChallenge(challenge)} 
                                disabled={!isCompleted || isClaimed}
                                className={`
                                    w-32 flex-shrink-0 h-10 flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg font-bold text-white transition-all duration-200 active:scale-95 shadow-md touch-manipulation
                                    ${isClaimed 
                                        ? 'bg-slate-500 cursor-default' 
                                        : !isCompleted 
                                            ? 'bg-slate-600 cursor-not-allowed' 
                                            : `bg-gradient-to-r from-green-500 to-green-600 active:shadow-lg ${!isClaimed && isCompleted ? 'animate-shine' : ''}`
                                    }
                                `}
                            >
                                {isClaimed ? (
                                    <>
                                        <CheckCircle className="w-5 h-5 text-white/80"/>
                                        <span>Recibido</span>
                                    </>
                                ) : (
                                    <>
                                        <span>+</span>
                                        <span className="font-bold">{challenge.reward}</span>
                                        <Bones className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default memo(DailyChallenges);