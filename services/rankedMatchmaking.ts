import { getFirestore, collection, doc, setDoc, onSnapshot, query, where, orderBy, limit, getDocs, updateDoc, deleteDoc, Timestamp, Unsubscribe } from 'firebase/firestore';
import { getDb } from './firebase';
import { MatchMode, League, QuestionData } from '../types';
import { getMatchmakingRange } from '../utils/rankedElo';
import { questionBank } from '../constants';

export interface MatchmakingEntry {
  userId: string;
  name: string;
  avatar: string;
  rating: number;
  league: League;
  mode: MatchMode;
  timestamp: any;
  status: 'searching' | 'matched' | 'cancelled';
  matchId?: string;
}

export interface ActiveMatch {
  matchId: string;
  mode: MatchMode;
  p1: {
    userId: string;
    name: string;
    avatar: string;
    rating: number;
    league: League;
    ready: boolean;
    currentQuestionIndex: number;
    answers: boolean[];
    times: number[];
    score: number;
    connected: boolean;
    lastHeartbeat: any;
  };
  p2: {
    userId: string;
    name: string;
    avatar: string;
    rating: number;
    league: League;
    ready: boolean;
    currentQuestionIndex: number;
    answers: boolean[];
    times: number[];
    score: number;
    connected: boolean;
    lastHeartbeat: any;
  };
  questions: QuestionData[];
  status: 'waiting' | 'active' | 'finished';
  startedAt?: any;
  finishedAt?: any;
  winner?: 'p1' | 'p2' | 'draw';
}

// Sistema de matchmaking PvP real - Sin timeout, espera indefinida hasta encontrar rival real
const HEARTBEAT_INTERVAL = 3000; // 3 segundos
const DISCONNECT_TIMEOUT = 30000; // 30 segundos - Para detección de desconexión durante partida

/**
 * Agrega al usuario a la cola de matchmaking
 */
export const joinMatchmakingQueue = async (
  userId: string,
  name: string,
  avatar: string,
  rating: number,
  league: League,
  mode: MatchMode
): Promise<string> => {
  try {
    const db = getDb();
    if (!db) throw new Error('Firestore no disponible');

    const queueId = `${userId}_${Date.now()}`;
    const entry: MatchmakingEntry = {
      userId,
      name,
      avatar,
      rating,
      league,
      mode,
      timestamp: Timestamp.now(),
      status: 'searching'
    };

    await setDoc(doc(db, 'matchmakingQueue', queueId), entry);
    return queueId;
  } catch (error) {
    console.error('Error uniéndose a la cola:', error);
    throw error;
  }
};

/**
 * Sale de la cola de matchmaking
 */
export const leaveMatchmakingQueue = async (queueId: string): Promise<void> => {
  try {
    const db = getDb();
    if (!db) return;

    await deleteDoc(doc(db, 'matchmakingQueue', queueId));
  } catch (error) {
    console.error('Error saliendo de la cola:', error);
  }
};

/**
 * Limpia entradas obsoletas de la cola (usuarios que se desconectaron sin cancelar)
 */
const cleanupStaleQueueEntries = async (db: any): Promise<void> => {
  try {
    const STALE_THRESHOLD = 30000; // 30 segundos
    const staleTimestamp = Timestamp.fromMillis(Date.now() - STALE_THRESHOLD);

    // Buscar entradas antiguas
    const staleQuery = query(
      collection(db, 'matchmakingQueue'),
      where('timestamp', '<', staleTimestamp)
    );

    const staleSnapshot = await getDocs(staleQuery);
    
    // Eliminar entradas obsoletas
    const deletions = staleSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletions);

    if (deletions.length > 0) {
      console.log(`🧹 Limpiadas ${deletions.length} entradas obsoletas de la cola`);
    }
  } catch (error) {
    console.error('Error limpiando cola:', error);
  }
};

/**
 * Busca un rival REAL compatible y crea una partida
 * 
 * IMPORTANTE: Este sistema es 100% PvP (Player vs Player)
 * - NO hay bots ni oponentes simulados
 * - NO hay timeout - espera indefinidamente hasta encontrar un rival real
 * - Solo empareja jugadores reales que estén buscando partida al mismo tiempo
 */
