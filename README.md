# Anatomy Go - Aplicación de Aprendizaje de Anatomía

Una aplicación interactiva para aprender anatomía de forma divertida y efectiva, con gamificación, avatares desbloqueables, y **Atlas**, nuestra mascota guía.

## ✨ Características Principales

- 🎮 **Modos de Juego**: Estudio, Examen, Duelos con IA
- 🧠 **Atlas - La Mascota**: Un compañero inteligente que te guía y motiva
- 🏆 **Sistema de Logros y Niveles**
- 💀 **Sistema de Vidas y Rachas**
- 🎁 **Tienda con Power-ups**
- 📊 **Seguimiento de Progreso**
- 🗺️ **Mapa Anatómico Interactivo**

## 🦴 Atlas (C1) - La Mascota Guía

**Atlas** es la mascota oficial de Anatomy Go, representando la primera vértebra cervical (C1) que sostiene el cráneo - simbolizando cómo sostiene toda la base del conocimiento anatómico.

### Características de Atlas

- 🎨 **Imagen PNG personalizada** (`/images/Atlas.png`)
- 💬 **Mensajes contextuales** según tu rendimiento y progreso
- 🎭 **Múltiples expresiones** (happy, excited, thinking, celebrating, encouraging)
- 📍 **Presente en 8+ pantallas** de la aplicación
- 🎓 **Guía el tutorial interactivo** para nuevos usuarios
- 🏆 **Feedback motivacional** después de cada quiz
- 💡 **Consejos útiles** en tienda, logros y más
- 🎮 **Disponible como avatar** al alcanzar el nivel 15

### Dónde Aparece Atlas

| Pantalla | Función |
|----------|---------|
| **Login** | Da la bienvenida |
| **Home** | FloatingAtlas con estadísticas |
| **Quiz Summary** | Feedback según puntuación |
| **Profile** | Saludo personalizado |
| **Shop** | Consejos de compra |
| **Achievements** | Celebra tus logros |
| **Tutorial** | Guía paso a paso |
| **Atlas Screen** | Su propia sección |

### Documentación

- 📖 [Documentación completa de Atlas](docs/atlas-mascota.md)
- 🗺️ [Mapa de ubicaciones](docs/atlas-ubicaciones.md)
- 🎨 [Guía de imagen PNG](docs/atlas-imagen-png.md)

## 🎓 Tutorial Interactivo

Los nuevos usuarios son recibidos con un **tutorial interactivo completo** de 20 pasos que cubre:

- ✅ Sistema de recursos (corazones, huesitos, racha)
- ✅ Todos los modos de juego
- ✅ Tienda y comodines
- ✅ Sistema de logros y progreso
- ✅ Consejos prácticos de estudio

**Características del tutorial:**
- Guiado por Atlas con mensajes personalizados
- Navegación automática entre pantallas
- Spotlight visual en elementos importantes
- Puede repetirse desde el menú de ajustes

Consulta la [documentación del tutorial](docs/tutorial-interactivo.md) para más detalles.

## 🚀 Ejecutar Localmente

**Prerequisitos:** Node.js (v16 o superior)

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar la API de Gemini:
   - Crea un archivo `.env.local`
   - Agrega tu clave: `GEMINI_API_KEY=tu_clave_aqui`

3. Ejecutar la aplicación:
   ```bash
   npm run dev
   ```

4. Abrir en el navegador:
   ```
   http://localhost:5173
   ```

## 📁 Estructura del Proyecto

```
anatomy-go/
├── components/          # Componentes React
│   ├── Atlas.tsx       # Componente base de la mascota
│   ├── FloatingAtlas.tsx  # Versión flotante de Atlas
│   ├── AtlasHelper.tsx    # Ayuda contextual con Atlas
│   └── screens/        # Pantallas principales
├── constants.ts        # Datos de preguntas, avatares, logros
├── types.ts           # Tipos TypeScript
├── services/          # Firebase y servicios
├── docs/              # Documentación
│   └── atlas-mascota.md  # Guía de Atlas
└── public/            # Recursos estáticos
    └── images/        # Imágenes de la app
```

## 🎨 Componentes de Atlas

### `Atlas.tsx`
Componente base con diferentes expresiones y tamaños:
```tsx
<Atlas expression="happy" size="medium" showMessage={true} />
```

### `FloatingAtlas.tsx`
Versión flotante que aparece en esquinas:
```tsx
<FloatingAtlas userData={userData} autoShow={true} />
```

### `AtlasHelper.tsx`
Botón de ayuda contextual:
```tsx
<AtlasHelper message="¡Consejo útil aquí!" expression="thinking" />
```

## 🔧 Tecnologías

- **React** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (estilos)
- **Firebase** (backend)
- **Google Gemini AI** (modo duelo)

## 📚 Recursos Adicionales

- [Documentación de Atlas](docs/atlas-mascota.md)
- [Tutorial Interactivo](docs/tutorial-interactivo.md)
- [Ejemplos de Atlas](docs/ejemplos-atlas.md)
- [Optimización de Imágenes](docs/image-optimization.md)
- [Guía de Resolución de Problemas](TROUBLESHOOTING.md)

## 🤝 Contribuir

Para agregar nuevas funcionalidades a Atlas o mejorar la aplicación:

1. Mantén la coherencia con el diseño existente
2. Documenta los cambios importantes
3. Prueba en diferentes dispositivos
4. Actualiza la documentación relevante

---

**Hecho con ❤️ para estudiantes de anatomía**
