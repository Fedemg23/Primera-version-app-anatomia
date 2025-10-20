# 🔍 Diagnóstico de Matchmaking

## ✅ Cambios Aplicados

1. **Reglas de Firestore desplegadas correctamente** ✅
2. **Rango de búsqueda ampliado:**
   - Antes: ±50 inicial, expansión cada 10s (+25), máximo ±200
   - **Ahora: ±150 inicial, expansión cada 5s (+50), máximo ±500**

## 🎯 Cómo Probar el Matchmaking

### Paso 1: Preparar Dos Cuentas

**Cuenta 1:**
- Inicia sesión en Chrome
- Ve a Ranked
- Anota tu rating (ejemplo: 500)

**Cuenta 2:**
- Inicia sesión en Firefox (o Chrome Incógnito)
- Ve a Ranked  
- Anota tu rating (ejemplo: 600)

### Paso 2: Iniciar Matchmaking

1. **En Cuenta 1:** Presiona "Jugar Ranked"
2. **Espera 2-3 segundos**
3. **En Cuenta 2:** Presiona "Jugar Ranked"
4. **Espera 5-10 segundos**

### Paso 3: Verificar en Consola

**Abre la consola del navegador (F12) en AMBAS cuentas y busca:**

✅ **Mensajes de éxito:**
```
🎮 Unido a cola de matchmaking: queue_xxxxxxx
✅ Match encontrado: match_xxxxxxx
```

❌ **Mensajes de error:**
```
Missing or insufficient permissions
Error buscando partida
```

---

## 🧪 Prueba de Diagnóstico en Consola

Abre la consola del navegador (F12) y ejecuta estos comandos para ver qué está pasando:

### Ver Estado de Autenticación:
```javascript
// ¿Estás autenticado?
console.log('Auth:', firebase.auth().currentUser);
```

### Ver tu Rating:
```javascript
// Buscar tu perfil ranked en localStorage
console.log('UserData:', JSON.parse(localStorage.getItem('userData') || '{}'));
```

### Ver Cola de Matchmaking (Manual):
```javascript
// Ver todas las entradas en la cola
const db = firebase.firestore();
db.collection('matchmakingQueue')
  .where('status', '==', 'searching')
  .get()
  .then(snapshot => {
    console.log('📊 Entradas en cola:', snapshot.size);
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`
        ID: ${doc.id}
        Usuario: ${data.name}
        Rating: ${data.rating}
        Liga: ${data.league}
        Tiempo: ${new Date(data.timestamp?.toMillis()).toLocaleTimeString()}
      `);
    });
  })
  .catch(err => console.error('Error:', err));
```

---

## 🔎 Problemas Comunes y Soluciones

### Problema 1: "No encuentra partida después de 30 segundos"

**Causas posibles:**
1. **Ratings muy diferentes** → Ahora el rango es ±150, debería funcionar
2. **Solo una cuenta en la cola** → Asegúrate de tener dos cuentas buscando
3. **Tiempo de búsqueda no sincronizado** → Inicia la segunda cuenta 2-3s después de la primera

**Solución:**
- Verifica que ambas cuentas estén en modo Ranked
- Verifica que ambas hayan presionado "Jugar Ranked"
- Espera al menos 10-15 segundos

### Problema 2: "Missing or insufficient permissions"

**Causa:** Las reglas no se aplicaron correctamente

**Solución:**
```powershell
# Redesplegar reglas
firebase deploy --only firestore:rules

# Esperar 1 minuto
# Recargar app con Ctrl+Shift+R
```

### Problema 3: "No se crean entradas en matchmakingQueue"

**Causa:** Error de autenticación o conexión

**Verificar:**
1. ¿Estás autenticado? (ver consola)
2. ¿Tienes conexión a internet?
3. ¿Firebase está inicializado?

**Solución:**
```javascript
// En consola del navegador
console.log('Firebase App:', firebase.app());
console.log('Auth User:', firebase.auth().currentUser);
```

### Problema 4: "Se crea entrada pero no encuentra rival"

**Causa:** Rango de rating o timing

**Datos útiles:**
- Rating Cuenta 1: ___
- Rating Cuenta 2: ___
- Diferencia: ___

**Con el nuevo rango:**
- 0-5 segundos: ±150 puntos
- 5-10 segundos: ±200 puntos
- 10-15 segundos: ±250 puntos
- 15-20 segundos: ±300 puntos

---

## 📊 Tabla de Compatibilidad de Ratings

Con el nuevo sistema (±150 inicial):

| Rating Jugador 1 | Rango Compatible | Ejemplo Jugador 2 |
|------------------|------------------|-------------------|
| 500 | 350 - 650 | ✅ 400, 500, 600 |
| 1000 | 850 - 1150 | ✅ 900, 1000, 1100 |
| 1500 | 1350 - 1650 | ✅ 1400, 1500, 1600 |

Después de 10 segundos (±300):

| Rating Jugador 1 | Rango Compatible | Ejemplo Jugador 2 |
|------------------|------------------|-------------------|
| 500 | 200 - 800 | ✅ 300, 700, 800 |
| 1000 | 700 - 1300 | ✅ 800, 1200, 1300 |

