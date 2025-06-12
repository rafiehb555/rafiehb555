import React from 'react';
import { useAIAgent } from '../../context/AIAgentContext';

interface APIEndpoint {
  path: string;
  method: string;
  status: 'active' | 'inactive' | 'error';
  lastChecked: Date;
  responseTime: number;
  errorRate: number;
}

export function APIAgent() {
  const { dispatch } = useAIAgent();
  const [endpoints, setEndpoints] = React.useState<APIEndpoint[]>([]);
  const [isScanning, setIsScanning] = React.useState(false);

  const scanEndpoints = async () => {
    setIsScanning(true);
    try {
      // Simulate API endpoint scanning
      const mockEndpoints: APIEndpoint[] = [
        {
          path: '/api/auth/login',
          method: 'POST',
          status: 'active',
          lastChecked: new Date(),
          responseTime: 120,
          errorRate: 0.1,
        },
        {
          path: '/api/users',
          method: 'GET',
          status: 'active',
          lastChecked: new Date(),
          responseTime: 85,
          errorRate: 0.05,
        },
        {
          path: '/api/payments',
          method: 'POST',
          status: 'error',
          lastChecked: new Date(),
          responseTime: 250,
          errorRate: 2.5,
        },
      ];

      setEndpoints(mockEndpoints);

      // Log findings
      mockEndpoints.forEach(endpoint => {
        if (endpoint.status === 'error') {
          dispatch({
            type: 'ADD_MESSAGE',
            payload: {
              role: 'system',
              content: `API Error: ${endpoint.path} has high error rate (${endpoint.errorRate}%)`,
            },
          });
        }
      });

      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'system',
          content: `API Scan complete. Found ${mockEndpoints.length} endpoints.`,
        },
      });
    } catch (error) {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'system',
          content: `Error scanning API endpoints: ${error}`,
        },
      });
    } finally {
      setIsScanning(false);
    }
  };

  React.useEffect(() => {
    scanEndpoints();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">API Monitoring</h3>
        <button
          onClick={scanEndpoints}
          disabled={isScanning}
          className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          {isScanning ? 'Scanning...' : 'Scan APIs'}
        </button>
      </div>

      <div className="space-y-4">
        {endpoints.map((endpoint, index) => (
          <div
            key={index}
            className="p-3 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${
                  endpoint.status === 'active'
                    ? 'bg-green-500'
                    : endpoint.status === 'error'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }`} />
                <span className="font-medium text-gray-900">{endpoint.path}</span>
              </div>
              <span className="text-sm text-gray-500">{endpoint.method}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Response Time:</span>
                <span className="ml-1 font-medium">{endpoint.responseTime}ms</span>
              </div>
              <div>
                <span className="text-gray-500">Error Rate:</span>
                <span className="ml-1 font-medium">{endpoint.errorRate}%</span>
              </div>
              <div>
                <span className="text-gray-500">Last Checked:</span>
                <span className="ml-1 font-medium">
                  {endpoint.lastChecked.toLocaleTimeString()}
                </span>
              </div>
            </div>

            {endpoint.status === 'error' && (
              <div className="mt-2 p-2 bg-red-50 text-red-700 rounded text-sm">
                High error rate detected. Consider investigating this endpoint.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 