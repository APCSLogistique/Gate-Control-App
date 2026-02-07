import { useState } from 'react';
import { BarChart3, Download, Calendar, TrendingUp, FileText, Filter } from 'lucide-react';

const Reports = () => {
  const [reportType, setReportType] = useState('bookings');
  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState('2026-02-01');
  const [endDate, setEndDate] = useState('2026-02-06');

  const reportTypes = [
    { value: 'bookings', label: 'Bookings Report', icon: Calendar },
    { value: 'capacity', label: 'Capacity Utilization', icon: TrendingUp },
    { value: 'operations', label: 'Operations Report', icon: BarChart3 },
    { value: 'performance', label: 'Performance Metrics', icon: FileText },
  ];

  // Sample report data
  const reportData = {
    bookings: {
      total: 248,
      confirmed: 156,
      pending: 42,
      consumed: 28,
      rejected: 8,
      byDate: [
        { date: '2026-02-01', count: 35 },
        { date: '2026-02-02', count: 42 },
        { date: '2026-02-03', count: 38 },
        { date: '2026-02-04', count: 45 },
        { date: '2026-02-05', count: 48 },
        { date: '2026-02-06', count: 40 },
      ],
    },
    capacity: {
      avgUtilization: 73,
      peakHour: '14:00 - 15:00',
      lowHour: '17:00 - 18:00',
      terminals: [
        { name: 'Terminal A', utilization: 85 },
        { name: 'Terminal B', utilization: 72 },
        { name: 'Terminal C', utilization: 65 },
        { name: 'Terminal D', utilization: 90 },
      ],
    },
  };

  const generateReport = () => {
    alert(`Generating ${reportType} report for ${dateRange}...`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-deep-ocean flex items-center gap-3">
            <BarChart3 size={32} />
            Reports & Analytics
          </h1>
          <p className="text-gray-500 mt-1">Generate detailed reports and analyze system performance</p>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="card">
        <h3 className="text-lg font-semibold text-deep-ocean mb-4 flex items-center gap-2">
          <Filter size={20} />
          Report Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apcs-blue"
            >
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Preset */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apcs-blue"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apcs-blue"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apcs-blue"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={generateReport} className="btn-primary flex items-center gap-2">
            <BarChart3 size={18} />
            Generate Report
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Download size={18} />
            Export to PDF
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Download size={18} />
            Export to Excel
          </button>
        </div>
      </div>

      {/* Report Preview */}
      <div className="card">
        <h3 className="text-lg font-semibold text-deep-ocean mb-4">
          {reportTypes.find(t => t.value === reportType)?.label}
        </h3>

        {reportType === 'bookings' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-3xl font-bold text-apcs-blue">{reportData.bookings.total}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Confirmed</p>
                <p className="text-3xl font-bold text-status-success">{reportData.bookings.confirmed}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-status-warning">{reportData.bookings.pending}</p>
              </div>
              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                <p className="text-sm text-gray-600 mb-1">Consumed</p>
                <p className="text-3xl font-bold text-digital-cyan">{reportData.bookings.consumed}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-sm text-gray-600 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-status-error">{reportData.bookings.rejected}</p>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="bg-gray-100 rounded-lg p-8">
              <p className="text-center text-gray-500 mb-4">Bookings Over Time</p>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="space-y-2">
                  {reportData.bookings.byDate.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 w-24">{item.date}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-6">
                        <div
                          className="bg-apcs-blue rounded-full h-6 flex items-center justify-end px-2"
                          style={{ width: `${(item.count / 50) * 100}%` }}
                        >
                          <span className="text-xs text-white font-semibold">{item.count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {reportType === 'capacity' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Avg Utilization</p>
                <p className="text-3xl font-bold text-apcs-blue">{reportData.capacity.avgUtilization}%</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Peak Hour</p>
                <p className="text-xl font-bold text-status-success">{reportData.capacity.peakHour}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-gray-600 mb-1">Low Hour</p>
                <p className="text-xl font-bold text-status-warning">{reportData.capacity.lowHour}</p>
              </div>
            </div>

            {/* Terminal Utilization */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="font-semibold text-deep-ocean mb-4">Utilization</h4>
              <div className="space-y-4">
                {reportData.capacity.terminals.map((terminal, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{terminal.name}</span>
                      <span className="text-sm font-bold text-apcs-blue">{terminal.utilization}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          terminal.utilization >= 85
                            ? 'bg-status-error'
                            : terminal.utilization >= 70
                            ? 'bg-status-warning'
                            : 'bg-status-success'
                        }`}
                        style={{ width: `${terminal.utilization}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {(reportType === 'operations' || reportType === 'performance') && (
          <div className="bg-gray-100 rounded-lg p-12 text-center">
            <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">
              {reportType === 'operations' ? 'Operations Report' : 'Performance Metrics'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Configure filters and click "Generate Report" to view data
            </p>
          </div>
        )}
      </div>

      {/* Scheduled Reports */}
      <div className="card">
        <h3 className="text-lg font-semibold text-deep-ocean mb-4">Scheduled Reports</h3>
        <div className="space-y-3">
          <div className="p-4 bg-light-blue rounded-lg border border-blue-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-apcs-blue p-2 rounded-lg">
                <Calendar className="text-white" size={20} />
              </div>
              <div>
                <p className="font-medium text-deep-ocean">Weekly Bookings Report</p>
                <p className="text-sm text-gray-600">Every Monday at 9:00 AM</p>
              </div>
            </div>
            <button className="text-sm text-apcs-blue hover:underline">Edit</button>
          </div>
          <div className="p-4 bg-light-blue rounded-lg border border-blue-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-apcs-blue p-2 rounded-lg">
                <TrendingUp className="text-white" size={20} />
              </div>
              <div>
                <p className="font-medium text-deep-ocean">Monthly Performance</p>
                <p className="text-sm text-gray-600">First day of each month</p>
              </div>
            </div>
            <button className="text-sm text-apcs-blue hover:underline">Edit</button>
          </div>
        </div>
        <button className="w-full mt-4 btn-secondary">+ Add Scheduled Report</button>
      </div>

    </div>
  );
};

export default Reports;
