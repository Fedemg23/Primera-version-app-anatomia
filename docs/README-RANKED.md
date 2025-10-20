# 🏆 Sistema Ranked - Documentación Completa

## Resumen Ejecutivo

Se ha implementado un **sistema competitivo 1v1 completo** para Anatomy Go que permite a los usuarios:
- Competir en partidas clasificatorias 1v1
- Ganar/perder **Eritros** (rating) según rendimiento
- Ascender a través de **6 ligas** (Bronce → Diamante)
- Ver clasificaciones globales y de amigos
- Recibir recompensas de temporada

---

## 📚 Documentación Disponible

### 1. [Resumen de Implementación](./ranked-implementation-summary.md)
**Lo más importante para empezar**
- Descripción general del sistema
- Componentes implementados
- Sistema de ligas y recompensas
- Características técnicas (fórmula ELO)
- Próximos pasos y pendientes

### 2. [Ejemplos de Uso](./ranked-usage-examples.md)
**Guía práctica con código**
- Inicializar perfil ranked
- Calcular delta de rating
- Actualizar perfiles post-match
- Cargar leaderboards
- Sistema de matchmaking (conceptual)
- Aplicar decaimiento y resets
- Componentes React de ejemplo

### 3. [Assets de Ligas](./ranked-league-assets.md)
**Prompts para generar imágenes**
- Prompts para Midjourney/DALL-E/Stable Diffusion
- Especificaciones de cada emblema (Bronce → Diamante)
- Monedas del sistema (Neuronas, Eritros)
- Implementación actual con CSS
- Checklist de implementación

---

## 🚀 Quick Start

### Para Desarrolladores

1. **Ver la implementación**:
   ```bash
   # Archivos principales
   types.ts                              # Tipos
   utils/rankedElo.ts                    # Lógica ELO
   services/firestore.ts                 # API Backend
   components/screens/RankedScreen.tsx   # UI Principal
   components/MatchmakingModal.tsx       # Cola de búsqueda
   App.tsx                               # Integración
   ```

2. **Probar localmente**:
   - Navegar a `/ranked` en la app
   - El perfil se crea automáticamente al autenticarse
   - Rating inicial: 1000 Eritros (Liga Bronce)

3. **Deploy de reglas de seguridad**:
   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only firestore:indexes
   ```

### Para Diseñadores

1. **Generar assets**:
   - Ver [ranked-league-assets.md](./ranked-league-assets.md)
   - Usar los prompts proporcionados
   - Guardar en `public/images/leagues/`

2. **Actualizar componente**:
   - Editar `components/screens/RankedScreen.tsx`
   - Reemplazar gradientes CSS por `<img>` tags

---

## 🎯 Estado de Implementación

### ✅ Completado

- [x] Sistema de tipos TypeScript
- [x] Utilidades de cálculo ELO adaptado
- [x] API de Firestore (perfiles, matches, leaderboard)
- [x] Pantalla principal de Ranked
- [x] Modal de matchmaking (simulado)
- [x] Integración en App.tsx
- [x] Botón de acceso desde Home
- [x] Reglas de seguridad Firestore
- [x] Índices de base de datos
- [x] Documentación completa

### ⏳ Pendiente (Backend Real)

- [ ] Sistema de matchmaking en tiempo real
- [ ] Validación servidor-side de respuestas
- [ ] Lógica de partidas 1v1 completa
- [ ] Cloud Functions para matches
- [ ] Sistema de reconexión
- [ ] Anti-cheat avanzado
- [ ] Telemetría y analytics

### 🎨 Pendiente (Assets)

- [ ] Generar emblemas PNG de ligas
- [ ] Generar ícono de Eritros 3D
- [ ] Generar ícono de Neuronas 3D
- [ ] Optimizar para WebP
- [ ] Actualizar componente LeagueEmblem

---

## 📊 Estructura de Archivos

```
proyecto/
├── types.ts                    # ✅ Tipos Ranked agregados
├── App.tsx                     # ✅ Integración completa
├── firestore.rules            # ✅ Reglas de seguridad
├── firestore.indexes.json     # ✅ Índices agregados
│
├── utils/
│   └── rankedElo.ts           # ✅ Nuevo - Lógica ELO
│
├── services/
│   └── firestore.ts           # ✅ API Ranked agregada
│
├── components/
│   ├── MatchmakingModal.tsx   # ✅ Nuevo - Modal de búsqueda
│   └── screens/
│       ├── RankedScreen.tsx   # ✅ Nuevo - Pantalla principal
│       └── HomeScreen.tsx     # ✅ Botón de acceso agregado
│
└── docs/
    ├── README-RANKED.md                    # 📄 Este archivo
    ├── ranked-implementation-summary.md    # 📄 Resumen técnico
    ├── ranked-usage-examples.md           # 📄 Ejemplos prácticos
    └── ranked-league-assets.md            # 📄 Prompts de arte
```

---

## 🔑 Conceptos Clave

### Sistema ELO Adaptado

```
Δ = K × (S - E)

