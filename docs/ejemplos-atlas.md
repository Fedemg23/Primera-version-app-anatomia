# Ejemplos de Uso de Atlas

Esta guía muestra diferentes formas de integrar Atlas en tu aplicación.

## 📋 Índice

1. [Uso Básico](#uso-básico)
2. [Atlas Flotante](#atlas-flotante)
3. [Ayuda Contextual](#ayuda-contextual)
4. [Mensajes Personalizados](#mensajes-personalizados)
5. [Integración en Pantallas](#integración-en-pantallas)

---

## Uso Básico

### Atlas Simple

Muestra Atlas sin interacción:

```tsx
import Atlas from './components/Atlas';

function MiComponente() {
    return (
        <div>
            <Atlas expression="happy" size="medium" />
        </div>
    );
}
```

### Con Diferentes Expresiones

```tsx
// Feliz
<Atlas expression="happy" size="medium" />

// Emocionado
<Atlas expression="excited" size="large" />

// Pensativo
<Atlas expression="thinking" size="small" />

// Celebrando
<Atlas expression="celebrating" size="medium" />

// Animando
<Atlas expression="encouraging" size="medium" />
```

---

## Atlas Flotante

### Implementación Básica

Agrega Atlas flotante a cualquier pantalla:

```tsx
import { useState } from 'react';
import FloatingAtlas from './components/FloatingAtlas';

function MiPantalla({ userData }) {
    const [showAtlas, setShowAtlas] = useState(true);

    return (
        <div>
            {/* Tu contenido aquí */}
            
            {showAtlas && (
                <FloatingAtlas 
                    userData={userData}
                    onClose={() => setShowAtlas(false)}
                    autoShow={true}
                    autoHideDelay={10000}
                />
            )}
        </div>
    );
}
```

### Control Manual de Visibilidad

```tsx
const [showAtlas, setShowAtlas] = useState(false);

// Mostrar Atlas cuando el usuario necesite ayuda
const handleNeedHelp = () => {
    setShowAtlas(true);
};

// Ocultar después de cierta acción
const handleCompleteAction = () => {
    setShowAtlas(false);
};
```

---

## Ayuda Contextual

### Botón de Ayuda con Atlas

Perfecto para dar tips específicos en cada pantalla:

```tsx
import AtlasHelper from './components/AtlasHelper';

function PantallaQuiz() {
    return (
        <div>
            <h1>Quiz de Anatomía</h1>
            
            {/* Atlas Helper en la esquina superior derecha */}
            <AtlasHelper 
                message="Lee cada pregunta cuidadosamente. ¡Tómate tu tiempo!"
                expression="encouraging"
                buttonPosition="top-right"
            />
            
            {/* Tu quiz aquí */}
        </div>
    );
}
```

### Diferentes Posiciones

```tsx
// Superior izquierda
<AtlasHelper 
    message="Consejo aquí"
    buttonPosition="top-left"
/>

// Superior derecha (predeterminado)
<AtlasHelper 
    message="Consejo aquí"
    buttonPosition="top-right"
/>

// Inferior izquierda
<AtlasHelper 
    message="Consejo aquí"
    buttonPosition="bottom-left"
/>

// Inferior derecha
<AtlasHelper 
    message="Consejo aquí"
    buttonPosition="bottom-right"
/>
```

---

## Mensajes Personalizados

### Mensajes Basados en Estado del Usuario

```tsx
import Atlas from './components/Atlas';

function MensajeMotivacional({ userData }) {
    const obtenerMensaje = () => {
        if (userData.streak >= 7) {
            return {
                text: `¡${userData.streak} días de racha! ¡Imparable!`,
                expression: 'celebrating'
            };
        }
        
        if (userData.level >= 20) {
            return {
                text: "Eres un maestro de la anatomía. ¡Sigue así!",
                expression: 'excited'
            };
        }
        
        return {
            text: "¡Vamos! Cada pregunta te acerca más a tu meta.",
            expression: 'encouraging'
        };
    };

    const mensaje = obtenerMensaje();

    return (
        <Atlas 
            message={mensaje.text}
            expression={mensaje.expression}
            size="medium"
            showMessage={true}
        />
    );
}
```

### Mensajes de Feedback Inmediato

```tsx
function ResultadoRespuesta({ esCorrecta }) {
    return (
        <Atlas 
            expression={esCorrecta ? 'celebrating' : 'encouraging'}
            message={
                esCorrecta 
                    ? "¡Correcto! ¡Excelente trabajo!" 
                    : "No te preocupes, ¡sigue intentando!"
            }
            showMessage={true}
            size="large"
        />
    );
}
```

---

## Integración en Pantallas

### Pantalla de Bienvenida

```tsx
import Atlas from './components/Atlas';

function PantallaBienvenida({ userName }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1>¡Bienvenido, {userName}!</h1>
            
            <Atlas 
                expression="happy"
                size="large"
                message="¡Hola! Soy Atlas, tu guía en el mundo de la anatomía. ¡Vamos a aprender juntos!"
                showMessage={true}
            />
            
            <button>Comenzar</button>
        </div>
    );
}
```

### Pantalla de Error

```tsx
function PantallaError({ error }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Atlas 
                expression="thinking"
                size="medium"
                message="Ups, algo salió mal. No te preocupes, vamos a resolverlo."
                showMessage={true}
            />
            
            <p className="text-red-500 mt-4">{error.message}</p>
            <button>Reintentar</button>
        </div>
    );
}
```

### Pantalla de Logro Desbloqueado

```tsx
function LogroDesbloqueado({ logro }) {
    return (
        <div className="modal">
            <Atlas 
                expression="celebrating"
                size="large"
                message={`¡Felicidades! Has desbloqueado: ${logro.name}`}
                showMessage={true}
            />
            
            <div className="logro-details">
                <h2>{logro.name}</h2>
                <p>{logro.description}</p>
            </div>
        </div>
    );
}
```

### Durante un Quiz

```tsx
import { useState } from 'react';
import Atlas from './components/Atlas';

function PantallaQuiz() {
    const [respuestasCorrectas, setRespuestasCorrectas] = useState(0);
    const [mostrarAtlas, setMostrarAtlas] = useState(false);

    const handleRespuesta = (esCorrecta) => {
        if (esCorrecta) {
            setRespuestasCorrectas(prev => prev + 1);
            
            // Mostrar Atlas cada 5 respuestas correctas
            if (respuestasCorrectas + 1) % 5 === 0) {
                setMostrarAtlas(true);
                setTimeout(() => setMostrarAtlas(false), 3000);
            }
        }
    };

    return (
        <div>
            {/* Quiz content */}
            
            {mostrarAtlas && (
                <div className="fixed bottom-4 right-4 animate-slide-up-fade">
                    <Atlas 
                        expression="excited"
                        size="medium"
                        message="¡Vas muy bien! ¡Sigue así!"
                        showMessage={true}
                    />
                </div>
            )}
        </div>
    );
}
```

---

## Tips Avanzados

### 1. Atlas con Animación de Entrada

```tsx
import { useState, useEffect } from 'react';

function AtlasAnimado() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setVisible(true), 500);
    }, []);

    return visible ? (
        <div className="animate-slide-up-fade">
            <Atlas expression="happy" size="medium" />
        </div>
    ) : null;
}
```

### 2. Rotación de Mensajes

```tsx
import { useState, useEffect } from 'react';

const mensajes = [
    { text: "¿Sabías que el cerebro consume el 20% de la energía del cuerpo?", expression: "thinking" },
    { text: "¡El corazón late aproximadamente 100,000 veces al día!", expression: "excited" },
    { text: "Tus huesos son más fuertes que el acero.", expression: "happy" },
];

function AtlasMensajesRotativos() {
    const [indice, setIndice] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndice((prev) => (prev + 1) % mensajes.length);
        }, 10000); // Cambiar cada 10 segundos

        return () => clearInterval(timer);
    }, []);

    const mensajeActual = mensajes[indice];

    return (
        <Atlas 
            expression={mensajeActual.expression}
            message={mensajeActual.text}
            showMessage={true}
            size="medium"
        />
    );
}
```

### 3. Atlas Condicional Basado en Progreso

```tsx
function AtlasCondicional({ userData }) {
    // Solo mostrar Atlas si el usuario tiene menos de 3 corazones
    if (userData.hearts >= 3) return null;

    return (
        <FloatingAtlas 
            userData={userData}
            onClose={() => {}}
            autoShow={true}
        />
    );
}
```

---

## Mejores Prácticas

1. **No Sobrecargues la UI**: Usa Atlas con moderación para no distraer al usuario
2. **Contexto Relevante**: Asegúrate de que los mensajes sean relevantes a la situación actual
3. **Expresiones Apropiadas**: Usa expresiones que coincidan con el tono del mensaje
4. **Timing**: Considera cuándo mostrar y ocultar Atlas para mejor UX
5. **Responsive**: Ajusta el tamaño de Atlas según el dispositivo

---

## Solución de Problemas

### Atlas no se muestra

```tsx
// Verifica que el componente esté importado correctamente
import Atlas from './components/Atlas';

// Asegúrate de que no esté oculto por z-index bajo
<Atlas className="z-50" />
```

### Mensajes no aparecen

```tsx
// Asegúrate de que showMessage esté en true
<Atlas showMessage={true} message="Tu mensaje" />
```

### Animaciones no funcionan

```tsx
// Verifica que las clases CSS estén definidas en global.css
// Y que estén siendo importadas correctamente
```

---

¿Necesitas más ejemplos? Consulta la [documentación principal de Atlas](atlas-mascota.md).


