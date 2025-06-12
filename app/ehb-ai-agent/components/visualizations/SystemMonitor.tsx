import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { MetricsService } from '../../services/metricsService';
import { useAIAgent } from '../../context/AIAgentContext';

interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    load: number[];
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    connections: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const SystemMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['cpu.usage', 'memory.usage']);
  const { dispatch } = useAIAgent();
  const metricsService = MetricsService.getInstance();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const systemMetrics = await metricsService.collectSystemMetrics();
        setMetrics(systemMetrics);
        setHistory(prev => [...prev, { timestamp: new Date(), ...systemMetrics }].slice(-100));
      } catch (error) {
        console.error('Error fetching system metrics:', error);
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            id: Date.now().toString(),
            type: 'log',
            role: 'system',
            content: `Error fetching system metrics: ${error}`,
            timestamp: new Date(),
            severity: 'error',
            metadata: { component: 'SystemMonitor' }
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 1000); // Update every second

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const renderChart = () => {
    if (loading) {
      return <div className="flex items-center justify-center h-64">Loading metrics...</div>;
    }

    const chartProps = {
      data: history,
      margin: { top: 10, right: 30, left: 0, bottom: 0 }
    };

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value: number) => [value.toFixed(2), '']}
              />
              <Legend />
              {selectedMetrics.map((metric, index) => (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  stroke={COLORS[index % COLORS.length]}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value: number) => [value.toFixed(2), '']}
              />
              <Legend />
              {selectedMetrics.map((metric, index) => (
                <Area
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  fill={COLORS[index % COLORS.length]}
                  stroke={COLORS[index % COLORS.length]}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value: number) => [value.toFixed(2), '']}
              />
              <Legend />
              {selectedMetrics.map((metric, index) => (
                <Bar
                  key={metric}
                  dataKey={metric}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const renderResourceUsage = () => {
    if (!metrics) return null;

    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">CPU Usage</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Overall Usage</span>
              <span className="font-medium">{metrics.cpu.usage.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Cores</span>
              <span className="font-medium">{metrics.cpu.cores}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${metrics.cpu.usage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Memory Usage</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Used</span>
              <span className="font-medium">
                {(metrics.memory.used / (1024 * 1024 * 1024)).toFixed(1)} GB
              </span>
            </div>
            <div className="flex justify-between">
              <span>Free</span>
              <span className="font-medium">
                {(metrics.memory.free / (1024 * 1024 * 1024)).toFixed(1)} GB
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${metrics.memory.usage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Network</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Bytes In</span>
              <span className="font-medium">
                {(metrics.network.bytesIn / (1024 * 1024)).toFixed(1)} MB
              </span>
            </div>
            <div className="flex justify-between">
              <span>Bytes Out</span>
              <span className="font-medium">
                {(metrics.network.bytesOut / (1024 * 1024)).toFixed(1)} MB
              </span>
            </div>
            <div className="flex justify-between">
              <span>Connections</span>
              <span className="font-medium">{metrics.network.connections}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const availableMetrics = [
    'cpu.usage',
    'memory.usage',
    'network.bytesIn',
    'network.bytesOut',
    'network.connections'
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {['line', 'area', 'bar'].map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type as any)}
              className={`px-3 py-1 rounded ${
                chartType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex space-x-2">
          {availableMetrics.map((metric) => (
            <button
              key={metric}
              onClick={() => handleMetricToggle(metric)}
              className={`px-3 py-1 rounded ${
                selectedMetrics.includes(metric)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {metric.split('.').pop()}
            </button>
          ))}
        </div>
      </div>

      {renderResourceUsage()}

      <div className="bg-white rounded-lg shadow p-4">
        {renderChart()}
      </div>
    </div>
  );
};

export default SystemMonitor; 