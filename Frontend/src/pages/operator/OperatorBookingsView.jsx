import { useState } from 'react';
import {
  Calendar,
  Clock,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Truck,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  QrCode
} from 'lucide-react';

const OperatorBookingsView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('day'); // day, week
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Sample bookings data
  const bookings = [
    { id: 'B-001', carrier: 'LogiTrans DZ', truck: 'TRK-123', driver: 'Ahmed Benali', timeSlot: '08:00 - 09:00', status: 'out', checkIn: '08:15', checkOut: '08:45' },
    { id: 'B-002', carrier: 'Med Shipping', truck: 'TRK-456', driver: 'Karim Mohand', timeSlot: '08:00 - 09:00', status: 'out', checkIn: '08:22', checkOut: '08:50' },
    { id: 'B-003', carrier: 'Trans Algerie', truck: 'TRK-789', driver: 'Yacine Saidi', timeSlot: '09:00 - 10:00', status: 'in', checkIn: '09:05', checkOut: null },
    { id: 'B-004', carrier: 'Express Cargo', truck: 'TRK-321', driver: 'Malik Djelloul', timeSlot: '09:00 - 10:00', status: 'in', checkIn: '09:12', checkOut: null },
    { id: 'B-005', carrier: 'Port Services', truck: 'TRK-654', driver: 'Said Bouzid', timeSlot: '09:00 - 10:00', status: 'pending', checkIn: null, checkOut: null },
    { id: 'B-006', carrier: 'FastLogistics', truck: 'TRK-987', driver: 'Omar Hadj', timeSlot: '10:00 - 11:00', status: 'pending', checkIn: null, checkOut: null },
    { id: 'B-007', carrier: 'SafeTransit', truck: 'TRK-147', driver: 'Riad Meziane', timeSlot: '10:00 - 11:00', status: 'pending', checkIn: null, checkOut: null },
    { id: 'B-008', carrier: 'GlobalFreight', truck: 'TRK-258', driver: 'Amine Touati', timeSlot: '11:00 - 12:00', status: 'pending', checkIn: null, checkOut: null },
  ];

  const timeSlots = [
    '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
    '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
    '16:00 - 17:00', '17:00 - 18:00'
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-orange-100 text-status-warning border-status-warning',
      in: 'bg-green-100 text-status-success border-status-success',
      out: 'bg-blue-100 text-status-info border-status-info',
    };
    return colors[status] || 'bg-gray-100 text-gray-600 border-gray-400';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      in: Truck,
      out: CheckCircle,
    };
    return icons[status] || Clock;
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.truck.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.driver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Summary stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    in: bookings.filter(b => b.status === 'in').length,
    out: bookings.filter(b => b.status === 'out').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-deep-ocean">Bookings by Day</h1>
          <p className="text-gray-500 mt-1">View and manage all bookings with status tracking</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Calendar className="text-apcs-blue" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xl font-bold text-deep-ocean">{stats.total}</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="bg-orange-50 p-2 rounded-lg">
            <Clock className="text-status-warning" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Pending</p>
            <p className="text-xl font-bold text-status-warning">{stats.pending}</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="bg-green-50 p-2 rounded-lg">
            <Truck className="text-status-success" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">In Port</p>
            <p className="text-xl font-bold text-status-success">{stats.in}</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="bg-cyan-50 p-2 rounded-lg">
            <CheckCircle className="text-digital-cyan" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Completed</p>
            <p className="text-xl font-bold text-digital-cyan">{stats.out}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronLeft size={18} />
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apcs-blue"
              />
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ID, carrier, truck, driver..."
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
              <option value="pending">Pending</option>
              <option value="in">In Port</option>
              <option value="out">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="table-header">Booking ID</th>
                <th className="table-header">Time Slot</th>
                <th className="table-header">Carrier</th>
                <th className="table-header">Truck / Driver</th>
                <th className="table-header">Status</th>
                <th className="table-header">Check In</th>
                <th className="table-header">Check Out</th>
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
                      <span className="flex items-center gap-1 text-sm">
                        <Clock size={14} className="text-gray-400" />
                        {booking.timeSlot}
                      </span>
                    </td>
                    <td className="table-cell font-medium">{booking.carrier}</td>
                    <td className="table-cell">
                      <div>
                        <p className="font-medium">{booking.truck}</p>
                        <p className="text-xs text-gray-500">{booking.driver}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`status-badge ${getStatusColor(booking.status)} flex items-center gap-1 w-fit`}>
                        <StatusIcon size={14} />
                        {booking.status === 'in' ? 'In Port' : booking.status === 'out' ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                    <td className="table-cell">
                      {booking.checkIn ? (
                        <span className="text-status-success font-medium">{booking.checkIn}</span>
                      ) : (
                        <span className="text-gray-400">--:--</span>
                      )}
                    </td>
                    <td className="table-cell">
                      {booking.checkOut ? (
                        <span className="text-status-info font-medium">{booking.checkOut}</span>
                      ) : (
                        <span className="text-gray-400">--:--</span>
                      )}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} className="text-gray-600" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Scan QR"
                        >
                          <QrCode size={16} className="text-gray-600" />
                        </button>
                        {booking.status === 'pending' && (
                          <button
                            className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                            title="Mark Entry"
                          >
                            <Truck size={16} className="text-status-success" />
                          </button>
                        )}
                        {booking.status === 'in' && (
                          <button
                            className="p-2 hover:bg-cyan-50 rounded-lg transition-colors"
                            title="Mark Exit"
                          >
                            <XCircle size={16} className="text-digital-cyan" />
                          </button>
                        )}
                      </div>
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
            Showing {filteredBookings.length} of {bookings.length} bookings
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 bg-apcs-blue text-white rounded-lg">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-deep-ocean">Booking Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="font-mono font-semibold text-apcs-blue">{selectedBooking.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`status-badge ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Carrier</p>
                  <p className="font-medium">{selectedBooking.carrier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time Slot</p>
                  <p className="font-medium">{selectedBooking.timeSlot}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Truck</p>
                  <p className="font-medium">{selectedBooking.truck}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Driver</p>
                  <p className="font-medium">{selectedBooking.driver}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check In / Out</p>
                  <p className="font-medium">
                    {selectedBooking.checkIn || '--:--'} / {selectedBooking.checkOut || '--:--'}
                  </p>
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <QrCode size={80} className="mx-auto text-gray-400" />
                <p className="text-sm text-gray-500 mt-2">QR Code</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              {selectedBooking.status === 'pending' && (
                <button className="flex-1 btn-primary flex items-center justify-center gap-2">
                  <Truck size={18} />
                  Mark Entry
                </button>
              )}
              {selectedBooking.status === 'in' && (
                <button className="flex-1 bg-digital-cyan hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                  <XCircle size={18} />
                  Mark Exit
                </button>
              )}
              <button
                onClick={() => setSelectedBooking(null)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OperatorBookingsView;
