import { Code2 } from 'lucide-react';

const APIIntegration = ({ title, endpoints }) => {
  return (
    <div className="card bg-gray-50 border border-gray-200">
      <h3 className="font-semibold text-deep-ocean mb-3 flex items-center gap-2">
        <Code2 size={18} />
        {title || 'API Integration'}
      </h3>
      <div className="space-y-2 text-sm">
        {endpoints.map((endpoint, index) => (
          <div key={index} className="flex items-start gap-2">
            <span
              className={`font-mono px-2 py-0.5 rounded text-xs font-semibold ${
                endpoint.method === 'GET'
                  ? 'bg-green-100 text-status-success'
                  : endpoint.method === 'POST'
                  ? 'bg-orange-100 text-status-warning'
                  : endpoint.method === 'PUT'
                  ? 'bg-blue-100 text-status-info'
                  : 'bg-red-100 text-status-error'
              }`}
            >
              {endpoint.method}
            </span>
            <code className="text-gray-700 flex-shrink-0">{endpoint.path}</code>
            <span className="text-gray-500">{endpoint.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default APIIntegration;
