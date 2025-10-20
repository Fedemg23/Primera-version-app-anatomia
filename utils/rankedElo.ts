import { League } from '../types';

/**
 * Calcula el rating esperado (expectativa) usando la fórmula ELO
 * @param myRating - Rating del jugador
 * @param opponentRating - Rating del oponente
 * @returns Expectativa (0-1)
 */
export function calculateExpectedScore(myRating: number, opponentRating: number): number {
  return 1 / (1 + Math.pow(10, (opponentRating - myRating) / 400));
}

/**
 * Calcula el factor K dinámico basado en racha y liga
 * @param streak - Racha actual del jugador
 * @param league - Liga actual
 * @param provisionalGames - Número de partidas de colocación restantes
 * @returns Factor K
 */
export function calculateKFactor(
  streak: number = 0, 
  league: League = 'Bronce',
  provisionalGames: number = 0
): number {
  // Durante partidas provisionales, K más alto
  if (provisionalGames < 10) {
    return 40;
  }

  // K base según liga
  let baseK = 30;
  
  switch (league) {
    case 'Diamante':
      baseK = 25; // Más estable en ligas altas
      break;
    case 'Esmeralda':
    case 'Rubí':
      baseK = 28;
      break;
    default:
      baseK = 30;
  }

  // Bonus por racha (máximo +10)
  const streakBonus = Math.min(10, Math.abs(streak));
  
  return baseK + streakBonus;
}

/**
 * Obtiene los límites de delta según la liga
 * @param league - Liga actual
 * @returns [min, max] límites de delta
 */
export function getDeltaLimits(league: League): [number, number] {
  switch (league) {
    case 'Diamante':
      return [-35, 35];
    case 'Esmeralda':
    case 'Rubí':
      return [-30, 30];
    case 'Oro':
      return [-25, 25];
    default: // Bronce, Plata
      return [-18, 18];
  }
}

/**
 * Protección para jugadores provisionales
 * @param delta - Delta calculado
 * @param provisionalGames - Partidas provisionales restantes
 * @returns Delta ajustado
 */
export function applyProvisionalProtection(delta: number, provisionalGames: number): number {
  if (provisionalGames >= 10) return delta;
  
  // No perder más de -12 durante provisional
  if (delta < 0) {
    return Math.max(delta, -12);
  }
  
  return delta;
}

/**
 * Calcula el delta de rating después de un match
 * @param myRating - Rating actual
 * @param opponentRating - Rating del oponente
 * @param outcome - Resultado: 1 (victoria), 0 (derrota), 0.5 (empate)
 * @param streak - Racha actual
 * @param league - Liga actual
 * @param provisionalGames - Partidas provisionales restantes
 * @param margin - Margen de victoria (opcional, para ajuste por puntos)
 * @returns Delta de rating
 */
export function calculateRatingDelta(
  myRating: number,
  opponentRating: number,
  outcome: number, // 1 = win, 0 = loss, 0.5 = draw
  streak: number = 0,
  league: League = 'Bronce',
  provisionalGames: number = 0,
  margin: number = 0
): number {
  // Calcular expectativa
  const expected = calculateExpectedScore(myRating, opponentRating);
  
  // Factor K dinámico
  const K = calculateKFactor(streak, league, provisionalGames);
  
  // Delta base
  let delta = K * (outcome - expected);
  
  // Ajuste por margen (si aplicable)
  if (margin > 0) {
    const marginMultiplier = Math.min(1.5, 1 + margin / 10);
    delta *= marginMultiplier;
  }
  
  // Aplicar límites por liga
  const [minDelta, maxDelta] = getDeltaLimits(league);
  delta = Math.max(minDelta, Math.min(maxDelta, delta));
  
  // Protección provisional
  delta = applyProvisionalProtection(delta, provisionalGames);
  
  // Redondear
  return Math.round(delta);
}

/**
 * Determina la liga según el rating
 * @param rating - Rating actual
 * @returns Liga correspondiente
 */
export function getLeagueFromRating(rating: number): League {
  if (rating >= 2800) return 'Diamante';
  if (rating >= 2400) return 'Esmeralda';
  if (rating >= 2000) return 'Rubí';
  if (rating >= 1500) return 'Oro';
  if (rating >= 1000) return 'Plata';
  return 'Bronce';
}

