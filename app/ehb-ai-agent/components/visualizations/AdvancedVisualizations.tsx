import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis,
  Surface, Symbols, ComposedChart, Area, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, Sankey
} from 'recharts';
import { MetricsService } from '../../services/metricsService';
import { useAIAgent } from '../../context/AIAgentContext';

interface AdvancedVisualizationsProps {
  module: 'security' | 'performance' | 'system';
  timeRange: '1h' | '24h' | '7d' | '30d';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AdvancedVisualizations: React.FC<AdvancedVisualizationsProps> = ({ module, timeRange }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'sankey' | 'bubble' | 'scatter' | 'radar'>('sankey');
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
        } else if (module === 'performance') {
          setSelectedMetrics(['responseTime', 'requestsPerSecond', 'errorRate']);
        } else if (module === 'system') {
          setSelectedMetrics(['cpu.usage', 'memory.usage', 'network.bytesIn']);
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
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [module, timeRange, dispatch]);

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const renderSankeyDiagram = () => {
    const sankeyData = {
      nodes: [
        { name: 'Security' },
        { name: 'Performance' },
        { name: 'System' },
        { name: 'Alerts' },
        { name: 'Threats' },
        { name: 'Vulnerabilities' },
        { name: 'Response Time' },
        { name: 'CPU' },
        { name: 'Memory' },
        { name: 'Network' }
      ],
      links: [
        { source: 0, target: 4, value: 100 },
        { source: 0, target: 5, value: 50 },
        { source: 0, target: 6, value: 75 },
        { source: 1, target: 7, value: 80 },
        { source: 2, target: 8, value: 60 },
        { source: 2, target: 9, value: 40 },
        { source: 2, target: 10, value: 30 }
      ]
    };

    return (
      <ResponsiveContainer width="100%" height={400}>
        <Sankey
          data={sankeyData}
          node={{ fill: '#8884d8' }}
          link={{ fill: '#8884d8' }}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <Tooltip />
        </Sankey>
      </ResponsiveContainer>
    );
  };

  const renderBubbleChart = () => {
    const bubbleData = data.map(item => ({
      x: new Date(item.timestamp).getTime(),
      y: item[selectedMetrics[0]] || 0,
      z: item[selectedMetrics[1]] || 0,
      name: new Date(item.timestamp).toLocaleTimeString()
    }));

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis
            dataKey="x"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
          />
          <YAxis dataKey="y" />
          <ZAxis dataKey="z" range={[50, 400]} />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            formatter={(value, name) => [value, name]}
          />
          <Scatter
            name="Metrics"
            data={bubbleData}
            fill="#8884d8"
          >
            {bubbleData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    );
  };

  const renderScatterPlot = () => {
    const scatterData = data.map(item => ({
      x: new Date(item.timestamp).getTime(),
      y: item[selectedMetrics[0]] || 0,
      z: item[selectedMetrics[1]] || 0,
      name: new Date(item.timestamp).toLocaleTimeString()
    }));

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis
            dataKey="x"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
          />
          <YAxis dataKey="y" />
          <ZAxis dataKey="z" range={[50, 400]} />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            formatter={(value, name) => [value, name]}
          />
          <Scatter
            name="Metrics"
            data={scatterData}
            fill="#8884d8"
          >
            {scatterData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    );
  };

  const renderRadarChart = () => {
    const radarData = data[data.length - 1] || {};
    const radarMetrics = selectedMetrics.map(metric => ({
      subject: metric.split('.').pop() || metric,
      A: radarData[metric] || 0,
      fullMark: 100
    }));

    return (
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={radarMetrics}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Metrics"
            dataKey="A"
            stroke={COLORS[0]}
            fill={COLORS[0]}
            fillOpacity={0.6}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    );
  };

  const renderChart = () => {
    if (loading) {
      return <div className="flex items-center justify-center h-64">Loading metrics...</div>;
    }

    switch (chartType) {
      case 'sankey':
        return renderSankeyDiagram();
      case 'bubble':
        return renderBubbleChart();
      case 'scatter':
        return renderScatterPlot();
      case 'radar':
        return renderRadarChart();
      default:
        return null;
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
    : module === 'performance'
    ? [
        'responseTime',
        'requestsPerSecond',
        'errorRate',
        'systemMetrics.cpu.usage',
        'systemMetrics.memory.usage',
        'systemMetrics.network.bytesIn',
        'systemMetrics.network.bytesOut',
      ]
    : [
        'cpu.usage',
        'memory.usage',
        'network.bytesIn',
        'network.bytesOut',
        'network.connections',
      ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {['sankey', 'bubble', 'scatter', 'radar'].map((type) => (
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
                const stdDev = Math.sqrt(
                  values.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / values.length
                );
                return (
                  <div key={metric} className="space-y-1">
                    <div className="text-sm text-gray-600">{metric}</div>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div>Avg: {avg.toFixed(2)}</div>
                      <div>Max: {max.toFixed(2)}</div>
                      <div>Min: {min.toFixed(2)}</div>
                      <div>StdDev: {stdDev.toFixed(2)}</div>
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

export default AdvancedVisualizations; 