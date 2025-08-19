import React, { memo, useRef, useEffect } from 'react';
import { Heart, Shield, Settings, Gift, ArrowLeft, iconMap, Star } from './icons';
import { useAnimation } from './AnimationProvider';
import { StatusBarProps } from '../types';

const StatItem = memo(React.forwardRef<HTMLButtonElement, { 
    icon: React.ReactNode; 
    value: number | string; 
    title: string; 
    iconContainerClass?: string;
    onClick?: () => void;
}>(({ icon, value, title, iconContainerClass, onClick }, ref) => (
    <button 
        ref={ref}
        onClick={onClick}
        className="flex items-center flex-shrink-0 p-1 rounded-lg transition-colors duration-200 active:bg-slate-700/50 disabled:cursor-default disabled:active:bg-transparent touch-manipulation" 
        title={title}
        disabled={!onClick}
    >
        <div className={`icon-container h-8 w-8 flex items-center justify-center ${iconContainerClass || "[filter:drop-shadow(0_0_2px_rgba(255,255,255,0.7))]"}`}>
            {icon}
        </div>
        <span className="font-black text-lg text-slate-100 ml-1.5 tabular-nums min-w-[2ch] text-center">{value}</span>
    </button>
)));

const StatusBar: React.FC<StatusBarProps> = ({ 
    userData, 
    xpInCurrentLevel, 
    xpForNextLevel, 
    onOpenSettings, 
    onOpenRewardsModal, 
    onOpenInfoTooltip,
    levelUpAnimationKey, 
    pendingLevelRewards,
    onBack, 
    onNavigateToProfile, 
    showBackButton 
}) => {
    const { setTargetRef } = useAnimation();
    const { hearts, bones, streak, streakFreezeActive, level, avatar, perfectStreak = 0 } = userData;
    
    const xpPercentage = xpForNextLevel > 0 ? (xpInCurrentLevel / xpForNextLevel) * 100 : 100;
    
    const heartsRef = useRef<HTMLButtonElement>(null);
    const bonesRef = useRef<HTMLButtonElement>(null);
    const xpRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (heartsRef.current) {
            const iconEl = heartsRef.current.querySelector('.icon-container');
            if (iconEl) setTargetRef('heart', iconEl as HTMLElement);
        }
        if (bonesRef.current) {
            const iconEl = bonesRef.current.querySelector('.icon-container');
            if (iconEl) setTargetRef('bone', iconEl as HTMLElement);
        }
        if (xpRef.current) setTargetRef('xp', xpRef.current);
    }, [setTargetRef]);
    
    const radius = 38; // en un viewBox de 80
    const circumference = 2 * Math.PI * radius;
    const strokeWidth = 4;
    // Clamp del progreso para que nunca sobrepase el 100% y nunca sea negativo
    const xpRatio = ((): number => {
        if (!isFinite(xpPercentage)) return 0;
        const current = Math.max(0, xpInCurrentLevel);
        const needed = Math.max(1, xpForNextLevel); // evita división por 0
        const ratio = current / needed;
        return Math.max(0, Math.min(1, ratio));
    })();
    const xpOffset = circumference - xpRatio * circumference;
    const neededXp = xpForNextLevel > 0 ? Math.max(0, Math.ceil(xpForNextLevel - Math.max(0, xpInCurrentLevel))) : 0;

    return (
        <div className="w-full h-20 md:h-24 px-3 bg-black z-20">
            <div className="max-w-4xl mx-auto h-full flex justify-between items-center gap-2">
                {/* Left Side: Back Button or Profile */}
                <div className="flex-shrink-0 flex justify-start items-center gap-2">
                    {showBackButton ? (
                        <button onClick={onBack} title="Volver" className="p-2 rounded-full active:bg-slate-800 transition-colors active:scale-90 touch-manipulation">
                            <ArrowLeft className="w-7 h-7 text-slate-200" />
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={onNavigateToProfile}
                                title="Ir al Perfil"
                                className="relative group flex items-center gap-1 cursor-pointer transition-transform duration-200 active:scale-95 touch-manipulation"
                            >
                                <div ref={xpRef} className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0" title={`XP ${Math.max(0, Math.floor(xpInCurrentLevel))}/${Math.max(0, Math.floor(xpForNextLevel))}${xpForNextLevel > 0 ? ` · Faltan ${neededXp}` : ''}`}>
                                    <svg className="w-full h-full" viewBox="0 0 80 80">
                                        <defs>
                                            <filter id="whiteGlow" x="-50%" y="-50%" width="200%" height="200%">
                                                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#ffffff" floodOpacity="0.6" />
                                            </filter>
                                        </defs>
                                        {/* marcas alrededor */}
                                        <g className="text-slate-600/70">
                                            {Array.from({ length: 12 }).map((_, i) => (
                                                <line key={i} x1="40" y1="2" x2="40" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" transform={`rotate(${i * 30} 40 40)`} />
                                            ))}
                                        </g>
                                        {/* pista */}
                                        <circle
                                            className="text-slate-700/80"
                                            strokeWidth={strokeWidth}
                                            stroke="currentColor"
                                            fill="transparent"
                                            r={radius}
                                            cx="40"
                                            cy="40"
                                        />
                                        {/* progreso */}
                                        <circle
                                            strokeWidth={strokeWidth}
                                            strokeDasharray={circumference}
                                            strokeDashoffset={xpOffset}
                                            strokeLinecap="round"
                                            stroke="#ffffff"
                                            fill="transparent"
                                            r={radius}
                                            cx="40"
                                            cy="40"
                                            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-out' }}
                                            filter="url(#whiteGlow)"
                                            opacity={0.85}
                                        />
                                    </svg>
                                    <div className="absolute inset-1">
                                        <div className="w-full h-full bg-black/90 group-hover:bg-black/80 transition-colors duration-150 rounded-full flex items-center justify-center shadow-inner overflow-hidden border border-white/20">
                                            {typeof avatar === 'string' && /(png|webp|jpg|jpeg|svg)$/i.test(avatar) ? (
                                                <img src={avatar} alt="Avatar" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                                            ) : (
                                                <span className="text-5xl md:text-6xl transition-transform duration-300 group-active:scale-110">{avatar}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    key={levelUpAnimationKey}
                                    className="absolute -bottom-1 -left-1 flex items-center justify-center animate-level-up-pop w-8 h-8 rounded-full bg-black/85 ring-2 ring-white/70 shadow-[0_0_14px_rgba(255,255,255,0.45)]"
                                >
                                    <span className="text-white font-black text-sm drop-shadow-md">{level}</span>
                                </div>
                            </button>
                            <button 
                                onClick={onOpenRewardsModal} 
                                title="Ver Recompensas de Nivel" 
                                className="relative flex-shrink-0 p-2 rounded-full active:bg-slate-700/50 transition-colors active:scale-95 touch-manipulation"
                            >
                                <Gift className="w-7 h-7 text-white" />
                                {pendingLevelRewards && (
                                    <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-slate-950 animate-notification-pulse"></span>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Side: Stats */}
                <div className="flex items-center flex-wrap md:flex-nowrap gap-x-0 sm:gap-x-1">
                    <StatItem 
                        icon={(() => { const S = Star; return <S className="w-full h-full text-white" /> })()} 
                        value={perfectStreak} 
                        title={`Racha Perfecta: ${perfectStreak}`}
                        iconContainerClass={"h-10 w-10"}
                    />
                    <StatItem 
                        icon={streakFreezeActive ? <Shield className="w-full h-full text-cyan-400" /> : (() => { const L = iconMap['llama']; return <L className="w-full h-full" /> })()} 
                        value={streak} 
                        title={`Racha de ${streak} días`}
                        iconContainerClass={!streakFreezeActive ? "h-10 w-10" : ""}
                        onClick={() => onOpenInfoTooltip('streak')}
                    />
                    <StatItem 
                        ref={bonesRef}
                        icon={(() => { const B = iconMap['bones']; return <B className="w-8 h-8" /> })()} 
                        value={bones} 
                        title={`${bones} Huesitos`}
                        onClick={() => onOpenInfoTooltip('bones')}
                    />
                    <StatItem 
                        ref={heartsRef}
                        icon={(() => { const HImg = iconMap['heart_img']; return <HImg className="w-full h-full" /> })()} 
                        value={hearts < 0 ? 0 : hearts} 
                        title={`${hearts} Vidas`}
                        iconContainerClass={"h-10 w-10"}
                        onClick={() => onOpenInfoTooltip('hearts')}
                    />
                    
                    <button onClick={onOpenSettings} title="Ajustes" className="ml-2 flex-shrink-0 transition-transform active:scale-95 p-2 rounded-full active:bg-slate-800 touch-manipulation">
                        <Settings className="w-6 h-6 text-slate-400 active:text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(StatusBar);