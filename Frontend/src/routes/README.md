# 📂 Documentation du Dossier Routes

## 🎯 Vue d'ensemble

Le dossier `src/routes/` contient la **liaison complète et documentée** entre le frontend React et le backend Laravel. Chaque fichier correspond à un module du backend et documente en détail les endpoints, les paramètres, les réponses et la logique backend.

---

## 📁 Structure du Dossier

```
src/routes/
├── index.js              # Point d'entrée - exporte toutes les routes
├── api.routes.js         # Configuration API de base
├── auth.routes.js        # Routes d'authentification
├── user.routes.js        # Routes utilisateur
├── booking.routes.js     # Routes de réservation
├── timeslot.routes.js    # Routes de créneaux horaires
├── gate.routes.js        # Routes de portail/QR code
├── admin.routes.js       # Routes administratives
├── report.routes.js      # Routes de rapports/incidents
└── ai.routes.js          # Routes IA/Chat
```

---

## 🔗 Mapping Frontend-Backend

### 1. **auth.routes.js**
**Backend:** `Backend/apcs-backend/routes/api.php` (lignes 17-18)

| Méthode Frontend | Backend Endpoint | Controller |
|-----------------|------------------|------------|
| `authRoutes.register(userData)` | `POST /register` | `UserController::Register` |
| `authRoutes.login(email, password)` | `POST /login` | `UserController::login` |
| `authRoutes.logout()` | `POST /logout` | Sanctum |

**Usage:**
```javascript
import { authRoutes } from './routes';

// Connexion
const { user, token } = await authRoutes.login('admin@apcs.dz', 'admin123');

// Inscription
await authRoutes.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  role: 'transiter'
});
```

---

### 2. **user.routes.js**
**Backend:** `Backend/apcs-backend/routes/api.php` (lignes 20-25)

| Méthode Frontend | Backend Endpoint | Controller |
|-----------------|------------------|------------|
| `userRoutes.getProfile()` | `GET /user/profile` | `UserController::getProfile` |
| `userRoutes.getUserBookings()` | `GET /user/bookings` | `UserController::getUserBookings` |

**Usage:**
```javascript
import { userRoutes } from './routes';

// Obtenir le profil
const profile = await userRoutes.getProfile();
// { user_id, name, email, role }

// Obtenir les bookings
const bookings = await userRoutes.getUserBookings();
// [{ booking_id, truck_number, timeslot, status, created_at }, ...]
```

---

### 3. **booking.routes.js**
**Backend:** `Backend/apcs-backend/routes/api.php` (lignes 27-35)
**Controller:** `BookingController.php`

| Méthode Frontend | Backend Endpoint | Rôles | Controller Ligne |
|-----------------|------------------|-------|-----------------|
| `bookingRoutes.getById(id)` | `GET /booking/{id}` | Admin | 15 |
| `bookingRoutes.getByDateAndHour(date, hour)` | `GET /booking/{date}/{hour}` | Carrier, Admin | 39 |
| `bookingRoutes.create(data)` | `POST /booking` | Carrier, Admin | 77 |
| `bookingRoutes.updateStatus(id, status)` | `PUT /booking/{id}/status` | Carrier (own), Admin | 130 |
| `bookingRoutes.reschedule(id, timeslot)` | `PUT /booking/{id}/reschedule` | Carrier (own), Admin | 170 |
| `bookingRoutes.delete(id)` | `DELETE /booking/{id}` | Carrier (own), Admin | 230 |

**Usage:**
```javascript
import { bookingRoutes } from './routes';

// Créer un booking
const booking = await bookingRoutes.create({
  truck_number: '123-ABC',
  timeslot: {
    date: '2026-02-10',
    hour_start: '08:00'
  }
});

// Reprogrammer
await bookingRoutes.reschedule(booking.booking_id, {
  date: '2026-02-11',
  hour_start: '10:00'
});

// Mettre à jour le status
await bookingRoutes.updateStatus(booking.booking_id, 'in');
```

---

### 4. **timeslot.routes.js**
**Backend:** `Backend/apcs-backend/routes/api.php` (lignes 38-40)
**Controller:** `TimeslotController.php` (ligne 12)

