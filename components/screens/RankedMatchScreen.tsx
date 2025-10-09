import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QuestionData, MatchMode, League } from '../../types';
import { useAudio } from '../../src/contexts/AudioProvider';

interface RankedMatchScreenProps {
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
  
  const questionStartTime = useRef(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

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

  // Simular respuesta del oponente (en producción sería sincronizada en tiempo real)
  const simulateOpponentAnswer = useCallback(() => {
    // El oponente responde entre 3-8 segundos después
    const delay = 3000 + Math.random() * 5000;
    
    setTimeout(() => {
      const isCorrect = Math.random() > 0.3; // 70% de aciertos
      const timeUsed = Math.floor(delay / 1000);
      
      setOpponentAnswers(prev => [...prev, isCorrect]);
      setOpponentTimes(prev => [...prev, timeUsed]);
      
      if (isCorrect) {
        setOpponentScore(prev => prev + getScoreForMode(mode, true));
        if (mode === 'Ataque') {
          setMyHP(prev => Math.max(0, prev - 1));
        }
      }
    }, delay);
  }, [mode]);

  useEffect(() => {
    if (!isAnswered) {
      simulateOpponentAnswer();
    }
  }, [currentQuestionIndex]);

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

  const handleAnswerSubmit = (answerIndex: number | null) => {
    if (isAnswered) return;

    const timeUsed = Math.floor((Date.now() - questionStartTime.current) / 1000);
    const isCorrect = answerIndex === currentQuestion.indiceRespuestaCorrecta;

    setIsAnswered(true);
    setMyAnswers(prev => [...prev, isCorrect]);
    setMyTimes(prev => [...prev, timeUsed]);

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

      {/* Botón de abandonar */}
      <button
        onClick={onForfeit}
        className="mt-4 text-sm text-neutral-500 hover:text-red-400 transition-colors"
      >
        Abandonar partida
      </button>
    </div>
  );
};

export default RankedMatchScreen;