export const findMatch = async (
  myQueueId: string,
  myEntry: MatchmakingEntry
): Promise<string | null> => {
  try {
    const db = getDb();
    if (!db) throw new Error('Firestore no disponible');

    // PASO 1: Limpiar entradas obsoletas (más de 30 segundos sin actualizar)
    await cleanupStaleQueueEntries(db);

    // PASO 2: Calcular rango de búsqueda
    const [minRating, maxRating] = getMatchmakingRange(myEntry.rating, 0);

    // PASO 3: Buscar oponentes compatibles - usando solo >= para evitar error de índice
    const q = query(
      collection(db, 'matchmakingQueue'),
      where('mode', '==', myEntry.mode),
      where('status', '==', 'searching'),
      where('rating', '>=', minRating),
      orderBy('rating'),
      orderBy('timestamp'),
      limit(50) // Aumentar límite para filtrar después
    );

    const snapshot = await getDocs(q);
    
    // PASO 4: Buscar el mejor rival (excluyéndome a mí mismo y filtrando por maxRating)
    // También verificar que la entrada sea reciente (menos de 30 segundos)
    let bestOpponent: { id: string; data: MatchmakingEntry } | null = null;
    const now = Date.now();
    const MAX_ENTRY_AGE = 30000; // 30 segundos
    
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data() as MatchmakingEntry;
      
      // Calcular antigüedad de la entrada
      const entryAge = now - (data.timestamp?.toMillis() || 0);
      
      // Filtrar por: maxRating, no ser yo mismo, status activo, y entrada reciente
      if (data.userId !== myEntry.userId && 
          data.status === 'searching' && 
          data.rating <= maxRating &&
          entryAge < MAX_ENTRY_AGE) {
        bestOpponent = { id: docSnap.id, data };
        break;
      }
    }

    if (!bestOpponent) return null;

    // Crear la partida
    const matchId = `match_${Date.now()}_${myEntry.userId}_${bestOpponent.data.userId}`;
    
    // Seleccionar preguntas aleatorias
    const selectedQuestions = selectRandomQuestions(myEntry.mode, 10);

    const match: ActiveMatch = {
      matchId,
      mode: myEntry.mode,
      p1: {
        userId: myEntry.userId,
        name: myEntry.name,
        avatar: myEntry.avatar,
        rating: myEntry.rating,
        league: myEntry.league,
        ready: false,
        currentQuestionIndex: 0,
        answers: [],
        times: [],
        score: 0,
        connected: true,
        lastHeartbeat: Timestamp.now()
      },
      p2: {
        userId: bestOpponent.data.userId,
        name: bestOpponent.data.name,
        avatar: bestOpponent.data.avatar,
        rating: bestOpponent.data.rating,
        league: bestOpponent.data.league,
        ready: false,
        currentQuestionIndex: 0,
        answers: [],
        times: [],
        score: 0,
        connected: true,
        lastHeartbeat: Timestamp.now()
      },
      questions: selectedQuestions,
      status: 'waiting'
    };

    // PASO 5: Guardar la partida en activeMatches
    await setDoc(doc(db, 'activeMatches', matchId), match);

    // PASO 6: Actualizar entradas de cola para AMBOS jugadores
    // Esto activará los listeners de ambos jugadores simultáneamente
    await Promise.all([
      updateDoc(doc(db, 'matchmakingQueue', myQueueId), { 
        status: 'matched', 
        matchId 
      }),
      updateDoc(doc(db, 'matchmakingQueue', bestOpponent.id), { 
        status: 'matched', 
        matchId 
      })
    ]);

    console.log(`✅ Match creado: ${matchId}`);
    console.log(`   Jugador 1: ${myEntry.name} (${myEntry.rating})`);
    console.log(`   Jugador 2: ${bestOpponent.data.name} (${bestOpponent.data.rating})`);

    // PASO 7: Limpiar entradas de cola después de 15 segundos
    // (dar tiempo a que ambos jugadores lean el matchId)
    setTimeout(async () => {
      try {
        await Promise.all([
          deleteDoc(doc(db, 'matchmakingQueue', myQueueId)),
          deleteDoc(doc(db, 'matchmakingQueue', bestOpponent!.id))
        ]);
        console.log(`🧹 Limpiadas entradas de cola para match ${matchId}`);
      } catch (error) {
        console.error('Error limpiando cola:', error);
      }
    }, 15000); // Aumentado a 15s para dar más margen

    return matchId;
  } catch (error) {
    console.error('Error buscando partida:', error);
    return null;
  }
};

