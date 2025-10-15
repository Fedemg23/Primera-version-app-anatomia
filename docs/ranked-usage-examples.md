# Ejemplos de Uso - Sistema Ranked

Este documento proporciona ejemplos prácticos de cómo usar las funciones del sistema Ranked.

---

## 1. Inicializar Perfil Ranked

```typescript
import { getRankedProfile } from './services/firestore';

// Al autenticarse el usuario
useEffect(() => {
  if (!auth?.uid) return;
  
  const loadProfile = async () => {
    try {
      const profile = await getRankedProfile(auth.uid);
      setRankedProfile(profile);
      
      console.log('Perfil cargado:', {
        rating: profile.rating,
        league: profile.league,
        provisional: profile.provisionalGames > 0
      });
    } catch (error) {
      console.error('Error cargando perfil:', error);
    }
  };
  
  loadProfile();
}, [auth?.uid]);
```

---

## 2. Calcular Delta de Rating

```typescript
import { calculateRatingDelta, getLeagueFromRating } from './utils/rankedElo';

// Después de una partida
function processMatchResult(
  myRating: number,
  opponentRating: number,
  won: boolean,
  myStreak: number,
  myLeague: League,
  provisionalGames: number,
  pointMargin: number = 0
) {
  const outcome = won ? 1 : 0; // 0.5 para empate
  
  const delta = calculateRatingDelta(
    myRating,
    opponentRating,
    outcome,
    myStreak,
    myLeague,
    provisionalGames,
    pointMargin
  );
  
  const newRating = myRating + delta;
  const newLeague = getLeagueFromRating(newRating);
  
  console.log('Resultado del match:', {
    delta,
    newRating,
    newLeague,
    leagueChanged: newLeague !== myLeague
  });
  
  return { delta, newRating, newLeague };
}

// Ejemplo: Victoria contra rival superior
const result1 = processMatchResult(
  1200,  // Mi rating
  1400,  // Rating del rival
  true,  // Gané
  2,     // Mi racha actual
  'Plata', // Mi liga
  0,     // Ya no estoy en provisional
  5      // Gané por 5 puntos de diferencia
);
// Resultado esperado: +30-35 Eritros

// Ejemplo: Derrota contra rival inferior
const result2 = processMatchResult(
  1200,  // Mi rating
  1000,  // Rating del rival
  false, // Perdí
  0,     // Sin racha
  'Plata',
  0,
  0
);
// Resultado esperado: -18 Eritros (límite de Plata)
```

---

## 3. Actualizar Perfil Después de Match

```typescript
import { updateRankedProfile, recordMatch } from './services/firestore';

async function finalizeMatch(
  matchId: string,
  myUserId: string,
  myData: { ratingBefore: number; delta: number; latency: number },
  opponentUserId: string,
  opponentData: { ratingBefore: number; delta: number; latency: number },
  outcome: 'p1' | 'p2' | 'draw',
  mode: MatchMode,
  questions: Array<{ qId: string; p1Ans: boolean; p2Ans: boolean; timeP1: number; timeP2: number }>
) {
  try {
    // 1. Actualizar mi perfil
    const newRating = myData.ratingBefore + myData.delta;
    const newStreak = outcome === 'p1' ? profile.streak + 1 : 0;
    
    await updateRankedProfile(myUserId, {
      rating: newRating,
      streak: newStreak,
      bestRating: Math.max(profile.bestRating || 0, newRating),
      totalMatches: (profile.totalMatches || 0) + 1,
      wins: outcome === 'p1' ? (profile.wins || 0) + 1 : profile.wins,
      losses: outcome === 'p2' ? (profile.losses || 0) + 1 : profile.losses,
      draws: outcome === 'draw' ? (profile.draws || 0) + 1 : profile.draws,
      provisionalGames: Math.max(0, (profile.provisionalGames || 0) - 1)
    });
    
    // 2. Registrar el match
    const matchRecord: MatchRecord = {
      matchId,
      seasonId: 'season_7',
      mode,
      bankVersion: 'v1.0',
      startedAt: new Date(Date.now() - 180000).toISOString(), // 3 min atrás
      finishedAt: new Date().toISOString(),
      p1: {
        userId: myUserId,
        ratingBefore: myData.ratingBefore,
        ratingAfter: newRating,
        delta: myData.delta,
        latencyMs: myData.latency
      },
      p2: {
        userId: opponentUserId,
        ratingBefore: opponentData.ratingBefore,
        ratingAfter: opponentData.ratingBefore + opponentData.delta,
        delta: opponentData.delta,
        latencyMs: opponentData.latency
      },
      outcome,
      details: { rounds: questions }
    };
    
    await recordMatch(matchRecord);
    
    console.log('Match finalizado correctamente');
  } catch (error) {
    console.error('Error finalizando match:', error);
    throw error;
  }
}
```

---

## 4. Obtener y Mostrar Leaderboard

