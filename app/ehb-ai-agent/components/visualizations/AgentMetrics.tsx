import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  PieLabelRenderProps,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { MetricsService } from '../../services/metricsService';
import { useAIAgent } from '../../context/AIAgentContext';

interface AgentMetricsProps {
  module: 'security' | 'performance';
  timeRange: '1h' | '24h' | '7d' | '30d';
}

interface MetricData {
  timestamp: Date;
  [key: string]: any;
}

interface PieData {
  name: string;
  value: number;
  color?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AgentMetrics: React.FC<AgentMetricsProps> = ({ module, timeRange }) => {
  const [data, setData] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'area' | 'radar' | 'scatter'>('line');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const { dispatch } = useAIAgent();
  const metricsService = MetricsService.getInstance();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const history = metricsService.getMetricsHistory(module, timeRange);
        setData(history);
        
        // Set default selected metrics based on module
        if (module === 'security') {
          setSelectedMetrics(['alerts.total', 'threats.active', 'vulnerabilities.total']);
        } else {
          setSelectedMetrics(['responseTime', 'requestsPerSecond', 'errorRate']);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            id: Date.now().toString(),
            type: 'log',
            role: 'system',
            content: `Error fetching ${module} metrics: ${error}`,
            timestamp: new Date(),
            severity: 'error',
            metadata: { module, timeRange }
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [module, timeRange, dispatch]);

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

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
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

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
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

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
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

      case 'radar':
        const radarData = data[data.length - 1] || {};
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={[radarData]}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar
                name="Metrics"
                dataKey="value"
                stroke={COLORS[0]}
                fill={COLORS[0]}
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <ZAxis dataKey="value" />
              <Tooltip />
              <Legend />
              {selectedMetrics.map((metric, index) => (
                <Scatter
                  key={metric}
                  name={metric}
                  data={data.map(d => ({
                    timestamp: new Date(d.timestamp).getTime(),
                    value: d[metric],
                    name: metric
                  }))}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'pie':
        const pieData = getPieChartData();
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({ name, percent }: { name: string; percent: number }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getPieChartData = (): PieData[] => {
    if (!data.length) return [];
    const latestData = data[data.length - 1];
    
    if (module === 'security') {
      return [
        { name: 'Critical Alerts', value: latestData.alerts?.critical || 0, color: '#FF0000' },
        { name: 'High Alerts', value: latestData.alerts?.high || 0, color: '#FFA500' },
        { name: 'Medium Alerts', value: latestData.alerts?.medium || 0, color: '#FFFF00' },
        { name: 'Low Alerts', value: latestData.alerts?.low || 0, color: '#00FF00' },
      ];
    } else {
      return [
        { name: 'Response Time', value: latestData.responseTime || 0, color: '#0088FE' },
        { name: 'Requests/sec', value: latestData.requestsPerSecond || 0, color: '#00C49F' },
        { name: 'Error Rate', value: latestData.errorRate || 0, color: '#FFBB28' },
      ];
    }
  };

  const availableMetrics = module === 'security'
    ? [
        'alerts.total',
        'alerts.critical',
        'alerts.high',
        'alerts.medium',
        'alerts.low',
        'threats.active',
        'threats.blocked',
        'threats.suspicious',
        'vulnerabilities.total',
        'vulnerabilities.critical',
        'vulnerabilities.high',
        'vulnerabilities.medium',
        'vulnerabilities.low',
      ]
    : [
        'responseTime',
        'requestsPerSecond',
        'errorRate',
        'systemMetrics.cpu.usage',
        'systemMetrics.memory.usage',
        'systemMetrics.network.bytesIn',
        'systemMetrics.network.bytesOut',
      ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {['line', 'bar', 'pie', 'area', 'radar', 'scatter'].map((type) => (
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

      <div className="bg-white rounded-lg shadow p-4">
        {renderChart()}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Latest Metrics</h3>
          {data.length > 0 && (
            <div className="space-y-2">
              {selectedMetrics.map((metric) => (
                <div key={metric} className="flex justify-between">
                  <span className="text-gray-600">{metric}</span>
                  <span className="font-medium">
                    {data[data.length - 1][metric]?.toFixed(2) || 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Statistics</h3>
          {data.length > 0 && (
            <div className="space-y-2">
              {selectedMetrics.map((metric) => {
                const values = data.map(d => d[metric]).filter(v => v !== undefined);
                const avg = values.reduce((a, b) => a + b, 0) / values.length;
                const max = Math.max(...values);
                const min = Math.min(...values);
                return (
                  <div key={metric} className="space-y-1">
                    <div className="text-sm text-gray-600">{metric}</div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>Avg: {avg.toFixed(2)}</div>
                      <div>Max: {max.toFixed(2)}</div>
                      <div>Min: {min.toFixed(2)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentMetrics; 