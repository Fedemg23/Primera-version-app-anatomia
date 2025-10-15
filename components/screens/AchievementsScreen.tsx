import React, { memo, useState } from 'react';
import { achievementsData } from '../../constants';
import { UserData, AchievementsScreenProps, Achievement, AchievementRank } from '../../types';
import { QuestionMarkCircle, StarFilled, iconMap } from '../icons';
import HelpIcon from '../HelpIcon';

const rankToLevelMap: Record<AchievementRank, number> = {
    bronze: 1,
    silver: 2,
    gold: 3,
    ruby: 4,
    emerald: 5,
    diamond: 6,
};

// Lista de logros que tienen imagen completa (sin emoji)
// Agrega aquí el ID de nuevos logros cuando tengan imágenes completas
const ACHIEVEMENTS_WITH_FULL_IMAGE = ['quiz_completer'];

const getFrameUrl = (achievementId: string, rank: AchievementRank | null): string => {
    if (!rank) {
        return ''; // O una URL a un marco por defecto para logros no desbloqueados
    }
    
    if (achievementId === 'quiz_completer') {
        const specialNames: Record<string, string> = {
            'bronze': 'Maestro_De_Los_Quizzes_Bronce',
            'silver': 'Maestro_De_Quizzes_Plata',
            'gold': 'Maestro_De_Quizzes_Oro',
            'ruby': 'Maestro_De_Los_Quizzes_Rubi_',
            'emerald': 'Maestro_De_Los_Quizzes_Esmeralda',
            'diamond': 'Maestro_De_Los_Quizzes_Diamante'
        };
        return `/images/Achievements/${specialNames[rank]}.png`;
    } else {
        const genericNames: Record<string, string> = {
            'bronze': 'Logros_Bronce',
            'silver': 'Logros_Plata',
            'gold': 'Logros_Oro',
            'ruby': 'Logros_Rubí',
            'emerald': 'Logros_Esmeralda',
            'diamond': 'Logros_Diamante_'
        };
        return `/images/Achievements/${genericNames[rank]}.png`;
    }
};


const AchievementCircle: React.FC<{ frameUrl: string; icon: string; level: number; rank: AchievementRank | null; achievementId: string }> = ({ frameUrl, icon, level, rank, achievementId }) => {
  const hasFullImage = ACHIEVEMENTS_WITH_FULL_IMAGE.includes(achievementId);
  const isLocked = !rank || level === 0;
  
  // Para logros no desbloqueados, usar el marco de bronce
  const displayFrameUrl = isLocked ? getFrameUrl(achievementId, 'bronze') : frameUrl;
  
  return (
    <div 
      className="relative rounded-full flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 shrink-0"
      style={{ 
        backgroundImage: displayFrameUrl ? `url("${displayFrameUrl}")` : 'none',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        // Aplicar filtro de escala de grises y reducir opacidad para logros bloqueados
        filter: isLocked ? 'grayscale(100%) brightness(0.6)' : 'none',
        opacity: isLocked ? 0.5 : 1
      }}
    >
      {!hasFullImage && (() => {
        const ImgIcon = (iconMap as any)[icon];
        const isSpecial = icon === 'llama' || icon === 'graduation_hat' || icon === 'archery' || icon === 'money_bag';
        const imgSizeClass = isSpecial ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-12 h-12 sm:w-14 sm:h-14';
        return (
          <span style={{ 
            fontSize: '3rem', 
            filter: isLocked ? 'grayscale(100%) brightness(0.6) drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            opacity: isLocked ? 0.5 : 1
          }}>
            {ImgIcon ? <ImgIcon className={imgSizeClass} /> : icon}
          </span>
        );
      })()}
      {level > 0 && rank && (
        <div 
          className="absolute -bottom-2 -right-2 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl border-3 border-slate-900 bg-gradient-to-br from-amber-400 to-yellow-600 shadow-md"
        >
          <span className="text-slate-900" style={{ textShadow: '0px 1px 1px rgba(255,255,255,0.5)' }}>{rankToLevelMap[rank]}</span>
        </div>
      )}
    </div>
  );
};

