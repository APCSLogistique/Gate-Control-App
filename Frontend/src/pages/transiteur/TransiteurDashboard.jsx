import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  QrCode,
  Eye
} from 'lucide-react';

const TransiteurDashboard = () => {
  // Stats
  const stats = [
    {
      label: 'Total Bookings',
      value: '24',
      change: '+3 this week',
      icon: Calendar,
      color: 'text-apcs-blue',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Active',
      value: '3',
      change: 'In progress',
      icon: Clock,
      color: 'text-status-warning',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Completed',
      value: '21',
      change: 'This month',
      icon: CheckCircle,
      color: 'text-status-success',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Success Rate',
      value: '96%',
      change: '+2% vs last month',
      icon: TrendingUp,
      color: 'text-digital-cyan',
      bgColor: 'bg-cyan-50',
    },
  ];

  // Upcoming bookings
  const upcomingBookings = [
    {
      id: 'B-2024-125',
      date: '2026-02-07',
      timeSlot: '09:00 - 10:00',
      truck: 'TRK-456',
      status: 'confirmed',
    },
    {
      id: 'B-2024-126',
      date: '2026-02-07',
      timeSlot: '14:00 - 15:00',
      truck: 'TRK-789',
      status: 'confirmed',
    },
    {
      id: 'B-2024-127',
      date: '2026-02-08',
      timeSlot: '10:00 - 11:00',
      truck: 'TRK-123',
      status: 'confirmed',
    },
  ];

  // Available slots preview
  const availableSlots = {
    today: 12,
    tomorrow: 18,
    thisWeek: 45,
  };

  // Recent activity
  const recentActivity = [
    { id: 1, action: 'Booking B-2024-124 completed', time: '2 hours ago', type: 'success' },
    { id: 2, action: 'Booking B-2024-125 confirmed', time: '5 hours ago', type: 'info' },
    { id: 3, action: 'Slot modified for B-2024-126', time: '1 day ago', type: 'warning' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-deep-ocean">
            Welcome Back! 👋
          </h1>
          <p className="text-gray-500 mt-1">Manage your bookings and schedule efficiently</p>
        </div>
        <Link to="/create-booking">
          <button className="btn-primary flex items-center gap-2 shadow-lg">
            <Package size={20} />
            New Booking
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-deep-ocean mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.change}</p>
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
        {/* Upcoming Bookings */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-deep-ocean flex items-center gap-2">
              <Calendar size={20} />
              Upcoming Bookings
            </h3>
            <Link to="/bookings">
              <button className="text-sm text-apcs-blue hover:underline flex items-center gap-1">
                View All
                <ArrowRight size={14} />
              </button>
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-apcs-blue hover:bg-light-blue transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono font-semibold text-apcs-blue">
                        {booking.id}
                      </span>
                      <span className="status-badge bg-green-100 text-status-success">
                        <CheckCircle size={12} />
                        {booking.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={14} />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={14} />
                        <span>{booking.timeSlot}</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">{booking.truck}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View QR Code"
                    >
                      <QrCode size={18} className="text-gray-600" />
                    </button>
                    <Link to={`/bookings/${booking.id}`}>
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} className="text-gray-600" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Slots & Quick Actions */}
        <div className="space-y-6">
          {/* Available Slots Preview */}
          <div className="card bg-gradient-to-br from-apcs-blue to-digital-cyan text-white">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock size={20} />
              Available Slots
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Today</span>
                <span className="text-2xl font-bold">{availableSlots.today}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tomorrow</span>
                <span className="text-2xl font-bold">{availableSlots.tomorrow}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>This Week</span>
                <span className="text-2xl font-bold">{availableSlots.thisWeek}</span>
              </div>
            </div>
            <Link to="/create-booking">
              <button className="w-full mt-4 bg-white text-apcs-blue font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <Package size={18} />
                Book Now
              </button>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold text-deep-ocean mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    activity.type === 'success'
                      ? 'border-l-status-success bg-green-50'
                      : activity.type === 'warning'
                      ? 'border-l-status-warning bg-orange-50'
                      : 'border-l-status-info bg-blue-50'
                  }`}
                >
                  <p className="text-sm text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-deep-ocean mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/create-booking">
            <button className="w-full p-4 bg-light-blue hover:bg-blue-100 rounded-lg text-center transition-colors">
              <Package className="mx-auto text-apcs-blue mb-2" size={24} />
              <span className="text-sm font-medium text-deep-ocean">New Booking</span>
            </button>
          </Link>
          <Link to="/bookings">
            <button className="w-full p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
              <Calendar className="mx-auto text-status-success mb-2" size={24} />
              <span className="text-sm font-medium text-deep-ocean">View Bookings</span>
            </button>
          </Link>
          <Link to="/bookings/history">
            <button className="w-full p-4 bg-cyan-50 hover:bg-cyan-100 rounded-lg text-center transition-colors">
              <Clock className="mx-auto text-digital-cyan mb-2" size={24} />
              <span className="text-sm font-medium text-deep-ocean">History</span>
            </button>
          </Link>
          <Link to="/ai-assistant">
            <button className="w-full p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
              <Sparkles className="mx-auto text-purple-600 mb-2" size={24} />
              <span className="text-sm font-medium text-deep-ocean">AI Assistant</span>
            </button>
          </Link>
        </div>
      </div>

      {/* AI Suggestion Box */}
      <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
        <div className="flex items-start gap-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Sparkles className="text-purple-600" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-deep-ocean mb-2">AI Recommendation</h3>
            <p className="text-sm text-gray-700 mb-3">
              Based on your typical booking patterns, the best time slots this week are:
              <strong> Wednesday 10:00-11:00</strong> (Terminal A) and{' '}
              <strong>Friday 14:00-15:00</strong> (Terminal B).
            </p>
            <Link to="/create-booking">
              <button className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                Book Recommended Slot
                <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TransiteurDashboard;
