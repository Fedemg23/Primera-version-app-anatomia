import React, { memo, useState } from 'react';
import { achievementsData } from '../../constants';
import { UserData, AchievementsScreenProps, Achievement } from '../../types';
import { QuestionMarkCircle, StarFilled, iconMap } from '../icons';
import HelpIcon from '../HelpIcon';

type MaterialKey = 'wood' | 'stone' | 'bronze' | 'iron' | 'silver' | 'gold' | 'platinum' | 'emerald' | 'ruby' | 'diamond';

const getAchievementAnimation = (achievementId: string, material: MaterialKey, level: number) => {
  // Intensidad basada en nivel (1-10) -> var CSS
  const levelFactor = Math.min(10, Math.max(1, level));
  // Mapear id a clases de overlay/ícono/anillo/número
  // Usa ids presentes en constants.ts: quiz_completer, perfectionist, level_achiever, streaker, explorer, spender, etc.
  const base = {
    overlayClass: '',
    ringClass: '',
    iconClass: '',
    numberClass: 'animate-level-number',
    styleVars: { ['--level-factor' as any]: String(levelFactor) } as React.CSSProperties,
  };
  switch (achievementId) {
    case 'quiz_completer':
      return { ...base, overlayClass: 'anim-quiz-sparkle', iconClass: 'icon-pop' };
    case 'perfectionist':
      return { ...base, overlayClass: 'anim-target-ripple', ringClass: 'anim-ring-rotate-slow', iconClass: 'icon-crisp' };
    case 'level_achiever':
      return { ...base, overlayClass: 'anim-level-arcs', ringClass: 'anim-ring-rotate-medium' };
    case 'streaker':
      return { ...base, overlayClass: 'anim-flame-flicker', iconClass: 'icon-heat', ringClass: 'anim-ring-wobble' };
    case 'explorer':
      return { ...base, overlayClass: 'anim-orbit-dots', ringClass: 'anim-ring-rotate-slow' };
    case 'spender':
      return { ...base, overlayClass: 'anim-coins-twinkle', iconClass: 'icon-shine' };
    default:
      // Materiales nobles: rotación leve del anillo
      if (['gold','silver','platinum','emerald','ruby','diamond'].includes(material)) {
        return { ...base, ringClass: 'anim-ring-rotate-slow', iconClass: 'icon-shine' };
      }
      return base;
  }
};

