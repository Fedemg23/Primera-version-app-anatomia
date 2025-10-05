# Tutorial Interactivo con Atlas

## 🎓 Descripción

El Tutorial Interactivo es un sistema de onboarding completo que guía a los nuevos usuarios a través de todas las funcionalidades de Anatomy Go, con **Atlas** como guía personal.

## ✨ Características Principales

### 1. **Guiado por Atlas**
- Atlas aparece en cada paso con diferentes expresiones
- Mensajes personalizados y motivacionales
- Conexión emocional con el usuario desde el primer momento

### 2. **Navegación Automática**
- El tutorial navega automáticamente entre pantallas
- Resalta elementos específicos de la UI
- Spotlight effect en elementos importantes

### 3. **Progreso Visual**
- Barra de progreso en la parte superior
- Indicadores de paso actual
- Contador de pasos completados

### 4. **Contenido Completo**
El tutorial cubre **20 pasos** que incluyen:

#### Recursos del Juego
- Corazones (vidas)
- Huesitos (moneda)
- Racha de días
- Nivel y experiencia

#### Modos de Juego
- Modo Estudio
- Modo Examen
- Desafíos Diarios
- Duelos con IA

#### Funcionalidades
- Tienda y compras
- Comodines y power-ups
- Sistema de logros
- Mapa de progreso
- Perfil y avatares

#### Consejos Prácticos
- Práctica diaria
- Uso estratégico del Modo Estudio
- Revisión de errores

## 🚀 Flujo de Usuario

```
1. Usuario crea cuenta
   ↓
2. LoginScreen - Ingresa nombre
   ↓
3. WelcomeModal - Mensaje de bienvenida
   ↓
4. [Automático] Tutorial Interactivo se abre
   ↓
5. Usuario completa 20 pasos guiados
   ↓
6. Tutorial marca hasCompletedWelcome = true
   ↓
7. Usuario puede comenzar a usar la app
```

## 📝 Implementación

### Componente Principal

**Archivo:** `components/InteractiveTutorial.tsx`

```tsx
<InteractiveTutorial 
  isOpen={isTourOpen}
  onClose={() => setIsTourOpen(false)}
  userName={userData.name}
/>
```

### Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `isOpen` | `boolean` | Controla si el tutorial está visible |
| `onClose` | `() => void` | Callback cuando el tutorial se cierra |
| `userName` | `string` | Nombre del usuario para personalización |

### Estructura de un Paso

```typescript
type TutorialStep = {
  id: string;                    // Identificador único
  view?: string;                 // Vista a la que navegar
  title: string;                 // Título del paso
  description: string;           // Descripción detallada
  atlasExpression: AtlasExpression; // Expresión de Atlas
  atlasMessage: string;          // Mensaje de Atlas
  anchorSelector?: string;       // Selector CSS del elemento a resaltar
  highlightSelector?: string;    // Selector para destacar
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'none';     // Acción interactiva
  interactiveDemo?: boolean;     // Si requiere demostración
}
```

## 🎨 Diseño Visual

### Colores y Estilos
- **Fondo:** Gradiente slate-900 → slate-800 → slate-900
- **Borde:** Indigo-500/30 con efecto glow
- **Barra de progreso:** Gradiente indigo-500 → purple-500
- **Spotlight:** Borde azul con shadow expandido

### Animaciones
- Transición suave entre pasos (300ms)
- Fade in/out con opacidad
- Pulse lento en spotlight
- Slide up para aparición

### Responsive
- Max-width: 512px (max-w-lg)
- Padding adaptable
- Botones touch-optimized

## 🔄 Ciclo de Vida

### Inicialización
1. Usuario completa WelcomeModal
2. `handleCompleteWelcome` se ejecuta
3. Espera 500ms
4. `setIsTourOpen(true)` se activa
5. Tutorial aparece con fade-in

### Durante el Tutorial
1. Usuario ve paso actual
2. Puede navegar con botones Atrás/Siguiente
3. Puede saltar con confirmación
4. Sistema navega automáticamente entre vistas
5. Elementos se resaltan automáticamente

### Finalización
1. Usuario llega al último paso
2. Presiona "¡Comenzar!"
3. `onClose` callback se ejecuta
4. `hasCompletedWelcome` se marca como `true`
5. Tutorial se cierra con fade-out

## 🎯 Casos de Uso

### 1. Usuario Nuevo
```tsx
// En App.tsx
if (isNewUser && !loadedData.hasCompletedWelcome) {
    setShowWelcomeModal(true);
}

// Después del welcome
handleCompleteWelcome(name) {
    // ...
    setTimeout(() => setIsTourOpen(true), 500);
}
```

