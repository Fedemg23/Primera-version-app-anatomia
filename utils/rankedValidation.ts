/**
 * Utilidades de validación para el sistema Ranked
 * Previene trampas y comportamiento sospechoso
 */

import { QuestionData } from '../types';

/**
 * Valida que el tiempo de respuesta sea realista
 * @param timeUsed - Tiempo usado en segundos
 * @returns true si es válido
 */
export function validateAnswerTime(timeUsed: number): boolean {
  // Mínimo 0.5 segundos (no puede ser instantáneo)
  // Máximo 20 segundos (límite de tiempo por pregunta)
  return timeUsed >= 0.5 && timeUsed <= 20;
}

/**
 * Valida que las respuestas sean consistentes con el progreso
 * @param answers - Array de respuestas
 * @param currentQuestionIndex - Índice actual de pregunta
 * @returns true si es válido
 */
export function validateAnswerSequence(
  answers: boolean[],
  currentQuestionIndex: number
): boolean {
  // El número de respuestas debe coincidir con el índice
  return answers.length === currentQuestionIndex;
}

/**
 * Valida que el score sea consistente con las respuestas
 * @param answers - Array de respuestas
 * @param score - Score reportado
 * @returns true si es válido
 */
export function validateScore(answers: boolean[], score: number): boolean {
  const expectedScore = answers.filter(a => a).length;
  return score === expectedScore;
}

/**
 * Detecta patrones sospechosos de respuestas
 * @param answers - Array de respuestas
 * @param times - Array de tiempos
 * @returns objeto con flags de sospecha
 */
export function detectSuspiciousPatterns(
  answers: boolean[],
  times: number[]
): {
  tooFast: boolean;
  tooAccurate: boolean;
  uniformTiming: boolean;
  suspicious: boolean;
} {
  if (answers.length === 0) {
    return {
      tooFast: false,
      tooAccurate: false,
      uniformTiming: false,
      suspicious: false
    };
  }

  // Calcular accuracy
  const accuracy = answers.filter(a => a).length / answers.length;
  
  // Calcular tiempo promedio
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  
  // Calcular desviación estándar de tiempos
  const stdDev = Math.sqrt(
    times.reduce((sq, n) => sq + Math.pow(n - avgTime, 2), 0) / times.length
  );

  // Flags de sospecha
  const tooFast = avgTime < 2; // Promedio < 2 segundos es sospechoso
  const tooAccurate = accuracy > 0.95 && answers.length >= 5; // > 95% en 5+ preguntas
  const uniformTiming = stdDev < 0.5 && times.length >= 5; // Tiempos muy uniformes

  return {
    tooFast,
    tooAccurate,
    uniformTiming,
    suspicious: tooFast || (tooAccurate && uniformTiming)
  };
}

/**
 * Valida que el índice de respuesta sea válido para la pregunta
 * @param answerIndex - Índice de respuesta seleccionada
 * @param question - Datos de la pregunta
 * @returns true si es válido
 */
export function validateAnswerIndex(
  answerIndex: number | null,
  question: QuestionData
): boolean {
  if (answerIndex === null) return true; // Timeout es válido
  return answerIndex >= 0 && answerIndex < question.opciones.length;
}

/**
 * Valida el cambio de rating propuesto
 * @param oldRating - Rating anterior
 * @param newRating - Rating nuevo
 * @param maxDelta - Delta máximo permitido
 * @returns true si es válido
 */
export function validateRatingChange(
  oldRating: number,
  newRating: number,
  maxDelta: number = 50
): boolean {
  const delta = Math.abs(newRating - oldRating);
  return delta <= maxDelta;
}

/**
 * Calcula una "firma" de la partida para verificación
 * @param matchId - ID de la partida
 * @param p1UserId - ID jugador 1
 * @param p2UserId - ID jugador 2
 * @param timestamp - Timestamp de inicio
 * @returns firma hash
 */
