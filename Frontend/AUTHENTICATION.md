# APCS Role-Based Authentication System

## Overview
Simple frontend authentication system that differentiates between user roles (Admin, Operator, Carrier) with realistic access restrictions.

## Authentication Credentials

### Admin User
- **Email:** `admin@apcs.dz`
- **Password:** `admin123`
- **Color Badge:** 🔴 Red
- **Role:** Full system administrator
- **Default Page:** Dashboard

### Operator User
- **Email:** `operator@apcs.dz`
- **Password:** `operator123`
- **Color Badge:** 🟡 Yellow
- **Role:** Gate/terminal operator
- **Default Page:** Operations

### Carrier User
- **Email:** `carrier@apcs.dz`
- **Password:** `carrier123`
- **Color Badge:** 🟢 Green
- **Role:** Trucking/logistics company
- **Default Page:** Create Booking

## Role-Based Menu Access (UPDATED)

### 🔴 Admin - Full System Access (11 pages)
**Purpose:** System administrator with complete control

- ✅ Dashboard - System overview
- ✅ Bookings - All bookings management (READ ONLY)
- ✅ **Reschedule & Late** - Approve/reject reschedule requests
- ✅ Slot Management - Terminal capacity control
- ✅ Fleet Management - View all company fleets
- ✅ AI Assistant - System queries
- ✅ Operations - Live port monitoring
- ✅ Traceability & Logs - Audit trails
- ✅ Notifications - System alerts
- ✅ Users & Roles - User management
- ✅ Settings - System configuration

**❌ Admin CANNOT create bookings** (carriers only)

### 🟡 Operator - Gate Operations Only (4 pages)
**Purpose:** Terminal worker who validates bookings and monitors gates

- ✅ **Operations** - Main page: Live gate monitoring
- ✅ **Validate Bookings** - View and approve/reject bookings
- ✅ **Notifications** - Operational alerts
- ✅ **Settings** - Personal settings

**Restricted:**
- ❌ Dashboard (admin-only analytics)
- ❌ Slot Management (admin-only)
- ❌ Create Booking (carriers only)
- ❌ Fleet Management (carriers only)
- ❌ AI Assistant (not needed)
- ❌ Traceability & Logs (admin-only)
- ❌ Users & Roles (admin-only)

### 🟢 Carrier - Booking & Fleet Only (6 pages)
**Purpose:** Trucking company managing their bookings and fleet

- ✅ **Create Booking** - Main page: Book terminal slots
- ✅ **My Bookings** - View their company bookings only
- ✅ **Reschedule & Late** - Request reschedule for late bookings
- ✅ **My Fleet** - Manage their trucks and drivers
- ✅ **Notifications** - Booking updates
- ✅ **Settings** - Company settings

**Restricted:**
- ❌ Dashboard (admin-only)
- ❌ Slot Management (admin/operator only)
- ❌ AI Assistant (simplified flow instead)
- ❌ Operations (operator-only gate control)
- ❌ Traceability & Logs (admin-only)
- ❌ Users & Roles (admin-only)

## Realistic Access Summary

| Feature | Admin | Operator | Carrier |
|---------|-------|----------|---------|
| **Total Pages** | 11 | 4 | 5 |
| View Dashboard | ✅ | ❌ | ❌ |
| View All Bookings | ✅ | ✅ View only | ✅ Own only |
| Validate Bookings | ✅ | ✅ | ❌ |
| Create Bookings | ✅ | ❌ | ✅ |
| Slot Management | ✅ | ❌ | ❌ |
| Fleet Management | ✅ All | ❌ | ✅ Own |
| Gate Operations | ✅ | ✅ | ❌ |
| System Logs | ✅ | ❌ | ❌ |
| User Management | ✅ | ❌ | ❌ |

## Login Methods

### Method 1: Email/Password Form
1. Enter email (e.g., `operator@apcs.dz`)
2. Enter password (e.g., `operator123`)
3. Click "Sign In"
4. Redirected to role-specific default page

### Method 2: Quick Login Buttons
- Click 🔴 **Admin** → Full dashboard access
- Click 🟡 **Operator** → Operations page
- Click 🟢 **Carrier** → Create Booking page

## Testing Restricted Access

### Test Operator Restrictions:
1. Login as Operator (🟡 button)
2. Should see only: Operations, Validate Bookings, Notifications, Settings
3. Try accessing `/dashboard` → Redirects to `/operations`
4. Try accessing `/users` → Redirects to `/operations`
5. Try accessing `/slots` → Redirects to `/operations`

### Test Carrier Restrictions:
1. Login as Carrier (🟢 button)
2. Should see only: Create Booking, My Bookings, My Fleet, Notifications, Settings
3. Try accessing `/dashboard` → Redirects to `/create-booking`
4. Try accessing `/operations` → Redirects to `/create-booking`
5. Try accessing `/logs` → Redirects to `/create-booking`

### Test Admin Full Access:
1. Login as Admin (🔴 button)
2. Should see all 11 menu items
3. Can access any page without restriction

## Role Definitions

### Admin Role
- System administrators
- Port authority managers
- IT support staff
- Access to everything

### Operator Role
- Gate operators
- Terminal workers
- Security personnel
- Limited to operational tasks only

### Carrier Role
- Trucking companies
- Logistics providers
- Transportation companies
- Manage only their own operations

## Storage

User data stored in localStorage:
```javascript
localStorage.getItem('apcs_user');
// { email: 'operator@apcs.dz', name: 'Operator User', role: 'operator' }
```

## Security Note

This is a **frontend-only authentication** for demonstration. For production:
- Add real backend API with proper authentication
- Implement JWT tokens or session-based auth
- Add password hashing (bcrypt)
- Server-side role validation
- HTTPS enforcement
- Rate limiting
- CSRF protection
- API-level access control