/**
 * Selecciona preguntas aleatorias según el modo
 */
const selectRandomQuestions = (mode: MatchMode, count: number): QuestionData[] => {
  const allQuestions = [...questionBank];
  
  // Filtrar por dificultad según el modo
  let filteredQuestions = allQuestions;
  
  if (mode === 'MuerteSubita') {
    // Solo preguntas fáciles para muerte súbita
    filteredQuestions = allQuestions.filter(q => q.dificultad === 'Fácil');
  } else if (mode === 'ImagenClick') {
    // Solo preguntas con imagen
    filteredQuestions = allQuestions.filter(q => q.urlImagen);
  }

  // Mezclar y seleccionar
  const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

/**
 * Escucha cambios en la cola de matchmaking
 */
export const subscribeToMatchmakingQueue = (
  queueId: string,
  onMatched: (matchId: string) => void,
  onError: (error: Error) => void
): Unsubscribe => {
  try {
    const db = getDb();
    if (!db) throw new Error('Firestore no disponible');

    return onSnapshot(
      doc(db, 'matchmakingQueue', queueId),
      (snapshot) => {
        if (!snapshot.exists()) return;
        
        const data = snapshot.data() as MatchmakingEntry;
        if (data.status === 'matched' && data.matchId) {
          onMatched(data.matchId);
        }
      },
      (error) => {
        console.error('Error en suscripción a cola:', error);
        onError(error);
      }
    );
  } catch (error) {
    console.error('Error suscribiéndose a cola:', error);
    throw error;
  }
};

/**
 * Escucha cambios en una partida activa
 */
export const subscribeToActiveMatch = (
  matchId: string,
  onUpdate: (match: ActiveMatch) => void,
  onError: (error: Error) => void
): Unsubscribe => {
  try {
    const db = getDb();
    if (!db) throw new Error('Firestore no disponible');

    return onSnapshot(
      doc(db, 'activeMatches', matchId),
      (snapshot) => {
        if (!snapshot.exists()) {
          onError(new Error('Partida no encontrada'));
          return;
        }
        
        const match = snapshot.data() as ActiveMatch;
        onUpdate(match);
      },
      (error) => {
        console.error('Error en suscripción a partida:', error);
        onError(error);
      }
    );
  } catch (error) {
    console.error('Error suscribiéndose a partida:', error);
    throw error;
  }
};

/**
 * Marca al jugador como listo
 */
export const setPlayerReady = async (matchId: string, userId: string): Promise<void> => {
  try {
    const db = getDb();
    if (!db) throw new Error('Firestore no disponible');

    const matchRef = doc(db, 'activeMatches', matchId);
    const matchSnap = await getDocs(query(collection(db, 'activeMatches'), where('matchId', '==', matchId), limit(1)));
    
    if (matchSnap.empty) throw new Error('Partida no encontrada');
    
    const match = matchSnap.docs[0].data() as ActiveMatch;
    const isP1 = match.p1.userId === userId;

    const updateData: any = {};
    if (isP1) {
      updateData['p1.ready'] = true;
    } else {
      updateData['p2.ready'] = true;
    }

    // Si ambos están listos, iniciar la partida
    if ((isP1 && match.p2.ready) || (!isP1 && match.p1.ready)) {
      updateData.status = 'active';
      updateData.startedAt = Timestamp.now();
    }

    await updateDoc(matchRef, updateData);
  } catch (error) {
    console.error('Error marcando jugador listo:', error);
    throw error;
  }
};

/**
 * Actualiza la respuesta de un jugador
 */
export const submitAnswer = async (
  matchId: string,
  userId: string,
  questionIndex: number,
  isCorrect: boolean,
  timeUsed: number
): Promise<void> => {
  try {
    const db = getDb();
    if (!db) throw new Error('Firestore no disponible');

    const matchRef = doc(db, 'activeMatches', matchId);
    const matchSnap = await getDocs(query(collection(db, 'activeMatches'), where('matchId', '==', matchId), limit(1)));
    
    if (matchSnap.empty) throw new Error('Partida no encontrada');
    
    const match = matchSnap.docs[0].data() as ActiveMatch;
    const isP1 = match.p1.userId === userId;

    const playerKey = isP1 ? 'p1' : 'p2';
    const player = match[playerKey];

    const updateData: any = {
      [`${playerKey}.answers`]: [...player.answers, isCorrect],
      [`${playerKey}.times`]: [...player.times, timeUsed],
      [`${playerKey}.score`]: player.score + (isCorrect ? 1 : 0),
      [`${playerKey}.currentQuestionIndex`]: questionIndex + 1,
      [`${playerKey}.lastHeartbeat`]: Timestamp.now()
    };

    await updateDoc(matchRef, updateData);
  } catch (error) {
    console.error('Error enviando respuesta:', error);
    throw error;
  }
};

/**
 * Envía heartbeat para mantener la conexión
 */
export const sendHeartbeat = async (matchId: string, userId: string): Promise<void> => {
  try {
    const db = getDb();
    if (!db) return;

    const matchRef = doc(db, 'activeMatches', matchId);
    const matchSnap = await getDocs(query(collection(db, 'activeMatches'), where('matchId', '==', matchId), limit(1)));
    
    if (matchSnap.empty) return;
    
    const match = matchSnap.docs[0].data() as ActiveMatch;
    const isP1 = match.p1.userId === userId;
    const playerKey = isP1 ? 'p1' : 'p2';

    await updateDoc(matchRef, {
      [`${playerKey}.lastHeartbeat`]: Timestamp.now(),
      [`${playerKey}.connected`]: true
    });
  } catch (error) {
    console.error('Error enviando heartbeat:', error);
  }
};

/**
 * Finaliza una partida
 */
export const finishMatch = async (
  matchId: string,
  winner: 'p1' | 'p2' | 'draw'
): Promise<void> => {
  try {
    const db = getDb();
    if (!db) throw new Error('Firestore no disponible');

    const matchRef = doc(db, 'activeMatches', matchId);
    
    await updateDoc(matchRef, {
      status: 'finished',
      finishedAt: Timestamp.now(),
      winner
    });
  } catch (error) {
    console.error('Error finalizando partida:', error);
    throw error;
  }
};

/**
 * Abandona una partida (forfeit)
 */
export const forfeitMatch = async (matchId: string, userId: string): Promise<void> => {
  try {
    const db = getDb();
    if (!db) throw new Error('Firestore no disponible');

    const matchRef = doc(db, 'activeMatches', matchId);
    const matchSnap = await getDocs(query(collection(db, 'activeMatches'), where('matchId', '==', matchId), limit(1)));
    
    if (matchSnap.empty) throw new Error('Partida no encontrada');
    
    const match = matchSnap.docs[0].data() as ActiveMatch;
    const isP1 = match.p1.userId === userId;

    await updateDoc(matchRef, {
      status: 'finished',
      finishedAt: Timestamp.now(),
      winner: isP1 ? 'p2' : 'p1'
    });
  } catch (error) {
    console.error('Error abandonando partida:', error);
    throw error;
  }
};

/**
 * Limpia partidas antiguas (más de 1 hora)
 */
export const cleanupOldMatches = async (): Promise<void> => {
  try {
    const db = getDb();
    if (!db) return;

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const q = query(
      collection(db, 'activeMatches'),
      where('startedAt', '<', Timestamp.fromDate(oneHourAgo))
    );

    const snapshot = await getDocs(q);
    
    const deletions = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletions);

    console.log(`Limpiadas ${deletions.length} partidas antiguas`);
  } catch (error) {
    console.error('Error limpiando partidas antiguas:', error);
  }
};

