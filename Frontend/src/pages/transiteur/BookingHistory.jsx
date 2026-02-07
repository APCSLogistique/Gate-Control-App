import { useState } from 'react';
import { History, Calendar, Download, Eye, Search, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';

const BookingHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all'); // all, week, month, year

  // Sample historical bookings
  const historicalBookings = [
    { id: 'B-2024-120', date: '2026-02-05', timeSlot: '10:00 - 11:00', truck: 'TRK-123', status: 'completed', duration: '45 min' },
    { id: 'B-2024-115', date: '2026-02-04', timeSlot: '14:00 - 15:00', truck: 'TRK-456', status: 'completed', duration: '52 min' },
    { id: 'B-2024-110', date: '2026-02-03', timeSlot: '09:00 - 10:00', truck: 'TRK-789', status: 'completed', duration: '38 min' },
    { id: 'B-2024-105', date: '2026-02-02', timeSlot: '11:00 - 12:00', truck: 'TRK-321', status: 'cancelled', duration: '-' },
    { id: 'B-2024-100', date: '2026-02-01', timeSlot: '15:00 - 16:00', truck: 'TRK-654', status: 'completed', duration: '41 min' },
    { id: 'B-2024-095', date: '2026-01-31', timeSlot: '08:00 - 09:00', truck: 'TRK-987', status: 'completed', duration: '48 min' },
    { id: 'B-2024-090', date: '2026-01-30', timeSlot: '13:00 - 14:00', truck: 'TRK-147', status: 'completed', duration: '35 min' },
    { id: 'B-2024-085', date: '2026-01-29', timeSlot: '10:00 - 11:00', truck: 'TRK-258', status: 'completed', duration: '50 min' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-status-success',
      cancelled: 'bg-red-100 text-status-error',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: CheckCircle,
      cancelled: XCircle,
    };
    return icons[status] || Clock;
  };

  const filteredBookings = historicalBookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.truck.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Summary stats
  const stats = {
    total: historicalBookings.length,
    completed: historicalBookings.filter(b => b.status === 'completed').length,
    cancelled: historicalBookings.filter(b => b.status === 'cancelled').length,
    avgDuration: '43 min',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-deep-ocean flex items-center gap-3">
            <History size={32} />
            Booking History
          </h1>
          <p className="text-gray-500 mt-1">View all your past bookings and statistics</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download size={18} />
          Export
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Calendar className="text-apcs-blue" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold text-deep-ocean">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-2 rounded-lg">
              <CheckCircle className="text-status-success" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-status-success">{stats.completed}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 p-2 rounded-lg">
              <XCircle className="text-status-error" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Cancelled</p>
              <p className="text-2xl font-bold text-status-error">{stats.cancelled}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-50 p-2 rounded-lg">
              <Clock className="text-digital-cyan" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Avg Duration</p>
              <p className="text-2xl font-bold text-digital-cyan">{stats.avgDuration}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID or truck..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apcs-blue"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apcs-blue"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apcs-blue"
            >
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="table-header">Booking ID</th>
                <th className="table-header">Date</th>
                <th className="table-header">Time Slot</th>
                <th className="table-header">Truck</th>
                <th className="table-header">Duration</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const StatusIcon = getStatusIcon(booking.status);
                return (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <span className="font-mono font-semibold text-apcs-blue">{booking.id}</span>
                    </td>
                    <td className="table-cell">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        {booking.date}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="flex items-center gap-1 text-sm">
                        <Clock size={14} className="text-gray-400" />
                        {booking.timeSlot}
                      </span>
                    </td>
                    <td className="table-cell font-medium">{booking.truck}</td>
                    <td className="table-cell">
                      {booking.duration !== '-' ? (
                        <span className="text-digital-cyan font-medium">{booking.duration}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="table-cell">
                      <span className={`status-badge ${getStatusColor(booking.status)} flex items-center gap-1 w-fit`}>
                        <StatusIcon size={14} />
                        {booking.status === 'completed' ? 'Completed' : 'Cancelled'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} className="text-gray-600" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing {filteredBookings.length} of {historicalBookings.length} bookings
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 bg-apcs-blue text-white rounded-lg">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BookingHistory;
