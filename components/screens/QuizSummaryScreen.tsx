import React, { memo, useRef, useEffect, useState } from 'react';
import { Trophy, StarFilled, CheckCircle, BrainCircuit, XCircle, iconMap } from '../icons';
import { QuizSummaryScreenProps, QuestionData } from '../../types';
import { questionBank } from '../../constants';

const QuizSummaryScreen: React.FC<QuizSummaryScreenProps> = ({ earnedXp, earnedBones, isPerfect, onContinue, wasChallenge, mistakes, questionIds, answers, onReviewMistakes, leveledUpItems, onViewLeveledUp }) => {
	const Bones = iconMap['bones'];
	const wasVictory = earnedXp > 0 || earnedBones > 0;
	let title = '¡Cuestionario Completado!';
	let bgColor = 'from-slate-950 via-slate-950 to-slate-950';
	let textColor = 'text-slate-100';
	let subTextColor = 'text-slate-400';
	let xpTextColor = 'text-slate-100';
	let boneTextColor = 'text-amber-400';
	let icon: React.ReactNode = <CheckCircle className="w-28 h-28 text-emerald-400" />;

	if(wasChallenge) {
		if (isPerfect) {
			title = '¡Desafío Ganado!';
			bgColor = 'from-slate-950 via-slate-950 to-slate-950';
			textColor = 'text-white';
			subTextColor = 'text-slate-300';
			xpTextColor = 'text-white';
			boneTextColor = 'text-white';
			icon = <Trophy className="w-28 h-28 text-amber-400" />;
		} else {
			title = 'Desafío Fallido';
			bgColor = 'from-slate-950 via-slate-950 to-slate-950';
			textColor = 'text-white';
			subTextColor = 'text-slate-300';
			icon = <XCircle className="w-28 h-28 text-red-500" />;
		}
	} else if (isPerfect) {
		title = '¡Estudio Perfecto!';
		bgColor = 'from-slate-950 via-slate-950 to-slate-950';
		icon = <StarFilled className="w-28 h-28 text-emerald-400" />;
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

	const handleReview = () => {
		const mistakenQuestions = questionIds.map((id, index) => {
			const question = questionBank.find(q => q.id === id);
			if (!question) return { question: null, isCorrect: false };
			const isFillInTheBlank = question.textoPregunta.includes('____');
			const answer = answers[index];
			if (answer === null || answer === undefined) return { question, isCorrect: false };
			const isCorrect = isFillInTheBlank
				? typeof answer === 'string' && answer.trim().toLowerCase() === question.opciones[question.indiceRespuestaCorrecta].trim().toLowerCase()
				: answer === question.indiceRespuestaCorrecta;
			return { question, isCorrect };
		}).filter(item => !item.isCorrect && item.question).map(item => item.question!);
		onReviewMistakes(mistakenQuestions);
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

	const targetXp = isPerfect && !wasChallenge ? earnedXp : 0;
	const targetBones = isPerfect && !wasChallenge ? earnedBones : 0;
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
					</>
				)}
				{wasChallenge && !isPerfect && (
					<p className="text-slate-300 text-lg mb-6">Perdiste tus 50 <Bones className="w-5 h-5 inline-block align-[-2px]" />. ¡Más suerte la próxima vez!</p>
				)}

				{wasVictory && (
					isPerfect && !wasChallenge ? (
						<div className="w-full max-w-xl my-6">
							<div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
								<div className="grid grid-cols-2 gap-4">
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
								</div>
							</div>
						</div>
					) : (
						<div className="flex justify-center items-center my-8">
							{(earnedXp > 0 && earnedBones > 0) ? (
								<div className="flex flex-row items-start gap-x-16">
									<div ref={xpRef} className="text-center">
										<p className={`text-6xl font-black ${xpTextColor}`}>+{earnedXp}</p>
										<p className={`${subTextColor} font-semibold text-xl`}>XP Ganados</p>
									</div>
									<div ref={bonesRef} className="text-center">
										<p className={`text-6xl font-black flex items-center justify-center ${boneTextColor}`}>
											+{earnedBones} <Bones className="text-[2.5rem] w-10 h-10 ml-2 inline-block align-[-6px]" />
										</p>
										<p className={`${subTextColor} font-semibold text-xl`}>Huesitos</p>
									</div>
								</div>
							) : earnedXp > 0 ? (
								<div ref={xpRef} className="text-center">
									<p className={`text-6xl font-black ${xpTextColor}`}>+{earnedXp}</p>
									<p className={`${subTextColor} font-semibold text-xl`}>XP Ganados</p>
								</div>
							) : earnedBones > 0 ? (
								<div ref={bonesRef} className="text-center">
									<p className={`text-6xl font-black flex items-center justify-center ${boneTextColor}`}>
										+{earnedBones} <Bones className="text-[2.5rem] w-10 h-10 ml-2 inline-block align-[-6px]" />
									</p>
									<p className={`${subTextColor} font-semibold text-xl`}>Huesitos</p>
								</div>
							) : null}
						</div>
					)
				)}

				{Array.isArray(leveledUpItems) && leveledUpItems.length > 0 && (
					<div className="w-full max-w-xl mt-4 mb-2">
						<div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
							<div className="flex items-center justify-between mb-2">
								<h3 className="text-lg font-extrabold text-slate-100">Nuevos niveles alcanzados</h3>
								{onViewLeveledUp && (
									<button onClick={onViewLeveledUp} className="px-3 py-1.5 rounded-lg text-sm font-bold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700">Ir a Logros</button>
								)}
							</div>
							<ul className="space-y-2 text-left max-h-48 overflow-y-auto pr-2">
								{leveledUpItems.map((it, idx) => (
									<li key={idx} className="flex items-center justify-between rounded-xl border border-slate-700 px-3 py-2 bg-slate-800">
										<div className="flex items-center gap-3 min-w-0">
											<div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-xl select-none">{renderAchievementIcon(it.icon)}</div>
											<div className="min-w-0">
												<p className="font-bold text-slate-200 truncate">{it.name}</p>
												<p className="text-xs text-slate-400">Nivel {it.newLevel}</p>
											</div>
										</div>
										<span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">Nuevo</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				)}

				<div className="w-full max-w-sm mt-8 space-y-3">
					{mistakes > 0 && (
						<button onClick={handleReview} className="w-full font-bold py-3 px-4 rounded-xl text-lg shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 bg-slate-800 text-slate-300 border border-slate-700"> 
							<BrainCircuit className="w-5 h-5"/> Repasar {mistakes} Errores
						</button>
					)}
					<button onClick={handleContinue} className={`w-full font-extrabold py-5 px-4 rounded-2xl text-xl shadow-xl hover:shadow-2xl active:scale-95 ${isPerfect && !wasChallenge ? 'bg-emerald-500 text-slate-900' : (wasChallenge && isPerfect ? 'bg-amber-500 text-white' : 'bg-slate-200 text-black')}`}>
						Continuar
					</button>
				</div>
			</div>
		</div>
	);
};

export default memo(QuizSummaryScreen);