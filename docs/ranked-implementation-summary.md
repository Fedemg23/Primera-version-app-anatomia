# 🏆 Sistema Ranked - Resumen de Implementación

## Descripción General

Sistema competitivo 1v1 completo para Anatomy Go usando **Eritros** como moneda y rating. Los jugadores compiten en partidas clasificatorias que afectan su rating ELO adaptado y pueden ascender a través de 6 ligas distintas.

---

## ✅ Componentes Implementados

### 1. **Tipos TypeScript** (`types.ts`)
- `League`: Tipos de ligas (Bronce, Plata, Oro, Rubí, Esmeralda, Diamante)
- `RankedProfile`: Perfil competitivo del usuario
- `MatchRecord`: Registro completo de partidas
- `RankedLeaderboardEntry`: Entrada en clasificación
- `MatchMode`: Modos de juego disponibles

### 2. **Utilidades ELO** (`utils/rankedElo.ts`)
Funciones completas para cálculo de rating:
- `calculateRatingDelta()`: Calcula cambio de rating post-match
- `calculateKFactor()`: Factor K dinámico según racha y liga
- `getLeagueFromRating()`: Determina liga según rating
- `calculatePercentile()`: Percentil del jugador
- `getMatchmakingRange()`: Rango de búsqueda dinámico
- `calculateDecay()`: Decaimiento por inactividad
- `applySeasonReset()`: Reset de temporada

**Características del sistema ELO:**
- K base: 30 (ajustable por liga y racha)
- Rachas aumentan ganancias/pérdidas
- Límites por liga para evitar swings injustos
- Protección para jugadores provisionales (primeras 10 partidas)
- Margen de victoria amplifica el delta

### 3. **API Firestore** (`services/firestore.ts`)
Funciones de backend:
- `getRankedProfile()`: Obtiene/crea perfil ranked
- `updateRankedProfile()`: Actualiza perfil post-match
- `recordMatch()`: Registra partida completada
- `getMatchHistory()`: Historial de partidas
- `getRankedLeaderboard()`: Clasificación (Global/Amigos)
- `getUserRankedPosition()`: Posición del usuario

### 4. **Pantalla Principal** (`components/screens/RankedScreen.tsx`)
Vista completa con:
- **Header competitivo**: Rating, liga, percentil, racha
- **Acciones rápidas**: Jugar Ranked, Entrenamiento, Reglas
- **Selector de modo**: 5 modos de juego
- **Panel de temporada**: Progreso y recompensas
- **Historial de duelos**: Últimas 10 partidas
- **Clasificación**: Tabs Global/Amigos con búsqueda
- **Modal de reglas**: Explicación completa del sistema

### 5. **Modal de Matchmaking** (`components/MatchmakingModal.tsx`)
Cola de búsqueda con:
- Rango dinámico que se expande con el tiempo
- Tips educativos rotativos
- Countdown 3-2-1 al encontrar rival
- Comparativa de jugadores (rating, liga, ventaja teórica)
- Animaciones y feedback visual

### 6. **Integración en App** (`App.tsx`)
- Estado de ranked profile cargado desde Firestore
- Handlers de matchmaking
- Vista 'ranked' en sistema de navegación
- Modal de matchmaking global

### 7. **Botón de Acceso** (`components/screens/HomeScreen.tsx`)
Card destacado en pantalla principal con:
- Gradiente llamativo (rojo-naranja-amarillo)
- Badge "¡Nuevo!"
- Animaciones hover
- Emoji 🏆

### 8. **Reglas de Seguridad** (`firestore.rules`)
Protección de colecciones:
- `rankedProfiles`: Lectura pública, escritura propia con validaciones
- `rankedMatches`: Lectura restringida a participantes
- `matchmakingQueue`: Solo gestión propia
- Validación de cambios de rating máximos (+/-50 por actualización)

---

## 📊 Sistema de Ligas

| Liga | Rating | Recompensas Fin Temporada | Límite Delta |
|------|--------|--------------------------|--------------|
| 🥉 Bronce | 0-999 | 100 Huesitos + Marco | ±18 |
| 🥈 Plata | 1000-1499 | 300 Huesitos + Marco | ±18 |
| 🥇 Oro | 1500-1999 | 700 Huesitos + Marco | ±25 |
| 💎 Rubí | 2000-2399 | 1200 Huesitos + Marco | ±30 |
| 💚 Esmeralda | 2400-2799 | 1800 Huesitos + Marco | ±30 |
| 💠 Diamante | 2800+ | 2500 Huesitos + Marco + Título | ±35 |

---

## 🎮 Modos de Juego

1. **Clásico**: Formato estándar de preguntas
2. **Ataque por Vida**: Sistema de vidas
3. **Robo de Puntos**: Puedes robar puntos del rival
4. **Imagen-Click**: Preguntas visuales
5. **Muerte Súbita**: Primera falla pierde

---

## 🔧 Características Técnicas

### Fórmula ELO Adaptada
```typescript
Δ = K × (S - E)

donde:
- K = 28-38 (según racha y liga)
- S = 1 (victoria), 0 (derrota), 0.5 (empate)
- E = 1 / (1 + 10^((R_rival - R_tuyo) / 400))
```

### Protecciones Anti-Abuso
- ✅ Validación servidor de rating máximo por actualización
- ✅ Matches inmutables una vez creados
- ✅ Límites de delta por liga
- ✅ Protección provisional (primeras 10 partidas)
- ✅ Permisos restrictivos en Firestore

