# Atlas - La Mascota de Anatomy Go

## 🎭 Descripción

**Atlas** es la mascota oficial de Anatomy Go, un compañero amigable con forma de cerebro estilizado que acompaña a los usuarios en su viaje de aprendizaje anatómico.

## 🎨 Características

### Expresiones de Atlas

Atlas puede mostrar diferentes expresiones según el contexto:

- **`happy`** - Sonrisa amigable (predeterminada)
- **`excited`** - Emocionado con ojos brillantes
- **`celebrating`** - Celebrando logros
- **`encouraging`** - Animando al usuario
- **`thinking`** - Pensativo y reflexivo
- **`neutral`** - Expresión neutral

### Tamaños Disponibles

- **`small`** - 64x64px (para íconos y botones)
- **`medium`** - 96x96px (predeterminado)
- **`large`** - 128x128px (para destacar)

## 📦 Componentes

### 1. `Atlas.tsx`

Componente base que renderiza la mascota con diferentes expresiones y tamaños.

**Uso básico:**
```tsx
import Atlas from './components/Atlas';

<Atlas 
  expression="happy"
  size="medium"
/>
```

**Con mensaje contextual:**
```tsx
<Atlas 
  userData={userData}
  size="medium"
  showMessage={true}
  onMessageDismiss={() => console.log('Mensaje cerrado')}
/>
```

### 2. `FloatingAtlas.tsx`

Componente flotante que aparece en la esquina de la pantalla con estadísticas y mensajes motivacionales.

**Uso:**
```tsx
import FloatingAtlas from './components/FloatingAtlas';

<FloatingAtlas 
  userData={userData}
  onClose={() => setShowAtlas(false)}
  autoShow={true}
  autoHideDelay={10000}
/>
```

**Props:**
- `userData`: Datos del usuario para mensajes contextuales
- `onClose`: Callback cuando se cierra
- `autoShow`: Si debe mostrarse automáticamente (default: true)
- `autoHideDelay`: Tiempo antes de minimizarse en ms (default: 8000)

## 💬 Mensajes Contextuales

Atlas genera mensajes automáticos basados en el estado del usuario:

- **Racha alta** (≥7 días): Felicita al usuario por su dedicación
- **Corazones bajos** (≤1): Recuerda que puede comprar más
- **Nivel alto** (≥10): Reconoce la experiencia del usuario
- **Quizzes perfectos**: Celebra los logros perfectos
- **Mensajes aleatorios**: Motivación general

## 🎯 Ubicaciones

Atlas aparece actualmente en:

1. **HomeScreen** - Versión flotante con auto-minimizado
2. **AtlasScreen** - Versión pequeña junto al título del mapa de progreso

## 🔧 Personalización

### Agregar Atlas a nuevas pantallas

```tsx
import Atlas from '../Atlas';

// Versión simple
<Atlas expression="happy" size="small" />

// Con mensajes
<Atlas 
  userData={userData}
  showMessage={true}
  message="¡Mensaje personalizado!"
  expression="excited"
/>
```

### Crear nuevas expresiones

Para agregar una nueva expresión, edita el archivo `Atlas.tsx`:

1. Agrega el tipo a `AtlasExpression`
2. Implementa los ojos en la función `getEyes()`
3. Implementa la boca en la función `getMouth()`
4. Opcionalmente, agrega mejillas sonrojadas u otros detalles

### Personalizar mensajes

Edita la función `getAtlasMessage()` en `Atlas.tsx` para agregar nuevos mensajes contextuales basados en las estadísticas del usuario.

## 🎨 Diseño Visual

Atlas está diseñado como:
- Forma de cerebro estilizado (cuerpo principal en tono índigo)
- Líneas anatómicas sutiles que simulan pliegues cerebrales
- Gorro de anatomista con símbolo médico (+)
- Orejas pequeñas a los lados
- Expresiones faciales animadas

## 🌟 Futuras Mejoras

Ideas para expandir Atlas:

- [ ] Más expresiones (sorprendido, confundido, etc.)
- [ ] Animaciones de entrada/salida más elaboradas
- [ ] Sistema de personalización (colores, accesorios)
- [ ] Integración con sistema de logros
- [ ] Voz/sonidos de Atlas
- [ ] Mini-juegos interactivos con Atlas
- [ ] Atlas como tutor en el modo duelo
- [ ] Animaciones de reacción a respuestas correctas/incorrectas
- [ ] Sistema de "estado de ánimo" que cambia con el tiempo

## 📝 Notas Técnicas

- Renderizado con SVG para escalado perfecto
- Optimizado con `React.memo` para rendimiento
- Animaciones CSS para transiciones suaves
- Mensajes almacenados en localStorage para persistencia
- Diseño responsive que se adapta a diferentes tamaños de pantalla

## 🤝 Contribuir

Para mejorar Atlas:

1. Mantén el diseño coherente con el tema anatómico
2. Asegúrate de que las animaciones sean suaves (60fps)
3. Prueba en diferentes dispositivos y tamaños de pantalla
4. Documenta cualquier nueva funcionalidad

---

¡Atlas está aquí para hacer el aprendizaje de anatomía más amigable y motivador! 🧠✨