const AchievementCard: React.FC<{ achievement: Achievement; userData: UserData; onClaimReward: (achievementId: string, rank: AchievementRank, level: number, startElement: HTMLElement) => void; onAction: (action: Achievement['action']) => void; isAnimating: boolean; }> = memo(({ achievement, userData, onClaimReward, onAction, isAnimating }) => {
    const unlockedLevel = userData.unlockedAchievements[achievement.id] || 0;
    const unclaimedRewardsRaw = userData.unclaimedAchievementRewards.filter(r => r.startsWith(achievement.id));
    
    const getRankByLevel = (level: number): AchievementRank | null => {
        const tier = achievement.tiers.find(t => t.level === level);
        return tier ? tier.rank : null;
    };
    
    const unclaimedRanks = unclaimedRewardsRaw.map(r => {
        const level = parseInt(r.split(':')[1], 10);
        return getRankByLevel(level);
    }).filter((r): r is AchievementRank => r !== null);

    const hasUnclaimedRewards = unclaimedRanks.length > 0;
    
    const displayLevel = unlockedLevel;
    const displayRank = getRankByLevel(displayLevel);

    const isFirstUnlock = unlockedLevel === 0 && unclaimedRanks.length > 0;

    const [claimFeedback, setClaimFeedback] = useState<{ xp?: number; bones?: number; key: number } | null>(null);

    const progressValue = achievement.progress(userData);
    const nextTier = achievement.tiers.find(t => t.level === displayLevel + 1);
    const currentTierForProgress = achievement.tiers.find(t => t.level === Math.max(displayLevel, 1));
    const lowerBound = currentTierForProgress?.target ? (displayLevel > 0 ? currentTierForProgress.target : 0) : 0;
    const upperBound = nextTier?.target ?? currentTierForProgress?.target ?? 1;
    const tierRange = Math.max(1, upperBound - lowerBound);
    const progressInTier = Math.max(0, progressValue - lowerBound);
    const progressPercentage = Math.min(100, (progressInTier / tierRange) * 100);
    const remaining = Math.max(0, upperBound - Math.max(progressValue, lowerBound));

    const frameUrl = getFrameUrl(achievement.id, displayRank);

    const handleClaimClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (hasUnclaimedRewards) {
            const rankToClaim = unclaimedRanks[0];
            const tierToClaim = achievement.tiers.find(t => t.rank === rankToClaim);
            if (tierToClaim) {
                onClaimReward(achievement.id, tierToClaim.rank, tierToClaim.level, e.currentTarget);
                
                const card = (e.currentTarget.closest('.group') as HTMLElement) || e.currentTarget as unknown as HTMLElement;
                card.classList.add('ach-claim-burst');
                setTimeout(() => card.classList.remove('ach-claim-burst'), 900);
                
                setClaimFeedback({ xp: tierToClaim.reward?.xp, bones: tierToClaim.reward?.bones, key: Date.now() });
                setTimeout(() => setClaimFeedback(null), 1200);
            }
        }
    };
    
    return (
    <div className="group relative w-full max-w-[240px]">
      {isFirstUnlock && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const fakeEvent = { currentTarget: (e.currentTarget.parentElement?.querySelector('button[aria-label="Reclamar recompensa"]') as HTMLButtonElement) || e.currentTarget } as unknown as React.MouseEvent<HTMLButtonElement>;
            handleClaimClick(fakeEvent);
          }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 new-unlock-badge px-3 py-1 rounded-full text-xs font-extrabold text-black bg-gradient-to-r from-amber-400 to-yellow-300 shadow-md border border-amber-300"
          aria-label="Logro desbloqueado, reclamar"
        >
          ¡Logro desbloqueado! Reclamar ⭐
        </button>
      )}
      <div className="relative flex flex-col items-center justify-between h-[260px] sm:h-[280px] p-4 sm:p-6">
        <AchievementCircle
          frameUrl={frameUrl}
          icon={achievement.icon}
          level={displayLevel}
          rank={displayRank}
          achievementId={achievement.id}
        />

        <div className="w-full text-center mt-3">
          <h3 className={`font-semibold text-xs sm:text-sm ${displayLevel > 0 ? 'text-slate-100' : 'text-slate-400'}`}>{achievement.name}</h3>
          <p className="mt-1 text-[11px] sm:text-xs text-slate-400 line-clamp-2 min-h-[2.6em]">
            {nextTier ? nextTier.description : '¡Logro completado al máximo nivel!'}
          </p>
                </div>
                
        <div className="w-full">
            {nextTier ? (
                <>
                    <div className="w-full bg-slate-700/60 rounded-full h-1.5 sm:h-2 shadow-inner">
                        <div className="bg-gradient-to-r from-amber-500 to-yellow-400 h-1.5 sm:h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[10px] sm:text-xs text-slate-400">
                        <span>{Math.min(progressValue, nextTier.target)} / {nextTier.target}</span>
                        <span>Faltan {remaining}</span>
                    </div>
                </>
            ) : (
                <div className="h-[18px] sm:h-[22px] flex items-center justify-center">
                    <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 text-[10px] sm:text-xs font-semibold">Completado</span>
                </div>
            )}
        </div>

        {hasUnclaimedRewards && (
            <button
                onClick={handleClaimClick}
                className={`absolute -top-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-bold rounded-full text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 touch-manipulation ${isAnimating ? 'animate-fade-out-shrink' : 'animate-fade-in'}`}
                disabled={isAnimating}
                aria-label="Reclamar recompensa"
            >
                ⭐
            </button>
        )}
        {claimFeedback && (
            <>
                {claimFeedback.xp ? (
                    <span className="reward-float text-sky-300 font-extrabold text-lg drop-shadow px-2 py-0.5 rounded bg-slate-900/70 border border-slate-700/60" key={`xp-${claimFeedback.key}`}>+{claimFeedback.xp} XP</span>
                ) : null}
                {claimFeedback.bones ? (
                    <span className="reward-float text-amber-300 font-extrabold text-lg drop-shadow px-2 py-0.5 rounded bg-slate-900/70 border border-slate-700/60" style={{ top: '-32px' }} key={`bones-${claimFeedback.key}`}>
                        +{claimFeedback.bones} {(() => { const B = iconMap['bones']; return <B className="inline-block w-5 h-5 align-[-2px]" /> })()}
                    </span>
                ) : null}
            </>
        )}
            </div>
        </div>
    );
});

