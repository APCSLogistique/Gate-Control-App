# APCS API Integration - Complete Mapping

This document maps every page in the frontend to the exact backend API endpoints.

---

## Dashboard Page

**File:** `src/pages/Dashboard.jsx`
**Access:** Admin only
**Purpose:** System overview with analytics

### API Endpoints Used

| Action | Endpoint | Method | Description |
|--------|----------|--------|-------------|
| Load Schedule Data | `GET /api/admin/schedule` | GET | Get today's schedule |
| Load Container Data | `GET /api/admin/data/containers/:date` | GET | Container analytics |
| Load Capacity Data | `GET /api/admin/data/capacity/:date` | GET | Capacity utilization |
| Load Logs | `GET /api/admin/data/logs/:date` | GET | System logs |

**Note:** Admin CANNOT create bookings - no quick actions for booking creation.

---

## Bookings Page

**File:** `src/pages/Bookings.jsx`
**Access:** Admin (view all), Operator (validate), Carrier (own bookings)

### API Endpoints by Role

#### Carrier
| Action | Endpoint | Method |
|--------|----------|--------|
| View My Bookings | `GET /api/user/bookings` | GET |
| View by Date/Hour | `GET /api/booking/:date/:hour` | GET |
| Update Status | `PUT /api/booking/:id/status` | PUT |
| Delete Booking | `DELETE /api/booking/:id` | DELETE |
| Get QR Code | `GET /api/terminal/qr/:bookingId` | GET |

#### Operator
| Action | Endpoint | Method |
|--------|----------|--------|
| View Booking | `GET /api/booking/:id` | GET |
| **Validate Booking** | `PUT /api/booking/:id/validate` | PUT |

#### Admin
| Action | Endpoint | Method |
|--------|----------|--------|
| View Booking (READ ONLY) | `GET /api/booking/:id` | GET |

---

## Create Booking Page

**File:** `src/pages/CreateBooking.jsx`
**Access:** Carrier only

### API Endpoints
| Step | Action | Endpoint | Method |
|------|--------|----------|--------|
| Step 2 | Check Availability | `GET /api/admin/:terminalId/:date/available` | GET |
| Step 4 | **Create Booking** | `POST /api/booking` | POST |
| Confirmation | Get QR Code | `GET /api/terminal/qr/:bookingId` | GET |

**Request Body (POST /api/booking):**
```json
{
  "terminalId": "terminal-a",
  "date": "2024-02-06",
  "timeSlot": "09:00-10:00",
  "truckPlate": "TRK-123",
  "driverName": "Ahmed Benali",
  "driverPhone": "+213555123456",
  "cargoType": "Container"
}
```

---

## Reschedule & Late Page

**File:** `src/pages/ReschedulePage.jsx`
**Access:** Admin, Carrier

### API Endpoints
| Action | Endpoint | Method | Role |
|--------|----------|--------|------|
| Get Late Bookings | `GET /api/booking/late` | GET | All |
| **Request Reschedule** | `PUT /api/booking/:id/reschedule` | PUT | Carrier |
| **Approve Reschedule** | `PUT /api/booking/:id/reschedule` | PUT | Admin |
| **Reject Reschedule** | `PUT /api/booking/:id/reschedule` | PUT | Admin |

---

## Slot Management Page

**File:** `src/pages/SlotManagement.jsx`
**Access:** Admin only

### API Endpoints
| Action | Endpoint | Method |
|--------|----------|--------|
| View Schedule | `GET /api/admin/schedule/:date` | GET |
| View Date Range | `GET /api/admin/schedule/:start-date/:end-date` | GET |
| Check Availability | `GET /api/admin/:terminalId/:date/available` | GET |
| **Set Capacity** | `POST /api/admin/config/:terminalId` | POST |
| **Emergency Override** | `POST /api/admin/config/late` | POST |

---

## Operations Page

**File:** `src/pages/Operations.jsx`
**Access:** Admin, Operator

### API Endpoints
| Action | Endpoint | Method | Role |
|--------|----------|--------|------|
| **Scan QR Code** | `POST /api/terminal/scan` | POST | Operator |
| Get Terminal Status | `GET /api/terminal/:terminalId/status` | GET | Operator |
| **Mark Complete** | `PUT /api/terminal/:terminalId/done` | PUT | Operator |
| View Schedule | `GET /api/admin/:terminalId/:date` | GET | Operator |

---

## Fleet Management Page

