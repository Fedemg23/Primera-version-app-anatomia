# 🔧 Solución a Problemas de Matchmaking

## Problemas Identificados

### 1. ❌ **ERROR CRÍTICO: Missing or insufficient permissions**
**Causa:** Las reglas de Firestore NO están desplegadas en el servidor de Firebase.

**Impacto:**
- El matchmaking no puede actualizar el heartbeat en `matchmakingQueue`
- Los usuarios no pueden unirse a la cola de matchmaking
- Las partidas no se pueden crear en `activeMatches`

### 2. ⚠️ **404: eritros.png no encontrada**
**Causa:** La imagen de eritros aún no se ha agregado.

**Impacto:** Estético - Muestra emoji 🔴 como fallback (funciona correctamente)

### 3. ⚠️ **404: /src/assets/avatars/alien.png**
**Causa:** Ruta incorrecta para el avatar 'alien'.

**Impacto:** Los avatares no se muestran correctamente en el matchmaking.

---

## 🚨 SOLUCIÓN URGENTE - Desplegar Reglas de Firestore

### Método 1: Usar el Script Automatizado (Recomendado)

1. **Abrir PowerShell en la carpeta del proyecto:**
   ```powershell
   cd "C:\Users\feder\Downloads\Anatomy Go new interface"
   ```

2. **Ejecutar el script de despliegue:**
   ```powershell
   .\deploy-firestore.bat
   ```

3. **Seguir las instrucciones:**
   - Si no has iniciado sesión, el script te pedirá hacer `firebase login`
   - Autoriza en el navegador
   - El script desplegará automáticamente las reglas

4. **Esperar 1-2 minutos** para que las reglas se propaguen

5. **Recargar la aplicación** con Ctrl+Shift+R

---

### Método 2: Despliegue Manual desde Terminal

Si el script no funciona, ejecuta estos comandos manualmente:

```powershell
# 1. Verificar instalación de Firebase CLI
firebase --version

# 2. Si no está instalado, instalarlo
npm install -g firebase-tools

# 3. Iniciar sesión en Firebase
firebase login

# 4. Verificar proyecto
firebase projects:list

# 5. Seleccionar proyecto (si es necesario)
firebase use anatomygo-beta-1

# 6. Desplegar SOLO las reglas de Firestore
firebase deploy --only firestore:rules
```

---

### Método 3: Actualización Manual en Firebase Console

Si los métodos anteriores fallan:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona el proyecto: **anatomygo-beta-1**
3. Ve a **Firestore Database** → **Reglas**
4. Abre el archivo `firestore.rules` de tu proyecto
5. Copia TODO el contenido
6. Pégalo en el editor de Firebase Console
7. Haz clic en **Publicar**
8. Espera 1-2 minutos

---

## 🔍 Verificación de Reglas Desplegadas

Después de desplegar, verifica que las siguientes colecciones tengan permisos:

### ✅ Colecciones que DEBEN tener reglas:

- `matchmakingQueue` - Para unirse/actualizar heartbeat
- `activeMatches` - Para crear y actualizar partidas
- `rankedProfiles` - Para leer/actualizar perfiles ranked
- `rankedMatches` - Para guardar historial de partidas
- `userData` - Datos privados del usuario
- `users` - Perfiles públicos (leaderboard)
- `friendRequests` - Solicitudes de amistad
- `friends` - Relaciones de amistad
- `friendGifts` - Regalos entre amigos
- `friendChallenges` - Desafíos entre amigos

---

## 📋 Verificar Reglas Específicas para Matchmaking

Las reglas de `matchmakingQueue` deben permitir:

```javascript
match /matchmakingQueue/{queueId} {
  // ✅ Leer cualquier entrada (necesario para buscar oponentes)
  allow read: if isSignedIn();
  
  // ✅ Crear tu entrada en la cola
  allow create: if isSignedIn() && 
    request.resource.data.userId == request.auth.uid;
  
  // ✅ Actualizar tu entrada o si otro jugador te empareja
  allow update: if isSignedIn() && 
    (resource.data.userId == request.auth.uid || 
     request.resource.data.status == 'matched');
  
  // ✅ Eliminar tu propia entrada
  allow delete: if isSignedIn() && 
    resource.data.userId == request.auth.uid;
}
```

---

## 🖼️ Solución Problema 2: Imagen de Eritros

### Solución Temporal (Ya Implementada)
El sistema usa emoji 🔴 como fallback - **NO REQUIERE ACCIÓN INMEDIATA**

### Solución Permanente
1. Crea o descarga una imagen PNG de un glóbulo rojo (eritrocito)
2. Guárdala como: `public/images/eritros.png`
3. Especificaciones:
   - Formato: PNG con transparencia
   - Tamaño: 128x128 px o 256x256 px
   - Diseño: Circular, rojo, similar a un glóbulo rojo

---

## 🎨 Solución Problema 3: Avatar Alien

### Causa del Error
El sistema busca el avatar en `/src/assets/avatars/alien.png` pero la ruta correcta debería ser relativa o pública.

### Verificación Rápida

```powershell
# Ver si existe el archivo
dir "src\assets\avatars\alien.png"
```

