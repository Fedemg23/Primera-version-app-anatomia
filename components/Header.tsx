import React, { memo, useRef, useEffect } from 'react';
import { Heart, Shield, Settings, Gift, ArrowLeft, iconMap, Star } from './icons';
import { useAnimation } from './AnimationProvider';
import { StatusBarProps } from '../types';
import { OptimizedLogo } from '../src/utils/optimizedIcons';
import ProfileDisplay from './ProfileDisplay';
import ExperienceDisplay from './ExperienceDisplay';

const StatItem = memo(React.forwardRef<HTMLButtonElement, { 
    icon: React.ReactNode; 
    value: number | string; 
    title: string; 
    iconContainerClass?: string;
    onClick?: () => void;
    textClass?: string;
}>(({ icon, value, title, iconContainerClass, onClick, textClass }, ref) => (
    <button 
        ref={ref}
        onClick={onClick}
        className="flex items-center flex-shrink-0 p-1 rounded-lg transition-colors duration-200 active:bg-slate-700/50 disabled:cursor-default disabled:active:bg-transparent touch-manipulation" 
        title={title}
        disabled={!onClick}
    >
        <div className={`icon-container h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 flex items-center justify-center ${iconContainerClass || "[filter:drop-shadow(0_0_2px_rgba(255,255,255,0.7))]"}`}>
            {icon}
        </div>
        <span className={`font-black text-white ml-1 sm:ml-1.5 tabular-nums min-w-[2ch] text-center ${textClass || 'text-lg sm:text-xl md:text-2xl'}`}>{value}</span>
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
    showBackButton, 
    onNavigate,
    friendRequestsCount 
}) => {
    const { setTargetRef } = useAnimation();
    const { hearts, bones, streak, streakFreezeActive, level, avatar, perfectStreak = 0 } = userData;
    
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
    

    return (
        <div className="w-full z-10">
            <div className={`w-full bg-transparent ${showBackButton ? 'h-14 md:h-16' : 'h-24 md:h-28'}`}>
                <div className="max-w-7xl mx-auto h-full grid grid-cols-3 items-start gap-1 sm:gap-4 md:gap-8 py-2 px-3">
                    {/* Left Side: Back Button (solo cuando no es home) */}
                    <div className="flex-shrink-0 flex justify-start items-center gap-2 sm:gap-3 md:gap-4 ml-2">
                        {showBackButton && (
                            <button onClick={onBack} title="Volver" className="p-2 rounded-full active:bg-slate-800 transition-colors active:scale-90 touch-manipulation">
                                <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7 text-slate-200" />
                            </button>
                        )}
                    </div>

                    {/* Center Title */}
                    <div className="text-center flex items-center justify-center z-0 pointer-events-none" style={{ marginTop: showBackButton ? '0' : '-7.5rem' }}>
                        {!showBackButton && (
                            <OptimizedLogo 
                                className="h-80 md:h-96 object-contain pointer-events-none"
                            />
                        )}
                    </div>

                    {/* Right Side: Stats */}
                    <div className={`flex justify-end items-center flex-wrap md:flex-nowrap gap-x-0 sm:gap-x-1 md:gap-x-3 ${showBackButton ? 'mt-0' : 'mt-8'}`}>
                        <StatItem 
                            icon={streakFreezeActive ? <Shield className="w-full h-full text-cyan-400" /> : (() => { const L = iconMap['llama']; return <L className="w-full h-full" /> })()} 
                            value={streak} 
                            title={`Racha de ${streak} días`}
                            iconContainerClass={!streakFreezeActive ? "h-8 w-8 sm:h-10 sm:w-10" : ""}
                            onClick={() => onOpenInfoTooltip('streak')}
                            textClass="text-lg sm:text-xl md:text-2xl"
                        />
                        <StatItem 
                            ref={bonesRef}
                            icon={(() => { const B = iconMap['bones']; return <B className="w-7 h-7 sm:w-8 sm:h-8" /> })()} 
                            value={bones} 
                            title={`${bones} Huesitos`}
                            onClick={() => onOpenInfoTooltip('bones')}
                        />
                        <StatItem 
                            ref={heartsRef}
                            icon={(() => { const HImg = iconMap['heart_img']; return <HImg className="w-full h-full" /> })()} 
                            value={hearts < 0 ? 0 : hearts} 
                            title={`${hearts} Vidas`}
                            iconContainerClass={"h-8 w-8 sm:h-10 sm:w-10"}
                            onClick={() => onOpenInfoTooltip('hearts')}
                            textClass="text-lg sm:text-xl md:text-2xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(StatusBar);