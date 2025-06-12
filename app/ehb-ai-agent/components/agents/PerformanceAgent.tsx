import React from 'react';
import { useAIAgent } from '../../context/AIAgentContext';
import { AgentMetrics } from '../visualizations/AgentMetrics';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  timestamp: Date;
}

interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  errorRate: number;
  lastUpdated: Date;
}

export function PerformanceAgent() {
  const { dispatch } = useAIAgent();
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({
    pageLoadTime: 0,
    apiResponseTime: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    errorRate: 0,
    lastUpdated: new Date(),
  });
  const [detailedMetrics, setDetailedMetrics] = React.useState<PerformanceMetric[]>([]);
  const [isMonitoring, setIsMonitoring] = React.useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = React.useState<'1h' | '24h' | '7d' | '30d'>('24h');

  const monitorPerformance = async () => {
    setIsMonitoring(true);
    try {
      // Simulate performance monitoring
      const mockDetailedMetrics: PerformanceMetric[] = [
        {
          id: '1',
          name: 'Page Load Time',
          value: 1.2,
          unit: 's',
          threshold: 2,
          status: 'good',
          trend: 'down',
          timestamp: new Date(),
        },
        {
          id: '2',
          name: 'API Response Time',
          value: 350,
          unit: 'ms',
          threshold: 500,
          status: 'good',
          trend: 'stable',
          timestamp: new Date(),
        },
        {
          id: '3',
          name: 'Memory Usage',
          value: 75,
          unit: '%',
          threshold: 80,
          status: 'warning',
          trend: 'up',
          timestamp: new Date(),
        },
        {
          id: '4',
          name: 'CPU Usage',
          value: 45,
          unit: '%',
          threshold: 70,
          status: 'good',
          trend: 'stable',
          timestamp: new Date(),
        },
        {
          id: '5',
          name: 'Error Rate',
          value: 0.5,
          unit: '%',
          threshold: 1,
          status: 'good',
          trend: 'down',
          timestamp: new Date(),
        },
      ];

      setDetailedMetrics(mockDetailedMetrics);

      // Calculate aggregate metrics
      const newMetrics: PerformanceMetrics = {
        pageLoadTime: mockDetailedMetrics[0].value,
        apiResponseTime: mockDetailedMetrics[1].value,
        memoryUsage: mockDetailedMetrics[2].value,
        cpuUsage: mockDetailedMetrics[3].value,
        errorRate: mockDetailedMetrics[4].value,
        lastUpdated: new Date(),
      };

      setMetrics(newMetrics);

      // Log performance issues
      mockDetailedMetrics.forEach(metric => {
        if (metric.status === 'critical') {
          dispatch({
            type: 'ADD_MESSAGE',
            payload: {
              id: Date.now().toString(),
              role: 'system',
              content: `Critical Performance Issue: ${metric.name} is at ${metric.value}${metric.unit}`,
              timestamp: new Date(),
              severity: 'error',
              type: 'alert',
              metadata: {
                source: 'PerformanceAgent',
                metricId: metric.id,
              },
            },
          });
        } else if (metric.status === 'warning') {
          dispatch({
            type: 'ADD_MESSAGE',
            payload: {
              id: Date.now().toString(),
              role: 'system',
              content: `Performance Warning: ${metric.name} is approaching threshold`,
              timestamp: new Date(),
              severity: 'warning',
              type: 'alert',
              metadata: {
                source: 'PerformanceAgent',
                metricId: metric.id,
              },
            },
          });
        }
      });

      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now().toString(),
          role: 'system',
          content: `Performance monitoring complete. All metrics within acceptable range.`,
          timestamp: new Date(),
          severity: 'info',
          type: 'log',
          metadata: {
            source: 'PerformanceAgent',
            metrics: newMetrics,
          },
        },
      });
    } catch (error) {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now().toString(),
          role: 'system',
          content: `Error during performance monitoring: ${error}`,
          timestamp: new Date(),
          severity: 'error',
          type: 'alert',
          metadata: {
            source: 'PerformanceAgent',
          },
        },
      });
    } finally {
      setIsMonitoring(false);
    }
  };

  React.useEffect(() => {
    monitorPerformance();
    // Set up periodic monitoring
    const interval = setInterval(monitorPerformance, 60000); // Every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-6 gap-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-500">Page Load Time</div>
          <div className="text-2xl font-semibold text-gray-900">{metrics.pageLoadTime}s</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-500">API Response Time</div>
          <div className="text-2xl font-semibold text-gray-900">{metrics.apiResponseTime}ms</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-500">Memory Usage</div>
          <div className="text-2xl font-semibold text-gray-900">{metrics.memoryUsage}%</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-500">CPU Usage</div>
          <div className="text-2xl font-semibold text-gray-900">{metrics.cpuUsage}%</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-500">Error Rate</div>
          <div className="text-2xl font-semibold text-gray-900">{metrics.errorRate}%</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-500">Last Updated</div>
          <div className="text-2xl font-semibold text-gray-900">
            {metrics.lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-end space-x-2">
        {(['1h', '24h', '7d', '30d'] as const).map(range => (
          <button
            key={range}
            onClick={() => setSelectedTimeRange(range)}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              selectedTimeRange === range
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Metrics Visualization */}
      <div className="bg-white rounded-lg shadow p-4">
        <AgentMetrics module="performance" timeRange={selectedTimeRange} />
      </div>

      {/* Detailed Metrics */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Detailed Metrics</h3>
            <button
              onClick={monitorPerformance}
              disabled={isMonitoring}
              className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              {isMonitoring ? 'Monitoring...' : 'Refresh'}
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {detailedMetrics.map(metric => (
            <div key={metric.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        metric.status === 'critical'
                          ? 'bg-red-500'
                          : metric.status === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                    />
                    <h4 className="font-medium text-gray-900">{metric.name}</h4>
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-sm">
                    <span className="text-gray-900 font-medium">
                      {metric.value}
                      {metric.unit}
                    </span>
                    <span className="text-gray-500">Threshold: {metric.threshold}{metric.unit}</span>
                    <span
                      className={`px-2 py-1 rounded ${
                        metric.trend === 'up'
                          ? 'bg-red-100 text-red-700'
                          : metric.trend === 'down'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {metric.trend}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {metric.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 