Donde:
- K = Factor dinámico (28-40)
- S = Score (1 win, 0 loss, 0.5 draw)
- E = Expectativa (basada en diferencia de rating)
```

**Características especiales:**
- K aumenta con rachas
- Límites por liga (±18 a ±35)
- Protección provisional (primeras 10 partidas)
- Ajuste por margen de victoria

### Ligas

| Liga | Rating | Delta Límite |
|------|--------|--------------|
| 🥉 Bronce | 0-999 | ±18 |
| 🥈 Plata | 1000-1499 | ±18 |
| 🥇 Oro | 1500-1999 | ±25 |
| 💎 Rubí | 2000-2399 | ±30 |
| 💚 Esmeralda | 2400-2799 | ±30 |
| 💠 Diamante | 2800+ | ±35 |

### Decaimiento

- **Trigger**: 14+ días sin jugar
- **Tasa**: -10 rating/semana
- **Mínimo**: 800 rating
- **Protección**: Campo `decayProtectedUntil`

### Reset de Temporada

- **Reducción**: 30% del rating
- **Conserva**: Mínimo de liga alcanzada
- **Recompensas**: Según liga final

---

## 🎮 Modos de Juego

1. **Clásico**: Standard Q&A
2. **Ataque por Vida**: Sistema de HP
3. **Robo de Puntos**: Robar al rival
4. **Imagen-Click**: Preguntas visuales
5. **Muerte Súbita**: First mistake loses

---

## 🔒 Seguridad

### Firestore Rules

```javascript
// Perfiles Ranked
- Read: Público (para leaderboard)
- Create: Solo propio perfil
- Update: Solo propio + validación delta máx ±50

// Matches
- Read: Solo participantes
- Create: Solo participantes
- Update: Prohibido (inmutable)
```

### Anti-Abuso

- Validación de cambios máximos por actualización
- Matches inmutables post-creación
- Límites de delta por liga
- Protección provisional
- (Pendiente) Validación servidor-side de respuestas

---

## 📈 Métricas de Éxito (KPIs)

1. **Participación**: % usuarios activos en Ranked
2. **Retención D7/D30**: Usuarios volviendo al modo
3. **Distribución de ligas**: Curva normal esperada
4. **Tiempo matchmaking**: <30s promedio
5. **Tasa abandono**: <5%
6. **Matches/usuario/día**: 3-5 objetivo

---

## 🐛 Troubleshooting

### "No se carga el perfil ranked"
- Verificar autenticación activa
- Revisar permisos Firestore
- Check console para errores

### "Leaderboard vacío"
- Verificar índices Firestore desplegados
- Comprobar que hay usuarios con `provisionalGames === 0`
- Ver reglas de lectura

### "Delta de rating incorrecto"
- Verificar inputs a `calculateRatingDelta()`
- Comprobar liga actual del usuario
- Revisar límites por liga en `getDeltaLimits()`

### "Modal de matchmaking no aparece"
- Verificar estado `rankedProfile` cargado
- Check `isMatchmaking === true`
- Revisar condición de render en App.tsx

---

## 🤝 Contribuir

### Para agregar un nuevo modo de juego:

1. Agregar tipo a `MatchMode` en `types.ts`
2. Actualizar selector en `RankedScreen.tsx`
3. Implementar lógica de preguntas
4. (Opcional) Ajustar cálculo de delta si cambia scoring

### Para modificar sistema de rating:

1. Editar funciones en `utils/rankedElo.ts`
2. Actualizar tests (si existen)
3. Documentar cambios en esta guía

---

## 📞 Soporte

¿Dudas sobre la implementación?

1. **Primero**: Revisar [ranked-implementation-summary.md](./ranked-implementation-summary.md)
2. **Segundo**: Ver [ranked-usage-examples.md](./ranked-usage-examples.md)
3. **Tercero**: Revisar inline comments en código
4. **Último**: Abrir issue/ticket

---

## 📜 Changelog

### v1.0.0 (2025-01-09)
- ✅ Implementación inicial completa
- ✅ Sistema ELO adaptado
- ✅ 6 ligas funcionales
- ✅ Leaderboards
- ✅ Matchmaking simulado
- ✅ Documentación completa

### Próximas versiones
- v1.1.0: Backend real de matchmaking
- v1.2.0: Sistema de partidas completo
- v1.3.0: Assets visuales finales
- v2.0.0: Temporadas automáticas + avanzados

---

## 🎨 Créditos

**Sistema Ranked** para **Anatomy Go**  
Implementado siguiendo especificación del documento original.

**Tecnologías:**
- TypeScript
- React
- Firebase/Firestore
- Tailwind CSS

---

## 📄 Licencia

Parte del proyecto Anatomy Go - Sistema educativo de anatomía gamificado.

---

**Última actualización**: 2025-01-09  
**Versión**: 1.0.0  
**Estado**: ✅ Producción (Frontend) / ⏳ Desarrollo (Backend)






