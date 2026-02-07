import { useState } from 'react';
import {
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Truck,
  Calendar,
  Filter,
  RefreshCw,
  Eye
} from 'lucide-react';

const OperatorDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('all');

  // KPI Stats
  const stats = [
    {
      label: "Today's Bookings",
      value: '48',
      icon: Calendar,
      color: 'text-apcs-blue',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'In Port',
      value: '12',
      icon: Truck,
      color: 'text-status-success',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Pending',
      value: '8',
      icon: Clock,
      color: 'text-status-warning',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Completed',
      value: '28',
      icon: CheckCircle,
      color: 'text-digital-cyan',
      bgColor: 'bg-cyan-50',
    },
  ];

  // Today's bookings by time slot
  const timeSlots = [
    { time: '08:00 - 09:00', bookings: [
      { id: 'B-001', carrier: 'LogiTrans', truck: 'TRK-123', status: 'completed' },
      { id: 'B-002', carrier: 'Med Shipping', truck: 'TRK-456', status: 'completed' },
    ]},
    { time: '09:00 - 10:00', bookings: [
      { id: 'B-003', carrier: 'Trans Algerie', truck: 'TRK-789', status: 'in' },
      { id: 'B-004', carrier: 'Express Cargo', truck: 'TRK-321', status: 'in' },
      { id: 'B-005', carrier: 'Port Services', truck: 'TRK-654', status: 'pending' },
    ]},
    { time: '10:00 - 11:00', bookings: [
      { id: 'B-006', carrier: 'FastLogistics', truck: 'TRK-987', status: 'pending' },
      { id: 'B-007', carrier: 'SafeTransit', truck: 'TRK-147', status: 'pending' },
    ]},
    { time: '11:00 - 12:00', bookings: [
      { id: 'B-008', carrier: 'GlobalFreight', truck: 'TRK-258', status: 'pending' },
    ]},
  ];

  // Recent notifications
  const recentNotifications = [
    { id: 1, message: 'Truck TRK-789 entered Terminal A', time: '5 min ago', type: 'success' },
    { id: 2, message: 'Booking B-010 approaching time slot', time: '10 min ago', type: 'warning' },
    { id: 3, message: 'Terminal B capacity at 90%', time: '15 min ago', type: 'warning' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-orange-100 text-status-warning',
      in: 'bg-green-100 text-status-success',
      completed: 'bg-blue-100 text-status-info',
      out: 'bg-gray-100 text-gray-600',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      in: Truck,
      completed: CheckCircle,
      out: XCircle,
    };
    return icons[status] || Clock;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-deep-ocean">Operator Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time booking status and operations</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apcs-blue"
          />
          <button className="btn-secondary flex items-center gap-2">
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-deep-ocean">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time Slot Bookings */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-deep-ocean flex items-center gap-2">
              <Calendar size={20} />
              Bookings by Time Slot
            </h3>
            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-apcs-blue"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in">In Port</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {timeSlots.map((slot, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-light-blue px-4 py-2 flex items-center justify-between">
                  <span className="font-semibold text-deep-ocean flex items-center gap-2">
                    <Clock size={16} />
                    {slot.time}
                  </span>
                  <span className="text-sm text-gray-600">{slot.bookings.length} bookings</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {slot.bookings
                    .filter((b) => filterStatus === 'all' || b.status === filterStatus)
                    .map((booking) => {
                      const StatusIcon = getStatusIcon(booking.status);
                      return (
                        <div
                          key={booking.id}
                          className="px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-4">
                            <span className="font-mono font-semibold text-apcs-blue">
                              {booking.id}
                            </span>
                            <span className="text-gray-700">{booking.carrier}</span>
                            <span className="text-sm text-gray-500">{booking.truck}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`status-badge ${getStatusColor(booking.status)} flex items-center gap-1`}
                            >
                              <StatusIcon size={14} />
                              {booking.status}
                            </span>
                            <button
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye size={16} className="text-gray-600" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications Panel */}
        <div className="card">
          <h3 className="text-lg font-semibold text-deep-ocean mb-4 flex items-center gap-2">
            <AlertTriangle size={20} />
            Recent Alerts
          </h3>
          <div className="space-y-3">
            {recentNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-lg border-l-4 ${
                  notif.type === 'success'
                    ? 'border-l-status-success bg-green-50'
                    : notif.type === 'warning'
                    ? 'border-l-status-warning bg-orange-50'
                    : 'border-l-status-error bg-red-50'
                }`}
              >
                <p className="text-sm text-gray-800">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-center text-sm text-apcs-blue hover:underline">
            View all notifications
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-deep-ocean mb-4 flex items-center gap-2">
          <Activity size={20} />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-light-blue hover:bg-blue-100 rounded-lg text-center transition-colors">
            <Truck className="mx-auto text-apcs-blue mb-2" size={24} />
            <span className="text-sm font-medium text-deep-ocean">Scan QR Code</span>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
            <CheckCircle className="mx-auto text-status-success mb-2" size={24} />
            <span className="text-sm font-medium text-deep-ocean">Mark Entry</span>
          </button>
          <button className="p-4 bg-cyan-50 hover:bg-cyan-100 rounded-lg text-center transition-colors">
            <XCircle className="mx-auto text-digital-cyan mb-2" size={24} />
            <span className="text-sm font-medium text-deep-ocean">Mark Exit</span>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
            <Filter className="mx-auto text-status-warning mb-2" size={24} />
            <span className="text-sm font-medium text-deep-ocean">Filter View</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default OperatorDashboard;
