import { useState } from 'react';
import { Clock, Calendar, AlertTriangle, TrendingUp, Save } from 'lucide-react';

const CapacityManagementNew = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Configuration des capacités - Modifiables par l'admin
  const [maxCapacityPerSlot, setMaxCapacityPerSlot] = useState(10);
  const [lateCapacityPerSlot, setLateCapacityPerSlot] = useState(2);
  const [hasChanges, setHasChanges] = useState(false);

  // Time slots (rows)
  const timeSlots = [
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
  ];

  // Capacity data - Les capacités sont maintenant liées aux états globaux
  const [capacityData, setCapacityData] = useState({
    '08:00 - 09:00': { capacity: maxCapacityPerSlot, lateCapacity: lateCapacityPerSlot, booked: 8 },
    '09:00 - 10:00': { capacity: maxCapacityPerSlot, lateCapacity: lateCapacityPerSlot, booked: 10 },
    '10:00 - 11:00': { capacity: maxCapacityPerSlot, lateCapacity: lateCapacityPerSlot, booked: 7 },
    '11:00 - 12:00': { capacity: maxCapacityPerSlot, lateCapacity: lateCapacityPerSlot, booked: 5 },
    '12:00 - 13:00': { capacity: maxCapacityPerSlot, lateCapacity: lateCapacityPerSlot, booked: 3 },
    '13:00 - 14:00': { capacity: maxCapacityPerSlot, lateCapacity: lateCapacityPerSlot, booked: 6 },
    '14:00 - 15:00': { capacity: maxCapacityPerSlot, lateCapacity: lateCapacityPerSlot, booked: 9 },
    '15:00 - 16:00': { capacity: maxCapacityPerSlot, lateCapacity: lateCapacityPerSlot, booked: 4 },
    '16:00 - 17:00': { capacity: maxCapacityPerSlot, lateCapacity: lateCapacityPerSlot, booked: 2 },
    '17:00 - 18:00': { capacity: maxCapacityPerSlot, lateCapacity: lateCapacityPerSlot, booked: 1 },
  });

  // Met à jour toutes les capacités max quand on change l'input global
  const handleMaxCapacityChange = (newCapacity) => {
    const capacity = parseInt(newCapacity) || 0;
    setMaxCapacityPerSlot(capacity);

    // Mettre à jour toutes les capacités
    const updatedData = {};
    timeSlots.forEach((slot) => {
      updatedData[slot] = {
        ...capacityData[slot],
        capacity: capacity,
      };
    });
    setCapacityData(updatedData);
    setHasChanges(true);
  };

  // Met à jour toutes les late capacities quand on change l'input global
  const handleLateCapacityChange = (newLateCapacity) => {
    const lateCapacity = parseInt(newLateCapacity) || 0;
    setLateCapacityPerSlot(lateCapacity);

    // Mettre à jour toutes les late capacities
    const updatedData = {};
    timeSlots.forEach((slot) => {
      updatedData[slot] = {
        ...capacityData[slot],
        lateCapacity: lateCapacity,
      };
    });
    setCapacityData(updatedData);
    setHasChanges(true);
  };

  const handleSave = () => {
    // TODO: Appel API pour sauvegarder la configuration
    alert(`Configuration sauvegardée!\nMax Capacity: ${maxCapacityPerSlot}\nLate Capacity: ${lateCapacityPerSlot}`);
    setHasChanges(false);
  };

  const getUtilizationColor = (booked, capacity) => {
    if (capacity === 0) return 'bg-gray-200';
    const percent = (booked / capacity) * 100;
    if (percent >= 100) return 'bg-status-error';
    if (percent >= 80) return 'bg-status-warning';
    if (percent >= 50) return 'bg-yellow-300';
    return 'bg-status-success';
  };

  const getCellBgColor = (booked, capacity) => {
    if (capacity === 0) return 'bg-gray-50';
    const percent = (booked / capacity) * 100;
    if (percent >= 100) return 'bg-red-50';
    if (percent >= 80) return 'bg-orange-50';
    if (percent >= 50) return 'bg-yellow-50';
    return 'bg-green-50';
  };

  // Calculate totals
  const totalCapacity = Object.values(capacityData).reduce((sum, slot) => sum + slot.capacity, 0);
  const totalLateCapacity = Object.values(capacityData).reduce((sum, slot) => sum + slot.lateCapacity, 0);
  const totalBooked = Object.values(capacityData).reduce((sum, slot) => sum + slot.booked, 0);
  const avgUtilization = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-deep-ocean flex items-center gap-3">
          <Clock size={32} />
          Capacity Management
        </h1>
        <button
          onClick={handleSave}
          className={`btn-primary flex items-center gap-2 ${hasChanges ? 'shadow-lg ring-2 ring-apcs-blue animate-pulse' : ''}`}
          disabled={!hasChanges}
        >
          <Save size={18} />
          {hasChanges ? 'Save Changes' : 'Saved'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="bg-apcs-blue p-3 rounded-lg">
              <Clock className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Capacity</p>
              <p className="text-3xl font-bold text-apcs-blue">{totalCapacity}</p>
            </div>
          </div>
        </div>
        <div className="card bg-orange-50 border border-orange-200">
          <div className="flex items-center gap-3">
            <div className="bg-status-warning p-3 rounded-lg">
              <AlertTriangle className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Late Capacity</p>
              <p className="text-3xl font-bold text-status-warning">{totalLateCapacity}</p>
            </div>
          </div>
        </div>
        <div className="card bg-cyan-50 border border-cyan-200">
          <div className="flex items-center gap-3">
            <div className="bg-digital-cyan p-3 rounded-lg">
              <Calendar className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Booked</p>
              <p className="text-3xl font-bold text-digital-cyan">{totalBooked}</p>
            </div>
          </div>
        </div>
        <div className="card bg-green-50 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="bg-status-success p-3 rounded-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Utilization</p>
              <p className="text-3xl font-bold text-status-success">{avgUtilization}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Date Selector */}
      <div className="card">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apcs-blue"
          />
        </div>
      </div>

      {/* Capacity Table */}
      <div className="card overflow-hidden p-0">
        {/* Inputs au-dessus du tableau */}
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-300 flex items-center gap-8">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Max Capacity:</label>
            <input
              type="number"
              value={maxCapacityPerSlot}
              onChange={(e) => handleMaxCapacityChange(e.target.value)}
              min="0"
              max="50"
              className="w-16 px-2 py-1 text-center font-bold border-2 border-apcs-blue rounded-lg focus:ring-2 focus:ring-apcs-blue"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Late Capacity:</label>
            <input
              type="number"
              value={lateCapacityPerSlot}
              onChange={(e) => handleLateCapacityChange(e.target.value)}
              min="0"
              max="10"
              className="w-16 px-2 py-1 text-center font-bold border-2 border-status-warning rounded-lg focus:ring-2 focus:ring-status-warning"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-deep-ocean text-white">
                <th className="px-6 py-4 text-left font-semibold">Time Slot</th>
                <th className="px-6 py-4 text-center font-semibold">Max Capacity</th>
                <th className="px-6 py-4 text-center font-semibold">Late Capacity</th>
                <th className="px-6 py-4 text-center font-semibold">Currently Booked</th>
                <th className="px-6 py-4 text-center font-semibold">Available</th>
                <th className="px-6 py-4 text-center font-semibold">Utilization</th>
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot, index) => {
                const data = capacityData[slot];
                const available = data.capacity - data.booked;
                const utilization = data.capacity > 0 ? Math.round((data.booked / data.capacity) * 100) : 0;

                return (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 hover:bg-gray-50 ${getCellBgColor(data.booked, data.capacity)}`}
                  >
                    {/* Time Slot */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span className="font-semibold text-deep-ocean">{slot}</span>
                      </div>
                    </td>

                    {/* Max Capacity */}
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-4 py-2 bg-apcs-blue text-white font-bold text-lg rounded-lg">
                        {data.capacity}
                      </span>
                    </td>

                    {/* Late Capacity */}
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-4 py-2 bg-status-warning text-white font-bold text-lg rounded-lg">
                        {data.lateCapacity}
                      </span>
                    </td>

                    {/* Currently Booked */}
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-digital-cyan text-lg">{data.booked}</span>
                    </td>

                    {/* Available */}
                    <td className="px-6 py-4 text-center">
                      <span className={`font-semibold text-lg ${
                        available === 0 ? 'text-status-error' :
                        available <= 2 ? 'text-status-warning' :
                        'text-status-success'
                      }`}>
                        {available}
                      </span>
                    </td>

                    {/* Utilization Bar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-4">
                          <div
                            className={`h-4 rounded-full transition-all ${getUtilizationColor(data.booked, data.capacity)}`}
                            style={{ width: `${Math.min(utilization, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                          {utilization}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="bg-gray-50 px-6 py-4 border-t-2 border-deep-ocean">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-gray-600">Total Capacity</p>
                <p className="text-xl font-bold text-deep-ocean">{totalCapacity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Late Capacity</p>
                <p className="text-xl font-bold text-status-warning">{totalLateCapacity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Booked</p>
                <p className="text-xl font-bold text-digital-cyan">{totalBooked}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Available</p>
                <p className="text-xl font-bold text-status-success">{totalCapacity - totalBooked}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Average Utilization</p>
              <p className="text-3xl font-bold text-apcs-blue">{avgUtilization}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="card bg-gray-50 border border-gray-200">
        <h3 className="font-semibold text-deep-ocean mb-3">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-50 border-2 border-green-200 rounded"></div>
            <span className="text-sm text-gray-700">0-49% (Low)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-50 border-2 border-yellow-200 rounded"></div>
            <span className="text-sm text-gray-700">50-79% (Medium)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-50 border-2 border-orange-200 rounded"></div>
            <span className="text-sm text-gray-700">80-99% (High)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-50 border-2 border-red-200 rounded"></div>
            <span className="text-sm text-gray-700">100% (Full)</span>
          </div>
        </div>
      </div>

      {/* Warning Messages */}
      {Object.entries(capacityData).some(([_, data]) => data.capacity < data.booked) && (
        <div className="card bg-red-50 border-l-4 border-l-status-error">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-status-error flex-shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-semibold text-status-error mb-1">Capacity Warning</h4>
              <p className="text-sm text-gray-700">
                Some time slots have more bookings than capacity. Please cancel some bookings to resolve this issue.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CapacityManagementNew;
