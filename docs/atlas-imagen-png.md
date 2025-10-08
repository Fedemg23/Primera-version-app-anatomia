# 🎨 Guía: Cómo Agregar la Imagen PNG de Atlas

## 📍 Dónde Colocar la Imagen

### Opción Recomendada: `public/images/`

Coloca tu imagen PNG de Atlas en:

```
public/
  images/
    atlas.png  ← Aquí va tu imagen
```

**¿Por qué aquí?**
- Las imágenes en `public/` se sirven directamente sin procesamiento
- Se puede acceder con la ruta `/images/atlas.png`
- Es la misma carpeta donde están las otras imágenes de la app
- No afecta el tamaño del bundle JavaScript

---

## 🖼️ Especificaciones de la Imagen

### Formato Recomendado
- **Formato**: PNG con transparencia
- **Tamaño**: 512x512 px (o mayor, se escalará automáticamente)
- **Fondo**: Transparente
- **Peso**: Menor a 200 KB (idealmente 50-100 KB)

### Optimización
Si tu imagen es muy pesada, puedes optimizarla:

1. **Online**: [TinyPNG](https://tinypng.com/)
2. **Photoshop/GIMP**: Exportar como PNG-8 con transparencia
3. **Comando**: `npx @squoosh/cli --mozjpeg auto atlas.png`

---

## 🎭 Cómo Funciona Atlas con la Imagen

### Uso Automático

El componente `Atlas` ya está configurado para usar tu imagen PNG automáticamente:

```typescript
<Atlas 
  size="medium"      // 'small' | 'medium' | 'large'
  expression="happy"
  useImage={true}    // Por defecto es true
/>
```

### Fallback al SVG

Si la imagen no se encuentra, Atlas usa automáticamente el SVG de respaldo:

```typescript
// En Atlas.tsx
{useImage && !imageError ? (
  <img 
    src="/images/atlas.png" 
    alt="Atlas - La vértebra C1, base del conocimiento"
    onError={() => setImageError(true)}  // Si falla, usa SVG
  />
) : (
  <AtlasSVG expression={displayExpression} size={size} />
)}
```

---

## 📱 Lugares Donde Aparece Atlas

### ✅ Ya Implementados

| Pantalla | Ubicación | Tamaño | Expresión |
|----------|-----------|--------|-----------|
| **Tutorial** | Guía paso a paso | Medium | Varía según paso |
| **Home** | FloatingAtlas (esquina) | Small | Happy |
| **AtlasScreen** | Junto al título | Small | Happy |
| **QuizSummary** | Resultado del quiz | Medium | Según puntuación |
| **Profile** | Parte superior | Small | Happy |
| **Shop** | Banner informativo | Small | Happy |

### 🎯 Lugares Sugeridos para Agregar Atlas

#### 1. **Pantalla de Login**
```typescript
// En LoginScreen.tsx
<Atlas 
  size="large"
  expression="excited"
  message="¡Bienvenido a Anatomy Go! Soy Atlas (C1), tu guía anatómica. 🦴"
  showMessage={true}
/>
```

#### 2. **Antes de Empezar un Quiz**
```typescript
// En RegionScreen.tsx o antes de iniciar quiz
<Atlas 
  size="small"
  expression="encouraging"
  message="¡Vamos! Yo sostengo el cráneo, tú sostén el conocimiento. 💪"
  showMessage={true}
/>
```

#### 3. **Pantalla de Logros**
```typescript
// En AchievementsScreen.tsx
<Atlas 
  size="small"
  expression="celebrating"
  message="¡Mira todos tus logros! Como yo, cada uno es una base sólida. 🏆"
  showMessage={false}
/>
```

#### 4. **Leaderboard**
```typescript
// En LeaderboardScreen.tsx
<Atlas 
  size="small"
  expression="thinking"
  message="Aquí están los mejores estudiantes. ¡Sigue estudiando para subir! 📊"
  showMessage={false}
/>
```

#### 5. **Pantalla de Error**
```typescript
// En ErrorBoundary.tsx
<Atlas 
  size="medium"
  expression="encouraging"
  message="Ups, algo salió mal. Pero no te preocupes, ¡volveremos pronto! 🔧"
  showMessage={true}
/>
```

---

## 🎨 Personalizar la Apariencia de Atlas

### Tamaños Disponibles

```typescript
// Pequeño (64x64px) - Para barras laterales, corners
<Atlas size="small" />

// Mediano (96x96px) - Para diálogos, tutoriales
<Atlas size="medium" />

// Grande (128x128px) - Para pantallas principales
<Atlas size="large" />
```

### Expresiones Disponibles

```typescript
export type AtlasExpression = 
  | 'happy'        // Feliz, neutro positivo
  | 'excited'      // Emocionado, energético
  | 'thinking'     // Pensativo, reflexivo
  | 'celebrating'  // Celebrando, victoria
  | 'encouraging'  // Animando, motivacional
  | 'neutral';     // Neutral, por defecto
```

**Nota**: Con `useImage={true}`, las expresiones no cambian la imagen PNG (siempre es la misma). Solo afectan al SVG de respaldo.

---

## 🔄 Versiones Alternativas de Atlas

Si quieres tener múltiples versiones de Atlas (con diferentes expresiones):

### Opción 1: Múltiples Imágenes

```
public/
  images/
    atlas-happy.png
    atlas-excited.png
    atlas-thinking.png
    atlas-celebrating.png
```

Modificar `Atlas.tsx`:
```typescript
const atlasImages = {
  happy: '/images/atlas-happy.png',
  excited: '/images/atlas-excited.png',
  thinking: '/images/atlas-thinking.png',
  celebrating: '/images/atlas-celebrating.png',
  encouraging: '/images/atlas-encouraging.png',
  neutral: '/images/atlas-happy.png',
};

<img 
  src={atlasImages[displayExpression]} 
  alt="Atlas - La vértebra C1, base del conocimiento"
  className={`${sizeClasses[size]} object-contain transition-transform duration-300 group-hover:scale-110`}
  onError={() => setImageError(true)}
/>
```

### Opción 2: Sprite Sheet

Si tienes un sprite sheet con todas las expresiones:

```
public/
  images/
    atlas-sprite.png  (contiene todas las expresiones en fila)
```

Usar CSS para cambiar la posición del sprite según la expresión.

---

## 🧪 Probar la Imagen

### 1. Colocar la Imagen

Copia tu `atlas.png` a `public/images/atlas.png`

### 2. Reiniciar el Servidor de Desarrollo

```bash
npm run dev
```

### 3. Verificar en el Navegador

Abre: `http://localhost:5173/images/atlas.png`

Deberías ver tu imagen de Atlas.

### 4. Ver Atlas en la App

Navega a cualquiera de estas pantallas:
- **Perfil** (tu icono de perfil)
- **Tienda** (icono del carrito)
- **Tutorial** (si eres usuario nuevo)
- **Resultado de Quiz** (completa cualquier quiz)

---

## 🎭 Descripción de Atlas (Para Referencia del Diseñador)

### Concepto

**Atlas (C1)** es la primera vértebra cervical que sostiene el cráneo. Representa:

- 🏛️ **Base del conocimiento**: Como sostiene el cráneo, Atlas sostiene todo el aprendizaje
- 🧠 **Conexión cerebro-cuerpo**: Es el puente entre la cabeza y el resto del cuerpo
- 💪 **Fuerza y estabilidad**: Pequeño pero crucial
- 🎓 **Guía educativa**: Mascota amigable y motivadora

### Características Visuales Sugeridas

- **Forma**: Basada en la anatomía real de la vértebra C1 (anillo óseo)
- **Ojos**: Grandes y expresivos (estilo caricatura amigable)
- **Color**: Tonos blancos/beige (hueso) con detalles anatómicos
- **Expresión**: Amigable, sabio, motivador
- **Extras**: Puede tener una pequeña corona o gorro de graduación

### Estilo Visual

- **Tipo**: Caricatura educativa, estilo friendly
- **Inspiración**: Mascota universitaria, personaje de app educativa
- **Público**: Estudiantes de medicina/anatomía (universitarios)
- **Tono**: Profesional pero accesible, motivador

---

## 📊 Estadísticas de Uso de Atlas

Después de implementar la imagen, Atlas aparece en:

- ✅ 6+ pantallas diferentes
- ✅ Tutorial interactivo (10 pasos)
- ✅ FloatingAtlas (siempre visible en Home)
- ✅ Mensajes contextuales según el rendimiento del usuario
- ✅ Como avatar desbloqueable en nivel 15

---

## 🛠️ Solución de Problemas

### La imagen no aparece

1. **Verificar ruta**: Asegúrate de que esté en `public/images/atlas.png`
2. **Limpiar caché**: `Ctrl + Shift + R` en el navegador
3. **Reiniciar servidor**: `npm run dev`
4. **Verificar nombre**: Debe ser exactamente `atlas.png` (minúsculas)

### La imagen se ve pixelada

1. **Aumentar resolución**: Usa 1024x1024px en lugar de 512x512px
2. **Verificar formato**: PNG de alta calidad
3. **Revisar exportación**: No comprimir demasiado

### La imagen es muy pesada

1. **Optimizar con TinyPNG**: https://tinypng.com/
2. **Reducir resolución**: 512x512px es suficiente
3. **Comprimir**: PNG-8 con transparencia

---

## 📚 Recursos Adicionales

### Anatomía de la Vértebra C1 (Atlas)

Para diseñadores que quieran crear una versión precisa:

- [Atlas Vertebra - Wikipedia](https://en.wikipedia.org/wiki/Atlas_(anatomy))
- Características clave:
  - Forma de anillo
  - Dos masas laterales
  - Arco anterior y posterior
  - Sin cuerpo vertebral (única característica)

### Inspiración Visual

- **Duolingo** (búho mascota educativa)
- **Kahoot** (personajes divertidos)
- **Anatomía apps** (visualización 3D pero caricaturesca)

---

## ✅ Checklist Final

Antes de lanzar la imagen de Atlas:

- [ ] Imagen colocada en `public/images/atlas.png`
- [ ] Formato PNG con transparencia
- [ ] Tamaño optimizado (< 200 KB)
- [ ] Resolución adecuada (512x512px mínimo)
- [ ] Probado en navegador (`/images/atlas.png`)
- [ ] Verificado en todas las pantallas donde aparece
- [ ] Fallback al SVG funciona correctamente
- [ ] Se ve bien en móvil y desktop

---

## 🎉 ¡Listo!

Una vez colocada la imagen de Atlas en `public/images/atlas.png`, se mostrará automáticamente en toda la app. El sistema está diseñado para usar tu imagen PNG por defecto y tener un SVG de respaldo si algo falla.

**¡Atlas está listo para guiar a los estudiantes en su viaje por la anatomía! 🦴📚**