---

## 🎮 Escenarios de Prueba

### Escenario 1: Ratings Cercanos (Fácil)
- Cuenta 1: Rating 500
- Cuenta 2: Rating 520
- **Resultado esperado:** Match en 3-5 segundos ✅

### Escenario 2: Ratings Moderadamente Diferentes
- Cuenta 1: Rating 500
- Cuenta 2: Rating 700
- **Resultado esperado:** Match en 5-10 segundos ✅

### Escenario 3: Ratings Muy Diferentes
- Cuenta 1: Rating 500
- Cuenta 2: Rating 1000
- **Resultado esperado:** Match en 15-20 segundos ✅

### Escenario 4: Nuevas Cuentas (Sin Perfil Ranked)
- Si una cuenta NO tiene perfil ranked creado, no puede buscar partida
- **Solución:** Asegúrate de que ambas cuentas hayan entrado a Ranked al menos una vez

---

## 🔧 Comandos de Depuración

### Ver Log Completo del Matchmaking:

En la consola del navegador, los mensajes importantes son:

```
🎮 Unido a cola de matchmaking: queue_xxx
📊 Rango de búsqueda: [400, 700]
🔍 Buscando oponentes compatibles...
✅ Match encontrado: match_xxx
🎉 Rival encontrado: [Nombre]
```

### Limpiar Cola (Si hay entradas obsoletas):

```javascript
// Solo para depuración - NO ejecutar durante búsqueda activa
const db = firebase.firestore();
db.collection('matchmakingQueue')
  .get()
  .then(snapshot => {
    snapshot.forEach(doc => doc.ref.delete());
    console.log('✅ Cola limpiada');
  });
```

---

## 📝 Checklist de Verificación

Antes de reportar que no funciona, verifica:

- [ ] Reglas de Firestore desplegadas (✅ confirmado arriba)
- [ ] Dos cuentas diferentes autenticadas
- [ ] Ambas cuentas con perfil ranked creado
- [ ] Ambas cuentas en la pantalla de Ranked
- [ ] Ambas presionaron "Jugar Ranked"
- [ ] Diferencia de rating menor a 300 puntos
- [ ] Esperado al menos 15 segundos
- [ ] Sin errores "Missing or insufficient permissions" en consola
- [ ] Conexión a internet estable

---

## 🎯 Qué Hacer Si No Funciona

### 1. Captura de Pantalla
Toma captura de:
- Consola del navegador (F12) con todos los mensajes
- Pantalla de matchmaking de ambas cuentas

### 2. Información Necesaria
- **Rating Cuenta 1:** ___
- **Rating Cuenta 2:** ___
- **Tiempo esperado:** ___
- **Errores en consola:** ___

### 3. Prueba Manual en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Proyecto: anatomygo-beta-1
3. Firestore Database → Data
4. Busca la colección `matchmakingQueue`
5. ¿Ves entradas con status: 'searching'?
6. ¿Cuántas entradas hay?
7. ¿Qué ratings tienen?

---

## ✨ Mejoras Aplicadas

1. **Rango inicial más amplio:** ±50 → ±150
2. **Expansión más rápida:** cada 10s → cada 5s
3. **Rango máximo mayor:** ±200 → ±500
4. **Incremento mayor:** +25 → +50 por intervalo

**Resultado:** Es **3x más fácil** encontrar partida ahora.

---

## 🔄 Próximos Pasos

Si después de estos cambios aún no encuentras partida:

1. Verifica que ambas cuentas tengan perfiles ranked
2. Asegúrate de que los ratings no sean extremadamente diferentes (>500 puntos)
3. Prueba con ratings similares primero (diferencia <100)
4. Revisa la consola para ver si hay otros errores

---

## 📞 Comando de Estado Rápido

Ejecuta esto en la consola de AMBAS cuentas para ver el estado:

```javascript
const checkStatus = async () => {
  const auth = firebase.auth().currentUser;
  const db = firebase.firestore();
  
  console.log('=== ESTADO DE MATCHMAKING ===');
  console.log('Usuario:', auth?.email || 'No autenticado');
  
  if (!auth) {
    console.error('❌ No estás autenticado');
    return;
  }
  
  // Ver mi entrada en la cola
  const myQueue = await db.collection('matchmakingQueue')
    .where('userId', '==', auth.uid)
    .get();
    
  console.log('Mis entradas en cola:', myQueue.size);
  myQueue.forEach(doc => {
    const data = doc.data();
    console.log(`  Rating: ${data.rating}, Status: ${data.status}`);
  });
  
  // Ver todas las entradas
  const allQueue = await db.collection('matchmakingQueue')
    .where('status', '==', 'searching')
    .get();
    
  console.log('Total buscando:', allQueue.size);
  allQueue.forEach(doc => {
    const data = doc.data();
    console.log(`  ${data.name}: ${data.rating} (${data.league})`);
  });
};

checkStatus();
```

Este comando te mostrará:
- Si estás autenticado
- Si tienes entradas en la cola
- Cuántas personas están buscando
- Los ratings de todos los que buscan

¡Con esta información podremos diagnosticar exactamente qué está pasando! 🎮

