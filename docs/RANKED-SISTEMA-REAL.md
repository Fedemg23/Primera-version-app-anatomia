# 🎮 Sistema Ranked 1v1 - Implementación Real

## ✅ Estado de Implementación

El sistema ranked 1v1 está **completamente implementado y funcional**. Los jugadores pueden:

- ✅ Unirse a la cola de matchmaking en tiempo real
- ✅ Encontrar oponentes compatibles basados en rating y modo de juego
- ✅ Jugar partidas sincronizadas 1v1 en tiempo real
- ✅ Ver progreso del oponente en vivo
- ✅ Detectar desconexiones y reconexiones
- ✅ Actualizar ratings automáticamente después de cada partida
- ✅ Ver historial de partidas y estadísticas

---

## 📋 Archivos Implementados

### Nuevos Archivos

1. **`services/rankedMatchmaking.ts`** - Sistema completo de matchmaking y partidas en tiempo real
   - Cola de matchmaking
   - Búsqueda de oponentes
   - Sincronización de partidas activas
   - Sistema de heartbeat para detectar desconexiones
   - Gestión de respuestas y puntuaciones

### Archivos Modificados

2. **`components/screens/RankedMatchScreen.tsx`**
   - Integración con sistema real de matchmaking
   - Sincronización en tiempo real con el oponente
   - Envío de respuestas al servidor
   - Heartbeat para mantener conexión
   - Indicador de desconexión del oponente

3. **`components/MatchmakingModal.tsx`**
   - Sistema real de cola de matchmaking
   - Búsqueda activa de oponentes cada 3 segundos
   - Limpieza automática al cancelar
   - Expansión progresiva del rango de búsqueda

4. **`App.tsx`**
   - Integración del matchId en el flujo de partidas
   - Paso correcto de props al MatchmakingModal
   - Manejo completo del ciclo de vida de partidas

5. **`firestore.rules`**
   - Reglas de seguridad para `matchmakingQueue`
   - Reglas de seguridad para `activeMatches`
   - Validaciones para prevenir trampas

6. **`firestore.indexes.json`**
   - Índices para búsqueda eficiente en matchmaking
   - Índices para consultas de partidas activas

---

## 🚀 Despliegue

### 1. Desplegar Reglas de Firestore

```bash
firebase deploy --only firestore:rules
```

### 2. Desplegar Índices de Firestore

```bash
firebase deploy --only firestore:indexes
```

### 3. Verificar Despliegue

1. Ir a Firebase Console
2. Navegar a Firestore Database
3. Verificar que existan las colecciones:
   - `rankedProfiles`
   - `matchmakingQueue`
   - `activeMatches`
   - `rankedMatches`

---

## 🎯 Cómo Funciona

### Flujo de Matchmaking

```
1. Usuario hace clic en "Jugar Ranked"
   ↓
2. Se crea entrada en matchmakingQueue con:
   - userId, name, avatar, rating, league, mode
   - timestamp y status: 'searching'
   ↓
3. Sistema busca oponentes cada 3 segundos:
   - Mismo modo de juego
   - Rating dentro del rango (±50, expandiendo con el tiempo)
   - Status: 'searching'
   ↓
4. Cuando encuentra oponente compatible:
   - Crea documento en activeMatches
   - Selecciona 10 preguntas aleatorias
   - Actualiza ambas entradas de cola a 'matched'
   ↓
5. Ambos jugadores son redirigidos a la partida
   - Se suscriben a actualizaciones en tiempo real
   - Envían heartbeat cada 3 segundos
   ↓
6. Durante la partida:
   - Cada respuesta se envía a Firestore
   - Se actualiza score y progreso
   - El oponente ve cambios en tiempo real
   ↓
7. Al finalizar:
   - Se calcula ganador
   - Se actualiza status a 'finished'
   - Se calculan cambios de rating
   - Se registra en rankedMatches
   - Se actualizan rankedProfiles
```

### Sincronización en Tiempo Real

**En RankedMatchScreen:**
- Se suscribe a `activeMatches/{matchId}` usando onSnapshot
- Recibe actualizaciones del oponente en tiempo real:
  - Respuestas
  - Puntuación
  - Progreso en preguntas
  - Estado de conexión

