# APCS Terminal Management System - Backend

[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=flat&logo=laravel)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.1+-777BB4?style=flat&logo=php)](https://php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.4-4479A1?style=flat&logo=mysql)](https://www.mysql.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker)](https://docker.com)

A comprehensive terminal management system for port operations with booking management, QR-based gate access, AI chat assistance, and incident reporting.

---

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [AI Integration](#ai-integration)
- [Use Cases](#use-cases)

---

## ✨ Features

- 🚚 **Booking Management** - Create, modify, reschedule terminal bookings
- 📅 **Dynamic Timeslots** - Regular and late capacity management
- 🔐 **QR Code Access** - Secure gate entry system
- ⏰ **Smart Late Handling** - Auto-reschedule to available slots
- 📊 **Real-time Tracking** - Live capacity monitoring
- 📝 **Incident Reports** - Track and resolve operational issues
- 🤖 **AI Chat** - Intelligent assistant powered by external Python service
- 📈 **Admin Dashboard** - Complete scheduling and reporting
- 🔍 **Audit Logging** - Full activity trail

### User Roles

- **transiter** - Manage bookings, generate QR codes
- **Operator** - Gate operations, scan QR codes
- **Admin** - Full system control and reporting

---

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Git

### Installation

```bash
# 1. Clone repository
git clone https://github.com/APCSLogistique/Backend.git
cd apcs-backend

# 2. Setup environment
cp .env.example .env
# Edit .env with your configuration

# 3. Start containers
docker-compose up -d --build

# 4. Initialize application
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate
docker-compose exec app php artisan db:init # this for creating the admin account

# 5. Access application
# http://localhost:8080
```

### Essential Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Run artisan commands
docker-compose exec app php artisan [command]

# Shell access
docker-compose exec app bash
```

### Configuration (.env)

```env
# Application
APP_URL=http://localhost:8080

# Database (use Docker service name)
DB_HOST=db
DB_PORT=3306
DB_DATABASE=apcs_terminal
DB_USERNAME=apcs_user
DB_PASSWORD=your_password

# Terminal Settings
DEFAULT_CAPACITY=10
DEFAULT_LATE_CAPACITY=2

# AI Service (use host.docker.internal for local Python service)
AI_SERVICE_URL=http://host.docker.internal:8001/api
AI_SERVICE_TIMEOUT=30
AI_SERVICE_TOKEN=your-internal-token
```

---

## 📡 API Documentation

**Base URL:** `http://localhost:8080/api`

### User API

| Method | Endpoint             | Auth | Description               |
| ------ | -------------------- | ---- | ------------------------- |
| `GET`  | `/api/user/profile`  | Any  | Get user profile          |
| `GET`  | `/api/user/bookings` | Any  | Get current user bookings |

**Example:**

```bash
curl http://localhost:8080/api/user/profile \
  -H "Authorization: Bearer {token}"
```

---

### Booking API

| Method   | Endpoint                       | Auth    | Description                      |
| -------- | ------------------------------ | ------- | -------------------------------- |
| `GET`    | `/api/booking/{id}`            | Admin   | Get booking by ID                |
| `GET`    | `/api/booking/{date}/{hour}`   | Carrier | Get user bookings by date & hour |
| `POST`   | `/api/booking`                 | Carrier | Create booking                   |
| `PUT`    | `/api/booking/{id}/status`     | Carrier | Update booking status            |
| `PUT`    | `/api/booking/{id}/reschedule` | Carrier | Reschedule booking               |
| `DELETE` | `/api/booking/{id}`            | Carrier | Delete booking                   |

**Create Booking Example:**

```bash
curl -X POST http://localhost:8080/api/booking \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "truck_number": "TRK-001",
    "user_id": 1,
    "timeslot": {
      "date": "2024-02-07",
      "hour_start": "14"
    }
  }'
```

**Response:**

```json
{
  "booking_id": 123,
  "message": "Booking created successfully"
}
```

---

### Timeslot API

| Method | Endpoint                      | Auth | Description               |
| ------ | ----------------------------- | ---- | ------------------------- |
| `GET`  | `/api/timeslot/{date}/{hour}` | Any  | Get timeslot availability |

**Example:**

```bash
curl http://localhost:8080/api/timeslot/2024-02-07/14
```

**Response:**

```json
{
  "max_capacity": 10,
  "capacity": 7,
  "late_capacity": 2
}
```

---

### Gate API

| Method | Endpoint                   | Auth         | Description                  |
| ------ | -------------------------- | ------------ | ---------------------------- |
| `GET`  | `/api/gate/qr/{bookingId}` | Carrier      | Generate QR code             |
| `POST` | `/api/gate/scan`           | Gate Service | Scan QR and enqueue shipment |

**Generate QR:**

```bash
curl http://localhost:8080/api/gate/qr/123 \
  -H "Authorization: Bearer {token}"
```

**Response:**

```json
{
  "qr": "apk_a1b2c3d4e5f6g7h8i9j0..."
}
```

**Scan QR:**

```bash
curl -X POST http://localhost:8080/api/gate/scan \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "qr": "apk_a1b2c3d4e5f6g7h8i9j0..."
  }'
```

---

### Admin API

| Method | Endpoint                                     | Auth  | Description                 |
| ------ | -------------------------------------------- | ----- | --------------------------- |
| `GET`  | `/api/admin/schedule`                        | Admin | Get today's schedule        |
| `GET`  | `/api/admin/schedule/{startDate}/{endDate}`  | Admin | Get schedule range          |
| `GET`  | `/api/admin/data/schedule/{date}`            | Admin | Get schedule by date        |
| `GET`  | `/api/admin/data/logs/{startDate}/{endDate}` | Admin | Get logs by date range      |
| `POST` | `/api/admin/config/capacity`                 | Admin | Configure terminal capacity |

**Get Schedule:**

```bash
curl http://localhost:8080/api/admin/schedule/2024-02-07 \
  -H "Authorization: Bearer {token}"
```

**Response:**

```json
[
  {
    "date": "2024-02-07",
    "max_shipments": 80,
    "booked_amount": 45,
    "schedule": [
      {
        "hour_start": "08",
        "max_capacity": 10,
        "booked_capacity": 7
      }
    ]
  }
]
```

**Configure Capacity:**

```bash
curl -X POST http://localhost:8080/api/admin/config/capacity \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "capacity": 10,
    "late_capacity": 2
  }'
```

---

### Report API

| Method | Endpoint              | Auth             | Description           |
| ------ | --------------------- | ---------------- | --------------------- |
| `POST` | `/api/report`         | Carrier/Operator | Create incident       |
| `GET`  | `/api/report/{date}`  | Admin            | Get incidents by date |
| `POST` | `/api/report/solve`   | Admin            | Resolve incident      |
| `GET`  | `/api/report/pending` | Admin            | Get pending incidents |

**Create Incident:**

```bash
curl -X POST http://localhost:8080/api/report \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "booking_id": 123,
    "message": "Late truck arrival due to traffic"
  }'
```

**Resolve Incident:**

```bash
curl -X POST http://localhost:8080/api/report/solve \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "incident_id": 456,
    "status": "resolved",
    "response": "Issue resolved, container delivered"
  }'
```

---

### Chat API

| Method | Endpoint                      | Auth | Description          |
| ------ | ----------------------------- | ---- | -------------------- |
| `GET`  | `/api/chat`                   | Any  | Create new chat      |
| `GET`  | `/api/chat/{chatId}/messages` | Any  | Get chat messages    |
| `POST` | `/api/ai/generate`            | Any  | Generate AI response |

**Create Chat:**

```bash
curl http://localhost:8080/api/chat \
  -H "Authorization: Bearer {token}"
```

**Response:**

```json
{
  "chat_id": "chat_123",
  "user_id": "U456",
  "created_at": "2024-02-07T10:00:00Z"
}
```

**Generate AI Response:**

```bash
curl -X POST http://localhost:8080/api/ai/generate \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "chat_123",
    "message": "What are my bookings today?"
  }'
```

**Response:**

```json
{
  "message": "You have 2 bookings today at 14:00 and 16:00",
  "message_id": "789",
  "index": 1
}
```

---

### Internal Tools API (AI Service Only)

| Method | Endpoint                             | Auth             | Description           |
| ------ | ------------------------------------ | ---------------- | --------------------- |
| `POST` | `/api/internal/tools/booking-status` | AI Service Token | Get booking status    |
| `POST` | `/api/internal/tools/user-bookings`  | AI Service Token | Get user bookings     |
| `POST` | `/api/internal/tools/port-schedule`  | AI Service Token | Get terminal schedule |

**Authentication:** `X-AI-Service-Token: {your-internal-token}`

**Get Booking Status:**

```bash
curl -X POST http://localhost:8080/api/internal/tools/booking-status \
  -H "X-AI-Service-Token: your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "booking_id": "BK123",
    "user_id": "U456"
  }'
```

---

## 🔐 Authentication

All endpoints require Bearer token authentication (except internal tools).

```
Authorization: Bearer {your-token}
```

### Role-Based Access

| Role         | Permissions                                                       |
| ------------ | ----------------------------------------------------------------- |
| **Carrier**  | Create/manage own bookings, generate QR codes, report incidents   |
| **Operator** | Scan QR codes, process gate operations, report incidents          |
| **Admin**    | Full system access, configuration, reporting, incident resolution |

---

## 🗄️ Database Schema

### Key Tables

**Users**

- user_id, name, email, hashed_pw, role

**Bookings**

- booking_id, user_id, truck_number, timeslot_id, status, created_at

**Timeslots**

- timeslot_id, date, hour_start, capacity, late_capacity

**QR Codes**

- id, booking_id, qr

**Incidents**

- incident_id, booking_id, reporter_id, message, status, response, created_at, resolved_at

**Logs**

- log_id, timestamp, code, message

**Chats & Messages**

- Chats: chat_id, user_id
- Messages: message_id, sender, index, message, chat_id

### Log Codes

| Code                | Description                    |
| ------------------- | ------------------------------ |
| `NEW_BOOKING`       | Booking created                |
| `MODIFIED_BOOKING`  | Booking changed/rescheduled    |
| `DELETED_BOOKING`   | Booking deleted                |
| `QR_GENERATED`      | QR Code generated              |
| `CARRIER_ARRIVED`   | Truck arrived at terminal      |
| `SHIPMENT_CONSUMED` | Shipment completed             |
| `CONFIG_CHANGED`    | Terminal configuration changed |
| `NEW_INCIDENT`      | Incident reported              |

---

## 🤖 AI Integration

### Overview

Laravel communicates with external Python AI service for chat functionality.

### Data Flow

```
User → Laravel → Python AI Service → Laravel → User
```

### What Laravel Sends

```json
{
  "chat_id": "chat_123",
  "user_id": "U456",
  "user_name": "John Doe",
  "user_role": "carrier",
  "message": "What are my bookings?",
  "messages": [
    {
      "sender": "human",
      "message": "Hello",
      "index": 0,
      "created_at": "2024-02-07T10:00:00Z"
    }
  ]
}
```

### Python Service Requirements

**Endpoint:** `POST /api/chat`

**Returns:**

```json
{
  "message": "AI generated response here"
}
```

### Configuration

```env
AI_SERVICE_URL=http://host.docker.internal:8001/api
AI_SERVICE_TIMEOUT=30
```

---

## 💡 Use Cases

### Use Case 1: Create Booking

1. Carrier views available timeslots
2. Creates booking with truck number
3. Receives confirmation
4. System logs the action

### Use Case 2: Late Arrival

1. Truck arrives late after scheduled time
2. Operator scans QR code
3. System detects late arrival
4. Auto-checks late capacity in current slot
5. If unavailable, finds next available late slot
6. Auto-reschedules and logs action

### Use Case 3: AI Chat

1. User asks: "What are my bookings?"
2. Laravel sends query + history to Python AI
3. Python processes and returns answer
4. User receives formatted response

### Use Case 4: Incident Reporting

1. Operator notices issue
2. Creates incident report
3. Admin receives notification
4. Admin reviews and resolves
5. All actions logged

---

## 🔧 Common Tasks

### Run Migrations

```bash
docker-compose exec app php artisan migrate
```

### Laravel Command

```bash
docker-compose exec app php artisan db:init
```

### Clear Cache

```bash
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear
```

### View Logs

```bash
docker-compose logs -f app
```

### Backup Database

```bash
docker-compose exec db mysqldump -u apcs_user -p apcs_terminal > backup.sql
```

---

## 🐛 Troubleshooting

**Database connection error:**

- Ensure `DB_HOST=db` (not localhost)
- Check containers: `docker-compose ps`

**Permission errors:**

```bash
docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
```

**Can't access AI service:**

- Use `host.docker.internal` instead of `localhost`
- Check AI service is running

**Port 8080 in use:**

- Change port in `docker-compose.yml`

---

## 📄 License

MIT License - See LICENSE file for details

---
