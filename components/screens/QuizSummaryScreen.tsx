import React, { memo, useRef } from 'react';
import { Trophy, StarFilled, CheckCircle, BrainCircuit, XCircle } from '../icons';
import { QuizSummaryScreenProps, QuestionData } from '../../types';
import { questionBank } from '../../constants';

const QuizSummaryScreen: React.FC<QuizSummaryScreenProps> = ({ earnedXp, earnedBones, isPerfect, onContinue, wasChallenge, mistakes, questionIds, answers, onReviewMistakes }) => {
    
    const wasVictory = earnedXp > 0 || earnedBones > 0;
    let title = '¡Cuestionario Completado!';
    let bgColor = 'from-slate-800 to-slate-900';
    let textColor = 'text-slate-100';
    let subTextColor = 'text-slate-400';
    let xpTextColor = 'text-slate-100';
    let boneTextColor = 'text-amber-400';
    let icon: React.ReactNode = <CheckCircle className="w-32 h-32 text-green-500" />;

    if(wasChallenge) {
        if (isPerfect) {
            title = '¡Desafío Ganado!';
            bgColor = 'from-amber-500 to-orange-600';
            textColor = 'text-white';
            subTextColor = 'text-amber-100';
            xpTextColor = 'text-white';
            boneTextColor = 'text-white';
            icon = <Trophy className="w-32 h-32 text-white" />;
        } else {
            title = 'Desafío Fallido';
            bgColor = 'from-slate-700 to-slate-900';
            textColor = 'text-white';
            subTextColor = 'text-slate-300';
            icon = <XCircle className="w-32 h-32 text-red-500" />;
        }
    } else if (isPerfect) {
        title = '¡Estudio Perfecto!';
        bgColor = 'from-emerald-700/30 via-emerald-900/20 to-slate-900';
        icon = <StarFilled className="w-32 h-32 text-emerald-400" />;
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
    
            if (answer === null || answer === undefined) {
                return { question, isCorrect: false };
            }
    
            const isCorrect = isFillInTheBlank
                ? typeof answer === 'string' && answer.trim().toLowerCase() === question.opciones[question.indiceRespuestaCorrecta].trim().toLowerCase()
                : answer === question.indiceRespuestaCorrecta;
            
            return { question, isCorrect };
        }).filter(item => !item.isCorrect && item.question).map(item => item.question!);
        
        onReviewMistakes(mistakenQuestions);
    };

    // Celebración especial para Estudio Perfecto
    const PerfectCelebration = () => {
        const pieces = Array.from({ length: 28 });
        return (
            <>
                <style>{`
                @keyframes confetti-fall { 0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; } 10% {opacity:1;} 100% { transform: translateY(110vh) rotate(720deg); opacity: .95; } }
                .confetti-piece { position: absolute; top: -10vh; width: 10px; height: 16px; border-radius: 2px; opacity: .9; animation: confetti-fall linear forwards; mix-blend-mode: screen; }
                `}</style>
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {pieces.map((_, i) => {
                        const left = Math.random() * 100;
                        const delay = Math.random() * 0.8;
                        const duration = 3 + Math.random() * 2.5;
                        const colors = ['#34d399', '#10b981', '#60a5fa', '#22d3ee', '#fbbf24'];
                        const color = colors[i % colors.length];
                        return (
                            <span
                                key={i}
                                className="confetti-piece"
                                style={{ left: `${left}%`, animationDuration: `${duration}s`, animationDelay: `${delay}s`, background: color }}
                            />
                        );
                    })}
                </div>
                <div className="flex items-center justify-center gap-2 mb-3">
                    <StarFilled className="w-8 h-8 text-emerald-400 animate-pulse" />
                    <h2 className={`text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-200 to-emerald-300 title-glow-cyan`}>
                        ¡Estudio Perfecto!
                    </h2>
                    <StarFilled className="w-8 h-8 text-emerald-400 animate-pulse" />
                </div>
                <p className="text-emerald-200/90 font-semibold -mt-1">¡Has acertado todas las preguntas!</p>
            </>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in p-4" onClick={handleContinue}>
            <div 
                className={`relative p-6 text-center flex flex-col items-center justify-center rounded-2xl shadow-2xl max-w-lg w-full bg-gradient-to-br ${bgColor} animate-scale-in overflow-hidden`}
                onClick={(e) => e.stopPropagation()}
            >
                {isPerfect && !wasChallenge ? (
                    <PerfectCelebration />
                ) : (
                    <>
                        <div className="mb-4 animate-scale-in [filter:drop-shadow(0_10px_15px_rgba(0,0,0,0.2))]">
                            {icon}
                        </div>
                        <h2 className={`text-6xl font-black tracking-tighter mb-3 animate-slide-up ${textColor}`}>{title}</h2>
                    </>
                )}
                {wasChallenge && !isPerfect && (() => { const B = iconMap['bones']; return (
                    <p className="text-slate-300 text-lg mb-6">Perdiste tus 50 <B className="w-5 h-5 inline-block align-[-2px]" />. ¡Más suerte la próxima vez!</p>
                )})()}

                {wasVictory && (
                    <div className="flex justify-center items-center my-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
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
                )}

                <div className="w-full max-w-sm mt-8 space-y-3 animate-slide-up" style={{animationDelay: '0.4s'}}>
                    {mistakes > 0 && (
                        <button 
                            onClick={handleReview}
                            className="w-full font-bold py-3 px-4 rounded-xl text-lg shadow-md hover:shadow-lg transition-shadow active:scale-95 flex items-center justify-center gap-2 bg-slate-800/80 backdrop-blur-sm text-slate-300 border border-slate-600 touch-manipulation"
                        >
                            <BrainCircuit className="w-5 h-5"/> Repasar {mistakes} Errores
                        </button>
                    )}
                    <button 
                        onClick={handleContinue} 
                        className={`w-full font-extrabold py-5 px-4 rounded-2xl text-xl shadow-xl hover:shadow-2xl transition-shadow active:scale-95 touch-manipulation ${
                            isPerfect && !wasChallenge ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900' : (wasChallenge && isPerfect ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'bg-slate-200 text-black')
                        }`}
                    >
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(QuizSummaryScreen);