export function calculateMatchSignature(
  matchId: string,
  p1UserId: string,
  p2UserId: string,
  timestamp: number
): string {
  // Crear firma simple (en producción usar crypto.subtle.digest)
  const data = `${matchId}:${p1UserId}:${p2UserId}:${timestamp}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Valida que el heartbeat no sea manipulado
 * @param lastHeartbeat - Timestamp del último heartbeat
 * @param now - Timestamp actual
 * @returns true si es válido
 */
export function validateHeartbeat(lastHeartbeat: number, now: number): boolean {
  const diff = now - lastHeartbeat;
  // Heartbeat debe estar entre 1-10 segundos (enviamos cada 3s)
  return diff >= 1000 && diff <= 10000;
}

/**
 * Detecta si un jugador está usando scripts/bots
 * @param answers - Respuestas del jugador
 * @param times - Tiempos de respuesta
 * @param correctAnswers - Array de índices correctos
 * @returns score de probabilidad de bot (0-100)
 */
export function detectBotBehavior(
  answers: boolean[],
  times: number[],
  correctAnswers: number[]
): number {
  if (answers.length < 5) return 0; // Necesitamos más datos

  let botScore = 0;

  // 1. Precisión inhumana (100% correcto)
  const accuracy = answers.filter(a => a).length / answers.length;
  if (accuracy === 1.0) botScore += 30;

  // 2. Tiempos demasiado consistentes
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const variance = times.reduce((sum, t) => sum + Math.pow(t - avgTime, 2), 0) / times.length;
  if (variance < 0.1) botScore += 25; // Muy poca variación

  // 3. Tiempos demasiado rápidos consistentemente
  const fastAnswers = times.filter(t => t < 1.5).length;
  if (fastAnswers / times.length > 0.8) botScore += 30;

  // 4. Patrón de respuesta perfecto en preguntas difíciles
  // (esto requeriría metadatos de dificultad)

  // 5. No hay errores de UI (siempre responde exactamente a tiempo)
  const timeoutsOrErrors = answers.length - times.filter(t => t > 0.1).length;
  if (timeoutsOrErrors === 0 && answers.length >= 10) botScore += 15;

  return Math.min(100, botScore);
}

/**
 * Sanitiza el nombre de usuario para prevenir inyecciones
 * @param name - Nombre a sanitizar
 * @returns nombre sanitizado
 */
export function sanitizeUsername(name: string): string {
  // Remover caracteres especiales peligrosos
  return name
    .replace(/[<>\"']/g, '') // Prevenir XSS
    .replace(/\s+/g, ' ') // Normalizar espacios
    .trim()
    .slice(0, 20); // Límite de longitud
}

/**
 * Valida que un matchId sea legítimo
 * @param matchId - ID a validar
 * @returns true si es válido
 */
export function validateMatchId(matchId: string): boolean {
  // Debe seguir el formato: match_timestamp_uid1_uid2
  const pattern = /^match_\d+_[\w-]+_[\w-]+$/;
  return pattern.test(matchId);
}

/**
 * Rate limiting simple para prevenir spam
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(
    private maxAttempts: number = 10,
    private windowMs: number = 60000 // 1 minuto
  ) {}

  /**
   * Verifica si la acción está permitida
   * @param key - Identificador único (ej: userId)
   * @returns true si está permitido
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Filtrar intentos dentro de la ventana
    const recentAttempts = attempts.filter(t => now - t < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Agregar intento actual
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true;
  }

  /**
   * Limpia intentos antiguos
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, attempts] of this.attempts.entries()) {
      const recent = attempts.filter(t => now - t < this.windowMs);
      if (recent.length === 0) {
        this.attempts.delete(key);
      } else {
        this.attempts.set(key, recent);
      }
    }
  }
}

// Rate limiters globales
export const matchmakingRateLimiter = new RateLimiter(5, 30000); // 5 intentos por 30s
export const answerRateLimiter = new RateLimiter(20, 60000); // 20 respuestas por minuto

// Limpieza periódica cada 5 minutos
if (typeof window !== 'undefined') {
  setInterval(() => {
    matchmakingRateLimiter.cleanup();
    answerRateLimiter.cleanup();
  }, 5 * 60 * 1000);
}

