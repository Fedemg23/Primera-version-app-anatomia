@echo off
echo ========================================
echo   Desplegando Sistema Ranked 1v1
echo ========================================
echo.

echo Verificando proyecto activo...
call firebase use anatomygo-beta-1
if %ERRORLEVEL% NEQ 0 (
    echo Error al cambiar de proyecto
    pause
    exit /b %ERRORLEVEL%
)
echo.

echo [1/2] Desplegando reglas de Firestore...
call firebase deploy --only firestore:rules
if %ERRORLEVEL% NEQ 0 (
    echo Error al desplegar reglas de Firestore
    pause
    exit /b %ERRORLEVEL%
)
echo.

echo [2/2] Desplegando indices de Firestore...
call firebase deploy --only firestore:indexes
if %ERRORLEVEL% NEQ 0 (
    echo Error al desplegar indices de Firestore
    pause
    exit /b %ERRORLEVEL%
)
echo.

echo ========================================
echo   Despliegue completado exitosamente
echo ========================================
echo.
echo El sistema Ranked 1v1 esta listo para usar.
echo.
echo Proximos pasos:
echo 1. Abre la aplicacion en dos navegadores
echo 2. Inicia sesion con diferentes usuarios
echo 3. Ve a la seccion Ranked
echo 4. Haz clic en "Jugar Ranked"
echo 5. Ambos usuarios seran emparejados automaticamente
echo.
pause