const getLevelBasedStyles = (level: number) => {
  const baseReturn = {
    levelIndicatorStyle: { background: '#374151' } as React.CSSProperties,
    levelIndicatorAnimationClass: 'animate-level-number',
    cardGlowStyle: {} as React.CSSProperties,
    cardGlowClass: '',
    showSheen: false,
    ringColor: '#374151',
    ringWidth: 12,
    materialKey: 'wood' as MaterialKey,
  } as const;

  if (level <= 0) return baseReturn;

  const materials: { key: MaterialKey; color: string; glow: string }[] = [
    { key: 'wood',     color: '#8B4513', glow: 'rgba(139,69,19,0.18)' },
    { key: 'stone',    color: '#696969', glow: 'rgba(105,105,105,0.16)' },
    { key: 'bronze',   color: '#CD7F32', glow: 'rgba(205,127,50,0.20)' },
    { key: 'iron',     color: '#708090', glow: 'rgba(112,128,144,0.18)' },
    { key: 'silver',   color: '#C0C0C0', glow: 'rgba(192,192,192,0.22)' },
    { key: 'gold',     color: '#FFD700', glow: 'rgba(255,215,0,0.22)' },
    { key: 'platinum', color: '#E5E4E2', glow: 'rgba(229,228,226,0.22)' },
    { key: 'emerald',  color: '#50C878', glow: 'rgba(80,200,120,0.22)' },
    { key: 'ruby',     color: '#E0115F', glow: 'rgba(224,17,95,0.22)' },
    { key: 'diamond',  color: '#B9F2FF', glow: 'rgba(185,242,255,0.24)' },
  ];

  const idx = Math.min(level - 1, materials.length - 1);
  const m = materials[idx];

  const gradients = {
    wood: 'conic-gradient(from 180deg at 50% 50%, #8B4513 0deg, #A0522D 60deg, #8B4513 120deg, #654321 180deg, #8B4513 240deg, #8B4513 360deg)',
    stone: 'conic-gradient(from 180deg at 50% 50%, #696969 0deg, #808080 60deg, #696969 120deg, #556B2F 180deg, #696969 240deg, #696969 360deg)',
    bronze: 'conic-gradient(from 180deg at 50% 50%, #CD7F32 0deg, #DAA520 60deg, #CD7F32 120deg, #B8860B 180deg, #CD7F32 240deg, #CD7F32 360deg)',
    iron: 'conic-gradient(from 180deg at 50% 50%, #708090 0deg, #778899 60deg, #708090 120deg, #2F4F4F 180deg, #708090 240deg, #708090 360deg)',
    silver: 'conic-gradient(from 180deg at 50% 50%, #C0C0C0 0deg, #E5E5E5 60deg, #C0C0C0 120deg, #A9A9A9 180deg, #C0C0C0 240deg, #C0C0C0 360deg)',
    gold: 'conic-gradient(from 180deg at 50% 50%, #FFD700 0deg, #FFA500 60deg, #FFD700 120deg, #FF8C00 180deg, #FFD700 240deg, #FFD700 360deg)',
    platinum: 'conic-gradient(from 180deg at 50% 50%, #E5E4E2 0deg, #F5F5F5 60deg, #E5E4E2 120deg, #C0C0C0 180deg, #E5E4E2 240deg, #E5E4E2 360deg)',
    emerald: 'conic-gradient(from 180deg at 50% 50%, #50C878 0deg, #00FF7F 60deg, #50C878 120deg, #228B22 180deg, #50C878 240deg, #50C878 360deg)',
    ruby: 'conic-gradient(from 180deg at 50% 50%, #E0115F 0deg, #FF1493 60deg, #E0115F 120deg, #B22222 180deg, #E0115F 240deg, #E0115F 360deg)',
    diamond: 'conic-gradient(from 180deg at 50% 50%, #B9F2FF 0deg, #FFFFFF 60deg, #B9F2FF 120deg, #87CEEB 180deg, #B9F2FF 240deg, #B9F2FF 360deg)'
  } as const;

  const levelIndicatorStyle: React.CSSProperties = { background: gradients[m.key] };

  // Brillo de fondo de alta calidad: usamos halo-layer con gradientes; el box-shadow solo de apoyo
  const strong = m.glow.replace(/,\s*0?\.?\d+\)/, ', 0.35)');
  const mid = m.glow.replace(/,\s*0?\.?\d+\)/, ', 0.18)');
  const cardGlowStyle: React.CSSProperties = {
    boxShadow: `0 0 4px ${m.glow}, 0 0 10px ${mid}`,
    ['--glow-color' as any]: m.glow,
    ['--halo-strong' as any]: strong,
    ['--halo-mid' as any]: mid,
  };

  const showSheen = false;

  return { levelIndicatorStyle, levelIndicatorAnimationClass: 'animate-level-number', cardGlowStyle, cardGlowClass: 'animate-card-glow-subtle', showSheen, ringColor: m.color, ringWidth: 12, materialKey: m.key as MaterialKey } as const;
};

const AchievementCircle: React.FC<{ level: number; levelIndicatorStyle: React.CSSProperties; levelIndicatorAnimationClass: string; cardGlowStyle: React.CSSProperties; cardGlowClass: string; showSheen: boolean; ringColor: string; ringWidth: number; icon: string; materialKey: MaterialKey; overlayClass: string; ringAnimClass: string; iconAnimClass: string; numberClass: string; overlayStyle?: React.CSSProperties; }> = ({ level, levelIndicatorStyle, levelIndicatorAnimationClass, cardGlowStyle, cardGlowClass, showSheen, ringColor, ringWidth, icon, materialKey, overlayClass, ringAnimClass, iconAnimClass, numberClass, overlayStyle }) => {
  return (
    <div 
      className={`relative rounded-full flex items-center justify-center bg-slate-900/60 backdrop-blur-sm shadow-[inset_0_4px_8px_rgba(0,0,0,0.35)] border border-slate-700/50 transition-all duration-300 ${cardGlowClass} w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 shrink-0`}
      style={{ ...cardGlowStyle, transform: 'translateZ(0)', willChange: 'transform' as any }}
      data-material={materialKey}
    >
      {/* Halo de alta calidad fuera del círculo */}
      <div className="halo-layer" />
      {/* Anillo nítido */}
      <div className={`absolute inset-0 rounded-full pointer-events-none ${ringAnimClass}`} style={{ border: `${ringWidth}px solid ${ringColor}` }} />
      {showSheen && <div className="achievement-sheen spin-slow"></div>}
      <div className={`anim-overlay ${overlayClass}`} style={overlayStyle}></div>
      {(() => {
        const ImgIcon = (iconMap as any)[icon];
        const isSpecial = icon === 'llama' || icon === 'graduation_hat' || icon === 'archery' || icon === 'money_bag';
        const imgSizeClass = isSpecial ? 'w-[104px] h-[104px]' : 'w-14 h-14';
        return (
          <span className={`icon-elevated ${iconAnimClass}`} style={{ fontSize: '3.4rem' }}>
            {ImgIcon ? <ImgIcon className={imgSizeClass} /> : icon}
          </span>
        );
      })()}
      {level > 0 && (
        <div 
          className={`absolute -bottom-3 -right-3 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-xl sm:text-2xl border-6 shadow-lg ${levelIndicatorAnimationClass} ${numberClass} level-badge`}
          style={{ ...levelIndicatorStyle, transform: 'translateZ(0)' }}
        >
          <span className="level-badge-halo" aria-hidden="true"></span>
          <span className="level-number-text">{level}</span>
          <span className="level-number-sheen-overlay" aria-hidden="true"></span>
        </div>
      )}
      {/* Cara interna con texturas del material */}
      <div className="mat-layer" style={{ inset: ringWidth }} />
    </div>
  );
};

