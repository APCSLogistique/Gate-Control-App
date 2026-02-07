# APCS - Algerian Port Community System

<div align="center">

![APCS Logo](https://img.shields.io/badge/APCS-Port_Community_System-1E5AA8?style=for-the-badge&logo=anchor&logoColor=white)

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.18-06B6D4?style=for-the-badge&logo=tailwindcss)
![React Router](https://img.shields.io/badge/React_Router-7.13.0-CA4245?style=for-the-badge&logo=reactrouter)

**Digital Control of Physical Flow**

A modern, role-based port booking management system for managing truck entries, time slots, and port operations.

[Demo](#-demo-accounts) | [Features](#-features) | [Installation](#-installation) | [Documentation](#-documentation)

</div>

---

## Overview

APCS (Algerian Port Community System) is a comprehensive frontend application designed to streamline port operations through intelligent logistics management. The system provides role-based access control with three distinct user roles, each with customized dashboards and permissions.

### Key Highlights

- **Real-time Booking Management** - Create, approve, and track port entry bookings
- **Role-Based Access Control** - Admin, Operator, and Carrier roles with specific permissions
- **QR Code Integration** - Generate and scan QR codes for seamless gate operations
- **Smart Capacity Management** - Monitor and manage port capacity in real-time
- **AI-Powered Assistant** - Integrated AI assistant for operational support
- **Demo Mode** - Fully functional demo accounts without backend dependency

---

## Demo Accounts

The application includes built-in demo accounts that work without a backend connection:

| Role         | Email              | Password      | Access Level       |
| ------------ | ------------------ | ------------- | ------------------ |
| **Admin**    | `admin@apcs.dz`    | `admin123`    | Full system access |
| **Operator** | `operator@apcs.dz` | `operator123` | Gate operations    |
| **Carrier**  | `carrier@apcs.dz`  | `carrier123`  | Booking management |

> **Note**: Demo accounts authenticate locally without API calls, perfect for testing and demonstrations.

---

## Features

### Admin Dashboard

- **Dashboard** - Real-time KPIs (Total Bookings, Available Slots, Port Saturation)
- **Capacity Management** - Configure daily capacity limits and time slots
- **Booking Requests** - Review and approve/reject booking requests from carriers
- **Booking History** - View all historical bookings
- **QR Scanner** - Scan and validate truck entries
- **Reports** - Analytics and operational reports
- **User Management** - Manage system users
- **Logs** - System activity logs

### Operator Dashboard

- **Dashboard** - Operational overview
- **Bookings** - View assigned bookings
- **QR Scanner** - Scan QR codes for truck entry validation

### Carrier Dashboard

- **Dashboard** - Personal booking overview
- **New Booking** - Create new port entry bookings
- **My Bookings** - View and manage personal bookings
- **History** - View booking history

### Shared Features

- **AI Assistant** - Natural language query support
- **Notifications** - Real-time alerts and updates
- **Profile** - Personal information management
- **Settings** - User preferences

---

## Tech Stack

| Technology       | Version | Purpose                 |
| ---------------- | ------- | ----------------------- |
| **React**        | 19.2.0  | UI Framework            |
| **Vite**         | 7.3.1   | Build Tool & Dev Server |
| **React Router** | 7.13.0  | Client-side Routing     |
| **TailwindCSS**  | 4.1.18  | Utility-first CSS       |
| **Recharts**     | 3.7.0   | Data Visualization      |
| **Lucide React** | 0.563.0 | Icon Library            |

---

## Installation

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd frontendAMine

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your API URL (optional for demo mode)
VITE_API_URL=http://localhost:8080/api
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
src/
├── components/                 # Reusable UI components
│   ├── Header.jsx             # Top navigation bar
│   ├── Sidebar.jsx            # Side navigation menu
│   ├── ProtectedRoute.jsx     # Route guard component
│   └── AIFloatingWidget.jsx   # Floating AI assistant
│
├── context/                   # React Context providers
│   ├── AuthContext.jsx        # Authentication state management
│   ├── ProfileContext.jsx     # User profile state
│   └── BookingContext.jsx     # Global booking state management
│
├── layouts/                   # Layout components
│   └── MainLayout.jsx         # Main application layout
│
├── pages/                     # Page components
│   ├── Login.jsx              # Login page with demo access
│   ├── Dashboard.jsx          # Admin dashboard
│   ├── Profile.jsx            # User profile page
│   │
│   ├── admin/                 # Admin-only pages
│   │   ├── BookingRequests.jsx    # Approve/reject bookings
│   │   ├── CapacityManagementNew.jsx
│   │   └── Reports.jsx
│   │
│   ├── operator/              # Operator-only pages
│   │   ├── OperatorDashboard.jsx
│   │   ├── OperatorBookingsView.jsx
│   │   └── QRScanner.jsx
│   │
│   └── transiteur/            # Carrier-only pages
│       ├── TransiteurDashboard.jsx
│       └── BookingHistory.jsx
│
├── services/                  # API service layer
│   ├── api.client.js          # HTTP client with auth
│   ├── auth.service.js        # Authentication (with demo support)
│   ├── booking.service.js     # Booking operations
│   └── ...
│
├── utils/                     # Utility functions
│   └── roleConfig.js          # Role-based menu configuration
│
├── App.jsx                    # Root component with providers
└── main.jsx                   # Application entry point
```

---

## Role Permissions

| Feature             |     Admin      | Operator | Carrier  |
| ------------------- | :------------: | :------: | :------: |
| Dashboard           |      Full      | Limited  | Personal |
| Booking Requests    | Approve/Reject |    -     |    -     |
| Create Booking      |       -        |    -     |   Yes    |
| View All Bookings   |      Yes       |   Yes    |    -     |
| View Own Bookings   |      Yes       |    -     |   Yes    |
| QR Scanner          |      Yes       |   Yes    |    -     |
| Capacity Management |      Yes       |    -     |    -     |
| User Management     |      Yes       |    -     |    -     |
| Reports             |      Yes       |    -     |    -     |
| AI Assistant        |      Yes       |   Yes    |   Yes    |

---

## Booking Workflow

```
1. Carrier creates booking request
         ↓
2. Admin reviews in "Booking Requests"
         ↓
3. Admin approves or rejects
         ↓
4. If approved → Status changes to "Confirmed"
         ↓
5. Carrier receives QR code
         ↓
6. Operator scans QR at gate
         ↓
7. Truck entry validated
```

---

## Available Scripts

```bash
# Development
npm run dev          # Start dev server with HMR

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

---

## Docker Deployment

```bash
# Build Docker image
docker build -t apcs-frontend .

# Run container
docker run -p 5173:5173 apcs-frontend

# Or use convenience scripts
./docker-start.sh    # Linux/Mac
docker-start.bat     # Windows
```

### Docker Compose

```yaml
version: "3.8"
services:
  frontend:
    build: .
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://backend:8080/api
```

---

## Key Components

### BookingContext

Global state management for bookings with real-time status updates:

- `bookings` - List of all bookings
- `updateBookingStatus(id, status)` - Update booking status
- `getBookingsByStatus(status)` - Filter bookings by status
- `pendingCount`, `confirmedCount`, `rejectedCount` - Status counts

### AuthContext

Authentication state with demo account support:

- `user` - Current user data
- `login(email, password)` - Authenticate user
- `logout()` - End session
- `isAdmin`, `isOperator`, `isCarrier` - Role checks

### ProtectedRoute

Route guard component for role-based access control.

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Architecture Diagrams

### 1. Application Architecture Overview

```mermaid
graph TB
    subgraph "User Interface Layer"
        A[Login Page] --> B{Authentication}
        B -->|Demo Account| C[Local Auth]
        B -->|Real Account| D[API Auth]
        C --> E[AuthContext]
        D --> E
    end

    subgraph "State Management"
        E[AuthContext] --> F[User State]
        G[BookingContext] --> H[Bookings State]
        I[ProfileContext] --> J[Profile State]
    end

    subgraph "Routing Layer"
        F --> K{Role Router}
        K -->|Admin| L[Admin Routes]
        K -->|Operator| M[Operator Routes]
        K -->|Carrier| N[Carrier Routes]
    end

    subgraph "Admin Features"
        L --> O[Dashboard]
        L --> P[Booking Requests]
        L --> Q[Capacity Management]
        L --> R[Reports]
        L --> S[User Management]
    end

    subgraph "Operator Features"
        M --> T[Operator Dashboard]
        M --> U[QR Scanner]
        M --> V[Bookings View]
    end

    subgraph "Carrier Features"
        N --> W[Carrier Dashboard]
        N --> X[Create Booking]
        N --> Y[My Bookings]
        N --> Z[History]
    end

    subgraph "Shared Components"
        O & P & Q & R & S & T & U & V & W & X & Y & Z --> AA[Header]
        O & P & Q & R & S & T & U & V & W & X & Y & Z --> AB[Sidebar]
        O & P & Q & R & S & T & U & V & W & X & Y & Z --> AC[AI Assistant]
    end

    subgraph "Service Layer"
        O & P & Q & R & S & T & U & V & W & X & Y & Z --> AD[API Client]
        AD --> AE[Auth Service]
        AD --> AF[Booking Service]
        AD --> AG[Gate Service]
        AD --> AH[Admin Service]
    end

    subgraph "Backend"
        AE & AF & AG & AH -.->|HTTP/REST| AI[Laravel API]
        AI -.-> AJ[(MySQL DB)]
    end

    style A fill:#3b82f6
    style E fill:#10b981
    style G fill:#10b981
    style K fill:#f59e0b
    style AI fill:#ef4444
```

### 2. Authentication Flow (Demo Mode)

```mermaid
sequenceDiagram
    participant U as User
    participant LP as Login Page
    participant AS as Auth Service
    participant AC as AuthContext
    participant LS as LocalStorage
    participant DR as Dashboard Router

    U->>LP: Enter demo credentials
    Note over U,LP: admin@apcs.dz / admin123
    LP->>AS: login(email, password)

    alt Demo Account
        AS->>AS: Check DEMO_ACCOUNTS
        AS->>AS: Validate password
        AS->>LS: Store demo token
        AS->>LS: Store user data {role, name, id}
        AS-->>AC: Return {token, user}
        AC->>AC: Set user state
        AC-->>LP: Success
        LP->>DR: Navigate to /dashboard
        DR->>DR: Check user.role

        alt Admin Role
            DR->>U: Show Admin Dashboard
        else Operator Role
            DR->>U: Show Operator Dashboard
        else Carrier Role
            DR->>U: Show Carrier Dashboard
        end
    else Real Account
        AS->>Backend: POST /api/login
        Backend-->>AS: {token, user}
        AS->>LS: Store token & user
        AS-->>AC: Return data
        AC-->>LP: Success
        LP->>DR: Navigate
    end
```

### 3. Booking Request Workflow (Admin)

```mermaid
sequenceDiagram
    participant C as Carrier
    participant CB as Create Booking Page
    participant BC as BookingContext
    participant A as Admin
    participant BR as Booking Requests Page
    participant N as Notifications

    C->>CB: Fill booking form
    CB->>CB: Validate inputs
    CB->>BC: addBooking(newBooking)
    BC->>BC: bookings.push({status: 'pending'})
    BC->>BC: pendingCount++
    BC-->>CB: Success
    CB->>C: Show confirmation
    CB->>N: Notify admin

    Note over A,BR: Admin logs in

    A->>BR: Open Booking Requests
    BR->>BC: getBookingsByStatus('pending')
    BC-->>BR: Return pending bookings
    BR->>A: Display requests table

    alt Approve Booking
        A->>BR: Click Accept ✓
        BR->>BC: updateBookingStatus(id, 'confirmed')
        BC->>BC: booking.status = 'confirmed'
        BC->>BC: pendingCount--
        BC->>BC: confirmedCount++
        BC-->>BR: Success
        BR->>N: Notify carrier (approved)
        BR->>A: Update UI (green badge)

    else Reject Booking
        A->>BR: Click Reject ✗
        BR->>BC: updateBookingStatus(id, 'rejected')
        BC->>BC: booking.status = 'rejected'
        BC->>BC: pendingCount--
        BC->>BC: rejectedCount++
        BC-->>BR: Success
        BR->>N: Notify carrier (rejected)
        BR->>A: Update UI (red badge)
    end

    Note over C: Status changes visible everywhere
```

### 4. Component Hierarchy & Data Flow

```mermaid
graph TB
    subgraph "App.jsx"
        A[App Root] --> B[AuthProvider]
        B --> C[ProfileProvider]
        C --> D[BookingProvider]
        D --> E[Router]
    end

    subgraph "Layout"
        E --> F[MainLayout]
        F --> G[Header Component]
        F --> H[Sidebar Component]
        F --> I[Content Area / Outlet]
    end

    subgraph "Protected Routes"
        I --> J{ProtectedRoute}
        J -->|Check Auth| K{User Logged In?}
        K -->|No| L[Redirect to /login]
        K -->|Yes| M{Check Role Access}
        M -->|Allowed| N[Render Page]
        M -->|Denied| L
    end

    subgraph "Page Components"
        N --> O[Dashboard]
        N --> P[Booking Requests]
        N --> Q[Create Booking]
        N --> R[QR Scanner]
    end

    subgraph "State Access"
        O --> S[useAuth Hook]
        O --> T[useBooking Hook]
        P --> S
        P --> T
        Q --> S
        Q --> T
        R --> S
    end

    subgraph "Context State"
        S --> U[AuthContext State]
        T --> V[BookingContext State]
        U --> W[user, isAdmin, isOperator]
        V --> X[bookings, pendingCount, updateStatus]
    end

    style A fill:#3b82f6
    style B fill:#10b981
    style D fill:#10b981
    style J fill:#f59e0b
```

### 5. State Management with Contexts

```mermaid
graph LR
    subgraph "AuthContext"
        A1[State] --> A2[user]
        A1 --> A3[loading]
        A1 --> A4[error]

        B1[Methods] --> B2[login]
        B1 --> B3[logout]
        B1 --> B4[register]

        C1[Computed] --> C2[isAuthenticated]
        C1 --> C3[isAdmin]
        C1 --> C4[isOperator]
        C1 --> C5[isCarrier]
    end

    subgraph "BookingContext"
        D1[State] --> D2[bookings Array]
        D1 --> D3[loading]
        D1 --> D4[error]

        E1[Methods] --> E2[updateBookingStatus]
        E1 --> E3[addBooking]
        E1 --> E4[deleteBooking]
        E1 --> E5[getBookingsByStatus]
        E1 --> E6[getBookingById]

        F1[Computed] --> F2[pendingCount]
        F1 --> F3[confirmedCount]
        F1 --> F4[rejectedCount]
        F1 --> F5[completedCount]
    end

    subgraph "ProfileContext"
        G1[State] --> G2[profileImage]
        H1[Methods] --> H2[updateProfileImage]
    end

    subgraph "Components Access"
        I[Login] -.uses.-> A1
        J[Dashboard] -.uses.-> A1
        J -.uses.-> D1
        K[Booking Requests] -.uses.-> D1
        L[Create Booking] -.uses.-> D1
        M[Header] -.uses.-> G1
        N[Profile] -.uses.-> G1
    end

    style A1 fill:#10b981
    style D1 fill:#10b981
    style G1 fill:#10b981
```

### 6. Role-Based Menu System

```mermaid
graph TB
    A[roleConfig.js] --> B[menuConfig Object]

    B --> C[Admin Menu]
    B --> D[Operator Menu]
    B --> E[Carrier Menu]

    C --> C1[Dashboard]
    C --> C2[Capacity Management]
    C --> C3[Booking Requests]
    C --> C4[Booking History]
    C --> C5[QR Scanner]
    C --> C6[Reports]
    C --> C7[Users]
    C --> C8[Logs]
    C --> C9[AI Assistant]
    C --> C10[Notifications]
    C --> C11[Profile]
    C --> C12[Settings]

    D --> D1[Dashboard]
    D --> D2[Bookings]
    D --> D3[QR Scanner]
    D --> D4[AI Assistant]
    D --> D5[Notifications]
    D --> D6[Profile]
    D --> D7[Settings]

    E --> E1[Dashboard]
    E --> E2[New Booking]
    E --> E3[My Bookings]
    E --> E4[History]
    E --> E5[AI Assistant]
    E --> E6[Notifications]
    E --> E7[Profile]
    E --> E8[Settings]

    subgraph "Sidebar Component"
        F[User Login] --> G{Get user.role}
        G -->|admin| C
        G -->|operator| D
        G -->|carrier| E
        C & D & E --> H[Map to Icons]
        H --> I[Render Menu Items]
    end

    style C fill:#ef4444
    style D fill:#f59e0b
    style E fill:#10b981
```

### 7. API Service Architecture

```mermaid
graph TB
    subgraph "Frontend Services"
        A[API Client] --> B[Configuration]
        B --> B1[baseURL]
        B --> B2[timeout: 30s]
        B --> B3[headers]

        A --> C[Interceptors]
        C --> C1[Request: Add Token]
        C --> C2[Response: Handle 401]
        C --> C3[Error: Format Messages]
    end

    subgraph "Service Modules"
        A --> D[authService]
        A --> E[bookingService]
        A --> F[gateService]
        A --> G[adminService]
        A --> H[reportService]
        A --> I[aiService]
    end

    subgraph "Auth Service"
        D --> D1[login Demo Check]
        D1 -->|Demo| D2[Local Auth]
        D1 -->|Real| D3[POST /api/login]
        D --> D4[register]
        D --> D5[logout]
        D --> D6[getCurrentUser]
    end

    subgraph "Booking Service"
        E --> E1[createBooking]
        E --> E2[getBookingById]
        E --> E3[updateBookingStatus]
        E --> E4[rescheduleBooking]
        E --> E5[deleteBooking]
    end

    subgraph "Gate Service"
        F --> F1[getQRCode]
        F --> F2[scanQRCode]
        F --> F3[completeShipment]
    end

    subgraph "Admin Service"
        G --> G1[getSchedule]
        G --> G2[updateCapacityConfig]
    end

    subgraph "Backend API"
        D3 --> J[Laravel API]
        E1 & E2 & E3 & E4 & E5 --> J
        F1 & F2 & F3 --> J
        G1 & G2 --> J
        J --> K[(MySQL Database)]
    end

    style A fill:#3b82f6
    style J fill:#ef4444
    style D2 fill:#10b981
```

### 8. Booking Status Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Pending : Carrier creates booking

    Pending --> Confirmed : Admin approves
    Pending --> Rejected : Admin rejects

    Confirmed --> InProgress : Operator scans QR
    InProgress --> Completed : Shipment done

    Rejected --> [*] : End
    Completed --> [*] : End

    note right of Pending
        Visible in:
        - Booking Requests (Admin)
        - My Bookings (Carrier)
    end note

    note right of Confirmed
        QR Code generated
        Ready for gate entry
    end note

    note right of InProgress
        Truck inside port
        Active shipment
    end note

    note right of Completed
        Archived in:
        - Booking History
    end note
```

### 9. Dashboard KPI System (Admin)

```mermaid
graph TB
    subgraph "Admin Dashboard"
        A[Dashboard Component] --> B[KPI Cards]
        A --> C[Charts Section]
        A --> D[Weekly Slots Table]
        A --> E[Status & Alerts]
    end

    subgraph "KPI Cards - 3 Metrics"
        B --> B1[Total Bookings Today]
        B --> B2[Available Slots]
        B --> B3[Port Saturation]

        B1 --> B1A[Value: 248]
        B1 --> B1B[Trend: +12%]
        B1 --> B1C[Icon: Package]

        B2 --> B2A[Value: 156]
        B2 --> B2B[Trend: -8%]
        B2 --> B2C[Icon: Clock]

        B3 --> B3A[Value: 73%]
        B3 --> B3B[Trend: +5%]
        B3 --> B3C[Icon: Activity]
    end

    subgraph "Charts - Recharts"
        C --> C1[Hourly Slot Usage]
        C --> C2[Terminal Capacity]

        C1 --> C1A[Line Chart]
        C1A --> C1B[8h-17h timeline]

        C2 --> C2A[Bar Chart]
        C2A --> C2B[Terminal A-D]
    end

    subgraph "Status Distribution"
        E --> E1[Pie Chart]
        E1 --> E1A[In: 156]
        E1 --> E1B[Out: 98]
        E1 --> E1C[Pending: 42]
    end

    subgraph "Weekly Slots"
        D --> D1[Mon-Sun Columns]
        D --> D2[8 Time Slots Rows]
        D --> D3[Color Coding]
        D3 --> D3A[Green: <50%]
        D3 --> D3B[Yellow: 50-69%]
        D3 --> D3C[Orange: 70-89%]
        D3 --> D3D[Red: ≥90%]
    end

    style B fill:#3b82f6
    style C fill:#10b981
    style E fill:#f59e0b
```

---

<div align="center">

**APCS - Algerian Port Community System**

Digital Control of Physical Flow

Made with React + Vite + TailwindCSS

</div>
