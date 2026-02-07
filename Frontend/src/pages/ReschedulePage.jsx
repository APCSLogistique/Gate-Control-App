import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RefreshCw, AlertCircle, Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';

const ReschedulePage = () => {
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  // Sample late/pending reschedule bookings
  const lateBookings = [
    {
      id: 'B-2024-006',
      carrier: 'LogiTrans DZ',
      originalDate: '2024-02-05',
      originalSlot: '14:00 - 15:00',
      terminal: 'Terminal A',
      truck: 'TRK-123',
      status: 'LATE',
      reason: 'Traffic delay',
      requestedDate: '2024-02-06',
      requestedSlot: '09:00 - 10:00',
    },
    {
      id: 'B-2024-007',
      carrier: 'Med Shipping',
      originalDate: '2024-02-05',
      originalSlot: '10:00 - 11:00',
      terminal: 'Terminal B',
      truck: 'TRK-456',
      status: 'RESCHEDULE_PENDING',
      reason: 'Vehicle breakdown',
      requestedDate: '2024-02-07',
      requestedSlot: '11:00 - 12:00',
    },
    {
      id: 'B-2024-008',
      carrier: 'Trans Algerie',
      originalDate: '2024-02-04',
      originalSlot: '15:00 - 16:00',
      terminal: 'Terminal C',
      truck: 'TRK-789',
      status: 'LATE',
      reason: 'Customs delay',
      requestedDate: '2024-02-06',
      requestedSlot: '14:00 - 15:00',
    },
  ];

  const getStatusBadge = (status) => {
    const config = {
      LATE: { bg: 'bg-red-100', text: 'text-status-error', icon: AlertCircle },
      RESCHEDULE_PENDING: { bg: 'bg-orange-100', text: 'text-status-warning', icon: Clock },
      RESCHEDULE_APPROVED: { bg: 'bg-green-100', text: 'text-status-success', icon: CheckCircle },
      RESCHEDULE_REJECTED: { bg: 'bg-gray-100', text: 'text-gray-600', icon: XCircle },
    };
    return config[status] || config.LATE;
  };

  const handleApprove = (bookingId) => {
    console.log('Approve reschedule:', bookingId);
    // API: PUT /api/booking/:id/reschedule with { approved: true }
  };

  const handleReject = (bookingId) => {
    console.log('Reject reschedule:', bookingId);
    // API: PUT /api/booking/:id/reschedule with { approved: false, reason: '...' }
  };

  const handleRequestReschedule = (bookingId) => {
    setSelectedBooking(bookingId);
    setShowRescheduleModal(true);
    // Open modal for carrier to select new date/time
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-deep-ocean flex items-center gap-3">
            <RefreshCw className="text-digital-cyan" size={32} />
            Reschedule & Late Bookings
          </h1>
          <p className="text-gray-500 mt-1">
            {user?.role === 'admin'
              ? 'Manage and approve reschedule requests'
              : 'Request reschedule for late or missed bookings'}
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div className="card border-l-4 border-l-digital-cyan">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-digital-cyan flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-semibold text-deep-ocean mb-2">Reschedule Policy</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Late bookings can be rescheduled within 48 hours</li>
              <li>• Reschedule requests require admin approval</li>
              <li>• Maximum 2 reschedule attempts per booking</li>
              <li>• Emergency late slots may incur additional fees</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-l-4 border-l-status-error">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 p-3 rounded-lg">
              <AlertCircle className="text-status-error" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Late Bookings</p>
              <p className="text-2xl font-bold text-deep-ocean">
                {lateBookings.filter((b) => b.status === 'LATE').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-l-status-warning">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 p-3 rounded-lg">
              <Clock className="text-status-warning" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Approval</p>
              <p className="text-2xl font-bold text-deep-ocean">
                {lateBookings.filter((b) => b.status === 'RESCHEDULE_PENDING').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-l-status-success">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckCircle className="text-status-success" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Approved Today</p>
              <p className="text-2xl font-bold text-deep-ocean">0</p>
            </div>
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
                <th className="table-header">Carrier</th>
                <th className="table-header">Original Schedule</th>
                <th className="table-header">Requested Schedule</th>
                <th className="table-header">Terminal</th>
                <th className="table-header">Status</th>
                <th className="table-header">Reason</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lateBookings.map((booking) => {
                const statusConfig = getStatusBadge(booking.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <span className="font-mono font-semibold text-apcs-blue">
                        {booking.id}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="font-medium">{booking.carrier}</p>
                        <p className="text-xs text-gray-500">{booking.truck}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm">
                        <p className="font-medium text-gray-700">{booking.originalDate}</p>
                        <p className="text-gray-500">{booking.originalSlot}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm">
                        <p className="font-medium text-digital-cyan">
                          {booking.requestedDate || '-'}
                        </p>
                        <p className="text-gray-500">{booking.requestedSlot || '-'}</p>
                      </div>
                    </td>
                    <td className="table-cell">{booking.terminal}</td>
                    <td className="table-cell">
                      <span
                        className={`status-badge ${statusConfig.bg} ${statusConfig.text} flex items-center gap-1 w-fit`}
                      >
                        <StatusIcon size={14} />
                        {booking.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="table-cell">
                      <p className="text-sm text-gray-600">{booking.reason}</p>
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        {user?.role === 'admin' &&
                          booking.status === 'RESCHEDULE_PENDING' && (
                            <>
                              <button
                                onClick={() => handleApprove(booking.id)}
                                className="px-3 py-1 bg-green-100 text-status-success rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(booking.id)}
                                className="px-3 py-1 bg-red-100 text-status-error rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}

                        {user?.role === 'carrier' && booking.status === 'LATE' && (
                          <button
                            onClick={() => handleRequestReschedule(booking.id)}
                            className="px-3 py-1 bg-digital-cyan text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-1"
                          >
                            <RefreshCw size={14} />
                            Request
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

        {lateBookings.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="mx-auto text-green-300" size={48} />
            <p className="text-gray-500 mt-4">No late or pending reschedule bookings</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ReschedulePage;
