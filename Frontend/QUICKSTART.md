# 🚀 Guide de Démarrage Rapide - Frontend & Backend

## Étape 1: Démarrer le Backend Laravel

```bash
cd Backend/apcs-backend

# Si première fois, installer les dépendances
composer install

# Copier le fichier d'environnement (si pas déjà fait)
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Créer la base de données et migrer
php artisan migrate

# (Optionnel) Peupler la base avec des données de test
php artisan db:seed

# Démarrer le serveur Laravel sur le port 8080
php artisan serve --port=8080
```

Le backend sera accessible sur: **http://localhost:8080**

---

## Étape 2: Démarrer le Frontend React

```bash
# Dans un nouveau terminal, rester dans le dossier principal
cd C:\Users\ALGER\Desktop\frontendAMine

# Si première fois, installer les dépendances
npm install

# Vérifier que le fichier .env existe avec:
# VITE_API_URL=http://localhost:8080/api

# Démarrer le serveur de développement Vite
npm run dev
```

Le frontend sera accessible sur: **http://localhost:5173** (ou le port indiqué dans le terminal)

---

## Étape 3: Créer des Utilisateurs de Test

### Option 1: Via Artisan Tinker
```bash
php artisan tinker

# Créer un admin
$admin = App\Models\User::create([
    'name' => 'Admin User',
    'email' => 'admin@apcs.dz',
    'password' => bcrypt('admin123'),
    'role' => 'admin'
]);

# Créer un operator
$operator = App\Models\User::create([
    'name' => 'Operator User',
    'email' => 'operator@apcs.dz',
    'password' => bcrypt('operator123'),
    'role' => 'operator'
]);

# Créer un carrier/transiteur
$carrier = App\Models\User::create([
    'name' => 'Carrier User',
    'email' => 'carrier@apcs.dz',
    'password' => bcrypt('carrier123'),
    'role' => 'transiter'
]);
```

### Option 2: Via l'endpoint Register
Utilisez Postman ou curl:
```bash
curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@apcs.dz",
    "password": "admin123",
    "role": "admin"
  }'
```

---

## Étape 4: Tester la Connexion

### Sur le Frontend
1. Ouvrir http://localhost:5173/login
2. Utiliser les boutons "Quick Demo Access" ou entrer manuellement:
   - **Admin**: admin@apcs.dz / admin123
   - **Operator**: operator@apcs.dz / operator123
   - **Carrier**: carrier@apcs.dz / carrier123

3. Après connexion réussie, vous devriez être redirigé vers /dashboard

### Vérifier le Token
Ouvrir les DevTools > Application > Local Storage:
- `apcs_token`: Bearer token
- `apcs_user`: Données utilisateur

---

## Étape 5: Créer une Configuration de Capacité

Avant de créer des bookings, initialiser la configuration:

```bash
curl -X POST http://localhost:8080/api/admin/config/capacity \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{
    "capacity": 10,
    "late_capacity": 3
  }'
```

Ou via le frontend, aller sur la page **Capacity Management** et définir:
- Max Capacity: 10
- Late Capacity: 3

---

## 🧪 Tests de Fonctionnalités

### Test 1: Créer un Booking (Carrier)
```bash
curl -X POST http://localhost:8080/api/booking \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{
    "truck_number": "123-ABC",
    "timeslot": {
      "date": "2026-02-10",
      "hour_start": "08:00"
    }
  }'
```

### Test 2: Obtenir le QR Code (Carrier)
```bash
curl -X GET http://localhost:8080/api/gate/qr/{bookingId} \
  -H "Authorization: Bearer {TOKEN}"
```

### Test 3: Scanner le QR Code (Operator)
```bash
curl -X POST http://localhost:8080/api/gate/scan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{
    "qr": "apk_xxxxxxxxxxxxx"
  }'
```

### Test 4: Voir le Schedule (Admin)
```bash
curl -X GET http://localhost:8080/api/admin/schedule \
  -H "Authorization: Bearer {TOKEN}"
```

---

## 🛠️ Dépannage

### Erreur CORS
Si vous voyez des erreurs CORS, ajoutez dans `Backend/apcs-backend/config/cors.php`:
```php
'allowed_origins' => ['http://localhost:5173'],
```

### Token Expiré
Les tokens Sanctum expirent après un certain temps. Si vous avez une erreur 401:
1. Déconnectez-vous
2. Reconnectez-vous pour obtenir un nouveau token

### Base de Données
Si problème avec la base de données:
```bash
# Réinitialiser la base
php artisan migrate:fresh

# Avec données de test
php artisan migrate:fresh --seed
```

### Port Déjà Utilisé
Si le port 8080 est occupé:
```bash
# Backend sur un autre port
php artisan serve --port=8000

# Mettre à jour .env frontend
VITE_API_URL=http://localhost:8000/api
```

---

## 📋 Checklist de Vérification

- [ ] Backend démarré sur http://localhost:8080
- [ ] Frontend démarré sur http://localhost:5173
- [ ] Utilisateurs de test créés
- [ ] Configuration de capacité initialisée
- [ ] Login fonctionne et token stocké
- [ ] Dashboard affiche les données du bon rôle
- [ ] Pas d'erreurs dans la console

---

## 📚 Documentation Complète

Pour plus de détails sur chaque endpoint et service:
- `BACKEND_INTEGRATION.md` - Documentation complète de l'intégration
- `API_SERVICES_DOCUMENTATION.md` - Documentation des services frontend
- `Backend/apcs-backend/routes/api.php` - Routes backend

---

## 🎉 Vous êtes prêt!

Le frontend et le backend sont maintenant connectés. Vous pouvez:
- Créer des bookings
- Scanner des QR codes
- Gérer les capacités
- Voir les logs
- Utiliser l'AI Assistant
