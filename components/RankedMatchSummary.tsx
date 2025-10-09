import React from 'react';
import { League } from '../types';

interface RankedMatchSummaryProps {
  isOpen: boolean;
  result: {
    winner: 'me' | 'opponent' | 'draw';
    myScore: number;
    opponentScore: number;
    ratingChange: number;
    newRating: number;
    oldRating: number;
    newLeague: League;
    oldLeague: League;
  };
  myData: {
    name: string;
    avatar: string;
  };
  opponentData: {
    name: string;
    avatar: string;
  };
  onContinue: () => void;
  onPlayAgain: () => void;
}

const RankedMatchSummary: React.FC<RankedMatchSummaryProps> = ({
  isOpen,
  result,
  myData,
  opponentData,
  onContinue,
  onPlayAgain
}) => {
  if (!isOpen) return null;

  const isVictory = result.winner === 'me';
  const isDraw = result.winner === 'draw';
  const ratingChangeAbs = Math.abs(result.ratingChange);
  const leagueChanged = result.newLeague !== result.oldLeague;
  const promoted = leagueChanged && result.winner === 'me';
  const demoted = leagueChanged && result.winner === 'opponent';

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        {/* Resultado */}
        <div className="text-center mb-6">
          <div className={`text-6xl mb-2 ${
            isVictory ? 'animate-bounce' : ''
          }`}>
            {isVictory ? '🏆' : isDraw ? '🤝' : '😔'}
          </div>
          <h2 className={`text-3xl font-black mb-2 ${
            isVictory ? 'text-green-400' : isDraw ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {isVictory ? '¡Victoria!' : isDraw ? '¡Empate!' : 'Derrota'}
          </h2>
          {leagueChanged && (
            <div className={`text-lg font-bold ${
              promoted ? 'text-purple-400' : 'text-orange-400'
            }`}>
              {promoted ? `🎉 ¡Ascendiste a ${result.newLeague}!` : `⬇️ Bajaste a ${result.newLeague}`}
            </div>
          )}
        </div>

        {/* Comparativa de jugadores */}
        <div className="bg-gradient-to-r from-neutral-800/50 to-neutral-800/30 rounded-xl p-5 mb-6 border border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-3xl shadow-lg ring-4 ring-green-500/30">
                  {myData.avatar}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {isVictory ? '👑' : ''}
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-white">{myData.name}</div>
                <div className="text-xs text-neutral-400">Tú</div>
              </div>
            </div>
            <div className="text-3xl font-black text-green-400">
              {result.myScore}
            </div>
          </div>

          <div className="relative h-px bg-neutral-700 my-3">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-900 px-2 text-xs text-neutral-500 font-bold">
              VS
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-3xl shadow-lg ring-4 ring-blue-500/30">
                  {opponentData.avatar}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {result.winner === 'opponent' ? '👑' : ''}
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-white">{opponentData.name}</div>
                <div className="text-xs text-neutral-400">Rival</div>
              </div>
            </div>
            <div className="text-3xl font-black text-blue-400">
              {result.opponentScore}
            </div>
          </div>
        </div>

        {/* Cambio de rating */}
        <div className="bg-gradient-to-r from-neutral-800/50 to-neutral-800/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-400">Rating anterior</span>
            <span className="text-white font-bold">{result.oldRating}</span>
          </div>
          
          <div className="flex items-center justify-center my-3">
            <div className={`text-4xl font-black ${
              result.ratingChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {result.ratingChange >= 0 ? '+' : ''}{result.ratingChange}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-400">Nuevo rating</span>
            <span className="text-white font-bold text-xl">{result.newRating}</span>
          </div>
        </div>

        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-neutral-800/30 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">
              {isVictory ? '📈' : isDraw ? '➡️' : '📉'}
            </div>
            <div className="text-xs text-neutral-400">Resultado</div>
          </div>
          <div className="bg-neutral-800/30 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-white mb-1">
              {result.newLeague}
            </div>
            <div className="text-xs text-neutral-400">Liga</div>
          </div>
        </div>

        {/* Botones */}
        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
          >
            Jugar de nuevo
          </button>
          <button
            onClick={onContinue}
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-3 rounded-xl transition-all active:scale-95"
          >
            Volver a Ranked
          </button>
        </div>
      </div>
    </div>
  );
};

export default RankedMatchSummary;