const AchievementCard: React.FC<{ achievement: Achievement; userData: UserData; onClaimReward: (achievementId: string, level: number, startElement: HTMLElement) => void; onAction: (action: Achievement['action']) => void; isAnimating: boolean; }> = memo(({ achievement, userData, onClaimReward, onAction, isAnimating }) => {
    const unlockedLevel = userData.unlockedAchievements[achievement.id] || 0;
    const unclaimedRewards = userData.unclaimedAchievementRewards.filter(r => r.startsWith(achievement.id)).map(r => parseInt(r.split(':')[1], 10));
    const hasUnclaimedRewards = unclaimedRewards.length > 0;
    const displayLevel = unlockedLevel; // mostrar nivel reclamado; el siguiente nivel es el reclamable
    const isFirstUnlock = unlockedLevel === 0 && unclaimedRewards.includes(1);

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

    const { levelIndicatorStyle, levelIndicatorAnimationClass, cardGlowStyle, cardGlowClass, showSheen, ringColor, ringWidth, materialKey } = getLevelBasedStyles(displayLevel);
    const anim = getAchievementAnimation(achievement.id, materialKey, Math.max(1, Math.min(displayLevel || 1, 10)));

    const handleClaimClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (hasUnclaimedRewards) {
            const levelToClaim = Math.min(...unclaimedRewards);
            const tier = achievement.tiers.find(t => t.level === levelToClaim);
            onClaimReward(achievement.id, levelToClaim, e.currentTarget);
            // Animación local
            const card = (e.currentTarget.closest('.group') as HTMLElement) || e.currentTarget as unknown as HTMLElement;
            card.classList.add('ach-claim-burst');
            setTimeout(() => card.classList.remove('ach-claim-burst'), 900);
            // Feedback flotante
            setClaimFeedback({ xp: tier?.reward?.xp, bones: tier?.reward?.bones, key: Date.now() });
            setTimeout(() => setClaimFeedback(null), 1200);
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
          level={displayLevel}
          levelIndicatorStyle={levelIndicatorStyle}
          levelIndicatorAnimationClass={levelIndicatorAnimationClass}
          cardGlowStyle={cardGlowStyle}
          cardGlowClass={cardGlowClass}
          showSheen={showSheen}
          ringColor={ringColor}
          ringWidth={ringWidth}
          icon={achievement.icon}
          materialKey={materialKey}
          overlayClass={anim.overlayClass}
          ringAnimClass={anim.ringClass}
          iconAnimClass={anim.iconClass}
          numberClass={anim.numberClass}
          overlayStyle={anim.styleVars}
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
    <div className="p-4 md:p-6 min-h-screen pb-40">
      <div className="flex items-start md:items-center gap-3 md:gap-4 mb-16 md:mb-28">
        <h2 className="font-graffiti font-black text-3xl sm:text-4xl md:text-5xl tracking-wide -rotate-1 title-white-clean block text-center transform scale-105 md:scale-110 flex-1 mx-auto">
          Logros
        </h2>
        <HelpIcon modalTitle="Cómo funcionan los Logros" ariaLabel="Cómo funcionan los Logros">
          <ul>
            <li>Cada logro tiene <strong>10 niveles</strong> desde Madera → Diamante.</li>
            <li>Al subir de nivel, aparecen <strong>recompensas pendientes</strong> para reclamar.</li>
            <li>El halo y el anillo reflejan el <strong>material</strong> de tu nivel actual.</li>
            <li>Apunta a un <strong>nivel diamante</strong> como objetivo máximo <StarFilled className="inline w-4 h-4"/>.</li>
          </ul>
        </HelpIcon>
      </div>
      {showHelp && (
        <div id="achievements-help" className="mb-12 md:mb-16 p-3 sm:p-4 bg-slate-800/50 border border-slate-700/60 rounded-lg text-slate-300 text-xs sm:text-sm leading-relaxed">
          Gana niveles de logro completando objetivos. Cada logro tiene 10 niveles (Madera → Diamante). Las animaciones y el halo reflejan el material y el tipo de logro. La barra indica tu progreso hacia el siguiente nivel.
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