**File:** `src/pages/FleetManagement.jsx`
**Access:** Admin (all), Carrier (own)

### API Endpoints
| Action | Endpoint | Method |
|--------|----------|--------|
| List Fleet | `GET /api/user/fleet` | GET |
| Add Truck | `POST /api/user/fleet` | POST |
| Update Truck | `PUT /api/user/fleet/:id` | PUT |
| Delete Truck | `DELETE /api/user/fleet/:id` | DELETE |

---

## AI Assistant Page

**File:** `src/pages/AIAssistant.jsx`
**Access:** All roles

### API Endpoints
| Action | Endpoint | Method |
|--------|----------|--------|
| Get Chat History | `GET /api/ai/chat` | GET |
| **Send Query** | `POST /api/ai/generate` | POST |

**Request (POST /api/ai/generate):**
```json
{
  "query": "What is the status of booking B-2024-001?",
  "context": {
    "role": "carrier",
    "userId": "user-123"
  }
}
```

---

## Logs & Traceability Page

**File:** `src/pages/Logs.jsx`
**Access:** Admin only

### API Endpoints
| Action | Endpoint | Method |
|--------|----------|--------|
| View Logs | `GET /api/admin/data/logs` | GET |
| View Logs by Date | `GET /api/admin/data/logs/:date` | GET |
| View Date Range | `GET /api/admin/data/logs/:start-date/:end-date` | GET |
| Get Reports | `GET /api/report/:date` | GET |
| **Solve Incident** | `POST /api/report/solve` | POST |
| Get Pending Reports | `GET /api/report/pending` | GET |

---

## Notifications Page

**File:** `src/pages/Notifications.jsx`
**Access:** All roles

### API Endpoints
| Action | Endpoint | Method |
|--------|----------|--------|
| Get Notifications | `GET /api/user/notifications` | GET |
| Mark as Read | `PUT /api/user/notifications/:id/read` | PUT |
| Mark All Read | `PUT /api/user/notifications/read-all` | PUT |

---

## Users & Roles Page

**File:** `src/pages/Users.jsx`
**Access:** Admin only

### API Endpoints
| Action | Endpoint | Method |
|--------|----------|--------|
| List Users | `GET /api/admin/users` | GET |
| **Create User** | `POST /api/admin/users` | POST |
| Update User | `PUT /api/admin/users/:id` | PUT |
| Assign Role | `PUT /api/admin/users/:id/role` | PUT |
| Enable/Disable | `PUT /api/admin/users/:id/status` | PUT |
| Delete User | `DELETE /api/admin/users/:id` | DELETE |

---

## Settings Page

**File:** `src/pages/Settings.jsx`
**Access:** All roles

### API Endpoints
| Action | Endpoint | Method |
|--------|----------|--------|
| Get Profile | `GET /api/user/profile` | GET |
| **Update Profile** | `PUT /api/user/profile` | PUT |
| Change Password | `PUT /api/user/password` | PUT |
| Update Preferences | `PUT /api/user/preferences` | PUT |

---

## Login Page

**File:** `src/pages/Login.jsx`
**Access:** Public

### API Endpoints
| Action | Endpoint | Method |
|--------|----------|--------|
| **Login** | `POST /api/auth/login` | POST |
| Logout | `POST /api/auth/logout` | POST |
| Forgot Password | `POST /api/auth/forgot-password` | POST |

---

## Logging Events

All actions trigger backend logging with these event codes:

### Booking Events
- `NEW_BOOKING` - Booking created
- `MODIFIED_BOOKING` - Booking updated
- `DELETED_BOOKING` - Booking deleted
- `QR_GENERATED` - QR code generated
- `CARRIER_ARRIVED` - Truck arrival scanned
- `SHIPMENT_CONSUMED` - Booking completed

### Configuration Events
- `CONFIG_TERMINAL_CHANGED` - Terminal capacity modified
- `CONFIG_LATE_CHANGED` - Late policy updated

### Security Events
- `USER_LOGIN` - Successful login
- `USER_LOGOUT` - User logout
- `UNAUTHORIZED_ACCESS` - Access denied

---

## Summary by Role

### 🔴 Admin APIs
- Full read access to all data
- Configuration management
- User management
- Report resolution
- **NO booking creation**

### 🟡 Operator APIs
- Terminal operations (scan, status, complete)
- Booking validation
- Limited schedule view

### 🟢 Carrier APIs
- Booking creation
- Own bookings management
- QR code retrieval
- Fleet management
- Reschedule requests
