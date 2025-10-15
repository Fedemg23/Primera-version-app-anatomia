import React, { useState, useEffect, memo, useRef } from 'react';
import { MatchMode, League } from '../types';
import { getMatchmakingRange } from '../utils/rankedElo';
import {
  joinMatchmakingQueue,
  leaveMatchmakingQueue,
  subscribeToMatchmakingQueue,
  findMatch
} from '../services/rankedMatchmaking';
import { matchmakingRateLimiter, sanitizeUsername } from '../utils/rankedValidation';
import AvatarImage from './AvatarImage';

interface MatchmakingModalProps {
  isOpen: boolean;
  myUserId: string;
  myName: string;
  myRating: number;
  myLeague: League;
  myAvatar: string;
  mode: MatchMode;
  onCancel: () => void;
  onMatchFound?: (matchId: string, opponentData: {
    userId: string;
    avatar: string;
    name: string;
    rating: number;
    league: League;
    advantage: number;
  }) => void;
}

const tips = [
  "💡 Las arterias llevan sangre oxigenada, excepto la pulmonar",
  "💡 El fémur es el hueso más largo del cuerpo humano",
  "💡 El corazón late aproximadamente 100.000 veces al día",
  "💡 Los pulmones contienen cerca de 300 millones de alvéolos",
  "💡 El cerebro consume el 20% de la energía del cuerpo",
  "💡 La piel es el órgano más grande del cuerpo",
  "💡 El hígado puede regenerarse a su tamaño completo",
  "💡 Los huesos son más fuertes que el acero del mismo peso",
  "💡 El cuerpo humano tiene aproximadamente 37.2 billones de células",
  "💡 El nervio vago es el nervio craneal más largo"
];

