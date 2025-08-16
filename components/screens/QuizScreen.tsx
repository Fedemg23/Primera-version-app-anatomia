

import React, { useState, useEffect, useRef, memo } from 'react';
import { QuizScreenProps, QuestionData, LifelineData } from '../../types';
import { CheckCircle, XCircle, iconMap } from '../icons';
import { bibliographyData } from '../../constants';

const Timer: React.FC<{ timeLimit: number; onTimeUp: () => void }> = memo(({ timeLimit, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const radius = 20;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }
        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, onTimeUp]);

    const progress = (timeLeft / timeLimit) * circumference;
    const percentageLeft = (timeLeft / timeLimit) * 100;

    let strokeColor = 'stroke-green-500';
    if (percentageLeft < 50) strokeColor = 'stroke-yellow-500';
    if (percentageLeft < 25) strokeColor = 'stroke-red-500';

    return (
        <div className="absolute top-4 left-4 w-12 h-12">
            <svg className="w-full h-full" viewBox="0 0 44 44">
                <circle
                    className="stroke-gray-600"
                    strokeWidth="4"
                    fill="transparent"
                    r={radius}
                    cx="22"
                    cy="22"
                />
                <circle
                    className={`transition-all duration-1000 ease-linear ${strokeColor}`}
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx="22"
                    cy="22"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-200">
                {timeLeft}
            </div>
        </div>
    );
});

const LifelineButton: React.FC<{
  icon: React.ReactNode;
  count: number;
  onClick: () => void;
  disabled: boolean;
  name: string;
}> = memo(({ icon, count, onClick, disabled, name }) => (
  <button
    title={name}
    onClick={onClick}
    disabled={disabled}
    className="relative flex flex-col items-center justify-center w-20 h-20 md:w-20 md:h-20 bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-slate-700/80 shadow-lg transition-all duration-200 enabled:active:scale-105 enabled:hover:border-blue-500/50 enabled:active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
  >
    <div className="w-full h-full flex items-center justify-center overflow-hidden">{icon}</div>
    <span className="absolute top-1 right-1.5 flex items-center justify-center w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full border-2 border-slate-800/50">
      {count}
    </span>
  </button>
));

const formatExplanation = (explanation: string) => {
    if (!explanation) return '';
    // Regex to find and capture the key from [CITA:key]
    const parts = explanation.split(/(\[CITA:[\w-]+\])/g);

    return parts.map((part, index) => {
        const match = part.match(/\[CITA:([\w-]+)\]/);
        if (match) {
            const key = match[1];
            const entry = bibliographyData.find(b => b.key === key);
            if (entry) {
                const mainAuthor = entry.author.split(',')[0];
                const etAl = entry.author.includes('&') || entry.author.split(',').length > 3 ? ' et al.' : '';
                return (
                    <strong key={index} className="text-sky-300 font-semibold mx-1 cursor-help" title={`${entry.title} (${entry.year})`}>
                        ({mainAuthor}{etAl}, {entry.year})
                    </strong>
                );
            }
        }
        return part; // Return the text part as is
    });
};


