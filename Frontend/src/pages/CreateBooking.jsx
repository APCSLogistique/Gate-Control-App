import { useState } from 'react';
import { Calendar, Truck, User, CheckCircle, AlertCircle } from 'lucide-react';

const CreateBooking = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    truckPlate: '',
    driverName: '',
    driverPhone: '',
    cargoType: '',
  });

  const [availableSlots] = useState([
    { time: '08:00 - 09:00', available: 2, status: 'low' },
    { time: '09:00 - 10:00', available: 0, status: 'full' },
    { time: '10:00 - 11:00', available: 5, status: 'good' },
    { time: '11:00 - 12:00', available: 7, status: 'good' },
    { time: '12:00 - 13:00', available: 8, status: 'good' },
    { time: '13:00 - 14:00', available: 4, status: 'medium' },
    { time: '14:00 - 15:00', available: 1, status: 'low' },
    { time: '15:00 - 16:00', available: 6, status: 'good' },
  ]);

  const getSlotColor = (status) => {
    if (status === 'full') return 'bg-gray-200 text-gray-400 cursor-not-allowed';
    if (status === 'low') return 'bg-orange-50 border-status-warning text-status-warning hover:bg-orange-100';
    if (status === 'medium') return 'bg-yellow-50 border-yellow-500 text-yellow-700 hover:bg-yellow-100';
    return 'bg-green-50 border-status-success text-status-success hover:bg-green-100';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit booking
      console.log('Booking submitted:', formData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-deep-ocean">Create New Booking</h1>
        <p className="text-gray-500 mt-1">Book a time slot for terminal access</p>
      </div>

      {/* Progress Steps */}
      <div className="card">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Select Date' },
            { num: 2, label: 'Time Slot' },
            { num: 3, label: 'Details' },
            { num: 4, label: 'Confirmation' },
          ].map((s, index) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s.num
                      ? 'bg-apcs-blue text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {s.num}
                </div>
                <span className="text-xs mt-2 text-gray-600">{s.label}</span>
              </div>
              {index < 3 && (
                <div className={`w-24 h-1 mx-2 ${step > s.num ? 'bg-apcs-blue' : 'bg-gray-200'}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="card space-y-6">
            <h3 className="text-xl font-semibold text-deep-ocean">
              Step 1: Select Date
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <div className="relative max-w-md">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apcs-blue"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Next: Choose Time Slot
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="card space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-deep-ocean">
                Step 2: Select Time Slot
              </h3>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-apcs-blue hover:underline"
              >
                ← Back
              </button>
            </div>

            <div className="bg-light-blue p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                Selected date: <strong>{formData.date}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  disabled={slot.status === 'full'}
                  onClick={() => setFormData({ ...formData, timeSlot: slot.time })}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    formData.timeSlot === slot.time
                      ? 'border-apcs-blue bg-blue-50 ring-2 ring-apcs-blue'
                      : getSlotColor(slot.status)
                  }`}
                >
                  <p className="font-semibold">{slot.time}</p>
                  <p className="text-xs mt-1">
                    {slot.available} {slot.available === 1 ? 'slot' : 'slots'} available
                  </p>
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={!formData.timeSlot}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Enter Details
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="card space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-deep-ocean">
                Step 3: Truck & Driver Details
              </h3>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-apcs-blue hover:underline"
              >
                ← Back
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Truck className="inline mr-2" size={16} />
                  Truck Plate Number
                </label>
                <input
                  type="text"
                  value={formData.truckPlate}
                  onChange={(e) => setFormData({ ...formData, truckPlate: e.target.value })}
                  placeholder="e.g., TRK-12345"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cargo Type
                </label>
                <select
                  value={formData.cargoType}
                  onChange={(e) => setFormData({ ...formData, cargoType: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select cargo type</option>
                  <option value="Container">Container</option>
                  <option value="Bulk">Bulk</option>
                  <option value="General">General Cargo</option>
                  <option value="Vehicle">Vehicle</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline mr-2" size={16} />
                  Driver Name
                </label>
                <input
                  type="text"
                  value={formData.driverName}
                  onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                  placeholder="Enter driver name"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Driver Phone
                </label>
                <input
                  type="tel"
                  value={formData.driverPhone}
                  onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                  placeholder="+213 XXX XXX XXX"
                  className="input-field"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Review Booking
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="card space-y-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
              <CheckCircle className="text-status-success" size={32} />
            </div>

            <h3 className="text-2xl font-bold text-deep-ocean">Booking Confirmed!</h3>
            <p className="text-gray-600">Your booking has been successfully created</p>

            <div className="bg-light-blue p-6 rounded-lg text-left max-w-md mx-auto">
              <h4 className="font-semibold text-deep-ocean mb-4">Booking Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-semibold">B-2024-{Math.floor(Math.random() * 1000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">{formData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-semibold">{formData.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Truck:</span>
                  <span className="font-semibold">{formData.truckPlate}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button className="btn-primary">Download QR Code</button>
              <button className="btn-secondary" onClick={() => window.location.reload()}>
                Create Another Booking
              </button>
            </div>
          </div>
        )}
      </form>

    </div>
  );
};

export default CreateBooking;
