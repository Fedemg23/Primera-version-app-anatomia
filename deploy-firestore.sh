#!/bin/bash

# Script para desplegar reglas de Firestore
echo "🔥 Desplegando reglas de Firestore..."

# Verificar si Firebase CLI está instalado
if ! command -v firebase &> /dev/null
then
    echo "❌ Firebase CLI no está instalado"
    echo "Instálalo con: npm install -g firebase-tools"
    exit 1
fi

# Verificar si el usuario está autenticado
echo "🔐 Verificando autenticación..."
firebase projects:list &> /dev/null
if [ $? -ne 0 ]; then
    echo "🔑 Iniciando sesión en Firebase..."
    firebase login
fi

# Desplegar las reglas
echo "📤 Desplegando reglas de Firestore..."
firebase deploy --only firestore:rules

if [ $? -eq 0 ]; then
    echo "✅ ¡Reglas desplegadas exitosamente!"
    echo "🎉 Las funciones de regalos y desafíos ahora deberían funcionar"
    echo ""
    echo "Espera 1-2 minutos y recarga la aplicación"
else
    echo "❌ Error al desplegar reglas"
    exit 1
fi




