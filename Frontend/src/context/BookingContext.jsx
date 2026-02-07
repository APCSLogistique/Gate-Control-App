import { createContext, useContext, useState, useEffect } from 'react';
import { bookingService } from '../services/booking.service';

const BookingContext = createContext(null);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([
    {
      id: 'B-2026-001',
      date: '2026-02-08',
      timeSlot: '09:00 - 10:00',
      truck: 'TRK-123',
      driver: 'Ahmed Benali',
      phone: '+213 555 123 456',
      company: 'Transport Co.',
      containerType: '20ft',
      status: 'pending',
      createdAt: '2026-02-07T10:30:00Z'
    },
    {
      id: 'B-2026-002',
      date: '2026-02-08',
      timeSlot: '10:00 - 11:00',
      truck: 'TRK-456',
      driver: 'Mohamed Khelifi',
      phone: '+213 555 234 567',
      company: 'Fast Logistics',
      containerType: '40ft',
      status: 'pending',
      createdAt: '2026-02-07T11:15:00Z'
    },
    {
      id: 'B-2026-003',
      date: '2026-02-08',
      timeSlot: '14:00 - 15:00',
      truck: 'TRK-789',
      driver: 'Karim Messaoud',
      phone: '+213 555 345 678',
      company: 'Express Freight',
      containerType: '20ft',
      status: 'confirmed',
      createdAt: '2026-02-07T09:00:00Z'
    },
    {
      id: 'B-2026-004',
      date: '2026-02-08',
      timeSlot: '11:00 - 12:00',
      truck: 'TRK-321',
      driver: 'Youcef Hamdi',
      phone: '+213 555 456 789',
      company: 'Sahara Transport',
      containerType: '40ft',
      status: 'pending',
      createdAt: '2026-02-07T08:45:00Z'
    },
    {
      id: 'B-2026-005',
      date: '2026-02-09',
      timeSlot: '08:00 - 09:00',
      truck: 'TRK-654',
      driver: 'Rachid Bouaziz',
      phone: '+213 555 567 890',
      company: 'Atlas Logistics',
      containerType: '20ft',
      status: 'pending',
      createdAt: '2026-02-07T12:00:00Z'
    },
    {
      id: 'B-2026-006',
      date: '2026-02-09',
      timeSlot: '09:00 - 10:00',
      truck: 'TRK-987',
      driver: 'Omar Belkacem',
      phone: '+213 555 678 901',
      company: 'Mediterranean Cargo',
      containerType: '40ft',
      status: 'confirmed',
      createdAt: '2026-02-07T07:30:00Z'
    },
    {
      id: 'B-2026-007',
      date: '2026-02-09',
      timeSlot: '13:00 - 14:00',
      truck: 'TRK-147',
      driver: 'Samir Hadj',
      phone: '+213 555 789 012',
      company: 'North Africa Shipping',
      containerType: '20ft',
      status: 'rejected',
      createdAt: '2026-02-07T06:15:00Z'
    },
    {
      id: 'B-2026-008',
      date: '2026-02-10',
      timeSlot: '10:00 - 11:00',
      truck: 'TRK-258',
      driver: 'Farid Amrani',
      phone: '+213 555 890 123',
      company: 'Port Express',
      containerType: '40ft',
      status: 'pending',
      createdAt: '2026-02-07T14:20:00Z'
    },
    {
      id: 'B-2026-009',
      date: '2026-02-10',
      timeSlot: '15:00 - 16:00',
      truck: 'TRK-369',
      driver: 'Nabil Cherif',
      phone: '+213 555 901 234',
      company: 'Global Transit',
      containerType: '20ft',
      status: 'pending',
      createdAt: '2026-02-07T15:45:00Z'
    },
    {
      id: 'B-2026-010',
      date: '2026-02-10',
      timeSlot: '16:00 - 17:00',
      truck: 'TRK-741',
      driver: 'Hichem Djelloul',
      phone: '+213 555 012 345',
      company: 'Coastal Freight',
      containerType: '40ft',
      status: 'confirmed',
      createdAt: '2026-02-07T13:10:00Z'
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update booking status
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      setLoading(true);
      setError(null);

      // Update locally immediately for better UX
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: newStatus, updatedAt: new Date().toISOString() }
            : booking
        )
      );

      // Then update via API (in real implementation)
      // await bookingService.updateBookingStatus(bookingId, newStatus);

      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to update booking status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get bookings by status
  const getBookingsByStatus = (status) => {
    return bookings.filter(booking => booking.status === status);
  };

  // Get booking by ID
  const getBookingById = (bookingId) => {
    return bookings.find(booking => booking.id === bookingId);
  };

  // Add new booking
  const addBooking = (newBooking) => {
    setBookings(prevBookings => [...prevBookings, newBooking]);
  };

  // Delete booking
  const deleteBooking = (bookingId) => {
    setBookings(prevBookings =>
      prevBookings.filter(booking => booking.id !== bookingId)
    );
  };

  const value = {
    bookings,
    loading,
    error,
    updateBookingStatus,
    getBookingsByStatus,
    getBookingById,
    addBooking,
    deleteBooking,
    pendingCount: bookings.filter(b => b.status === 'pending').length,
    confirmedCount: bookings.filter(b => b.status === 'confirmed').length,
    completedCount: bookings.filter(b => b.status === 'completed').length,
    rejectedCount: bookings.filter(b => b.status === 'rejected').length,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
