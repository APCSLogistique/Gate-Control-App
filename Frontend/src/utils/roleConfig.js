// Role-based menu configuration
export const menuConfig = {
  // ADMIN - Full system access (inherits ALL from operator + transiteur - except create booking)
  admin: [
    { icon: 'LayoutDashboard', label: 'Dashboard', path: '/dashboard' },
    { icon: 'Clock', label: 'Capacity Management', path: '/slots' },
    { icon: 'ClipboardList', label: 'Booking Requests', path: '/admin/booking-requests' },
    { icon: 'History', label: 'Booking History', path: '/bookings/history' },
    { icon: 'Scan', label: 'QR Scanner', path: '/operator/scan' },
    { icon: 'BarChart3', label: 'Reports', path: '/reports' },
    { icon: 'Users', label: 'Users', path: '/users' },
    { icon: 'FileText', label: 'Logs', path: '/logs' },
    { icon: 'MessageSquare', label: 'AI Assistant', path: '/ai-assistant' },
    { icon: 'Bell', label: 'Notifications', path: '/notifications' },
    { icon: 'User', label: 'Profile', path: '/profile' },
    { icon: 'Settings', label: 'Settings', path: '/settings' },
  ],

  // OPERATOR - Gate operations & booking validation
  operator: [
    { icon: 'LayoutDashboard', label: 'Dashboard', path: '/dashboard' },
    { icon: 'Calendar', label: 'Bookings', path: '/operator/bookings' },
    { icon: 'Scan', label: 'QR Scanner', path: '/operator/scan' },
    { icon: 'MessageSquare', label: 'AI Assistant', path: '/ai-assistant' },
    { icon: 'Bell', label: 'Notifications', path: '/notifications' },
    { icon: 'User', label: 'Profile', path: '/profile' },
    { icon: 'Settings', label: 'Settings', path: '/settings' },
  ],

  // CARRIER (Transiteur) - Booking & fleet management
  carrier: [
    { icon: 'LayoutDashboard', label: 'Dashboard', path: '/dashboard' },
    { icon: 'Package', label: 'New Booking', path: '/create-booking' },
    { icon: 'Calendar', label: 'My Bookings', path: '/bookings' },
    { icon: 'History', label: 'History', path: '/bookings/history' },
    { icon: 'MessageSquare', label: 'AI Assistant', path: '/ai-assistant' },
    { icon: 'Bell', label: 'Notifications', path: '/notifications' },
    { icon: 'User', label: 'Profile', path: '/profile' },
    { icon: 'Settings', label: 'Settings', path: '/settings' },
  ],
};

// Check if user has access to a specific route
export const hasAccess = (userRole, path) => {
  const menu = menuConfig[userRole];
  if (!menu) return false;
  return menu.some((item) => item.path === path);
};

// Get default route for a role
export const getDefaultRoute = (userRole) => {
  const routes = {
    admin: '/dashboard',
    operator: '/dashboard',
    carrier: '/dashboard',
  };
  return routes[userRole] || '/login';
};

// Get role-specific dashboard component
export const getRoleDashboard = (userRole) => {
  const dashboards = {
    admin: 'admin-dashboard',
    operator: 'operator-dashboard',
    carrier: 'transiteur-dashboard',
  };
  return dashboards[userRole] || 'default-dashboard';
};