```typescript
import { getRankedLeaderboard, listFriendsUserIds } from './services/firestore';

async function loadLeaderboard(
  scope: 'global' | 'friends',
  myUserId: string
) {
  try {
    let friendIds: string[] = [];
    
    if (scope === 'friends') {
      friendIds = await listFriendsUserIds(myUserId);
      
      if (friendIds.length === 0) {
        console.log('No tienes amigos jugando Ranked aún');
        return [];
      }
    }
    
    const leaderboard = await getRankedLeaderboard(
      scope,
      undefined, // mode (opcional)
      scope === 'friends' ? friendIds : undefined,
      50 // límite
    );
    
    // Encontrar mi posición
    const myPosition = leaderboard.findIndex(entry => entry.userId === myUserId);
    
    console.log('Leaderboard cargado:', {
      totalEntries: leaderboard.length,
      myPosition: myPosition !== -1 ? myPosition + 1 : null,
      topPlayer: leaderboard[0]
    });
    
    return leaderboard;
  } catch (error) {
    console.error('Error cargando leaderboard:', error);
    return [];
  }
}
```

---

## 5. Sistema de Matchmaking (Placeholder)

```typescript
// NOTA: Esta es una implementación simplificada de ejemplo
// En producción, se necesita un backend real con Cloud Functions

interface MatchmakingQueue {
  userId: string;
  rating: number;
  mode: MatchMode;
  timestamp: number;
}

async function findMatch(
  myUserId: string,
  myRating: number,
  mode: MatchMode,
  maxWaitTime: number = 30000 // 30 segundos
): Promise<{ opponentId: string; opponentRating: number } | null> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    // Calcular rango de búsqueda actual
    const waitTime = Math.floor((Date.now() - startTime) / 1000);
    const [minRating, maxRating] = getMatchmakingRange(myRating, waitTime);
    
    console.log(`Buscando en rango ${minRating}-${maxRating}...`);
    
    // En producción, aquí se consultaría una cola en tiempo real
    // Por ahora, es solo un ejemplo
    
    // Simular búsqueda cada 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular encontrar rival (ejemplo)
    if (Math.random() > 0.7) {
      return {
        opponentId: 'opponent_123',
        opponentRating: myRating + Math.floor(Math.random() * 200 - 100)
      };
    }
  }
  
  console.log('Timeout de matchmaking');
  return null;
}

// Uso
const match = await findMatch(
  auth.uid,
  rankedProfile.rating,
  'Clasico'
);

if (match) {
  console.log('¡Match encontrado!', match);
  // Iniciar partida...
} else {
  console.log('No se encontró rival');
}
```

---

## 6. Calcular Percentil y Mostrar Stats

```typescript
import { calculatePercentile } from './utils/rankedElo';

function displayPlayerStats(profile: RankedProfile) {
  const percentile = calculatePercentile(profile.rating);
  const winRate = profile.totalMatches > 0
    ? ((profile.wins || 0) / profile.totalMatches * 100).toFixed(1)
    : '0.0';
  
  return {
    rating: profile.rating,
    league: profile.league,
    percentile: `Top ${percentile}%`,
    winRate: `${winRate}%`,
    totalMatches: profile.totalMatches || 0,
    record: `${profile.wins || 0}W - ${profile.losses || 0}L - ${profile.draws || 0}D`,
    streak: profile.streak,
    bestRating: profile.bestRating || profile.rating,
    provisional: profile.provisionalGames > 0 ? `${profile.provisionalGames} partidas restantes` : null
  };
}

// Uso
const stats = displayPlayerStats(rankedProfile);
console.log('Estadísticas del jugador:', stats);
```

---

## 7. Aplicar Decaimiento por Inactividad

```typescript
import { calculateDecay, updateRankedProfile } from './utils/rankedElo';

async function applyDecayIfNeeded(userId: string, profile: RankedProfile) {
  if (!profile.lastMatchAt) return;
  
  // Verificar si está protegido
  if (profile.decayProtectedUntil) {
    const protectedUntil = new Date(profile.decayProtectedUntil);
    if (protectedUntil > new Date()) {
      console.log('Usuario protegido del decay hasta', protectedUntil);
      return;
    }
  }
  
  const decay = calculateDecay(profile.lastMatchAt, profile.rating);
  
  if (decay > 0) {
    console.log(`Aplicando decay de -${decay} por inactividad`);
    
    const newRating = Math.max(800, profile.rating - decay);
    
    await updateRankedProfile(userId, {
      rating: newRating
    });
    
    return decay;
  }
  
  return 0;
}
```

---

## 8. Reset de Temporada

```typescript
import { applySeasonReset, getLeagueFromRating } from './utils/rankedElo';

async function resetSeasonForUser(userId: string, profile: RankedProfile) {
  const currentLeague = profile.league;
  const newRating = applySeasonReset(profile.rating, currentLeague);
  
  console.log('Reset de temporada:', {
    oldRating: profile.rating,
    newRating,
    oldLeague: currentLeague,
    newLeague: getLeagueFromRating(newRating),
    reduction: profile.rating - newRating
  });
  
  await updateRankedProfile(userId, {
    rating: newRating,
    seasonId: 'season_8', // Nueva temporada
    streak: 0, // Reset de racha
    provisionalGames: 0 // Ya no es provisional después de la primera temporada
  });
  
  // Entregar recompensas según liga alcanzada
  const rewards = getSeasonRewards(currentLeague);
  console.log('Recompensas de temporada:', rewards);
  
  // Aquí se entregarían las recompensas al usuario...
}
```

