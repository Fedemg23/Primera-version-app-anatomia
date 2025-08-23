import React, { memo, useRef, useEffect, useState } from 'react';
import { Trophy, StarFilled, CheckCircle, XCircle, iconMap } from '../icons';
import { QuizSummaryScreenProps, QuestionData } from '../../types';
import { useAudio } from '../../src/contexts/AudioProvider';
import { questionBank } from '../../constants';

const QuizSummaryScreen: React.FC<QuizSummaryScreenProps> = ({ earnedXp, earnedBones, isPerfect, onContinue, wasChallenge, mistakes, questionIds, answers, onReviewMistakes, leveledUpItems, onViewLeveledUp }) => {
	const { playSound } = useAudio();

	useEffect(() => {
		/* if (isPerfect || (wasChallenge && mistakes === 0)) {
			playSound('level-up.wav');
		} */
	}, [isPerfect, wasChallenge, mistakes, playSound]);

	const Bones = iconMap['bones'];
	const wasVictory = earnedXp > 0 || earnedBones > 0;
	// Determinar tipo de resultado
	const totalQuestions = mistakes + (questionIds?.length ? questionIds.length - mistakes : 0);
	const correctAnswers = totalQuestions - mistakes;
	const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

	let title = '¡Cuestionario Completado!';
	let subtitle = '';
	let bgColor = 'from-slate-950 via-slate-950 to-slate-950';
	let textColor = 'text-slate-100';
	let subTextColor = 'text-slate-400';
	let xpTextColor = 'text-slate-100';
	let boneTextColor = 'text-amber-400';
	let icon: React.ReactNode = <CheckCircle className="w-28 h-28 text-emerald-400" />;

	if(wasChallenge) {
		if (isPerfect) {
			title = '¡Desafío Ganado!';
			subtitle = 'Has respondido todas las preguntas correctamente.';
			bgColor = 'from-slate-950 via-slate-950 to-slate-950';
			textColor = 'text-white';
			subTextColor = 'text-slate-300';
			xpTextColor = 'text-white';
			boneTextColor = 'text-white';
			icon = <Trophy className="w-28 h-28 text-amber-400" />;
		} else {
			title = 'Desafío Fallido';
			subtitle = 'No has conseguido un resultado perfecto.';
			bgColor = 'from-slate-950 via-slate-950 to-slate-950';
			textColor = 'text-white';
			subTextColor = 'text-slate-300';
			icon = <XCircle className="w-28 h-28 text-red-500" />;
		}
	} else if (isPerfect) {
		title = '¡Estudio Perfecto!';
		subtitle = 'Has acertado todas las preguntas.';
		bgColor = 'from-slate-950 via-slate-950 to-slate-950';
		icon = <StarFilled className="w-28 h-28 text-emerald-400" />;
	} else {
		// Caso no perfecto - determinar mensaje según el porcentaje
		if (scorePercentage >= 80) {
			title = '¡Buen Trabajo!';
			subtitle = `Has acertado ${correctAnswers} de ${totalQuestions} preguntas (${scorePercentage}%).`;
			icon = <CheckCircle className="w-28 h-28 text-blue-400" />;
		} else if (scorePercentage >= 60) {
			title = 'Puedes Mejorar';
			subtitle = `Has acertado ${correctAnswers} de ${totalQuestions} preguntas (${scorePercentage}%).`;
			icon = <CheckCircle className="w-28 h-28 text-yellow-400" />;
		} else {
			title = 'Sigue Practicando';
			subtitle = `Has acertado ${correctAnswers} de ${totalQuestions} preguntas (${scorePercentage}%).`;
			icon = <XCircle className="w-28 h-28 text-orange-400" />;
		}
	}

	const xpRef = useRef<HTMLDivElement>(null);
	const bonesRef = useRef<HTMLDivElement>(null);

	const handleContinue = () => {
		const rewardPositions = {
			xp: xpRef.current?.getBoundingClientRect() || null,
			bones: bonesRef.current?.getBoundingClientRect() || null,
		};
		onContinue(rewardPositions);
	};



	const useCountUp = (end: number, durationMs = 900) => {
		const [value, setValue] = useState(0);
		useEffect(() => {
			let raf: number;
			const start = performance.now();
			const tick = (now: number) => {
				const progress = Math.min(1, (now - start) / durationMs);
				setValue(Math.round(end * progress));
				if (progress < 1) raf = requestAnimationFrame(tick);
			};
			setValue(0);
			raf = requestAnimationFrame(tick);
			return () => cancelAnimationFrame(raf);
		}, [end, durationMs]);
		return value;
	};

	// Mostrar siempre XP y bones ganados, incluso si no es perfecto
	const targetXp = earnedXp;
	const targetBones = earnedBones;
	const xpDisplay = useCountUp(targetXp);
	const bonesDisplay = useCountUp(targetBones);

	const renderAchievementIcon = (ico: any): React.ReactNode => {
		if (typeof ico === 'string') {
			const Cmp: any = (iconMap as any)[ico];
			if (Cmp) return <Cmp className="w-7 h-7" />;
			return <span className="text-2xl leading-none">{ico}</span>;
		}
		// Si ya viene como ReactNode
		return ico as React.ReactNode;
	};

	const PerfectCelebration = () => (
		<>
			<div className="flex items-center justify-center gap-2 mb-2">
				<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-emerald-900 bg-emerald-300 text-sm font-bold shadow-sm">
					<StarFilled className="w-4 h-4" /> Perfecto
				</span>
			</div>
			<div className="flex items-center justify-center gap-2 mb-2">
				<StarFilled className="w-8 h-8 text-emerald-400" />
				<h2 className={`text-6xl font-black tracking-tighter text-slate-100`}>
					¡Estudio Perfecto!
				</h2>
				<StarFilled className="w-8 h-8 text-emerald-400" />
			</div>
			<p className="text-emerald-200 font-semibold -mt-1">¡Has acertado todas las preguntas!</p>
		</>
	);

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center animate-fade-in bg-black">
			<div className={`relative w-full h-full max-w-none p-6 md:p-10 text-center flex flex-col items-center justify-center bg-black`}>
				{isPerfect && !wasChallenge ? (
					<PerfectCelebration />
				) : (
					<>
						<div className="mb-4 [filter:drop-shadow(0_10px_15px_rgba(0,0,0,0.2))]">{icon}</div>
						<h2 className={`text-5xl md:text-6xl font-black tracking-tighter mb-3 ${textColor}`}>{title}</h2>
						{subtitle && <p className={`${subTextColor} text-lg mb-4`}>{subtitle}</p>}
					</>
				)}
				{wasChallenge && !isPerfect && (
					<p className="text-slate-300 text-lg mb-6">Perdiste tus 50 <Bones className="w-5 h-5 inline-block align-[-2px]" />. ¡Más suerte la próxima vez!</p>
				)}

				{(earnedXp > 0 || earnedBones > 0) && (
					<div className="w-full max-w-xl my-6">
						<div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
							<div className="grid grid-cols-2 gap-4">
								{earnedXp > 0 && (
									<div ref={xpRef} className="relative rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-400/10 border border-emerald-500/25 p-4 text-left">
										<div className="flex items-center gap-2">
											<span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-400/15 text-emerald-200">
												<StarFilled className="w-5 h-5" />
											</span>
											<div>
												<p className={`text-3xl font-extrabold leading-none ${xpTextColor}`}>+{xpDisplay}</p>
												<p className={`${subTextColor} text-sm font-semibold`}>XP Ganados</p>
											</div>
										</div>
									</div>
								)}
								{earnedBones > 0 && (
									<div ref={bonesRef} className="relative rounded-xl bg-gradient-to-br from-amber-300/10 to-amber-200/5 border border-amber-400/25 p-4 text-left">
										<div className="flex items-center gap-2">
											<span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-amber-300/15 text-amber-200">
												<Bones className="w-5 h-5" />
											</span>
											<div>
												<p className={`text-3xl font-extrabold leading-none ${boneTextColor}`}>+{bonesDisplay}</p>
												<p className={`${subTextColor} text-sm font-semibold`}>Huesitos</p>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				)}

				{/* Sección de subidas de nivel */}
				{leveledUpItems && leveledUpItems.filter(item => item.type === 'user_level').length > 0 && (
					<div className="w-full max-w-xl my-4">
						<div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
							<h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
								<span className="text-2xl">🌟</span>
								¡Subiste de Nivel!
							</h3>
							<div className="space-y-2">
								{leveledUpItems.filter(item => item.type === 'user_level').map((item, index) => (
									<div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50">
										<div className="w-8 h-8 rounded-full bg-blue-400/20 flex items-center justify-center text-blue-400">
											<span className="text-lg">🌟</span>
										</div>
										<div className="flex-1">
											<p className="text-white text-sm font-semibold">Nivel {item.newLevel}</p>
											<p className="text-slate-400 text-xs">¡Felicidades por tu progreso!</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				)}

				{/* Sección de logros desbloqueados */}
				{leveledUpItems && leveledUpItems.filter(item => item.type === 'achievement').length > 0 && (
					<div className="w-full max-w-xl my-4">
						<div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
							<h3 className="text-white text-lg font-bold mb-3">
								¡Logros Desbloqueados!
							</h3>
							<div className="space-y-2">
								{leveledUpItems.filter(item => item.type === 'achievement').slice(0, 3).map((item, index) => (
									<div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50">
										<div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400">
											{renderAchievementIcon(item.icon)}
										</div>
										<div className="flex-1">
											<p className="text-white text-sm font-semibold">{item.name}</p>
											<p className="text-slate-400 text-xs">Nivel {item.newLevel}</p>
										</div>
									</div>
								))}
								{leveledUpItems.filter(item => item.type === 'achievement').length > 3 && (
									<p className="text-slate-400 text-xs text-center">
										+{leveledUpItems.filter(item => item.type === 'achievement').length - 3} logros más
									</p>
								)}
							</div>
							{leveledUpItems.filter(item => item.type === 'achievement').length > 0 && (
								<button 
									onClick={onViewLeveledUp}
									className="w-full mt-3 bg-amber-500/20 text-amber-400 border border-amber-400/30 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-amber-500/30 transition-colors"
								>
									Ver Todos los Logros
								</button>
							)}
						</div>
					</div>
				)}





				<div className="w-full max-w-sm mt-8">
					<button onClick={handleContinue} className={`w-full font-extrabold py-5 px-4 rounded-2xl text-xl shadow-xl hover:shadow-2xl active:scale-95 ${isPerfect && !wasChallenge ? 'bg-emerald-500 text-slate-900' : (wasChallenge && isPerfect ? 'bg-amber-500 text-white' : 'bg-slate-200 text-black')}`}>
						Continuar
					</button>
				</div>
			</div>
		</div>
	);
};

export default memo(QuizSummaryScreen);