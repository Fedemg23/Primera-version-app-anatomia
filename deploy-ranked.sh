#!/bin/bash

echo "========================================"
echo "  Desplegando Sistema Ranked 1v1"
echo "========================================"
echo ""

echo "[1/2] Desplegando reglas de Firestore..."
firebase deploy --only firestore:rules
if [ $? -ne 0 ]; then
    echo "Error al desplegar reglas de Firestore"
    exit 1
fi
echo ""

echo "[2/2] Desplegando índices de Firestore..."
firebase deploy --only firestore:indexes
if [ $? -ne 0 ]; then
    echo "Error al desplegar índices de Firestore"
    exit 1
fi
echo ""

echo "========================================"
echo "  Despliegue completado exitosamente"
echo "========================================"
echo ""
echo "El sistema Ranked 1v1 está listo para usar."
echo ""
echo "Próximos pasos:"
echo "1. Abre la aplicación en dos navegadores"
echo "2. Inicia sesión con diferentes usuarios"
echo "3. Ve a la sección Ranked"
echo "4. Haz clic en 'Jugar Ranked'"
echo "5. Ambos usuarios serán emparejados automáticamente"
echo ""