### Posibles Soluciones

**Opción A: Verificar que el avatar existe**
```powershell
# Listar todos los avatares disponibles
dir "src\assets\avatars\*.png"
```

**Opción B: Si el archivo no existe**
- Agrega la imagen `alien.png` en `src/assets/avatars/`
- O usa un avatar diferente temporalmente

**Opción C: Verificar componente AvatarImage**
El componente debería manejar correctamente las rutas de avatares.

---

## 🧪 Prueba Después de Desplegar

### Pasos para Probar Matchmaking:

1. **Abre dos ventanas del navegador** (o dos navegadores diferentes)
2. **Inicia sesión con dos cuentas diferentes** en cada ventana
3. **Ve al modo Ranked** en ambas
4. **Inicia matchmaking** en la primera cuenta
5. **Espera 2-3 segundos**
6. **Inicia matchmaking** en la segunda cuenta
7. **Verifica que se encuentren** (debería tomar ~5-10 segundos)

### Lo que Deberías Ver:

✅ **Sin Errores en Consola:**
- No más "Missing or insufficient permissions"
- No más errores de Firestore

✅ **Matchmaking Funcionando:**
- "Buscando rival..."
- "¡Rival encontrado!"
- Ambos jugadores pasan a la pantalla de partida

### Si NO Funciona:

1. **Verifica la consola del navegador:**
   - ¿Aún ves "Missing or insufficient permissions"?
   - → Las reglas no se desplegaron correctamente

2. **Verifica Firebase Console:**
   - Ve a Firestore Database
   - Busca la colección `matchmakingQueue`
   - ¿Ves entradas creándose?

3. **Verifica autenticación:**
   - ¿Los usuarios están correctamente autenticados?
   - Revisa la consola: `auth.currentUser`

---

## 🔧 Comandos de Diagnóstico

### Verificar Estado de Firebase CLI:
```powershell
firebase --version
firebase projects:list
firebase use
```

### Ver Reglas Actuales en Firebase:
```powershell
firebase firestore:rules get
```

### Desplegar TODO (reglas + índices):
```powershell
firebase deploy --only firestore
```

---

## 📊 Troubleshooting por Tipo de Error

### Error: "Missing or insufficient permissions"
- ✅ Despliega las reglas de Firestore
- ✅ Espera 1-2 minutos
- ✅ Recarga la app con Ctrl+Shift+R

### Error: "Failed to load resource: 404"
- Para eritros.png: **Ignóralo** (usa fallback)
- Para alien.png: **Verifica que el avatar exista**
- Para vite.svg: **No afecta funcionalidad**

### Error: "FirebaseError: PERMISSION_DENIED"
- Las reglas no están desplegadas o son incorrectas
- Verifica el proyecto en Firebase Console
- Asegúrate de estar autenticado

### Matchmaking no encuentra rival:
- ✅ Verifica que ambos usuarios estén autenticados
- ✅ Verifica que las reglas estén desplegadas
- ✅ Abre la consola de Firebase para ver si se crean entradas
- ✅ Verifica que los ratings sean similares

---

## ✅ Checklist Final

Antes de probar matchmaking, verifica:

- [ ] Firebase CLI instalado
- [ ] Iniciado sesión en Firebase (`firebase login`)
- [ ] Proyecto seleccionado (`firebase use anatomygo-beta-1`)
- [ ] Reglas desplegadas (`firebase deploy --only firestore:rules`)
- [ ] Esperado 1-2 minutos después del despliegue
- [ ] App recargada con Ctrl+Shift+R
- [ ] Dos usuarios autenticados con diferentes cuentas
- [ ] Ambos con perfiles ranked creados

---

## 📞 Soporte Adicional

Si después de seguir todos los pasos el matchmaking sigue sin funcionar:

1. **Captura de pantalla de:**
   - Consola del navegador (con todos los errores)
   - Firebase Console → Firestore → Reglas (las primeras 50 líneas)
   - Terminal después de ejecutar `firebase deploy --only firestore:rules`

2. **Verifica en Firebase Console:**
   - Firestore Database → Data
   - ¿Se están creando documentos en `matchmakingQueue`?
   - ¿Qué estado tienen?

3. **Logs útiles:**
   ```javascript
   // En la consola del navegador
   console.log(auth.currentUser);
   console.log(db);
   ```

---

## 🎯 Prioridad de Soluciones

1. **URGENTE:** Desplegar reglas de Firestore (Soluciona matchmaking)
2. **MEDIA:** Verificar avatar alien.png
3. **BAJA:** Agregar imagen eritros.png (funciona con emoji)
4. **INFO:** Ignorar error vite.svg

---

## 📝 Notas Finales

- Las reglas de Firestore son **FUNDAMENTALES** para que funcione el matchmaking
- Sin reglas correctas, **NINGUNA** operación de escritura funcionará
- Los errores 404 de imágenes son **estéticos** y no impiden la funcionalidad
- El sistema está diseñado con **fallbacks** para mantener la app funcional

¡Una vez desplegadas las reglas, el matchmaking debería funcionar perfectamente! 🎮

