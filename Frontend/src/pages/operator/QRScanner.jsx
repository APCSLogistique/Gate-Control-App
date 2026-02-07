import { useState } from 'react';
import { Scan, Search, CheckCircle, XCircle, Truck, AlertTriangle, Clock } from 'lucide-react';

const QRScanner = () => {
  const [scanMode, setScanMode] = useState('scanner'); // 'scanner' or 'manual'
  const [manualBookingId, setManualBookingId] = useState('');
  const [scannedBooking, setScannedBooking] = useState(null);
  const [scanHistory, setScanHistory] = useState([
    { id: 'B-001', time: '14:25', status: 'checked-in', truck: 'TRK-123' },
    { id: 'B-002', time: '14:20', status: 'checked-in', truck: 'TRK-456' },
    { id: 'B-003', time: '14:15', status: 'checked-out', truck: 'TRK-789' },
  ]);

  // Sample booking data
  const sampleBooking = {
    id: 'B-2024-125',
    carrier: 'LogiTrans DZ',
    truck: 'TRK-456',
    driver: 'Ahmed Benali',
    date: '2026-02-06',
    timeSlot: '09:00 - 10:00',
    status: 'pending',
    cargoType: 'Container',
  };

  const handleManualSearch = () => {
    if (manualBookingId.trim()) {
      // Simulate booking found
      setScannedBooking(sampleBooking);
    }
  };

  const handleScan = () => {
    // Simulate QR scan
    setTimeout(() => {
      setScannedBooking(sampleBooking);
    }, 500);
  };

  const handleCheckIn = () => {
    const newEntry = {
      id: scannedBooking.id,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'checked-in',
      truck: scannedBooking.truck,
    };
    setScanHistory([newEntry, ...scanHistory]);
    setScannedBooking(null);
    setManualBookingId('');
  };

  const handleCheckOut = () => {
    const newEntry = {
      id: scannedBooking.id,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'checked-out',
      truck: scannedBooking.truck,
    };
    setScanHistory([newEntry, ...scanHistory]);
    setScannedBooking(null);
    setManualBookingId('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-deep-ocean flex items-center gap-3">
          <Scan size={32} />
          QR Code Scanner
        </h1>
        <p className="text-gray-500 mt-1">Scan QR codes or enter booking ID manually</p>
      </div>

      {/* Mode Selection */}
      <div className="card">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setScanMode('scanner')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              scanMode === 'scanner'
                ? 'bg-apcs-blue text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Scan className="inline mr-2" size={20} />
            QR Scanner
          </button>
          <button
            onClick={() => setScanMode('manual')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              scanMode === 'manual'
                ? 'bg-apcs-blue text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Search className="inline mr-2" size={20} />
            Manual Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner/Manual Entry Section */}
        <div className="lg:col-span-2 space-y-6">
          {scanMode === 'scanner' ? (
            <div className="card">
              <h3 className="text-lg font-semibold text-deep-ocean mb-4">QR Code Scanner</h3>

              {/* Camera Placeholder */}
              <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-4">
                <div className="text-center text-white">
                  <Scan size={64} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Camera View</p>
                  <p className="text-sm text-gray-400">Position QR code within frame</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button onClick={handleScan} className="btn-primary flex items-center gap-2">
                  <Scan size={20} />
                  Start Scanning
                </button>
                <button className="btn-secondary">Stop</button>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <strong>Tip:</strong> Hold the QR code steady within the camera frame. The system will automatically detect and process the code.
                </p>
              </div>
            </div>
          ) : (
            <div className="card">
              <h3 className="text-lg font-semibold text-deep-ocean mb-4">Manual Booking ID Entry</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Booking ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualBookingId}
                      onChange={(e) => setManualBookingId(e.target.value)}
                      placeholder="e.g., B-2024-125"
                      className="flex-1 input-field"
                      onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                    />
                    <button
                      onClick={handleManualSearch}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Search size={20} />
                      Search
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700">
                    Enter the booking ID in the format <strong>B-YYYY-XXX</strong> (e.g., B-2024-125)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Scanned Booking Details */}
          {scannedBooking && (
            <div className="card border-2 border-apcs-blue">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-deep-ocean flex items-center gap-2">
                  <CheckCircle className="text-status-success" size={24} />
                  Booking Found
                </h3>
                <span className="status-badge bg-orange-100 text-status-warning">
                  <Clock size={14} />
                  {scannedBooking.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="font-mono font-semibold text-apcs-blue">{scannedBooking.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{scannedBooking.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time Slot</p>
                  <p className="font-medium">{scannedBooking.timeSlot}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Carrier</p>
                  <p className="font-medium">{scannedBooking.carrier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Truck</p>
                  <p className="font-medium">{scannedBooking.truck}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Driver</p>
                  <p className="font-medium">{scannedBooking.driver}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cargo Type</p>
                  <p className="font-medium">{scannedBooking.cargoType}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCheckIn}
                  className="flex-1 bg-status-success hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Truck size={20} />
                  Check In
                </button>
                <button
                  onClick={handleCheckOut}
                  className="flex-1 bg-digital-cyan hover:bg-cyan-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle size={20} />
                  Check Out
                </button>
                <button
                  onClick={() => setScannedBooking(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Scan History */}
        <div className="card">
          <h3 className="text-lg font-semibold text-deep-ocean mb-4">Recent Scans</h3>

          <div className="space-y-3">
            {scanHistory.map((scan, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  scan.status === 'checked-in'
                    ? 'border-l-status-success bg-green-50'
                    : 'border-l-digital-cyan bg-cyan-50'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="font-mono text-sm font-semibold text-apcs-blue">
                    {scan.id}
                  </span>
                  <span className="text-xs text-gray-500">{scan.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{scan.truck}</span>
                  {scan.status === 'checked-in' ? (
                    <span className="status-badge bg-green-100 text-status-success text-xs">
                      <Truck size={10} />
                      In
                    </span>
                  ) : (
                    <span className="status-badge bg-cyan-100 text-digital-cyan text-xs">
                      <CheckCircle size={10} />
                      Out
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 text-center text-sm text-apcs-blue hover:underline">
            View All History
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card bg-green-50 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Truck className="text-status-success" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Checked In Today</p>
              <p className="text-2xl font-bold text-status-success">18</p>
            </div>
          </div>
        </div>
        <div className="card bg-cyan-50 border border-cyan-200">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-100 p-2 rounded-lg">
              <CheckCircle className="text-digital-cyan" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Checked Out Today</p>
              <p className="text-2xl font-bold text-digital-cyan">15</p>
            </div>
          </div>
        </div>
        <div className="card bg-orange-50 border border-orange-200">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Clock className="text-status-warning" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Currently In Port</p>
              <p className="text-2xl font-bold text-status-warning">3</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default QRScanner;
