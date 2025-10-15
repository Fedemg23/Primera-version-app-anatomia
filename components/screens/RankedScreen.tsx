import React, { useState, useEffect, memo } from 'react';
import { RankedScreenProps, League, MatchMode, RankedLeaderboardEntry, MatchRecord } from '../../types';
import { 
  calculatePercentile, 
  getLeagueMinRating,
  getSeasonRewards,
  getMatchmakingRange
} from '../../utils/rankedElo';
import { 
  getRankedLeaderboard, 
  getMatchHistory,
  getUserRankedPosition,
  listFriendsUserIds
} from '../../services/firestore';
import { useAudio } from '../../src/contexts/AudioProvider';
import AvatarImage from '../AvatarImage';

interface LeagueEmblemProps {
  league: League;
  size?: 'sm' | 'md' | 'lg';
}

const LeagueEmblem: React.FC<LeagueEmblemProps> = memo(({ league, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const colors = {
    'Bronce': 'from-amber-700 via-amber-600 to-amber-800',
    'Plata': 'from-gray-300 via-gray-200 to-gray-400',
    'Oro': 'from-yellow-400 via-yellow-300 to-yellow-500',
    'Rubí': 'from-red-600 via-red-500 to-pink-600',
    'Esmeralda': 'from-emerald-500 via-teal-400 to-emerald-600',
    'Diamante': 'from-blue-400 via-cyan-300 to-purple-400'
  };

  return (
    <div className={`${sizeClasses[size]} relative rounded-full bg-black shadow-2xl flex items-center justify-center`}>
      {/* Anillo exterior con gradiente de la liga */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors[league]} opacity-90`}></div>
      
      {/* Centro negro */}
      <div className="absolute inset-2 rounded-full bg-black shadow-inner"></div>
      
      {/* Texto de la liga */}
      <span className="relative z-10 text-white font-black text-xs">
        {league.charAt(0)}
      </span>
    </div>
  );
});

const RankedScreen: React.FC<RankedScreenProps> = ({ 
  userData, 
  rankedProfile, 
  onNavigate, 
  onStartMatchmaking 
}) => {
  const { playSound } = useAudio();
  const [activeTab, setActiveTab] = useState<'global' | 'country' | 'friends'>('global');
  const [leaderboard, setLeaderboard] = useState<RankedLeaderboardEntry[]>([]);
  const [matchHistory, setMatchHistory] = useState<MatchRecord[]>([]);
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [selectedMode, setSelectedMode] = useState<MatchMode>('Clasico');
  const [loading, setLoading] = useState(true);
  const [showRules, setShowRules] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    if (!rankedProfile) return;
    
    setLoading(true);
    try {
      // Cargar leaderboard
      let friendIds: string[] = [];
      if (activeTab === 'friends') {
        friendIds = await listFriendsUserIds(rankedProfile.userId);
      }

      const board = await getRankedLeaderboard(
        activeTab,
        undefined,
        activeTab === 'friends' ? friendIds : undefined
      );
      setLeaderboard(board);

      // Cargar historial de matches
      const history = await getMatchHistory(rankedProfile.userId, 10);
      setMatchHistory(history);

      // Obtener posición del usuario
      const position = await getUserRankedPosition(rankedProfile.userId);
      setUserPosition(position);
    } catch (error) {
      console.error('Error cargando datos ranked:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!rankedProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Cargando perfil ranked...</p>
        </div>
      </div>
    );
  }

  const percentile = calculatePercentile(rankedProfile.rating);
  const leagueMin = getLeagueMinRating(rankedProfile.league);
  const nextLeagueMin = rankedProfile.league === 'Diamante' ? 3000 : getLeagueMinRating(
    rankedProfile.league === 'Esmeralda' ? 'Diamante' :
    rankedProfile.league === 'Rubí' ? 'Esmeralda' :
    rankedProfile.league === 'Oro' ? 'Rubí' :
    rankedProfile.league === 'Plata' ? 'Oro' : 'Plata'
  );
  const progressInLeague = Math.min(100, ((rankedProfile.rating - leagueMin) / (nextLeagueMin - leagueMin)) * 100);

  const avgDelta = matchHistory.length > 0 
    ? Math.round(matchHistory.slice(0, 10).reduce((sum, m) => {
        const delta = m.p1.userId === rankedProfile.userId ? m.p1.delta : m.p2.delta;
        return sum + delta;
      }, 0) / Math.min(10, matchHistory.length))
    : 0;

  const handleStartMatchmaking = () => {
    playSound('button-click');
    onStartMatchmaking(selectedMode);
  };

  const handleTabChange = (tab: 'global' | 'country' | 'friends') => {
    playSound('button-click');
    setActiveTab(tab);
  };

  return (
    <div className="mx-auto max-w-5xl p-4 space-y-6 pb-24">
      {/* Header competitivo */}
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LeagueEmblem league={rankedProfile.league} size="lg" />
          <div>
            <h1 className="text-2xl font-black text-white">Ranked</h1>
            <p className="text-sm text-neutral-400">
              Temporada VII · {rankedProfile.provisionalGames > 0 ? 'Colocación' : rankedProfile.league}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-white">
            R: {rankedProfile.rating.toLocaleString()}
          </div>
          <div className="text-sm text-neutral-400 flex items-center justify-end gap-2">
            {rankedProfile.provisionalGames === 0 ? (
              <>
                <span>Top {percentile.toFixed(1)}%</span>
                {rankedProfile.streak !== 0 && (
                  <span className={rankedProfile.streak > 0 ? 'text-green-400' : 'text-red-400'}>
                    🔥 {Math.abs(rankedProfile.streak)}x
                  </span>
                )}
              </>
            ) : (
              <span>Provisional {10 - rankedProfile.provisionalGames}/10</span>
            )}
          </div>
          {avgDelta !== 0 && (
            <div className={`text-xs ${avgDelta > 0 ? 'text-green-400' : 'text-red-400'}`}>
              Promedio: {avgDelta > 0 ? '+' : ''}{avgDelta} / partida
            </div>
          )}
        </div>
      </section>

      {/* Acciones rápidas */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={handleStartMatchmaking}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 p-4 font-bold text-white shadow-lg transition-all active:scale-95 touch-manipulation"
        >
          Jugar Ranked
          <div className="text-xs font-normal opacity-80 mt-1">PvP real - Esperando rival</div>
        </button>
        <button
          onClick={() => playSound('button-click')}
          className="rounded-xl border border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 p-4 text-white transition-all active:scale-95 touch-manipulation"
        >
          Entrenamiento 1v1
          <div className="text-xs opacity-60 mt-1">Sin impacto en rating</div>
        </button>
        <button
          onClick={() => setShowRules(true)}
          className="rounded-xl border border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 p-4 text-white transition-all active:scale-95 touch-manipulation"
        >
          Reglas
          <div className="text-xs opacity-60 mt-1">Cómo funciona Ranked</div>
        </button>
      </section>

      {/* Selector de modo */}
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-xl p-5">
        <h3 className="font-bold text-white mb-3">Modo de juego</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(['Clasico', 'Ataque', 'Robo', 'ImagenClick', 'MuerteSubita'] as MatchMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => {
                playSound('button-click');
                setSelectedMode(mode);
              }}
              className={`rounded-lg p-3 text-sm font-medium transition-all ${
                selectedMode === mode
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </section>

      {/* Panel de temporada */}
      {rankedProfile.provisionalGames === 0 && (
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white">Progreso de Temporada</h2>
            <span className="text-sm text-neutral-400">
              {rankedProfile.rating} / {nextLeagueMin}
            </span>
          </div>
          <div className="relative h-3 rounded-full bg-neutral-800 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 transition-all duration-700"
              style={{ width: `${progressInLeague}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-neutral-500">
            <span>{leagueMin}</span>
            {rankedProfile.league !== 'Diamante' && <span>{nextLeagueMin}</span>}
          </div>
          
          {/* Recompensas de liga */}
          <div className="mt-4 p-4 rounded-lg bg-black/40 border border-neutral-700">
            <h4 className="text-sm font-bold text-white mb-2">Recompensas de {rankedProfile.league}</h4>
            <div className="flex items-center gap-3 text-sm text-neutral-300">
              <span>🦴 {getSeasonRewards(rankedProfile.league).bones} Huesitos</span>
              <span>🖼️ Marco {rankedProfile.league}</span>
              {getSeasonRewards(rankedProfile.league).title && (
                <span className="text-purple-400">✨ {getSeasonRewards(rankedProfile.league).title}</span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Últimos duelos */}
      {matchHistory.length > 0 && (
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-xl p-5">
          <h3 className="font-bold text-white mb-3">Últimos duelos</h3>
          <div className="space-y-2">
            {matchHistory.slice(0, 5).map((match) => {
              const isP1 = match.p1.userId === rankedProfile.userId;
              const myData = isP1 ? match.p1 : match.p2;
              const opponentData = isP1 ? match.p2 : match.p1;
              const won = (match.outcome === 'p1' && isP1) || (match.outcome === 'p2' && !isP1);
              const draw = match.outcome === 'draw';

              return (
                <div 
                  key={match.matchId}
                  className="flex items-center justify-between p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <AvatarImage avatarId={opponentData.avatar || 'novice'} size="sm" />
                    <div className="flex-1">
                      <div className="text-sm text-white font-medium">
                        vs {opponentData.name || 'Anónimo'}
                      </div>
                      <div className="text-xs text-neutral-400">
                        {match.mode} · {new Date(match.finishedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${
                      draw ? 'text-neutral-400' : won ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {draw ? 'Empate' : won ? 'Victoria' : 'Derrota'}
                    </div>
                    <div className={`text-lg font-black ${
                      myData.delta >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {myData.delta >= 0 ? '+' : ''}{myData.delta}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Clasificación / Leaderboard */}
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white">Clasificación</h3>
          <div className="flex gap-2">
            {(['global', 'friends'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`text-sm rounded-lg px-3 py-1.5 font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'border border-neutral-700 text-neutral-400 hover:text-white'
                }`}
              >
                {tab === 'global' ? 'Global' : 'Amigos'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-neutral-400 text-sm">Cargando clasificación...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-8 text-neutral-400">
            {activeTab === 'friends' ? 'No tienes amigos jugando Ranked aún' : 'No hay datos disponibles'}
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.slice(0, 20).map((entry, idx) => {
              const isCurrentUser = entry.userId === rankedProfile.userId;
              return (
                <div
                  key={entry.userId}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    isCurrentUser 
                      ? 'bg-blue-600/20 border border-blue-500/50' 
                      : 'bg-neutral-800/30 hover:bg-neutral-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-sm font-bold text-neutral-400 w-8">
                      #{entry.rank || idx + 1}
                    </div>
                    <AvatarImage avatarId={entry.avatar} size="sm" />
                    <div className="flex-1">
                      <div className="text-sm text-white font-medium">
                        {entry.name}
                        {isCurrentUser && <span className="ml-2 text-xs text-blue-400">(Tú)</span>}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <LeagueEmblem league={entry.league} size="sm" />
                        <span>{entry.league}</span>
                        {entry.streak > 0 && <span className="text-orange-400">🔥 {entry.streak}x</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-white">
                      {entry.rating.toLocaleString()}
                    </div>
                    <div className="text-xs text-neutral-400">Rating</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tu posición si no está en top 20 */}
        {userPosition && userPosition > 20 && (
          <div className="mt-4 pt-4 border-t border-neutral-700">
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-600/20 border border-blue-500/50">
              <div className="flex items-center gap-3">
                <div className="text-sm font-bold text-neutral-300">#{userPosition}</div>
                <AvatarImage avatarId={userData.avatar} size="sm" />
                <div>
                  <div className="text-sm text-white font-medium">{userData.name} (Tú)</div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <LeagueEmblem league={rankedProfile.league} size="sm" />
                    <span>{rankedProfile.league}</span>
                  </div>
                </div>
              </div>
              <div className="text-lg font-black text-white">
                {rankedProfile.rating.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Modal de reglas */}
      {showRules && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setShowRules(false)}
        >
          <div 
            className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-black text-white mb-4">Reglas de Ranked</h2>
            
            <div className="space-y-4 text-neutral-300">
              <div>
                <h3 className="font-bold text-white mb-2">🎮 Cómo funciona</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Compite 1v1 contra otros jugadores en tiempo real</li>
                  <li>Gana o pierde <strong>Eritros</strong> (rating) según el resultado</li>
                  <li>Asciende de liga alcanzando los requisitos de rating</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-white mb-2">📊 Sistema de Rating</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Primeras 10 partidas son de <strong>colocación</strong> (provisional)</li>
                  <li>Ganar a un rival superior da más rating</li>
                  <li>Las rachas aumentan las ganancias/pérdidas</li>
                  <li>Cada liga tiene límites de cambio de rating por partida</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-white mb-2">🏆 Ligas y Requisitos</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <LeagueEmblem league="Bronce" size="sm" />
                    <span>Bronce: 0-999</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LeagueEmblem league="Plata" size="sm" />
                    <span>Plata: 1000-1499</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LeagueEmblem league="Oro" size="sm" />
                    <span>Oro: 1500-1999</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LeagueEmblem league="Rubí" size="sm" />
                    <span>Rubí: 2000-2399</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LeagueEmblem league="Esmeralda" size="sm" />
                    <span>Esmeralda: 2400-2799</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LeagueEmblem league="Diamante" size="sm" />
                    <span>Diamante: 2800+</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-white mb-2">⚠️ Reglas importantes</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Abandonar causa pérdida automática y penalización</li>
                  <li>30 segundos para reconectar en caso de desconexión</li>
                  <li>Inactividad de 14+ días causa decaimiento de rating (-10/semana)</li>
                  <li>Al final de temporada, rating resetea -30% (mínimo tu liga base)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-white mb-2">🎁 Recompensas</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Marcos de perfil exclusivos por liga alcanzada</li>
                  <li>Huesitos según tu liga final de temporada</li>
                  <li>Títulos especiales para las ligas más altas</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowRules(false)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors"
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(RankedScreen);


