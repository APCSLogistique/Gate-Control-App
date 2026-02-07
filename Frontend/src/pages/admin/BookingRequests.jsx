import { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import {
  ClipboardList,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Truck,
  Calendar,
  User,
  Phone,
  Building,
  Package,
  X,
} from 'lucide-react';

const BookingRequests = () => {
  const { bookings, updateBookingStatus, loading, pendingCount } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
      completed: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      rejected: XCircle,
      completed: CheckCircle,
    };
    return icons[status] || Clock;
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.truck.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAccept = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, 'confirmed');
    } catch (error) {
      console.error('Failed to accept booking:', error);
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, 'rejected');
    } catch (error) {
      console.error('Failed to reject booking:', error);
    }
  };

  const openDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setShowModal(false);
  };

  // Stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-deep-ocean flex items-center gap-3">
            <ClipboardList size={32} />
            Booking Requests
          </h1>
          <p className="text-gray-500 mt-1">Review and manage booking requests from carriers</p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-semibold">
            {pendingCount} pending request{pendingCount > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <ClipboardList className="text-apcs-blue" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Requests</p>
              <p className="text-2xl font-bold text-deep-ocean">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-50 p-2 rounded-lg">
              <Clock className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-2 rounded-lg">
              <CheckCircle className="text-status-success" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold text-status-success">{stats.confirmed}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 p-2 rounded-lg">
              <XCircle className="text-status-error" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-status-error">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, truck, driver or company..."
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
              <option value="confirmed">Confirmed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="table-header">Booking ID</th>
                <th className="table-header">Date & Time</th>
                <th className="table-header">Driver</th>
                <th className="table-header">Truck</th>
                <th className="table-header">Company</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => {
                  const StatusIcon = getStatusIcon(booking.status);
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50 border-b border-gray-100">
                      <td className="table-cell">
                        <span className="font-mono font-semibold text-apcs-blue">{booking.id}</span>
                      </td>
                      <td className="table-cell">
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} className="text-gray-400" />
                            {booking.date}
                          </span>
                          <span className="text-sm text-gray-500">{booking.timeSlot}</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex flex-col">
                          <span className="font-medium">{booking.driver}</span>
                          <span className="text-sm text-gray-500">{booking.phone}</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="flex items-center gap-1">
                          <Truck size={14} className="text-gray-400" />
                          {booking.truck}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm">{booking.company}</span>
                      </td>
                      <td className="table-cell">
                        <span className={`status-badge ${getStatusColor(booking.status)} flex items-center gap-1 w-fit px-2 py-1 rounded-full text-xs font-medium border`}>
                          <StatusIcon size={14} />
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openDetails(booking)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} className="text-gray-600" />
                          </button>
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleAccept(booking.id)}
                                disabled={loading}
                                className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                                title="Accept"
                              >
                                <CheckCircle size={16} className="text-green-600" />
                              </button>
                              <button
                                onClick={() => handleReject(booking.id)}
                                disabled={loading}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle size={16} className="text-red-600" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No booking requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold text-deep-ocean">Booking Details</h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg font-bold text-apcs-blue">{selectedBooking.id}</span>
                <span className={`status-badge ${getStatusColor(selectedBooking.status)} px-3 py-1 rounded-full text-sm font-medium border`}>
                  {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Calendar size={18} className="text-apcs-blue" />
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium">{selectedBooking.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Clock size={18} className="text-apcs-blue" />
                  <div>
                    <p className="text-xs text-gray-500">Time Slot</p>
                    <p className="font-medium">{selectedBooking.timeSlot}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User size={18} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Driver</p>
                    <p className="font-medium">{selectedBooking.driver}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone size={18} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium">{selectedBooking.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Building size={18} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Company</p>
                    <p className="font-medium">{selectedBooking.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Truck size={18} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Truck</p>
                    <p className="font-medium">{selectedBooking.truck}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Package size={18} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Container Type</p>
                    <p className="font-medium">{selectedBooking.containerType}</p>
                  </div>
                </div>
              </div>
            </div>

            {selectedBooking.status === 'pending' && (
              <div className="flex gap-3 p-4 border-t bg-gray-50">
                <button
                  onClick={() => {
                    handleReject(selectedBooking.id);
                    closeModal();
                  }}
                  className="flex-1 py-2 px-4 border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle size={18} />
                  Reject
                </button>
                <button
                  onClick={() => {
                    handleAccept(selectedBooking.id);
                    closeModal();
                  }}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} />
                  Accept
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingRequests;