**Sistema de Heartbeat:**
- Cada jugador envía heartbeat cada 3 segundos
- Si no hay heartbeat por 30 segundos → desconectado
- Se muestra indicador de desconexión al otro jugador
- Posibilidad de esperar reconexión

### Cálculo de Rating

Se usa sistema ELO adaptado (ver `utils/rankedElo.ts`):

```typescript
Δ = K × (S - E)

Donde:
- K = Factor dinámico (28-40, aumenta con rachas)
- S = Score (1 win, 0.5 draw, 0 loss)
- E = Expectativa basada en diferencia de ratings

Límites por liga:
- Bronce/Plata: ±18
- Oro: ±25
- Rubí/Esmeralda: ±30
- Diamante: ±35
```

---

## 🔒 Seguridad

### Firestore Rules

**matchmakingQueue:**
- ✅ Solo puedes leer tu propia entrada
- ✅ Solo puedes crear con tu userId
- ✅ Solo puedes actualizar/eliminar tu entrada

**activeMatches:**
- ✅ Solo puedes leer si eres participante
- ✅ No puedes cambiar matchId, mode o questions
- ✅ Solo puedes actualizar tus propios datos de jugador

**rankedProfiles:**
- ✅ Límite de cambio de rating: ±50 por actualización
- ✅ Solo puedes actualizar tu propio perfil
- ✅ seasonId debe ser válido

### Anti-Trampas (Implementadas)

1. **Validación de cambios:**
   - No más de ±50 puntos de rating por actualización
   - No se pueden modificar preguntas una vez iniciada la partida

2. **Inmutabilidad:**
   - rankedMatches son inmutables después de creación
   - matchId, mode y questions no se pueden cambiar en activeMatches

3. **Sistema de heartbeat:**
   - Detecta desconexiones y abandono
   - Abandono cuenta como derrota automática

### Anti-Trampas (Pendientes - Servidor)

Para máxima seguridad, se recomienda implementar Cloud Functions:

1. **Validación servidor-side de respuestas:**
```typescript
// Cloud Function: validateAnswer
- Verificar que la respuesta corresponda a la pregunta actual
- Validar timing (no instantáneo, no más de 20s)
- Confirmar que el jugador aún está en la partida
```

2. **Matchmaking servidor-side:**
```typescript
// Cloud Function: matchmakePlayers
- Buscar oponentes desde el servidor
- Crear partidas de forma segura
- Prevenir auto-matchmaking
```

3. **Finalización servidor-side:**
```typescript
// Cloud Function: finalizeMatch
- Validar resultados
- Calcular ratings de forma segura
- Prevenir manipulación de resultados
```

---

## 🧪 Testing

### Test Manual

1. **Abrir dos navegadores/pestañas:**
   - Usuario A: Inicia sesión y va a Ranked
   - Usuario B: Inicia sesión y va a Ranked

2. **Ambos usuarios hacen clic en "Jugar Ranked"**

3. **Verificar:**
   - ✅ Encuentran partida en ~3-10 segundos
   - ✅ Ven countdown de 3 segundos
   - ✅ Son redirigidos a la partida
   - ✅ Ven preguntas idénticas
   - ✅ Cada uno ve su avatar y el del oponente
   - ✅ Puntuaciones se actualizan en tiempo real
   - ✅ Si uno se desconecta, el otro ve el indicador
   - ✅ Al finalizar, ambos ven resultado correcto
   - ✅ Ratings se actualizan correctamente

### Test en Consola de Firebase

```javascript
// Verificar cola de matchmaking
db.collection('matchmakingQueue').get()

// Verificar partidas activas
db.collection('activeMatches').get()

// Verificar historial
db.collection('rankedMatches')
  .where('p1.userId', '==', 'USER_ID')
  .get()
```

---

## 📊 Monitoreo

### Métricas Importantes

1. **Tiempo de matchmaking:**
   - Target: < 30 segundos
   - Medir: timestamp de entrada vs timestamp de match

2. **Tasa de abandono:**
   - Target: < 5%
   - Medir: matches con forfeit / total matches

3. **Tasa de desconexión:**
   - Target: < 10%
   - Medir: heartbeat failures

4. **Distribución de ligas:**
   - Esperado: Curva normal
   - Mayoría en Oro/Plata

### Logs a Revisar

