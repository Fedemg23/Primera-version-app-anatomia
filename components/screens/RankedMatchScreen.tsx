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
  
  const questionStartTime = useRef(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Sincronización en tiempo real con la partida
  useEffect(() => {
    const unsubscribe = subscribeToActiveMatch(
      matchId,
      (match: ActiveMatch) => {
        const isP1 = match.p1.userId === myData.userId;
        const opponent = isP1 ? match.p2 : match.p1;

        // Actualizar estado del oponente
        setOpponentAnswers(opponent.answers);
        setOpponentTimes(opponent.times);
        setOpponentScore(opponent.score);
        setOpponentConnected(opponent.connected);

        // Actualizar HP si es modo Ataque
        if (mode === 'Ataque') {
          const myHP = 5 - opponent.answers.filter(a => a).length;
          const oppHP = 5 - (isP1 ? match.p1.answers : match.p2.answers).filter(a => a).length;
          setMyHP(Math.max(0, myHP));
          setOpponentHP(Math.max(0, oppHP));
        }

        // Si la partida terminó, mostrar resultado
        if (match.status === 'finished' && match.winner) {
          const myWin = (match.winner === 'p1' && isP1) || (match.winner === 'p2' && !isP1);
          const winner = match.winner === 'draw' ? 'draw' : myWin ? 'me' : 'opponent';
          
          finishMatch();
        }
      },
      (error) => {
        console.error('Error en sincronización:', error);
      }
    );

    return () => unsubscribe();
  }, [matchId, myData.userId, mode]);

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

  const getScoreForMode = (mode: MatchMode, isCorrect: boolean): number => {
    if (!isCorrect) return 0;
    
    switch (mode) {
      case 'Robo':
        return 2; // Robar puntos vale el doble
      case 'MuerteSubita':
        return 1;
      default:
        return 1;
    }
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

    // Actualizar puntuación según el modo
    if (isCorrect) {
      const points = getScoreForMode(mode, true);
      setMyScore(prev => prev + points);
      
      if (mode === 'Ataque') {
        setOpponentHP(prev => Math.max(0, prev - 1));
      } else if (mode === 'Robo' && opponentScore > 0) {
        setOpponentScore(prev => Math.max(0, prev - 1));
      }
      
      playSound('correct');
    } else {
      playSound('incorrect');
      
      if (mode === 'Ataque') {
        setMyHP(prev => Math.max(0, prev - 1));
      } else if (mode === 'MuerteSubita') {
        // Muerte súbita: perder inmediatamente
        finishMatch();
        return;
      }
    }

    setShowResult(true);

    // Esperar 2 segundos antes de pasar a la siguiente pregunta
    setTimeout(() => {
      if (isLastQuestion || (mode === 'Ataque' && (myHP <= 1 || opponentHP <= 1))) {
        finishMatch();
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

  const finishMatch = () => {
    let winner: 'me' | 'opponent' | 'draw' = 'draw';
    
    if (mode === 'Ataque') {
      winner = myHP > opponentHP ? 'me' : opponentHP > myHP ? 'opponent' : 'draw';
    } else if (mode === 'MuerteSubita') {
      winner = myAnswers[myAnswers.length - 1] ? 'me' : 'opponent';
    } else {
      winner = myScore > opponentScore ? 'me' : opponentScore > myScore ? 'opponent' : 'draw';
    }

    onMatchComplete({
      myScore,
      opponentScore,
      myAnswers,
      opponentAnswers,
      myTimes,
      opponentTimes,
      winner
    });
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-white p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-neutral-900/80 backdrop-blur-xl border border-neutral-700 rounded-2xl p-4">
        {/* Mi info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-4xl shadow-lg ring-4 ring-green-500/30">
              {myData.avatar}
            </div>
            {mode === 'Ataque' && (
              <div className="absolute -bottom-1 -right-1 bg-red-600 rounded-full px-2 py-0.5 text-xs font-bold flex items-center gap-0.5">
                ❤️ {myHP}
              </div>
            )}
          </div>
          <div>
            <div className="text-base font-bold text-white">{myData.name}</div>
            <div className="text-xs text-neutral-400">{myData.rating} R · {myData.league}</div>
            {mode !== 'Ataque' && (
              <div className="text-xl font-black text-green-400 mt-1">
                {myScore} pts
              </div>
            )}
          </div>
        </div>

        {/* VS */}
        <div className="relative">
          <div className="text-2xl font-black text-red-500 px-4 py-2 bg-neutral-800 rounded-lg border-2 border-red-500/30">
            VS
          </div>
        </div>

        {/* Info del oponente */}
        <div className="flex items-center gap-3 flex-row-reverse">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-4xl shadow-lg ring-4 ring-blue-500/30">
              {opponentData.avatar}
            </div>
            {mode === 'Ataque' && (
              <div className="absolute -bottom-1 -left-1 bg-red-600 rounded-full px-2 py-0.5 text-xs font-bold flex items-center gap-0.5">
                ❤️ {opponentHP}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-base font-bold text-white">{opponentData.name}</div>
            <div className="text-xs text-neutral-400">{opponentData.rating} R · {opponentData.league}</div>
            {mode !== 'Ataque' && (
              <div className="text-xl font-black text-blue-400 mt-1">
                {opponentScore} pts
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-neutral-400 mt-1">
          <span>Pregunta {currentQuestionIndex + 1}/{questions.length}</span>
          <span className={timeLeft <= 5 ? 'text-red-400 font-bold' : ''}>⏱️ {timeLeft}s</span>
        </div>
      </div>

      {/* Pregunta */}
      <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full">
        <div className="bg-neutral-800/50 backdrop-blur-xl border border-neutral-700 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-center">
            {currentQuestion.textoPregunta}
          </h2>
          
          {currentQuestion.urlImagen && (
            <img 
              src={currentQuestion.urlImagen} 
              alt="Pregunta" 
              className="max-w-full max-h-64 mx-auto mb-4 rounded-lg"
            />
          )}
        </div>

        {/* Opciones */}
        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.opciones.map((opcion, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.indiceRespuestaCorrecta;
            const showCorrectness = showResult;

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
                className={`p-4 rounded-xl font-medium text-left transition-all ${
                  !showCorrectness
                    ? isSelected
                      ? 'bg-blue-600 text-white scale-95'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                    : showCorrectness && isCorrect
                    ? 'bg-green-600 text-white'
                    : showCorrectness && isSelected && !isCorrect
                    ? 'bg-red-600 text-white'
                    : 'bg-neutral-800 text-neutral-400'
                } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
              >
                <span className="font-bold mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                {opcion}
                {showCorrectness && isCorrect && <span className="ml-2">✓</span>}
                {showCorrectness && isSelected && !isCorrect && <span className="ml-2">✗</span>}
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
      <button
        onClick={async () => {
          try {
            await forfeitMatch(matchId, myData.userId);
            onForfeit();
          } catch (error) {
            console.error('Error abandonando:', error);
            onForfeit();
          }
        }}
        className="mt-4 text-sm text-neutral-500 hover:text-red-400 transition-colors"
      >
        Abandonar partida
      </button>
    </div>
  );
};

export default RankedMatchScreen;

