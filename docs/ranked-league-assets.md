# Assets para Ligas Ranked

Este documento contiene los prompts para generar las imágenes de emblemas de las ligas del sistema Ranked.

## Especificaciones generales

- **Fondo**: Negro puro (#000000)
- **Estilo**: Minimalista, premium, front-facing
- **Formato**: PNG con transparencia
- **Resolución recomendada**: 512x512px mínimo
- **Consistencia**: Todos los emblemas deben mantener la misma estructura circular

---

## Emblemas de Ligas

### 🥉 Bronce

**Prompt para generación:**
```
Closed badge ring on a pure black background, matte bronze metal, thin rim, minimal reflections, no symbols, elegant and simple. Front-facing. Circular frame only, center empty and black.
```

**Especificaciones adicionales:**
- Material: Bronce mate
- Grosor del anillo: Delgado (thin)
- Acabado: Sin brillo excesivo
- Color: Tonos cobrizos/dorados oscuros

---

### 🥈 Plata

**Prompt para generación:**
```
Circular badge frame on pure black, polished silver with subtle blue highlights, double ultra-thin outer ring, glossy, front-facing, minimal. Center empty and black.
```

**Especificaciones adicionales:**
- Material: Plata pulida
- Detalles: Doble anillo ultra fino en el exterior
- Reflejos: Azules sutiles
- Acabado: Brillante pero elegante

---

### 🥇 Oro

**Prompt para generación:**
```
Shiny golden circular badge frame on pure black, engraved delicate rim, strong warm central light glow, premium realistic metal, front-facing. Center empty and black.
```

**Especificaciones adicionales:**
- Material: Oro brillante
- Detalles: Grabados delicados en el borde
- Iluminación: Resplandor cálido central fuerte
- Acabado: Premium realista

---

### 💎 Rubí

**Prompt para generación:**
```
Thin hollow frame made of fractured ruby crystal shards forming a perfect circular ring on pure black, translucent, soft inner glow, center empty and black, fine proportions.
```

**Especificaciones adicionales:**
- Material: Cristal de rubí fracturado
- Estructura: Fragmentos formando círculo perfecto
- Transparencia: Translúcido
- Resplandor: Suave desde el interior
- Color: Rojos intensos, rosas

---

### 💚 Esmeralda

**Prompt para generación:**
```
Circular badge ring on pure black, crystalline emerald material with teal reflections, subtle inner aura, finely faceted, minimal and premium. Center empty and black.
```

**Especificaciones adicionales:**
- Material: Cristal de esmeralda
- Detalles: Facetas finas
- Reflejos: Verde-azulados (teal)
- Aura: Sutil resplandor interno
- Acabado: Premium minimalista

---

### 💠 Diamante

**Prompt para generación:**
```
Circular badge ring on pure black, diamond material, iridescent edges, subtle sparkles, highly detailed facets, front-facing. Center empty and black.
```

**Especificaciones adicionales:**
- Material: Diamante
- Bordes: Iridiscentes (múltiples colores)
- Detalles: Destellos sutiles
- Facetas: Muy detalladas
- Acabado: El más premium de todos

---

## Monedas del Sistema

### 🧠 Neuronas (Moneda General)

**Prompt para generación:**
```
3D neuron cell icon on pure black, soma with dendrites and a single axon, translucent gel material, subtle volumetric light, elegant minimal educational app style.
```

**Especificaciones:**
- Vista: 3D isométrica
- Material: Gel translúcido
- Iluminación: Volumétrica sutil
- Estilo: Educativo minimalista

---

### 🔴 Eritros (Rating Ranked)

**Prompt para generación:**
```
3D red blood cell icon on pure black, biconcave disc, soft subsurface scattering, faint inner glow, realistic yet minimal.
```

**Especificaciones:**
- Vista: 3D isométrica
- Forma: Disco bicóncavo (forma real de eritrocito)
- Material: Subsurface scattering suave
- Resplandor: Débil desde el interior
- Estilo: Realista pero minimalista

---

## Implementación Actual (CSS)

Actualmente, los emblemas están implementados con CSS en el componente `LeagueEmblem` usando gradientes:

```tsx
const colors = {
  'Bronce': 'from-amber-700 via-amber-600 to-amber-800',
  'Plata': 'from-gray-300 via-gray-200 to-gray-400',
  'Oro': 'from-yellow-400 via-yellow-300 to-yellow-500',
  'Rubí': 'from-red-600 via-red-500 to-pink-600',
  'Esmeralda': 'from-emerald-500 via-teal-400 to-emerald-600',
  'Diamante': 'from-blue-400 via-cyan-300 to-purple-400'
};
```

Para reemplazar con imágenes PNG:
1. Generar las imágenes usando los prompts anteriores
2. Guardar en `public/images/leagues/`
3. Actualizar el componente `LeagueEmblem` para usar `<img>` en lugar de gradientes CSS

---

## Herramientas Recomendadas

- **Midjourney**: Excelente para renders realistas de materiales
- **DALL-E 3**: Bueno para estilos consistentes
- **Stable Diffusion**: Mayor control y personalización
- **Leonardo AI**: Buen balance calidad/velocidad

---

## Notas de Diseño

1. **Consistencia**: Todos los emblemas deben tener proporciones similares
2. **Legibilidad**: Deben ser reconocibles incluso en tamaños pequeños (32x32px)
3. **Progresión visual**: Cada liga debe sentirse más "premium" que la anterior
4. **Fondo negro**: Crítico para la estética general de la app
5. **Sin símbolos**: Los anillos deben estar vacíos (solo el marco)

---

## Checklist de Implementación

- [ ] Generar 6 emblemas de ligas
- [ ] Generar ícono de Neuronas
- [ ] Generar ícono de Eritros
- [ ] Optimizar tamaños (WebP si es posible)
- [ ] Guardar en `public/images/leagues/`
- [ ] Actualizar componente `LeagueEmblem`
- [ ] Probar visibilidad en diferentes tamaños
- [ ] Verificar rendimiento en móviles