/**
 * Obtiene el rango mínimo de rating para una liga
 * @param league - Liga
 * @returns Rating mínimo
 */
export function getLeagueMinRating(league: League): number {
  switch (league) {
    case 'Diamante': return 2800;
    case 'Esmeralda': return 2400;
    case 'Rubí': return 2000;
    case 'Oro': return 1500;
    case 'Plata': return 1000;
    case 'Bronce': return 0;
  }
}

/**
 * Calcula el percentil aproximado basado en distribución normal
 * Asume media 1200, desviación estándar 300
 * @param rating - Rating del jugador
 * @returns Percentil (0-100)
 */
export function calculatePercentile(rating: number): number {
  const mean = 1200;
  const stdDev = 300;
  
  // Normalizar
  const z = (rating - mean) / stdDev;
  
  // Aproximación del CDF de la normal estándar
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  
  const percentile = z >= 0 ? (1 - probability) * 100 : probability * 100;
  
  return Math.max(0, Math.min(100, Math.round(percentile * 10) / 10));
}

/**
 * Calcula el rango de búsqueda de matchmaking
 * @param rating - Rating del jugador
 * @param waitTime - Tiempo de espera en segundos
 * @returns [min, max] rango de búsqueda
 */
export function getMatchmakingRange(rating: number, waitTime: number = 0): [number, number] {
  // Rango base: ±50
  let range = 50;
  
  // Expandir rango cada 10 segundos (+25 por cada 10s)
  range += Math.floor(waitTime / 10) * 25;
  
  // Máximo rango: ±200
  range = Math.min(200, range);
  
  const min = Math.max(0, rating - range);
  const max = rating + range;
  
  return [min, max];
}

/**
 * Calcula las recompensas de fin de temporada según la liga
 * @param league - Liga final
 * @returns Recompensas { bones, frame, title }
 */
export function getSeasonRewards(league: League): { bones: number; frame: string; title?: string } {
  switch (league) {
    case 'Diamante':
      return { bones: 2500, frame: 'diamond_animated', title: 'Maestro del Cuerpo Humano' };
    case 'Esmeralda':
      return { bones: 1800, frame: 'emerald_animated' };
    case 'Rubí':
      return { bones: 1200, frame: 'ruby_crystal' };
    case 'Oro':
      return { bones: 700, frame: 'gold_engraved' };
    case 'Plata':
      return { bones: 300, frame: 'silver_polished' };
    case 'Bronce':
      return { bones: 100, frame: 'bronze_static' };
  }
}

/**
 * Calcula el decay (decaimiento) por inactividad
 * @param lastMatchDate - Fecha del último match (ISO string)
 * @param currentRating - Rating actual
 * @returns Rating perdido por decay
 */
export function calculateDecay(lastMatchDate: string, currentRating: number): number {
  const lastMatch = new Date(lastMatchDate);
  const now = new Date();
  const daysSinceLastMatch = Math.floor((now.getTime() - lastMatch.getTime()) / (1000 * 60 * 60 * 24));
  
  // Sin decay si jugó en los últimos 14 días
  if (daysSinceLastMatch < 14) return 0;
  
  // -10 por cada semana de inactividad
  const weeksSinceLastMatch = Math.floor((daysSinceLastMatch - 14) / 7);
  const decay = weeksSinceLastMatch * 10;
  
  // No decaer por debajo de 800 (protección base)
  const maxDecay = Math.max(0, currentRating - 800);
  
  return Math.min(decay, maxDecay);
}

/**
 * Aplica reset de temporada al rating
 * @param rating - Rating actual
 * @param league - Liga alcanzada
 * @returns Nuevo rating después del reset
 */
export function applySeasonReset(rating: number, league: League): number {
  // Reset del 30% pero conserva liga base
  const resetRating = Math.floor(rating * 0.7);
  const leagueMin = getLeagueMinRating(league);
  
  // No bajar por debajo del mínimo de la liga alcanzada
  return Math.max(leagueMin, resetRating);
}






