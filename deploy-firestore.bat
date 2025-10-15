@echo off
REM Script para desplegar reglas de Firestore en Windows

echo 🔥 Desplegando reglas de Firestore...

REM Verificar si Firebase CLI está instalado
where firebase >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Firebase CLI no está instalado
    echo Instálalo con: npm install -g firebase-tools
    exit /b 1
)

REM Verificar autenticación
echo 🔐 Verificando autenticación...
firebase projects:list >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 🔑 Iniciando sesión en Firebase...
    firebase login
)

REM Desplegar las reglas
echo 📤 Desplegando reglas de Firestore...
firebase deploy --only firestore:rules

if %ERRORLEVEL% equ 0 (
    echo ✅ ¡Reglas desplegadas exitosamente!
    echo 🎉 Las funciones de regalos y desafíos ahora deberían funcionar
    echo.
    echo Espera 1-2 minutos y recarga la aplicación
) else (
    echo ❌ Error al desplegar reglas
    exit /b 1
)






