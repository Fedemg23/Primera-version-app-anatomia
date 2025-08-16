import React, { memo, useRef, useEffect } from 'react';
import { Heart, Shield, Settings, Gift, ArrowLeft, iconMap } from './icons';
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
		<span className="font-black text-lg text-slate-100 ml-1.5">{value}</span>
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
	const { hearts, bones, streak, streakFreezeActive, level, avatar } = userData;
	
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
	
	const radius = 28;
	const circumference = 2 * Math.PI * radius;
	const strokeWidth = 6;
	const xpOffset = circumference - (xpPercentage / 100) * circumference;

	return (
		<div className="w-full py-2 px-3 bg-black/70 backdrop-blur-sm z-20">
			<div className="max-w-4xl mx-auto flex justify-between items-center gap-2">
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
								<div ref={xpRef} className="relative w-16 h-16 flex-shrink-0">
									<svg className="w-full h-full" viewBox="0 0 68 68">
										<circle
											className="text-slate-700/80"
											strokeWidth={strokeWidth}
											stroke="currentColor"
											fill="transparent"
											r={radius}
											cx="34"
											cy="34"
										/>
										<circle
											className="text-blue-500"
											strokeWidth={strokeWidth}
											strokeDasharray={circumference}
											strokeDashoffset={xpOffset}
											strokeLinecap="round"
											stroke="currentColor"
											fill="transparent"
											r={radius}
											cx="34"
											cy="34"
											style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-out', filter: 'drop-shadow(0 0 4px #3b82f6)' }}
										/>
									</svg>
									<div className="absolute inset-0 p-1.5">
										<div className="w-full h-full bg-slate-800/80 group-hover:bg-slate-700/80 transition-colors duration-200 rounded-full flex items-center justify-center shadow-inner overflow-hidden">
											{typeof avatar === 'string' && /(png|webp|jpg|jpeg|svg)$/i.test(avatar) ? (
												<img src={avatar} alt="Avatar" className="w-10 h-10 object-contain" />
											) : (
												<span className="text-4xl transition-transform duration-300 group-active:scale-110">{avatar}</span>
											)}
										</div>
									</div>
								</div>
								<div
									key={levelUpAnimationKey}
									className="absolute -bottom-1 -left-1 flex items-center justify-center animate-level-up-pop w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-sky-400 to-cyan-400 border-2 border-slate-950"
								>
									<span className="text-white font-black text-sm drop-shadow-md">{level}</span>
								</div>
							</button>
							<button 
								onClick={onOpenRewardsModal} 
								title="Ver Recompensas de Nivel" 
								className="relative flex-shrink-0 p-2 rounded-full active:bg-slate-700/50 transition-colors active:scale-95 touch-manipulation"
							>
								<Gift className="w-7 h-7 text-amber-400 [filter:drop-shadow(0_0_5px_#f59e0b)]" />
								{pendingLevelRewards && (
									<span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-slate-950 animate-notification-pulse"></span>
								)}
							</button>
						</div>
					)}
				</div>

				{/* Right Side: Stats */}
				<div className="flex items-center flex-nowrap gap-x-0 sm:gap-x-1">
					<StatItem 
						icon={streakFreezeActive ? <Shield className="w-full h-full text-cyan-400" /> : (() => { const L = iconMap['llama']; return <L className="w-full h-full" /> })()} 
						value={streak} 
						title={`Racha de ${streak} días`}
						iconContainerClass={!streakFreezeActive ? "h-10 w-10 [filter:drop-shadow(0_0_5px_rgba(249,115,22,0.8))]" : "[filter:drop-shadow(0_0_5px_#22d3ee)]"}
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
						icon={<Heart className="w-full h-full" />} 
						value={hearts < 0 ? 0 : hearts} 
						title={`${hearts} Vidas`}
						iconContainerClass={"[filter:drop-shadow(0_0_5px_#ef4444)]"}
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