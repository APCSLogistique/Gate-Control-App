#!/bin/bash
# Script de démarrage Docker - APCS (Linux/Mac)
# Usage: ./docker-start.sh

echo "========================================"
echo " 🐳 APCS - Docker Startup"
echo "========================================"
echo ""

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    echo "   Installez Docker: https://docs.docker.com/get-docker/"
    exit 1
fi
echo "✅ Docker détecté"

# Vérifier si Docker Compose est disponible
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose n'est pas disponible"
    exit 1
fi
echo "✅ Docker Compose détecté"

echo ""
echo "📦 Construction et démarrage des conteneurs..."
echo "   Cela peut prendre quelques minutes la première fois..."
echo ""

docker compose up --build -d

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Erreur lors du démarrage des conteneurs"
    echo "   Consultez les logs avec: docker compose logs"
    exit 1
fi

echo ""
echo "========================================"
echo " ✅ APCS démarré avec succès!"
echo "========================================"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "📡 Backend:  http://localhost:8080"
echo ""
echo "📋 Utilisateurs de test:"
echo "   • admin@apcs.dz / admin123 (Admin)"
echo "   • operator@apcs.dz / operator123 (Operator)"
echo "   • carrier@apcs.dz / carrier123 (Carrier)"
echo ""
echo "========================================"
echo " 📊 Commandes utiles:"
echo "========================================"
echo "   docker compose logs -f      # Voir les logs"
echo "   docker compose down         # Arrêter"
echo "   docker compose restart      # Redémarrer"
echo "   docker compose ps           # Voir le statut"
echo ""

# Ouvrir le navigateur (optionnel)
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5173/login
elif command -v open &> /dev/null; then
    open http://localhost:5173/login
fi
