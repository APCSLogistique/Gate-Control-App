import { Bell, CheckCircle } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    { id: 1, title: 'Booking Confirmed', message: 'Your booking B-2024-001 has been confirmed', time: '5 min ago', read: false },
    { id: 2, title: 'Capacity Alert', message: 'Terminal A is at 85% capacity', time: '15 min ago', read: false },
    { id: 3, title: 'Booking Complete', message: 'Truck TRK-123 has completed its booking', time: '1 hour ago', read: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-deep-ocean">Notifications</h1>
          <p className="text-gray-500 mt-1">Stay updated with all activities</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <CheckCircle size={18} />
          Mark All Read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div key={notif.id} className={`card ${!notif.read ? 'border-l-4 border-l-apcs-blue' : ''}`}>
            <div className="flex items-start gap-4">
              <div className="bg-light-blue p-3 rounded-lg">
                <Bell className="text-apcs-blue" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-deep-ocean">{notif.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                <p className="text-gray-400 text-xs mt-2">{notif.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Notifications;