---

## 9. Validar Match en Servidor (Conceptual)

```typescript
// Este código iría en una Cloud Function
// Solo como referencia de lo que se necesitaría en producción

export const validateAndRecordMatch = functions.https.onCall(async (data, context) => {
  // Verificar autenticación
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }
  
  const { matchId, p1Answers, p2Answers, questions } = data;
  
  // Validar respuestas servidor-side
  let p1Score = 0;
  let p2Score = 0;
  
  for (let i = 0; i < questions.length; i++) {
    const question = await getQuestionFromBank(questions[i].id);
    
    if (p1Answers[i] === question.correctAnswer) p1Score++;
    if (p2Answers[i] === question.correctAnswer) p2Score++;
  }
  
  // Determinar ganador
  const outcome = p1Score > p2Score ? 'p1' : p2Score > p1Score ? 'p2' : 'draw';
  
  // Calcular deltas
  const [p1Profile, p2Profile] = await Promise.all([
    getRankedProfile(data.p1Id),
    getRankedProfile(data.p2Id)
  ]);
  
  const p1Delta = calculateRatingDelta(
    p1Profile.rating,
    p2Profile.rating,
    outcome === 'p1' ? 1 : outcome === 'draw' ? 0.5 : 0,
    p1Profile.streak,
    p1Profile.league,
    p1Profile.provisionalGames
  );
  
  const p2Delta = -p1Delta; // Simétrico
  
  // Actualizar ambos perfiles
  await Promise.all([
    updateRankedProfile(data.p1Id, { 
      rating: p1Profile.rating + p1Delta,
      // ... otros campos
    }),
    updateRankedProfile(data.p2Id, { 
      rating: p2Profile.rating + p2Delta,
      // ... otros campos
    })
  ]);
  
  // Registrar match
  await recordMatch({ /* ... */ });
  
  return { p1Delta, p2Delta, outcome };
});
```

---

## 10. Componente React de Ejemplo

```tsx
import React, { useState, useEffect } from 'react';
import { getRankedProfile, getRankedLeaderboard } from './services/firestore';
import { calculatePercentile } from './utils/rankedElo';

export function RankedStatsCard({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<RankedProfile | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function load() {
      try {
        const prof = await getRankedProfile(userId);
        setProfile(prof);
        
        // Obtener posición en leaderboard
        const board = await getRankedLeaderboard('global');
        const pos = board.findIndex(e => e.userId === userId);
        setPosition(pos !== -1 ? pos + 1 : null);
      } catch (error) {
        console.error('Error cargando stats:', error);
      } finally {
        setLoading(false);
      }
    }
    
    load();
  }, [userId]);
  
  if (loading) return <div>Cargando...</div>;
  if (!profile) return <div>No disponible</div>;
  
  const percentile = calculatePercentile(profile.rating);
  const winRate = profile.totalMatches > 0
    ? ((profile.wins || 0) / profile.totalMatches * 100).toFixed(1)
    : '0';
  
  return (
    <div className="p-4 bg-neutral-900 rounded-xl">
      <h3 className="text-xl font-bold text-white mb-2">
        {profile.league}
      </h3>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-400">Rating:</span>
          <span className="text-white font-bold">{profile.rating}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">Posición:</span>
          <span className="text-white">#{position || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">Percentil:</span>
          <span className="text-white">Top {percentile}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">Win Rate:</span>
          <span className="text-white">{winRate}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">Partidas:</span>
          <span className="text-white">{profile.totalMatches || 0}</span>
        </div>
        {profile.streak !== 0 && (
          <div className="flex justify-between">
            <span className="text-neutral-400">Racha:</span>
            <span className={profile.streak > 0 ? 'text-green-400' : 'text-red-400'}>
              {profile.streak > 0 ? '+' : ''}{profile.streak}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Notas Finales

- Todos estos ejemplos están pensados para uso **cliente-side**
- Para producción, la lógica crítica (validación de respuestas, cálculo de rating) debe estar en el **servidor**
- Firestore Realtime Database o WebSockets serían ideales para sincronización en vivo
- Considera implementar **rate limiting** para prevenir abuso
- Los índices de Firestore son **críticos** para el rendimiento de queries

---

## Recursos Adicionales

- [Documentación de Firestore](https://firebase.google.com/docs/firestore)
- [Sistema ELO en Wikipedia](https://es.wikipedia.org/wiki/Sistema_de_puntuaci%C3%B3n_Elo)
- [Cloud Functions para Firebase](https://firebase.google.com/docs/functions)
- [Realtime Database](https://firebase.google.com/docs/database)



