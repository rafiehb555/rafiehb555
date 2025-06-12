import React from 'react';
import { useAIAgent } from '../../context/AIAgentContext';

interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file';
  status: 'active' | 'inactive' | 'error';
  lastSync: Date;
  recordCount: number;
  size: string;
}

interface DataMetrics {
  totalSources: number;
  activeSources: number;
  totalRecords: number;
  lastUpdated: Date;
}

export function DataCollectorAgent() {
  const { dispatch } = useAIAgent();
  const [sources, setSources] = React.useState<DataSource[]>([]);
  const [metrics, setMetrics] = React.useState<DataMetrics>({
    totalSources: 0,
    activeSources: 0,
    totalRecords: 0,
    lastUpdated: new Date(),
  });
  const [isCollecting, setIsCollecting] = React.useState(false);

  const collectData = async () => {
    setIsCollecting(true);
    try {
      // Simulate data collection
      const mockSources: DataSource[] = [
        {
          id: 'users-db',
          name: 'Users Database',
          type: 'database',
          status: 'active',
          lastSync: new Date(),
          recordCount: 15000,
          size: '2.5 GB',
        },
        {
          id: 'products-api',
          name: 'Products API',
          type: 'api',
          status: 'active',
          lastSync: new Date(),
          recordCount: 5000,
          size: '500 MB',
        },
        {
          id: 'logs-file',
          name: 'System Logs',
          type: 'file',
          status: 'error',
          lastSync: new Date(),
          recordCount: 100000,
          size: '1.2 GB',
        },
      ];

      setSources(mockSources);

      // Calculate metrics
      const newMetrics: DataMetrics = {
        totalSources: mockSources.length,
        activeSources: mockSources.filter(s => s.status === 'active').length,
        totalRecords: mockSources.reduce((sum, s) => sum + s.recordCount, 0),
        lastUpdated: new Date(),
      };

      setMetrics(newMetrics);

      // Log findings
      mockSources.forEach(source => {
        if (source.status === 'error') {
          dispatch({
            type: 'ADD_MESSAGE',
            payload: {
              id: Date.now().toString(),
              role: 'system',
              content: `Data Source Error: ${source.name} is not syncing properly`,
              timestamp: new Date(),
              severity: 'error',
            },
          });
        }
      });

      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now().toString(),
          role: 'system',
          content: `Data Collection complete. Found ${newMetrics.totalSources} sources with ${newMetrics.totalRecords} total records.`,
          timestamp: new Date(),
          severity: 'info',
        },
      });
    } catch (error) {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now().toString(),
          role: 'system',
          content: `Error collecting data: ${error}`,
          timestamp: new Date(),
          severity: 'error',
        },
      });
    } finally {
      setIsCollecting(false);
    }
  };

  React.useEffect(() => {
    collectData();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Data Collection</h3>
        <button
          onClick={collectData}
          disabled={isCollecting}
          className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          {isCollecting ? 'Collecting...' : 'Collect Data'}
        </button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-600">Total Sources</div>
          <div className="text-2xl font-semibold text-blue-700">{metrics.totalSources}</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-sm text-green-600">Active Sources</div>
          <div className="text-2xl font-semibold text-green-700">{metrics.activeSources}</div>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="text-sm text-purple-600">Total Records</div>
          <div className="text-2xl font-semibold text-purple-700">{metrics.totalRecords.toLocaleString()}</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">Last Updated</div>
          <div className="text-2xl font-semibold text-gray-700">
            {metrics.lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Data Sources List */}
      <div className="space-y-4">
        {sources.map((source) => (
          <div
            key={source.id}
            className="p-3 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${
                  source.status === 'active'
                    ? 'bg-green-500'
                    : source.status === 'error'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }`} />
                <span className="font-medium text-gray-900">{source.name}</span>
              </div>
              <span className="text-sm text-gray-500">{source.type}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Records:</span>
                <span className="ml-1 font-medium">{source.recordCount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Size:</span>
                <span className="ml-1 font-medium">{source.size}</span>
              </div>
              <div>
                <span className="text-gray-500">Last Sync:</span>
                <span className="ml-1 font-medium">
                  {source.lastSync.toLocaleTimeString()}
                </span>
              </div>
            </div>

            {source.status === 'error' && (
              <div className="mt-2 p-2 bg-red-50 text-red-700 rounded text-sm">
                Sync error detected. Check connection and permissions.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 