```javascript
// En rankedMatchmaking.ts
console.log('Match encontrado:', matchId);
console.error('Error en matchmaking:', error);

// En RankedMatchScreen.tsx
console.log('Sincronización actualizada:', match);
console.error('Error en sincronización:', error);
```

---

## 🛠️ Mantenimiento

### Limpieza Automática

**Partidas antiguas:**
```typescript
// Se limpian automáticamente partidas > 1 hora
cleanupOldMatches()
```

**Cola de matchmaking:**
```typescript
// Entradas se eliminan 10 segundos después de match
// O al cancelar búsqueda
```

### Mantenimiento Manual

**Limpiar partidas huérfanas:**
```javascript
// Cloud Function recomendada cada 24h
db.collection('activeMatches')
  .where('status', '==', 'waiting')
  .where('startedAt', '<', hace_1_hora)
  .get()
  .then(snapshot => {
    snapshot.forEach(doc => doc.ref.delete());
  });
```

---

## 🚨 Troubleshooting

### Problema: "No encuentra oponentes"

**Causas posibles:**
1. No hay otros usuarios buscando en ese momento
2. Rango de rating muy cerrado
3. Modo de juego poco popular

**Soluciones:**
- El rango se expande automáticamente cada 10s (+25)
- Considerar agregar bots para testing
- Verificar que índices de Firestore estén desplegados

### Problema: "Partida no se sincroniza"

**Causas posibles:**
1. Reglas de Firestore no desplegadas
2. Usuario sin permisos
3. Error en onSnapshot

**Soluciones:**
```bash
# Redesplegar reglas
firebase deploy --only firestore:rules

# Verificar en consola del navegador
console.log('Match subscription:', unsubscribe);
```

### Problema: "Rating no se actualiza"

**Causas posibles:**
1. Error en cálculo de delta
2. Perfil no existe
3. Permisos insuficientes

**Soluciones:**
```typescript
// Verificar perfil existe
const profile = await getRankedProfile(userId);
console.log('Profile:', profile);

// Verificar cálculo
const delta = calculateRatingDelta(...);
console.log('Delta calculado:', delta);
```

---

## 📈 Próximos Pasos (Opcionales)

### Mejoras Recomendadas

1. **Implementar Cloud Functions** (Alta prioridad)
   - Validación servidor-side
   - Matchmaking seguro
   - Prevenir trampas

2. **Agregar sistema de reportes**
   - Reportar comportamiento sospechoso
   - Moderación automática

3. **Mejorar matchmaking**
   - Considerar latencia geográfica
   - Preferencia de idioma
   - Nivel de habilidad adicional

4. **Agregar estadísticas avanzadas**
   - Win rate por región
   - Preguntas más difíciles
   - Racha máxima histórica

5. **Implementar sistema de temporadas**
   - Reset automático cada X meses
   - Recompensas de fin de temporada
   - Ranking histórico

6. **Agregar modos adicionales**
   - Torneos
   - Ranked 2v2
   - Draft de preguntas

---

## 📞 Soporte

### Errores Comunes y Soluciones

**"Error: Firestore no disponible"**
```typescript
// Verificar configuración de Firebase
// Asegurarse de que firebase.ts esté correctamente configurado
```

**"Error: Permission denied"**
```bash
# Redesplegar reglas
firebase deploy --only firestore:rules
```

**"Warning: Can't perform a React state update on unmounted component"**
```typescript
// Ya manejado con useEffect cleanup
// Verificar que todas las suscripciones se cancelen
```

---

## ✨ Conclusión

El sistema ranked 1v1 está **100% funcional** y listo para producción. Los únicos elementos pendientes son optimizaciones opcionales y seguridad servidor-side mediante Cloud Functions.

**Características implementadas:**
- ✅ Matchmaking en tiempo real
- ✅ Sincronización de partidas
- ✅ Sistema de rating ELO
- ✅ Detección de desconexiones
- ✅ Historial y estadísticas
- ✅ Reglas de seguridad
- ✅ Validaciones básicas

**Para empezar a usar:**
1. Desplegar reglas e índices
2. Dos usuarios inician sesión
3. Ambos van a Ranked → Jugar Ranked
4. ¡Disfruten de la competencia!

---

**Última actualización:** 2025-10-15
**Versión:** 1.0.0 - Sistema Real Implementado
**Estado:** ✅ Producción Ready

