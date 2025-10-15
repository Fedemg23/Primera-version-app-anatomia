import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QuestionData, MatchMode, League } from '../../types';
import { useAudio } from '../../src/contexts/AudioProvider';
import { 
  subscribeToActiveMatch, 
  submitAnswer, 
  sendHeartbeat, 
  forfeitMatch,
  ActiveMatch 
} from '../../services/rankedMatchmaking';
import {
  validateAnswerTime,
  validateAnswerIndex,
  answerRateLimiter
} from '../../utils/rankedValidation';
import AvatarImage from '../AvatarImage';

interface RankedMatchScreenProps {
  matchId: string;
  mode: MatchMode;
  questions: QuestionData[];
  myData: {
    userId: string;
    name: string;
    avatar: string;
    rating: number;
    league: League;
  };
  opponentData: {
    userId: string;
    name: string;
    avatar: string;
    rating: number;
    league: League;
  };
  onMatchComplete: (result: MatchResult) => void;
  onForfeit: () => void;
}

export interface MatchResult {
  myScore: number;
  opponentScore: number;
  myAnswers: boolean[];
  opponentAnswers: boolean[];
  myTimes: number[];
  opponentTimes: number[];
  winner: 'me' | 'opponent' | 'draw';
}

const RankedMatchScreen: React.FC<RankedMatchScreenProps> = ({
  matchId,
  mode,
  questions,
  myData,
  opponentData,
  onMatchComplete,
  onForfeit
}) => {
  const { playSound } = useAudio();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [myAnswers, setMyAnswers] = useState<boolean[]>([]);
  const [opponentAnswers, setOpponentAnswers] = useState<boolean[]>([]);
  const [myTimes, setMyTimes] = useState<number[]>([]);
  const [opponentTimes, setOpponentTimes] = useState<number[]>([]);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [myHP, setMyHP] = useState(5); // Para modo Ataque por Vida
  const [opponentHP, setOpponentHP] = useState(5);
  const [opponentConnected, setOpponentConnected] = useState(true);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [iFinished, setIFinished] = useState(false);
  
  const questionStartTime = useRef(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const matchCompletedRef = useRef(false); // Prevenir llamadas múltiples

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Sincronización en tiempo real con la partida
  useEffect(() => {
    const unsubscribe = subscribeToActiveMatch(
      matchId,
      (match: ActiveMatch) => {
        const isP1 = match.p1.userId === myData.userId;
        const opponent = isP1 ? match.p2 : match.p1;
        const me = isP1 ? match.p1 : match.p2;

        // Actualizar estado del oponente
        setOpponentAnswers(opponent.answers);
        setOpponentTimes(opponent.times);
        setOpponentScore(opponent.score);
        setOpponentConnected(opponent.connected);

        // Actualizar HP si es modo Ataque
        if (mode === 'Ataque') {
          const myHP = 5 - opponent.answers.filter(a => a).length;
          const oppHP = 5 - me.answers.filter(a => a).length;
          setMyHP(Math.max(0, myHP));
          setOpponentHP(Math.max(0, oppHP));
        }

        // Verificar si ambos jugadores terminaron todas las preguntas
        const myFinished = me.currentQuestionIndex >= questions.length;
        const opponentFinished = opponent.currentQuestionIndex >= questions.length;

        // Si yo terminé pero el oponente no, mostrar pantalla de espera
        if (myFinished && !opponentFinished && !waitingForOpponent) {
          setWaitingForOpponent(true);
          setIFinished(true);
        }

        // Si ambos terminaron, calcular el ganador (solo una vez)
        if (myFinished && opponentFinished && iFinished && !matchCompletedRef.current) {
          matchCompletedRef.current = true;
          finishMatchWithResults(me.score, opponent.score, me.answers, opponent.answers);
        }

        // Si la partida terminó por el servidor (desconexión, forfeit, etc.) - solo una vez
        if (match.status === 'finished' && match.winner && !matchCompletedRef.current) {
          matchCompletedRef.current = true;
          const myWin = (match.winner === 'p1' && isP1) || (match.winner === 'p2' && !isP1);
          const winner = match.winner === 'draw' ? 'draw' : myWin ? 'me' : 'opponent';
          
          onMatchComplete({
            myScore,
            opponentScore,
            myAnswers,
            opponentAnswers,
            myTimes,
            opponentTimes,
            winner
          });
        }
      },
      (error) => {
        console.error('Error en sincronización:', error);
      }
    );

    return () => unsubscribe();
  }, [matchId, myData.userId, mode, iFinished, waitingForOpponent, questions.length]);

  // Heartbeat para mantener conexión
  useEffect(() => {
    heartbeatInterval.current = setInterval(() => {
      sendHeartbeat(matchId, myData.userId);
    }, 3000);

    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
    };
  }, [matchId, myData.userId]);

  // Timer
  useEffect(() => {
    if (isAnswered || showResult) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestionIndex, isAnswered, showResult]);

  // Modo clásico: 1 punto por respuesta correcta
  const getScoreForMode = (isCorrect: boolean): number => {
    return isCorrect ? 1 : 0;
  };

  const handleTimeout = () => {
    if (!isAnswered) {
      handleAnswerSubmit(null);
    }
  };

  const handleAnswerSubmit = async (answerIndex: number | null) => {
    if (isAnswered) return;

    const timeUsed = Math.floor((Date.now() - questionStartTime.current) / 1000);
    
    // Validaciones de seguridad
    if (!validateAnswerIndex(answerIndex, currentQuestion)) {
      console.error('Índice de respuesta inválido');
      return;
    }

    if (!validateAnswerTime(timeUsed)) {
      console.warn('Tiempo de respuesta sospechoso:', timeUsed);
      // Continuar pero registrar para análisis
    }

    // Rate limiting
    if (!answerRateLimiter.isAllowed(myData.userId)) {
      console.error('Rate limit excedido');
      return;
    }

    const isCorrect = answerIndex === currentQuestion.indiceRespuestaCorrecta;

    setIsAnswered(true);
    setMyAnswers(prev => [...prev, isCorrect]);
    setMyTimes(prev => [...prev, timeUsed]);

    // Enviar respuesta al servidor
    try {
      await submitAnswer(matchId, myData.userId, currentQuestionIndex, isCorrect, timeUsed);
    } catch (error) {
      console.error('Error enviando respuesta:', error);
    }

    // Actualizar puntuación (modo clásico)
    if (isCorrect) {
      const points = getScoreForMode(true);
      setMyScore(prev => prev + points);
      playSound('correct');
    } else {
      playSound('incorrect');
    }

    setShowResult(true);

    // Esperar 2 segundos antes de pasar a la siguiente pregunta
    setTimeout(() => {
      if (isLastQuestion) {
        // Marcar que terminé y esperar al rival
        setIFinished(true);
        setWaitingForOpponent(true);
      } else if (mode === 'Ataque' && (myHP <= 1 || opponentHP <= 1)) {
        finishMatchWithResults(myScore, opponentScore, myAnswers, opponentAnswers);
      } else {
        nextQuestion();
      }
    }, 2000);
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowResult(false);
    setTimeLeft(20);
    questionStartTime.current = Date.now();
  };

  const finishMatchWithResults = (finalMyScore: number, finalOpponentScore: number, finalMyAnswers: boolean[], finalOpponentAnswers: boolean[]) => {
    // Modo clásico: determinar ganador por puntuación
    const winner: 'me' | 'opponent' | 'draw' = 
      finalMyScore > finalOpponentScore ? 'me' : 
      finalOpponentScore > finalMyScore ? 'opponent' : 
      'draw';

    onMatchComplete({
      myScore: finalMyScore,
      opponentScore: finalOpponentScore,
      myAnswers: finalMyAnswers,
      opponentAnswers: finalOpponentAnswers,
      myTimes,
      opponentTimes,
      winner
    });
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  // Pantalla de espera cuando yo terminé pero el rival no
  if (waitingForOpponent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-white p-4 flex items-center justify-center">
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-700 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <h2 className="text-2xl font-black text-white mb-3">¡Has terminado!</h2>
          <p className="text-neutral-400 mb-6">Esperando a que tu rival termine...</p>
          
          {/* Comparativa temporal */}
          <div className="bg-gradient-to-r from-neutral-800/50 to-neutral-800/30 rounded-xl p-5 mb-6 border border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <AvatarImage avatarId={myData.avatar} size="md" className="ring-0 border-4 border-green-500" />
                <div>
                  <div className="text-sm font-bold text-white">{myData.name}</div>
                  <div className="text-xs text-neutral-400">Tú - Completado ✓</div>
                </div>
              </div>
              <div className="text-3xl font-black text-green-400">
                {myScore}
              </div>
            </div>

            <div className="relative h-px bg-neutral-700 my-3">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-900 px-2 text-xs text-neutral-500 font-bold">
                VS
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AvatarImage avatarId={opponentData.avatar} size="md" className="ring-0 border-4 border-blue-500" />
                <div>
                  <div className="text-sm font-bold text-white">{opponentData.name}</div>
                  <div className="text-xs text-yellow-400 animate-pulse">En progreso...</div>
                </div>
              </div>
              <div className="text-3xl font-black text-blue-400">
                {opponentScore}
              </div>
            </div>
          </div>

          <div className="text-xs text-neutral-500 italic">
            El rival aún puede remontar. ¡No cantes victoria todavía!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-transparent transition-colors duration-500">
      {/* Header de puntuaciones */}
      <div className="flex items-center justify-between mb-3 bg-gradient-to-t from-gray-800/60 to-gray-600/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-3 mx-2 mt-2 flex-shrink-0">
        {/* Mi info */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <AvatarImage avatarId={myData.avatar} size="md" className="ring-2 ring-green-500/50" />
            {mode === 'Ataque' && (
              <div className="absolute -bottom-0.5 -right-0.5 bg-red-600 rounded-full px-1.5 py-0.5 text-[10px] font-bold flex items-center gap-0.5">
                ❤️ {myHP}
              </div>
            )}
          </div>
          <div>
            <div className="text-xs font-bold text-white leading-tight">{myData.name}</div>
            {mode !== 'Ataque' && (
              <div className="text-base font-black text-green-400 leading-tight">
                {myScore} pts
              </div>
            )}
          </div>
        </div>

        {/* VS */}
        <div className="relative flex-shrink-0">
          <div className="text-lg font-black text-red-500 px-2 py-1 bg-slate-800/50 rounded-lg border border-red-500/30">
            VS
          </div>
        </div>

        {/* Info del oponente */}
        <div className="flex items-center gap-2 flex-row-reverse">
          <div className="relative">
            <AvatarImage avatarId={opponentData.avatar} size="md" className="ring-2 ring-blue-500/50" />
            {mode === 'Ataque' && (
              <div className="absolute -bottom-0.5 -left-0.5 bg-red-600 rounded-full px-1.5 py-0.5 text-[10px] font-bold flex items-center gap-0.5">
                ❤️ {opponentHP}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-white leading-tight">{opponentData.name}</div>
            {mode !== 'Ataque' && (
              <div className="text-base font-black text-blue-400 leading-tight">
                {opponentScore} pts
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-3 px-2">
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-sky-400 h-3 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-neutral-400 mt-1">
          <span>Pregunta {currentQuestionIndex + 1}/{questions.length}</span>
          <span className={timeLeft <= 5 ? 'text-red-400 font-bold animate-pulse' : ''}>⏱️ {timeLeft}s</span>
        </div>
      </div>

      {/* Pregunta */}
      <div className="flex-1 min-h-0 flex flex-col">
        <h2 className="text-base md:text-lg font-semibold my-2 flex-shrink-0 text-slate-100 px-3 text-center">
          {currentQuestion.textoPregunta}
        </h2>
        
        {currentQuestion.urlImagen && (
          <div className="flex justify-center mb-3 px-3">
            <img 
              src={currentQuestion.urlImagen} 
              alt="Pregunta" 
              className="max-w-full max-h-48 rounded-lg border border-slate-700"
            />
          </div>
        )}

        {/* Opciones */}
        <div className={`grid grid-cols-1 gap-1.5 md:gap-2 flex-none px-3 w-full ${isAnswered ? 'pointer-events-none opacity-90' : ''}`}>
          {currentQuestion.opciones.map((opcion, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.indiceRespuestaCorrecta;
            const showCorrectness = showResult;

            let buttonClass = 'border border-slate-700 bg-slate-800/60 hover:bg-slate-700/60 active:bg-slate-700 text-slate-200';

            if (showCorrectness) {
              if (isCorrect) {
                buttonClass = 'border-emerald-500 bg-emerald-900/50 font-bold ring-2 ring-emerald-500';
              } else if (isSelected) {
                buttonClass = 'border-red-500 bg-red-900/50 opacity-80 ring-2 ring-red-500';
              } else {
                buttonClass += ' opacity-50';
              }
            }

            return (
              <button
                key={index}
                onClick={() => {
                  if (!isAnswered) {
                    setSelectedAnswer(index);
                    handleAnswerSubmit(index);
                  }
                }}
                disabled={isAnswered}
                className={`w-full text-left py-1 md:py-1.5 px-3 md:px-4 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 flex justify-between items-center gap-1.5 min-w-0 touch-manipulation min-h-10 md:min-h-11 ${buttonClass}`}
              >
                <span className="flex-1 whitespace-normal break-words leading-tight">
                  <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                  {opcion}
                </span>
                {showCorrectness && isCorrect && (
                  <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                )}
                {showCorrectness && isSelected && !isCorrect && (
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Indicador de desconexión del oponente */}
      {!opponentConnected && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          ⚠️ Oponente desconectado... esperando reconexión
        </div>
      )}

      {/* Botón de abandonar */}
      <div className="flex justify-center mt-3 mb-2">
        <button
          onClick={async () => {
            if (confirm('¿Seguro que quieres abandonar? Esto contará como derrota.')) {
              try {
                await forfeitMatch(matchId, myData.userId);
                onForfeit();
              } catch (error) {
                console.error('Error abandonando:', error);
                onForfeit();
              }
            }
          }}
          className="text-xs text-slate-400 hover:text-red-400 transition-colors px-4 py-1"
        >
          Abandonar partida
        </button>
      </div>
    </div>
  );
};

export default RankedMatchScreen;