| Méthode Frontend | Backend Endpoint | Auth | Controller |
|-----------------|------------------|------|-----------|
| `timeslotRoutes.getAvailability(date, hour)` | `GET /timeslot/{date}/{hour}` | Public | `TimeslotController::getTimeslotAvailability` |

**Helpers:**
- `timeslotRoutes.isAvailable(date, hour)` - Retourne `true` si disponible
- `timeslotRoutes.getRemainingCapacity(date, hour)` - Retourne le nombre de places

**Usage:**
```javascript
import { timeslotRoutes } from './routes';

// Vérifier disponibilité
const availability = await timeslotRoutes.getAvailability('2026-02-10', '08:00');
// { max_capacity: 10, used_capacity: 5, late_capacity: 3 }

// Helper pour vérifier si disponible
const isAvailable = await timeslotRoutes.isAvailable('2026-02-10', '08:00');
if (isAvailable) {
  // Créer le booking
}
```

---

### 5. **gate.routes.js**
**Backend:** `Backend/apcs-backend/routes/api.php` (lignes 43-47)
**Controller:** `GateController.php`

| Méthode Frontend | Backend Endpoint | Rôles | Controller Ligne | Logique |
|-----------------|------------------|-------|-----------------|---------|
| `gateRoutes.getQR(bookingId)` | `GET /gate/qr/{bookingId}` | Carrier (own), Admin | 21 | Génère QR code |
| `gateRoutes.scan(qrCode)` | `POST /gate/scan` | Operator, Admin | 68 | **Logique Late Arrival complexe** |
| `gateRoutes.complete(bookingId)` | `POST /gate/complete` | Operator, Admin | 264 | Libère le slot |

**Logique Late Arrival (scan):**
1. Vérifie si le camion est trop tôt → Erreur
2. Si à l'heure (dans la fenêtre 1h) → Status 'in', type 'on_time'
3. Si en retard:
   - Vérifie late_capacity du slot original
   - Si disponible → Utilise late slot original
   - Si plein → Cherche prochain slot disponible
   - Si trouvé → Reprogramme automatiquement
   - Si aucun → Erreur + log incident

**Usage:**
```javascript
import { gateRoutes } from './routes';

// Carrier: Générer QR
const { qr } = await gateRoutes.getQR('123');
// qr = 'apk_xxxxxxxxxxxxx'

// Operator: Scanner QR
const result = await gateRoutes.scan('apk_xxxxxxxxxxxxx');
// { message, booking_id, truck_number, status: 'in', arrival_type: 'on_time' }

// Operator: Compléter livraison
await gateRoutes.complete('123');
// { timeslot_freed: true, timeslot_info: { ... } }
```

---

### 6. **admin.routes.js**
**Backend:** `Backend/apcs-backend/routes/api.php` (lignes 50-69)
**Controller:** `AdminController.php`

| Méthode Frontend | Backend Endpoint | Rôles |
|-----------------|------------------|-------|
| `adminRoutes.getTodaySchedule()` | `GET /admin/schedule` | Admin |
| `adminRoutes.getScheduleByDate(date)` | `GET /admin/schedule/{date}` | Admin |
| `adminRoutes.getScheduleRange(start, end)` | `GET /admin/schedule/{start}/{end}` | Admin |
| `adminRoutes.getLogs(start, end)` | `GET /admin/data/logs/{start}/{end}` | Admin |
| `adminRoutes.updateCapacity(config)` | `POST /admin/config/capacity` | Admin |

**Internal Tools (pour AI):**
- `adminRoutes.internalBookingStatus(params)`
- `adminRoutes.internalUserBookings(params)`
- `adminRoutes.internalPortSchedule(params)`
- `adminRoutes.internalAvailableSlots(params)`

**Usage:**
```javascript
import { adminRoutes } from './routes';

// Obtenir schedule d'aujourd'hui
const schedule = await adminRoutes.getTodaySchedule();

// Obtenir les logs
const logs = await adminRoutes.getLogs('2026-02-01', '2026-02-07');

// Mettre à jour la capacité
await adminRoutes.updateCapacity({
  capacity: 10,
  late_capacity: 3
});
```