### Sistema de Decaimiento
- Sin actividad por 14+ días: -10 rating/semana
- Protección: No baja del mínimo de 800
- No afecta durante `decayProtectedUntil`

### Reset de Temporada
- Reducción del 30% del rating
- Mantiene mínimo de liga base alcanzada
- Recompensas según liga final

---

## 🎨 Diseño Visual

### Emblemas de Ligas
Actualmente implementados con **CSS gradientes**. Ver `docs/ranked-league-assets.md` para prompts de generación de imágenes PNG reales.

```tsx
<LeagueEmblem league="Diamante" size="lg" />
```

Tamaños disponibles: `sm`, `md`, `lg`

### Paleta de Colores
- **Bronce**: Amber (700-600-800)
- **Plata**: Gray (300-200-400)
- **Oro**: Yellow (400-300-500)
- **Rubí**: Red-Pink (600-500-600)
- **Esmeralda**: Emerald-Teal (500-400-600)
- **Diamante**: Blue-Cyan-Purple (400-300-400)

### Tema Consistente
- Fondo negro (#000) en todos los emblemas
- Bordes neutrales (neutral-700/800)
- Backgrounds con backdrop-blur
- Animaciones suaves de hover y transiciones

---

## 📱 Responsividad

- Diseño mobile-first
- Grid adaptativo (1 col móvil, 2+ desktop)
- Touch-friendly (botones grandes con `touch-manipulation`)
- Scroll optimizado con `pb-24` para bottom nav
- Max-width: 5xl (80rem) para desktop

---

## 🚀 Próximos Pasos (No Implementados)

### Backend Real de Matchmaking
Actualmente es simulado. Para producción se necesita:
1. **Cloud Functions** para emparejamiento
2. **Realtime Database** para cola en tiempo real
3. **WebSockets/Firestore Realtime** para sincronización de partidas
4. **Validación servidor-side** de respuestas

### Sistema de Preguntas Ranked
1. Banco de preguntas versionado
2. Semillas sincronizadas para fairness
3. Misma dificultad y taxonomía para ambos jugadores
4. Sistema de rating por pregunta (dificultad adaptativa)

### Características Adicionales
- [ ] Replay de partidas
- [ ] Análisis post-match detallado
- [ ] Estadísticas avanzadas (winrate por región, accuracy)
- [ ] Temporadas automáticas con calendario
- [ ] Títulos y marcos desbloqueables
- [ ] Chat rápido con emotes predefinidos
- [ ] Reconexión automática en desconexión
- [ ] Sistema de reportes y fair play
- [ ] Penalizaciones por abandono escalonadas

---

## 📦 Archivos Creados/Modificados

### Nuevos Archivos
```
utils/rankedElo.ts
components/screens/RankedScreen.tsx
components/MatchmakingModal.tsx
docs/ranked-league-assets.md
docs/ranked-implementation-summary.md
```

### Archivos Modificados
```
types.ts (+ tipos Ranked)
services/firestore.ts (+ funciones Ranked)
App.tsx (+ integración Ranked)
components/screens/HomeScreen.tsx (+ botón acceso)
firestore.rules (+ reglas seguridad)
```

---

## 🧪 Testing

### Casos de Prueba Recomendados
1. ✅ Creación de perfil ranked inicial
2. ✅ Carga de perfil existente
3. ✅ Cálculo de delta correcto (victoria/derrota/empate)
4. ✅ Cambio de liga automático
5. ✅ Límites de delta respetados
6. ✅ Protección provisional funcionando
7. ✅ Leaderboard cargando correctamente
8. ✅ Historial de matches mostrando correctamente
9. ⚠️ Matchmaking real (pendiente backend)
10. ⚠️ Partida completa 1v1 (pendiente implementación)

---

## 💡 Notas de Implementación

### Consideraciones de Rendimiento
- Leaderboard limitado a 50 usuarios
- Historial limitado a 20 partidas
- Queries optimizadas con índices
- Caché de perfil en estado local

### Accesibilidad
- Contraste AA en todos los textos
- Tamaños de fuente legibles
- Touch targets mínimo 44x44px
- Feedback visual claro en interacciones

### Telemetría Futura
Eventos a trackear:
- `ranked_screen_viewed`
- `ranked_matchmaking_started`
- `ranked_match_completed`
- `ranked_league_changed`
- `ranked_season_ended`

---

## 🎯 KPIs del Sistema

Métricas clave a monitorear:
1. **Participación**: % usuarios que juegan Ranked
2. **Retención**: Usuarios activos día 7/30 en Ranked
3. **Distribución de Ligas**: Curva de Bell esperada
4. **Tiempo de matchmaking**: Media <30s
5. **Tasa de abandono**: <5% objetivo
6. **Matches por usuario/día**: 3-5 objetivo

---

## 📞 Soporte

Para dudas sobre implementación:
1. Revisar este documento
2. Ver código inline comments
3. Consultar `docs/ranked-league-assets.md` para assets
4. Revisar tipos en `types.ts`

---

## 📜 Licencia

Parte del proyecto **Anatomy Go** - Sistema educativo de anatomía gamificado.

---

**Última actualización**: 2025-01-09  
**Versión del sistema**: 1.0.0  
**Temporada actual**: VII



