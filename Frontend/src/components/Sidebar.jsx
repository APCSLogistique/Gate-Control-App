import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Truck,
  MessageSquare,
  Activity,
  FileText,
  Bell,
  Users,
  Settings,
  Package,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Scan,
  History,
  BarChart3,
  ClipboardList,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { menuConfig } from '../utils/roleConfig';

// Icon mapping
const iconMap = {
  LayoutDashboard,
  Calendar,
  Clock,
  RefreshCw,
  Truck,
  MessageSquare,
  Activity,
  FileText,
  Bell,
  Users,
  Settings,
  Package,
  Scan,
  History,
  BarChart3,
  ClipboardList,
  User
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Get menu items based on user role
  const menuItems = user ? menuConfig[user.role] || [] : [];

  // Role badge colors
  const roleBadgeColor = {
    admin: 'bg-red-500',
    operator: 'bg-yellow-500',
    carrier: 'bg-green-500',
  };

  return (
    <div
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-deep-ocean h-screen fixed left-0 top-0 transition-all duration-300 z-50 flex flex-col`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-apcs-blue flex items-center justify-between">
        {!collapsed && (
          <div>
            <h1 className="text-white text-2xl font-bold">APCS</h1>
            <p className="text-digital-cyan text-xs">Port Community System</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:text-digital-cyan transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* User Role Badge */}
      {user && !collapsed && (
        <div className="px-4 py-3 border-b border-apcs-blue">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${roleBadgeColor[user.role]}`}></div>
            <div>
              <p className="text-white text-sm font-medium">{user.name}</p>
              <p className="text-gray-400 text-xs capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {menuItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
              title={collapsed ? item.label : ''}
            >
              {Icon && <Icon size={20} />}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-apcs-blue">
          <p className="text-gray-400 text-xs text-center">
            © 2026 APCS Algeria
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
