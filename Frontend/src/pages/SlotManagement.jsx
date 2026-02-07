import { useState } from 'react';
import { Calendar, Clock, AlertTriangle, Plus, Minus, Save } from 'lucide-react';

const SlotManagement = () => {
  const [selectedTerminal, setSelectedTerminal] = useState('Terminal A');
  const [selectedDate, setSelectedDate] = useState('2024-02-06');

  const terminals = ['Terminal A', 'Terminal B', 'Terminal C', 'Terminal D'];

  // Sample slot data
  const slots = [
    { hour: '08:00 - 09:00', max: 10, booked: 8, available: 2 },
    { hour: '09:00 - 10:00', max: 10, booked: 10, available: 0 },
    { hour: '10:00 - 11:00', max: 10, booked: 7, available: 3 },
    { hour: '11:00 - 12:00', max: 10, booked: 5, available: 5 },
    { hour: '12:00 - 13:00', max: 10, booked: 3, available: 7 },
    { hour: '13:00 - 14:00', max: 10, booked: 6, available: 4 },
    { hour: '14:00 - 15:00', max: 10, booked: 9, available: 1 },
    { hour: '15:00 - 16:00', max: 10, booked: 4, available: 6 },
    { hour: '16:00 - 17:00', max: 10, booked: 2, available: 8 },
    { hour: '17:00 - 18:00', max: 10, booked: 1, available: 9 },
  ];

  const getCapacityColor = (booked, max) => {
    const percent = (booked / max) * 100;
    if (percent >= 90) return 'bg-status-error';
    if (percent >= 70) return 'bg-status-warning';
    return 'bg-status-success';
  };

  const getCapacityWidth = (booked, max) => {
    return `${(booked / max) * 100}%`;
  };

  // Heatmap data for week view
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h'];

  const getHeatmapColor = (value) => {
    if (value >= 90) return 'bg-red-500';
    if (value >= 70) return 'bg-orange-400';
    if (value >= 50) return 'bg-yellow-400';
    if (value >= 30) return 'bg-green-300';
    return 'bg-green-100';
  };

  const heatmapData = weekDays.map(() =>
    hours.map(() => Math.floor(Math.random() * 100))
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-deep-ocean">Slot & Capacity Management</h1>
          <p className="text-gray-500 mt-1">Control terminal flow and time slots</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Save size={18} />
          Save Changes
        </button>
      </div>

      {/* Terminal & Date Selection */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Terminal Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Terminal
            </label>
            <select
              value={selectedTerminal}
              onChange={(e) => setSelectedTerminal(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apcs-blue focus:border-transparent"
            >
              {terminals.map((terminal) => (
                <option key={terminal} value={terminal}>
                  {terminal}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apcs-blue focus:border-transparent"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-light-blue rounded-lg p-4">
            <p className="text-sm text-gray-600">Overall Capacity</p>
            <p className="text-2xl font-bold text-deep-ocean">73%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-apcs-blue h-2 rounded-full" style={{ width: '73%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Slot Configuration & Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Slots Table */}
        <div className="card">
          <h3 className="text-lg font-semibold text-deep-ocean mb-4 flex items-center gap-2">
            <Clock size={20} />
            Time Slot Configuration
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="table-header">Time Slot</th>
                  <th className="table-header">Max</th>
                  <th className="table-header">Booked</th>
                  <th className="table-header">Available</th>
                  <th className="table-header">Capacity</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="table-cell font-medium">{slot.hour}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center">{slot.max}</span>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="table-cell">{slot.booked}</td>
                    <td className="table-cell">
                      <span
                        className={`font-semibold ${
                          slot.available === 0
                            ? 'text-status-error'
                            : slot.available <= 2
                            ? 'text-status-warning'
                            : 'text-status-success'
                        }`}
                      >
                        {slot.available}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${getCapacityColor(slot.booked, slot.max)}`}
                          style={{ width: getCapacityWidth(slot.booked, slot.max) }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Capacity Heatmap */}
        <div className="card">
          <h3 className="text-lg font-semibold text-deep-ocean mb-4">
            Weekly Capacity Heatmap
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2 text-xs text-gray-500"></th>
                  {weekDays.map((day) => (
                    <th key={day} className="p-2 text-xs font-medium text-gray-600">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hours.map((hour, hourIndex) => (
                  <tr key={hour}>
                    <td className="p-2 text-xs text-gray-500">{hour}</td>
                    {weekDays.map((day, dayIndex) => (
                      <td key={`${day}-${hour}`} className="p-1">
                        <div
                          className={`w-8 h-8 rounded ${getHeatmapColor(
                            heatmapData[dayIndex][hourIndex]
                          )} flex items-center justify-center text-xs text-white font-semibold cursor-pointer hover:ring-2 hover:ring-apcs-blue`}
                          title={`${heatmapData[dayIndex][hourIndex]}% capacity`}
                        >
                          {heatmapData[dayIndex][hourIndex]}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded"></div>
              <span className="text-xs text-gray-600">0-30%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-300 rounded"></div>
              <span className="text-xs text-gray-600">30-50%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-xs text-gray-600">50-70%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-400 rounded"></div>
              <span className="text-xs text-gray-600">70-90%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-xs text-gray-600">90-100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Override */}
      <div className="card border-l-4 border-l-status-warning">
        <div className="flex items-start gap-4">
          <AlertTriangle className="text-status-warning flex-shrink-0" size={24} />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-deep-ocean mb-2">
              Emergency Capacity Override
            </h3>
            <p className="text-gray-600 mb-4">
              Use this feature to temporarily increase or decrease terminal capacity in emergency
              situations. All changes are logged for audit purposes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity Change
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option>+10% (Emergency Increase)</option>
                  <option>+20% (Emergency Increase)</option>
                  <option>-10% (Reduced Capacity)</option>
                  <option>-20% (Maintenance Mode)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option>1 Hour</option>
                  <option>2 Hours</option>
                  <option>4 Hours</option>
                  <option>Full Day</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <input
                  type="text"
                  placeholder="Enter reason for override"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="mt-4">
              <button className="bg-status-warning hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Apply Override
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SlotManagement;
