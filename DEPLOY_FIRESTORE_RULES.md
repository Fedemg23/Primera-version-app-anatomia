# 🔥 Desplegar Reglas de Firestore

## Error Actual
Estás viendo el error `Missing or insufficient permissions` porque las reglas de Firestore en el servidor no incluyen las nuevas colecciones para regalos y desafíos entre amigos.

## Solución Rápida

### Opción 1: Desplegar desde la Terminal (Recomendado)

1. **Instala Firebase CLI** (si no lo tienes):
```bash
npm install -g firebase-tools
```

2. **Inicia sesión en Firebase**:
```bash
firebase login
```

3. **Despliega solo las reglas de Firestore**:
```bash
firebase deploy --only firestore:rules
```

### Opción 2: Actualizar Manualmente en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **anatomygo-beta-1**
3. Ve a **Firestore Database** → **Reglas**
4. Copia y pega el contenido completo del archivo `firestore.rules`
5. Haz clic en **Publicar**

## Nuevas Colecciones Agregadas

Las reglas incluyen permisos para:

### 📦 `friendGifts`
- Los usuarios pueden **crear** regalos donde sean el remitente (`fromUid`)
- Los usuarios pueden **leer** regalos donde sean remitente o destinatario
- Los usuarios pueden **actualizar** (reclamar) regalos donde sean el destinatario (`toUid`)

### ⚔️ `friendChallenges`
- Los usuarios pueden **crear** desafíos donde sean el remitente (`fromUid`)
- Los usuarios pueden **leer** desafíos donde sean remitente o destinatario
- Los usuarios pueden **actualizar** desafíos donde sean uno de los participantes

### 👥 `friendRequests` y `friends`
- Ya estaban configuradas, sin cambios necesarios

## Verificación

Después de desplegar, las siguientes funciones deberían funcionar sin errores:
- ✅ Enviar regalos a amigos
- ✅ Reclamar regalos recibidos
- ✅ Enviar desafíos a amigos
- ✅ Ver desafíos activos
- ✅ Actualizar puntuaciones de desafíos

## Índices de Firestore

También he creado `firestore.indexes.json` con los índices necesarios para las consultas complejas. Estos se desplegarán automáticamente con:

```bash
firebase deploy --only firestore
```

O puedes crearlos manualmente cuando Firebase te lo pida en la consola.

## Troubleshooting

Si sigues viendo errores después de desplegar:
1. Espera 1-2 minutos (las reglas tardan en propagarse)
2. Recarga la aplicación con Ctrl+Shift+R (hard refresh)
3. Verifica que el proyecto correcto esté seleccionado: `anatomygo-beta-1`
4. Revisa la consola de Firebase para ver si hay errores en las reglas

## Archivos Creados

- ✅ `firebase.json` - Configuración de Firebase
- ✅ `.firebaserc` - Proyecto por defecto
- ✅ `firestore.indexes.json` - Índices para consultas
- ✅ `firestore.rules` - Ya existía, con reglas actualizadas



