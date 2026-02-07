@echo off
REM Script de démarrage Docker - APCS (Windows)
REM Usage: docker-start.bat

echo ========================================
echo  🐳 APCS - Docker Startup
echo ========================================
echo.

REM Vérifier si Docker est installé
docker --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker n'est pas installe ou n'est pas en cours d'execution
    echo    Installez Docker Desktop: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo ✅ Docker detecte

REM Vérifier si Docker Compose est disponible
docker compose version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker Compose n'est pas disponible
    pause
    exit /b 1
)
echo ✅ Docker Compose detecte

echo.
echo 📦 Construction et démarrage des conteneurs...
echo    Cela peut prendre quelques minutes la premiere fois...
echo.

docker compose up --build -d

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Erreur lors du démarrage des conteneurs
    echo    Consultez les logs avec: docker compose logs
    pause
    exit /b 1
)

echo.
echo ========================================
echo  ✅ APCS démarré avec succès!
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:5173
echo 📡 Backend:  http://localhost:8080
echo.
echo 📋 Utilisateurs de test:
echo    • admin@apcs.dz / admin123 (Admin)
echo    • operator@apcs.dz / operator123 (Operator)
echo    • carrier@apcs.dz / carrier123 (Carrier)
echo.
echo ========================================
echo  📊 Commandes utiles:
echo ========================================
echo    docker compose logs -f      # Voir les logs
echo    docker compose down         # Arrêter
echo    docker compose restart      # Redémarrer
echo    docker compose ps           # Voir le statut
echo.
echo Appuyez sur une touche pour ouvrir le navigateur...
pause >nul

start http://localhost:5173/login