---

### 7. **report.routes.js**
**Backend:** Routes à implémenter
**Note:** Ces routes n'existent pas encore dans le backend

---

### 8. **ai.routes.js**
**Backend:** Routes à implémenter
**Note:** Ces routes doivent être ajoutées au backend

---

## 🔄 Relation avec les Services

Les **services** (`src/services/`) utilisent maintenant les **routes** pour faire leurs appels API:

```javascript
// Ancien (direct API client)
import apiClient from './api.client';
async getProfile() {
  return apiClient.get('/user/profile');
}

// Nouveau (via routes)
import { userRoutes } from '../routes/user.routes';
async getProfile() {
  return userRoutes.getProfile();
}
```

**Avantages:**
- ✅ Documentation complète de chaque endpoint
- ✅ Mapping explicite avec le backend
- ✅ Référence aux lignes du controller backend
- ✅ Description de la logique backend
- ✅ Exemples d'utilisation
- ✅ Centralisation de la configuration

---

## 📝 Documentation dans les Routes

Chaque méthode dans les fichiers de routes contient:

1. **Backend Route:** L'endpoint Laravel correspondant
2. **Middleware:** Les middlewares appliqués (auth:sanctum, etc.)
3. **Roles:** Les rôles autorisés
4. **Controller:** Le controller et la ligne de code
5. **Logique Backend:** Description du comportement
6. **Paramètres:** Types et formats
7. **Réponse:** Structure de la réponse
8. **Exemple:** Code d'utilisation

**Exemple:**
```javascript
/**
 * POST /booking
 * Crée une nouvelle réservation
 *
 * Backend: Route::post('/', [BookingController::class, 'createBooking']);
 * Middleware: auth:sanctum
 * Roles: Carrier, Admin
 * Controller: Backend/apcs-backend/app/Http/Controllers/BookingController.php (ligne 77)
 *
 * Logique Backend:
 * 1. Vérifie que l'utilisateur est carrier ou admin
 * 2. Trouve ou crée le timeslot avec la config de capacité
 * 3. Vérifie que le timeslot n'est pas plein
 * 4. Crée la réservation avec status 'pending'
 * 5. Log l'action (NEW_BOOKING)
 *
 * @param {Object} bookingData
 * @returns {Promise<Object>} { booking_id, message }
 */
create(bookingData) {
  return api.post('/booking', bookingData);
}
```

---

## 🚀 Utilisation

### Import Simple
```javascript
import { authRoutes, userRoutes, bookingRoutes } from './routes';
```

### Import de l'API
```javascript
import api from './routes/api.routes';

// Méthodes HTTP directes
const data = await api.get('/user/profile');
const result = await api.post('/booking', bookingData);
```

### Via les Services
```javascript
import { userService } from './services';

// Les services utilisent les routes en interne
const profile = await userService.getProfile();
```

---

## ✅ Avantages de cette Architecture

1. **Documentation Vivante**
   - Chaque endpoint documenté avec le backend correspondant
   - Références aux controllers et lignes de code
   - Description de la logique métier

2. **Maintenance Facile**
   - Un seul endroit pour changer un endpoint
   - Facile de voir quel endpoint manque ou est obsolète
   - Mapping clair frontend ↔ backend

3. **Onboarding Rapide**
   - Nouveaux développeurs comprennent vite la structure
   - Exemples d'utilisation intégrés
   - Lien direct avec le code backend

4. **Type Safety (futur)**
   - Base pour ajouter TypeScript plus tard
   - Structure claire des paramètres et réponses

5. **Testabilité**
   - Facile de mocker les routes pour les tests
   - Séparation claire entre routes et logique métier

---

## 📚 Ressources

- **Backend Routes:** `Backend/apcs-backend/routes/api.php`
- **Backend Controllers:** `Backend/apcs-backend/app/Http/Controllers/`
- **Services Frontend:** `src/services/`
- **Configuration API:** `src/config/api.config.js`

---

**Date:** 2026-02-07
**Status:** ✅ Liaison Complète Documentée
