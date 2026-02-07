import { Activity, TrendingUp, AlertTriangle, Scan } from 'lucide-react';

const Operations = () => {
  const gateActivity = [
    { id: 1, truck: 'TRK-123', time: '14:25', terminal: 'Terminal A', status: 'Entered' },
    { id: 2, truck: 'TRK-456', time: '14:20', terminal: 'Terminal B', status: 'Pending' },
    { id: 3, truck: 'TRK-789', time: '14:15', terminal: 'Terminal A', status: 'Exited' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-deep-ocean">Operational Dashboard</h1>
        <p className="text-gray-500 mt-1">Live port control and monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Activity className="text-apcs-blue" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Live Trucks</p>
              <p className="text-2xl font-bold text-deep-ocean">42</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-3 rounded-lg">
              <TrendingUp className="text-status-success" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Processed Today</p>
              <p className="text-2xl font-bold text-deep-ocean">248</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 p-3 rounded-lg">
              <AlertTriangle className="text-status-warning" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Validations</p>
              <p className="text-2xl font-bold text-deep-ocean">12</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-deep-ocean mb-4">Gate Activity Monitor</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="table-header">Truck</th>
                <th className="table-header">Time</th>
                <th className="table-header">Terminal</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {gateActivity.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="table-cell font-semibold">{activity.truck}</td>
                  <td className="table-cell">{activity.time}</td>
                  <td className="table-cell">{activity.terminal}</td>
                  <td className="table-cell">
                    <span className="status-badge bg-green-100 text-status-success">
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Operations;