const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ userData, onClaimReward, onAction, animatingAchievementId }) => {
  const [showHelp, setShowHelp] = useState(false);
    return (
    <div className="h-full overflow-y-auto p-4 md:p-6 pb-24 pt-0">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3">
          <h2 className="font-graffiti text-4xl md:text-5xl tracking-wide -rotate-1 title-white-clean inline-block transform scale-105">
            Logros
          </h2>
          <HelpIcon modalTitle="Cómo funcionan los Logros" ariaLabel="Cómo funcionan los Logros">
            <ul>
              <li>Cada logro tiene <strong>6 rangos</strong>: Bronce, Plata, Oro, Rubí, Esmeralda y Diamante.</li>
              <li>Al subir de nivel, aparecen <strong>recompensas pendientes</strong> para reclamar.</li>
              <li>El marco del logro refleja tu <strong>rango</strong> actual.</li>
              <li>¡Apunta al <strong>rango de Diamante</strong> como objetivo máximo <StarFilled className="inline w-4 h-4"/>!</li>
            </ul>
          </HelpIcon>
        </div>
      </div>
      {showHelp && (
        <div id="achievements-help" className="mb-6 md:mb-8 p-3 sm:p-4 bg-slate-800/50 border border-slate-700/60 rounded-lg text-slate-300 text-xs sm:text-sm leading-relaxed">
          Gana rangos de logro completando objetivos. Cada logro tiene 6 rangos (Bronce → Diamante). El marco refleja el rango y el tipo de logro. La barra indica tu progreso hacia el siguiente rango.
            </div>
      )}
      <div className="grid grid-cols-3 gap-x-10 gap-y-28 place-items-center">
                {achievementsData.map(ach => (
                     <AchievementCard
                        key={ach.id}
                        achievement={ach}
                        userData={userData}
                        onClaimReward={onClaimReward}
                        onAction={onAction}
                        isAnimating={animatingAchievementId === ach.id}
                    />
                ))}
            </div>
      <div className="h-32 md:h-48" />
        </div>
    );
};

export default memo(AchievementsScreen);