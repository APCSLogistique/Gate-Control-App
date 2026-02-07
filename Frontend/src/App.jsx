import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { BookingProvider } from './context/BookingContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardRouter from './pages/DashboardRouter';
import Bookings from './pages/Bookings';
import SlotManagement from './pages/SlotManagement';
import CreateBooking from './pages/CreateBooking';
import ReschedulePage from './pages/ReschedulePage';
import FleetManagement from './pages/FleetManagement';
import AIAssistant from './pages/AIAssistant';
import Operations from './pages/Operations';
import Logs from './pages/Logs';
import Notifications from './pages/Notifications';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
// Operator Pages
import OperatorDashboard from './pages/operator/OperatorDashboard';
import OperatorBookingsView from './pages/operator/OperatorBookingsView';
import QRScanner from './pages/operator/QRScanner';
// Transiteur Pages
import TransiteurDashboard from './pages/transiteur/TransiteurDashboard';
import BookingHistory from './pages/transiteur/BookingHistory';
// Admin Pages
import Reports from './pages/admin/Reports';
import CapacityManagementNew from './pages/admin/CapacityManagementNew';
import BookingRequests from './pages/admin/BookingRequests';

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <BookingProvider>
          <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

          {/* Protected Routes with Main Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute path="/dashboard">
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />
            <Route
              path="bookings"
              element={
                <ProtectedRoute path="/bookings">
                  <Bookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="slots"
              element={
                <ProtectedRoute path="/slots">
                  <CapacityManagementNew />
                </ProtectedRoute>
              }
            />
            <Route
              path="create-booking"
              element={
                <ProtectedRoute path="/create-booking">
                  <CreateBooking />
                </ProtectedRoute>
              }
            />
            <Route
              path="reschedule"
              element={
                <ProtectedRoute path="/reschedule">
                  <ReschedulePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="fleet"
              element={
                <ProtectedRoute path="/fleet">
                  <FleetManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="ai-assistant"
              element={
                <ProtectedRoute path="/ai-assistant">
                  <AIAssistant />
                </ProtectedRoute>
              }
            />
            <Route
              path="operations"
              element={
                <ProtectedRoute path="/operations">
                  <Operations />
                </ProtectedRoute>
              }
            />
            <Route
              path="logs"
              element={
                <ProtectedRoute path="/logs">
                  <Logs />
                </ProtectedRoute>
              }
            />
            <Route
              path="notifications"
              element={
                <ProtectedRoute path="/notifications">
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute path="/users">
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute path="/settings">
                  <Settings />
                </ProtectedRoute>
              }
            />
            {/* Profile Page (All Roles) */}
            <Route
              path="profile"
              element={
                <ProtectedRoute path="/profile">
                  <Profile />
                </ProtectedRoute>
              }
            />
            {/* Reports Page (Admin) */}
            <Route
              path="reports"
              element={
                <ProtectedRoute path="/reports">
                  <Reports />
                </ProtectedRoute>
              }
            />
            {/* Operator Routes */}
            <Route
              path="operator/bookings"
              element={
                <ProtectedRoute path="/operator/bookings">
                  <OperatorBookingsView />
                </ProtectedRoute>
              }
            />
            <Route
              path="operator/scan"
              element={
                <ProtectedRoute path="/operator/scan">
                  <QRScanner />
                </ProtectedRoute>
              }
            />
            {/* Booking History (Transiteur + Admin) */}
            <Route
              path="bookings/history"
              element={
                <ProtectedRoute path="/bookings/history">
                  <BookingHistory />
                </ProtectedRoute>
              }
            />
            {/* Booking Requests (Admin) */}
            <Route
              path="admin/booking-requests"
              element={
                <ProtectedRoute path="/admin/booking-requests">
                  <BookingRequests />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      </BookingProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;