const MatchmakingModal: React.FC<MatchmakingModalProps> = ({
  isOpen,
  myUserId,
  myName,
  myRating,
  myLeague,
  myAvatar,
  mode,
  onCancel,
  onMatchFound
}) => {
  const [waitTime, setWaitTime] = useState(0);
  const [currentTip, setCurrentTip] = useState(tips[0]);
  const [searchRange, setSearchRange] = useState<[number, number]>([0, 0]);
  const [isSearching, setIsSearching] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [opponentData, setOpponentData] = useState<any>(null);
  const [queueId, setQueueId] = useState<string | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const searchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Unirse a la cola de matchmaking
  useEffect(() => {
    if (!isOpen) {
      // Limpiar estado
      setWaitTime(0);
      setIsSearching(true);
      setCountdown(null);
      setOpponentData(null);
      setQueueId(null);
      setMatchId(null);
      
      // Salir de la cola si estaba en ella
      if (queueId) {
        leaveMatchmakingQueue(queueId);
      }
      
      // Limpiar intervalo de búsqueda
      if (searchIntervalRef.current) {
        clearInterval(searchIntervalRef.current);
      }
      return;
    }

    // Unirse a la cola
    const initQueue = async () => {
      try {
        // Rate limiting
        if (!matchmakingRateLimiter.isAllowed(myUserId)) {
          console.error('Demasiados intentos de matchmaking');
          return;
        }

        // Sanitizar nombre
        const safeName = sanitizeUsername(myName);

        const id = await joinMatchmakingQueue(
          myUserId,
          safeName,
          myAvatar,
          myRating,
          myLeague,
          mode
        );
        setQueueId(id);
        
        // Suscribirse a actualizaciones de la cola
        const unsubscribe = subscribeToMatchmakingQueue(
          id,
          (foundMatchId) => {
            setMatchId(foundMatchId);
            // La partida se manejará en otro efecto
          },
          (error) => {
            console.error('Error en cola:', error);
          }
        );

        return unsubscribe;
      } catch (error) {
        console.error('Error uniéndose a la cola:', error);
      }
    };

    const unsubscribePromise = initQueue();

    return () => {
      unsubscribePromise?.then(unsub => unsub?.());
    };
  }, [isOpen, myUserId, myName, myAvatar, myRating, myLeague, mode]);

  // Contador de tiempo de espera
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setWaitTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Actualizar rango de búsqueda
  useEffect(() => {
    if (!isOpen) return;
    const range = getMatchmakingRange(myRating, waitTime);
    setSearchRange(range);
  }, [waitTime, myRating, isOpen]);

  // Cambiar tip cada 5 segundos
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Buscar partida activamente cada 3 segundos
  useEffect(() => {
    if (!isOpen || !queueId || matchId) return;

    searchIntervalRef.current = setInterval(async () => {
      try {
        const foundMatchId = await findMatch(queueId, {
          userId: myUserId,
          name: myName,
          avatar: myAvatar,
          rating: myRating,
          league: myLeague,
          mode,
          timestamp: new Date(),
          status: 'searching'
        });

        if (foundMatchId) {
          setMatchId(foundMatchId);
          if (searchIntervalRef.current) {
            clearInterval(searchIntervalRef.current);
          }
        }
      } catch (error) {
        console.error('Error buscando partida:', error);
      }
    }, 3000);

    return () => {
      if (searchIntervalRef.current) {
        clearInterval(searchIntervalRef.current);
      }
    };
  }, [isOpen, queueId, matchId, myUserId, myName, myAvatar, myRating, myLeague, mode]);

  // Cuando se encuentra una partida, obtener datos del oponente REAL desde Firebase
  useEffect(() => {
    if (!matchId || !onMatchFound) return;

    const loadOpponentData = async () => {
      try {
        const { getDb } = await import('../services/firebase');
        const { doc, getDoc } = await import('firebase/firestore');
        
        const db = getDb();
        if (!db) {
          console.error('Firestore no disponible');
          return;
        }

        // Obtener datos de la partida activa desde Firebase
        const matchDoc = await getDoc(doc(db, 'activeMatches', matchId));
        
        if (!matchDoc.exists()) {
          console.error('Partida no encontrada');
          return;
        }

        const matchData = matchDoc.data() as any;
        
        // Determinar si soy p1 o p2
        const isP1 = matchData.p1.userId === myUserId;
        const opponentInfo = isP1 ? matchData.p2 : matchData.p1;

        // Construir datos del oponente REAL
        const opponent = {
          userId: opponentInfo.userId,
          avatar: opponentInfo.avatar,
          name: opponentInfo.name,
          rating: opponentInfo.rating,
          league: opponentInfo.league,
          advantage: 0
        };

        // Calcular ventaja teórica
        const ratingDiff = myRating - opponent.rating;
        opponent.advantage = Math.round(50 + (ratingDiff / 400) * 25);

        setOpponentData(opponent);
        setIsSearching(false);
        setCountdown(3);
      } catch (error) {
        console.error('Error cargando datos del oponente:', error);
      }
    };

    loadOpponentData();
  }, [matchId, myUserId, myRating, onMatchFound]);

  // Countdown cuando se encuentra rival
  useEffect(() => {
    if (countdown === null || countdown === 0) {
      if (countdown === 0 && matchId && opponentData && onMatchFound) {
        onMatchFound(matchId, opponentData);
      }
      return;
    }

    const timeout = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [countdown, matchId, opponentData, onMatchFound]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        {isSearching ? (
          <>
            {/* Buscando rival */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-white mb-2">Buscando rival</h2>
              <p className="text-neutral-400 text-sm">{mode}</p>
            </div>

            {/* Animación de búsqueda */}
            <div className="relative h-32 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
              </div>
              <div className="z-10">
                <AvatarImage avatarId={myAvatar} size="xl" />
              </div>
            </div>

            {/* Información de búsqueda */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-800">
                <span className="text-sm text-neutral-400">Tu rating</span>
                <span className="text-white font-bold">{myRating}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-800">
                <span className="text-sm text-neutral-400">Rango de búsqueda</span>
                <span className="text-white font-bold">
                  {searchRange[0]} - {searchRange[1]}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-800">
                <span className="text-sm text-neutral-400">Tiempo de espera</span>
                <span className="text-white font-bold">{waitTime}s</span>
              </div>
            </div>

            {/* Tip educativo */}
            <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-700/30 mb-6">
              <p className="text-sm text-blue-200 text-center">{currentTip}</p>
            </div>

            {/* Botón cancelar */}
            <button
              onClick={async () => {
                if (queueId) {
                  await leaveMatchmakingQueue(queueId);
                }
                onCancel();
              }}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-3 rounded-xl transition-colors"
            >
              Cancelar búsqueda
            </button>
          </>
        ) : (
          <>
            {/* Rival encontrado */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-green-400 mb-2">¡Rival encontrado!</h2>
              <p className="text-neutral-400 text-sm">La partida comenzará en {countdown}...</p>
            </div>

            {/* Comparativa */}
            <div className="flex items-center justify-between gap-4 mb-6 p-6 rounded-xl bg-gradient-to-r from-neutral-800 to-neutral-900 border border-neutral-700">
              {/* Tú */}
              <div className="flex-1 text-center">
                <div className="relative inline-block mb-3">
                  <div className="ring-4 ring-green-500/40 rounded-full animate-pulse">
                    <AvatarImage avatarId={myAvatar} size="xl" className="ring-0 border-4 border-green-500" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-600 rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                    TÚ
                  </div>
                </div>
                <div className="text-white font-bold mb-1">{myRating} R</div>
                <div className="text-xs text-neutral-400">{myLeague}</div>
              </div>

              {/* VS */}
              <div className="relative">
                <div className="text-3xl font-black text-red-500 px-4 py-2 bg-black/50 rounded-lg border-2 border-red-500/50 animate-pulse">
                  VS
                </div>
              </div>

              {/* Rival */}
              <div className="flex-1 text-center">
                <div className="relative inline-block mb-3">
                  <div className="ring-4 ring-blue-500/40 rounded-full animate-pulse">
                    <AvatarImage avatarId={opponentData?.avatar || 'novice'} size="xl" className="ring-0 border-4 border-blue-500" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                    RIVAL
                  </div>
                </div>
                <div className="text-white font-bold mb-1">{opponentData?.name}</div>
                <div className="text-sm text-neutral-400">{opponentData?.rating} R</div>
                <div className="text-xs text-neutral-500">{opponentData?.league}</div>
              </div>
            </div>

            {/* Ventaja teórica */}
            <div className="p-4 rounded-lg bg-neutral-800 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-400">Ventaja teórica</span>
                <span className={`text-lg font-bold ${
                  opponentData?.advantage > 55 ? 'text-green-400' :
                  opponentData?.advantage < 45 ? 'text-red-400' :
                  'text-yellow-400'
                }`}>
                  {opponentData?.advantage}%
                </span>
              </div>
              <div className="relative h-2 rounded-full bg-neutral-700 overflow-hidden">
                <div 
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                    opponentData?.advantage > 55 ? 'bg-green-500' :
                    opponentData?.advantage < 45 ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}
                  style={{ width: `${opponentData?.advantage}%` }}
                />
              </div>
            </div>

            {/* Countdown visual */}
            <div className="flex items-center justify-center">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-green-600 animate-pulse"></div>
                <span className="text-4xl font-black text-green-400">{countdown}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default memo(MatchmakingModal);