### 2. Repetir Tutorial
```tsx
// Desde el menú de ajustes
<button onClick={() => {
    (window as any).__OPEN_TOUR__?.();
    onClose();
}}>
    Iniciar Tutorial
</button>
```

### 3. Skip Tutorial
```tsx
// Usuario presiona "Saltar tutorial"
if (confirm('¿Estás seguro...?')) {
    onClose(); // Cierra inmediatamente
}
```

## 📊 Métricas y Tracking

### Estados del Tutorial
- `currentStep`: Paso actual (0-19)
- `progress`: Porcentaje completado
- `isTransitioning`: Si está en transición
- `anchorRect`: Posición del elemento resaltado

### Global Flags
- `__TOUR_ACTIVE__`: Indica que el tutorial está activo
- `__NAVIGATE__`: Función para navegar entre vistas
- `__SCROLL_TO__`: Función para hacer scroll a elementos

## 🛠️ Personalización

### Agregar un Nuevo Paso

```typescript
{
  id: 'nuevo-paso',
  view: 'home', // o cualquier View válida
  title: 'Título del Paso',
  description: 'Descripción detallada de la funcionalidad.',
  atlasExpression: 'happy', // o cualquier AtlasExpression
  atlasMessage: 'Mensaje motivacional de Atlas',
  anchorSelector: '[data-tour="elemento"]', // opcional
  placement: 'bottom', // o top, left, right, center
}
```

### Modificar Expresiones de Atlas

Las expresiones disponibles:
- `happy` - Sonrisa amigable
- `excited` - Emocionado
- `celebrating` - Celebrando
- `encouraging` - Animando
- `thinking` - Pensativo
- `neutral` - Neutral

### Cambiar el Orden de los Pasos

Simplemente reordena el array `tutorialSteps` en `InteractiveTutorial.tsx`.

## 🔧 Configuración Avanzada

### Timing de Transiciones

```typescript
// Delay antes de mostrar el tutorial
setTimeout(() => setIsTourOpen(true), 500);

// Delay entre pasos
setTimeout(() => setCurrentStep(prev => prev + 1), 150);

// Delay para calcular posición del anchor
setTimeout(() => {
  const rect = getAnchorRect(step.anchorSelector);
  setAnchorRect(rect);
}, 300);
```

### Spotlight Personalizado

```css
/* En global.css */
.spotlight-custom {
  box-shadow: 0 0 0 9999px rgba(0,0,0,0.7);
  border: 4px solid theme('colors.blue.500');
  border-radius: theme('borderRadius.lg');
}
```

## 📱 Responsive Behavior

### Mobile
- Tooltip centrado en pantalla
- Sin anchors en mobile si es complicado
- Botones más grandes (touch-friendly)

### Tablet
- Tooltips posicionados cerca de elementos
- Spotlight más visible
- Textos con tamaño intermedio

### Desktop
- Tooltips con posicionamiento preciso
- Spotlight con offset adecuado
- Navegación con teclado opcional (futuro)

## 🐛 Troubleshooting

### El tutorial no se abre automáticamente
**Causa:** `hasCompletedWelcome` ya está en `true`
**Solución:** Verificar que sea un usuario nuevo

### Elementos no se resaltan
**Causa:** Selector CSS incorrecto o elemento no existe
**Solución:** Verificar con DevTools que el selector funciona

### Transiciones entrecortadas
**Causa:** Demasiadas animaciones simultáneas
**Solución:** Aumentar delays o simplificar animaciones

### Tutorial se cierra solo
**Causa:** Click fuera del contenido
**Solución:** Verificar propagación de eventos

## 🎬 Mejoras Futuras

### Corto Plazo
- [ ] Animaciones de Atlas más elaboradas
- [ ] Sonidos en cada paso
- [ ] Opción de reanudar tutorial
- [ ] Guardar progreso del tutorial

### Medio Plazo
- [ ] Tutorial contextual por sección
- [ ] Tooltips inline permanentes
- [ ] Sistema de hints progresivos
- [ ] Gamificación del tutorial (XP por completarlo)

### Largo Plazo
- [ ] Tutorial adaptativo según comportamiento
- [ ] A/B testing de diferentes flujos
- [ ] Analytics de pasos problemáticos
- [ ] Tutorial en múltiples idiomas

## 🤝 Contribuir

Para mejorar el tutorial:

1. Identifica puntos confusos para usuarios
2. Agrega pasos específicos si faltan
3. Mejora mensajes de Atlas
4. Optimiza animaciones y transiciones
5. Documenta cambios importantes

---

**El tutorial es la primera impresión que tienen los usuarios de Anatomy Go. ¡Hagámosla memorable! 🚀**


