import { useState } from 'react';
import { Search, Filter, Download, Eye, Edit, Trash2, QrCode, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBookings, setSelectedBookings] = useState([]);

  // Sample booking data
  const bookings = [
    {
      id: 'B-2024-001',
      carrier: 'LogiTrans DZ',
      terminal: 'Terminal A',
      date: '2024-02-06',
      timeSlot: '09:00 - 10:00',
      status: 'Confirmed',
      truck: 'TRK-123',
      driver: 'Ahmed Benali',
    },
    {
      id: 'B-2024-002',
      carrier: 'Med Shipping',
      terminal: 'Terminal B',
      date: '2024-02-06',
      timeSlot: '10:00 - 11:00',
      status: 'Pending',
      truck: 'TRK-456',
      driver: 'Karim Mohand',
    },
    {
      id: 'B-2024-003',
      carrier: 'Trans Algerie',
      terminal: 'Terminal A',
      date: '2024-02-06',
      timeSlot: '11:00 - 12:00',
      status: 'Consumed',
      truck: 'TRK-789',
      driver: 'Yacine Saidi',
    },
    {
      id: 'B-2024-004',
      carrier: 'Express Cargo',
      terminal: 'Terminal C',
      date: '2024-02-06',
      timeSlot: '14:00 - 15:00',
      status: 'Rejected',
      truck: 'TRK-321',
      driver: 'Malik Djelloul',
    },
    {
      id: 'B-2024-005',
      carrier: 'Port Services',
      terminal: 'Terminal D',
      date: '2024-02-07',
      timeSlot: '08:00 - 09:00',
      status: 'Confirmed',
      truck: 'TRK-654',
      driver: 'Said Bouzid',
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      Confirmed: 'bg-green-100 text-status-success',
      Pending: 'bg-orange-100 text-status-warning',
      Consumed: 'bg-blue-100 text-status-info',
      Rejected: 'bg-red-100 text-status-error',
    };
    return statusConfig[status] || 'bg-gray-100 text-gray-600';
  };

  const getStatusIcon = (status) => {
    const icons = {
      Confirmed: CheckCircle,
      Pending: Clock,
      Consumed: CheckCircle,
      Rejected: XCircle,
    };
    const Icon = icons[status] || Clock;
    return <Icon size={16} />;
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.truck.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-deep-ocean">Bookings Management</h1>
          <p className="text-gray-500 mt-1">Manage and track all booking requests</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by ID, carrier, or truck..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apcs-blue focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apcs-blue focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Consumed">Consumed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {selectedBookings.length} selected
          </span>
          {selectedBookings.length > 0 && (
            <>
              <button className="btn-secondary text-sm py-1">
                Validate Selected
              </button>
              <button className="btn-secondary text-sm py-1">
                Reject Selected
              </button>
            </>
          )}
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Bookings Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="table-header">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="table-header">Booking ID</th>
                <th className="table-header">Carrier</th>
                <th className="table-header">Date</th>
                <th className="table-header">Time Slot</th>
                <th className="table-header">Truck</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedBookings.includes(booking.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBookings([...selectedBookings, booking.id]);
                        } else {
                          setSelectedBookings(
                            selectedBookings.filter((id) => id !== booking.id)
                          );
                        }
                      }}
                    />
                  </td>
                  <td className="table-cell">
                    <span className="font-mono font-semibold text-apcs-blue">
                      {booking.id}
                    </span>
                  </td>
                  <td className="table-cell">{booking.carrier}</td>
                  <td className="table-cell">{booking.date}</td>
                  <td className="table-cell">
                    <span className="text-sm">{booking.timeSlot}</span>
                  </td>
                  <td className="table-cell">
                    <div>
                      <p className="font-medium">{booking.truck}</p>
                      <p className="text-xs text-gray-500">{booking.driver}</p>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`status-badge ${getStatusBadge(booking.status)} flex items-center gap-1 w-fit`}>
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button
                        title="View Details"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye size={16} className="text-gray-600" />
                      </button>
                      <button
                        title="QR Code"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <QrCode size={16} className="text-gray-600" />
                      </button>
                      <button
                        title="Edit"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit size={16} className="text-gray-600" />
                      </button>
                      <button
                        title="Delete"
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} className="text-status-error" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-apcs-blue text-white rounded-lg">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Bookings;