const QuizScreen: React.FC<QuizScreenProps> = ({ quizQuestions, onQuizComplete, onBack, onMistake, immediateFeedback, title, timeLimit, lifelines, onUseLifeline }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [userAnswers, setUserAnswers] = useState<(number | string)[]>([]);
    const [blankInput, setBlankInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Lifeline State
    const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
    const [showExplanationHint, setShowExplanationHint] = useState<string | null>(null);
    const [isSecondChanceActive, setIsSecondChanceActive] = useState(false);
    const [lifelinesUsedThisQuestion, setLifelinesUsedThisQuestion] = useState<{[key: string]: boolean}>({});

    const currentQuestion = quizQuestions?.[currentQuestionIndex];
    const isFillInTheBlank = currentQuestion?.textoPregunta.includes('____');

    useEffect(() => {
        if (!quizQuestions || quizQuestions.length === 0) {
            setTimeout(() => onBack(), 500);
        }
    }, [quizQuestions, onBack]);
    
    useEffect(() => {
      if (isFillInTheBlank && inputRef.current) {
        inputRef.current.focus();
      }
    }, [currentQuestionIndex, isFillInTheBlank]);

    const getIsCorrect = (question: QuestionData, answer: number | string) => {
        if (isFillInTheBlank) {
            return (answer as string).trim().toLowerCase() === question.opciones[question.indiceRespuestaCorrecta].trim().toLowerCase();
        }
        return answer === question.indiceRespuestaCorrecta;
    };
    
    const handleTimeUp = () => {
      const remainingAnswers = Array(quizQuestions.length - userAnswers.length).fill('timeout');
      onQuizComplete([...userAnswers, ...remainingAnswers]);
    };

    const handleAnswerSubmit = (answer: number | string) => {
        if (isAnswered) return;

        const correct = getIsCorrect(currentQuestion, answer);
        
        if (!correct && isSecondChanceActive) {
            setIsSecondChanceActive(false); // Consume la segunda oportunidad
            setDisabledOptions(prev => [...prev, answer as number]); // Deshabilita la opción incorrecta elegida
            return; // Permite al usuario elegir de nuevo
        }

        if (!correct && immediateFeedback) {
            onMistake(currentQuestion.id);
        }
        
        const newAnswers = [...userAnswers, answer];
        setUserAnswers(newAnswers);
        setSelectedAnswer(answer);

        if (immediateFeedback) {
            setIsAnswered(true);
        } else {
            handleNextQuestion(answer);
        }
    };
    
    const handleNextQuestion = (lastAnswer?: number | string) => {
        const answers = lastAnswer !== undefined ? [...userAnswers, lastAnswer] : userAnswers;

        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setIsAnswered(false);
            setSelectedAnswer(null);
            setBlankInput('');
            // Reset lifeline state for the new question
            setDisabledOptions([]);
            setShowExplanationHint(null);
            setIsSecondChanceActive(false);
            setLifelinesUsedThisQuestion({});
        } else {
            onQuizComplete(answers);
        }
    };
    
    const useFiftyFifty = () => {
        if (lifelines.fiftyFifty <= 0 || lifelinesUsedThisQuestion.fiftyFifty) return;
        onUseLifeline('fiftyFifty');
        setLifelinesUsedThisQuestion(prev => ({ ...prev, fiftyFifty: true }));

        const incorrectOptions = [0, 1, 2, 3].filter(i => i !== currentQuestion.indiceRespuestaCorrecta);
        const shuffled = incorrectOptions.sort(() => 0.5 - Math.random());
        setDisabledOptions(shuffled.slice(0, 2));
    };

    const useQuickReview = () => {
        if (lifelines.quickReview <= 0 || lifelinesUsedThisQuestion.quickReview) return;
        onUseLifeline('quickReview');
        setLifelinesUsedThisQuestion(prev => ({ ...prev, quickReview: true }));
        setShowExplanationHint(currentQuestion.explicacion);
    };

    const useSecondChance = () => {
        if (lifelines.secondChance <= 0 || lifelinesUsedThisQuestion.secondChance) return;
        onUseLifeline('secondChance');
        setLifelinesUsedThisQuestion(prev => ({ ...prev, secondChance: true }));
        setIsSecondChanceActive(true);
    };
    
    if (!currentQuestion) {
        return <div className="p-6 text-center text-gray-300">Cargando...</div>;
    }

    const isCorrect = isAnswered && getIsCorrect(currentQuestion, selectedAnswer!);

    const panelBg = isCorrect ? 'bg-gradient-to-t from-emerald-900/80 to-slate-950' : 'bg-gradient-to-t from-red-900/80 to-slate-950';
    const nextButtonClass = isCorrect ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white';

    const renderQuestionTextWithBlank = () => {
      const parts = currentQuestion.textoPregunta.split('____');
      return (
        <span className="text-base md:text-lg font-semibold my-1 flex-shrink-0 leading-relaxed text-center text-slate-200">
            {parts[0]}
            <input 
                ref={inputRef}
                type="text"
                value={blankInput}
                onChange={(e) => setBlankInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !isAnswered) handleAnswerSubmit(blankInput); }}
                disabled={isAnswered}
                className="inline-block w-48 mx-2 px-2 py-1 text-center font-bold text-lg rounded-lg border-2 border-slate-500 bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-700"
                autoFocus
            />
            {parts[1]}
        </span>
      );
    };

    return (
        <div className={`relative flex flex-col h-full overflow-hidden bg-slate-950 transition-colors duration-500`}>
            {timeLimit && <Timer timeLimit={timeLimit} onTimeUp={handleTimeUp} />}
            <button onClick={onBack} className="absolute top-4 right-4 text-slate-400 active:text-white z-30 transition-transform active:scale-95 touch-manipulation">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <div className="flex-grow p-4 flex flex-col pt-16 sm:pt-4">
                {title && <h2 className="text-center font-graffiti text-2xl text-slate-300 mb-2 tracking-wide -rotate-1">{title}</h2>}
                
                <div className="w-full bg-slate-700 rounded-full h-3 mb-4 flex-shrink-0">
                    <div className="bg-gradient-to-r from-blue-500 to-sky-400 h-3 rounded-full transition-all duration-300" style={{width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`}}></div>
                </div>
                
                {isFillInTheBlank ? (
                    <div className="flex-grow flex flex-col items-center justify-center space-y-4">
                        {renderQuestionTextWithBlank()}
                    </div>
                ) : (
                    <h2 className="text-lg md:text-xl font-semibold my-2 flex-shrink-0 text-slate-100">{currentQuestion.textoPregunta}</h2>
                )}

                 {immediateFeedback && !isAnswered && !isFillInTheBlank && (
                    <div className="flex-shrink-0 py-4">
                        <div className="flex justify-center items-center gap-4">
                           {(() => { const I = iconMap['lifeline_fifty_fifty']; return <LifelineButton name="50/50" icon={<I className="w-8 h-8" />} count={lifelines.fiftyFifty} onClick={useFiftyFifty} disabled={lifelines.fiftyFifty <= 0 || lifelinesUsedThisQuestion.fiftyFifty} /> })()}
                           {(() => { const I = iconMap['lifeline_quick_review']; return <LifelineButton name="Repaso Rápido" icon={<I className="w-8 h-8" />} count={lifelines.quickReview} onClick={useQuickReview} disabled={lifelines.quickReview <= 0 || lifelinesUsedThisQuestion.quickReview} /> })()}
                           {(() => { const I = iconMap['lifeline_second_chance']; return <LifelineButton name="Segunda Oportunidad" icon={<I className="w-8 h-8" />} count={lifelines.secondChance} onClick={useSecondChance} disabled={lifelines.secondChance <= 0 || lifelinesUsedThisQuestion.secondChance || isSecondChanceActive} /> })()}
                        </div>
                         {/* Indicador del tutorial: muestra teclas/acciones sugeridas si el tour está activo */}
                         {Boolean((window as any).__TOUR_ACTIVE__) && (
                           <p className="mt-2 text-center text-xs text-slate-400">Sugerencia: prueba activar un comodín para ver su efecto.</p>
                         )}
                    </div>
                )}

                <div className="space-y-3 flex-grow overflow-y-auto pr-2">
                    {!isFillInTheBlank ? (
                        currentQuestion.opciones.map((option, index) => {
                            let buttonClass = 'border-2 border-slate-700 bg-slate-800/60 hover:bg-slate-700/60 active:bg-slate-700 text-slate-200';
                             const isDisabledByLifeline = disabledOptions.includes(index);

                            if (isAnswered) {
                                if (index === currentQuestion.indiceRespuestaCorrecta) {
                                    buttonClass = 'border-emerald-500 bg-emerald-900/50 font-bold ring-2 ring-emerald-500';
                                } else if (index === selectedAnswer) {
                                    buttonClass = 'border-red-500 bg-red-900/50 opacity-80 ring-2 ring-red-500';
                                } else {
                                    buttonClass += ' opacity-50';
                                }
                            } else if (isDisabledByLifeline) {
                                buttonClass += ' opacity-30 cursor-not-allowed line-through';
                            }
                            return (
                                <button key={index} onClick={() => handleAnswerSubmit(index)} disabled={isAnswered || isDisabledByLifeline} className={`w-full text-left p-3 rounded-lg text-sm font-semibold transition-all duration-200 flex justify-between items-center touch-manipulation ${buttonClass}`}>
                                    <span>{option}</span>
                                    {isAnswered && index === currentQuestion.indiceRespuestaCorrecta && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                                    {isAnswered && index === selectedAnswer && index !== currentQuestion.indiceRespuestaCorrecta && <XCircle className="w-5 h-5 text-red-500" />}
                                </button>
                            );
                        })
                    ) : (
                      <div className="flex justify-center mt-4">
                        <button
                            onClick={() => handleAnswerSubmit(blankInput)}
                            disabled={isAnswered || blankInput.trim() === ''}
                            className="px-8 py-3 rounded-xl font-bold text-lg text-white bg-blue-600 active:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg touch-manipulation"
                        >
                            Comprobar
                        </button>
                      </div>
                    )}
                </div>
            </div>
            
             {showExplanationHint && (
                <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4" onClick={() => setShowExplanationHint(null)}>
                    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl max-w-md animate-scale-in border border-blue-400">
                        <h4 className="font-bold text-lg text-slate-100 flex items-center gap-2">{(() => { const I = iconMap['lifeline_quick_review']; return <I className="w-6 h-6" /> })()} Pista de Repaso Rápido</h4>
                        <p className="mt-2 text-slate-300">{formatExplanation(showExplanationHint)}</p>
                        <button onClick={() => setShowExplanationHint(null)} className="mt-4 w-full bg-slate-700 text-slate-200 font-bold py-2 px-4 rounded-lg touch-manipulation">Cerrar</button>
                    </div>
                </div>
            )}

            {isAnswered && (
                <div className={`flex-shrink-0 relative animate-slide-up-fade pt-8 ${panelBg}`}>
                    <div className={`p-4`}>
                        <h3 className={`font-bold text-xl text-center text-white`}>{isCorrect ? '¡Correcto!' : 'Respuesta incorrecta'}</h3>
                         {!isCorrect && (
                            <p className={`mt-1 font-semibold text-center text-sm text-white/90`}>
                                La respuesta correcta es: <strong className="underline">{currentQuestion.opciones[currentQuestion.indiceRespuestaCorrecta]}</strong>
                            </p>
                        )}
                        <div className="max-h-[6rem] overflow-y-auto my-2 pr-2 text-left">
                            {currentQuestion.explicacion && <p className={`text-sm text-white/90`}>{formatExplanation(currentQuestion.explicacion)}</p>}
                        </div>
                        <button onClick={() => handleNextQuestion()} className={`mt-2 w-full font-bold py-3 px-4 rounded-xl text-lg shadow-lg transition-transform active:scale-95 touch-manipulation ${nextButtonClass}`}>
                            {currentQuestionIndex < quizQuestions.length - 1 ? 'Siguiente' : 'Finalizar'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(QuizScreen);