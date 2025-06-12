import React from 'react';
import { useAIAgent } from '../../context/AIAgentContext';
import { AgentMetrics } from '../visualizations/AgentMetrics';

interface SecurityAlert {
  id: string;
  type: 'vulnerability' | 'threat' | 'compliance' | 'access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  status: 'open' | 'investigating' | 'resolved';
  affectedComponent: string;
  recommendation: string;
}

interface SecurityMetrics {
  totalAlerts: number;
  openAlerts: number;
  criticalAlerts: number;
  lastScan: Date;
  complianceScore: number;
}

export function SecurityAgent() {
  const { dispatch } = useAIAgent();
  const [alerts, setAlerts] = React.useState<SecurityAlert[]>([]);
  const [metrics, setMetrics] = React.useState<SecurityMetrics>({
    totalAlerts: 0,
    openAlerts: 0,
    criticalAlerts: 0,
    lastScan: new Date(),
    complianceScore: 0,
  });
  const [isScanning, setIsScanning] = React.useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = React.useState<'1h' | '24h' | '7d' | '30d'>('24h');

  const scanSecurity = async () => {
    setIsScanning(true);
    try {
      // Simulate security scanning
      const mockAlerts: SecurityAlert[] = [
        {
          id: '1',
          type: 'vulnerability',
          severity: 'high',
          title: 'Outdated Dependencies',
          description: 'Multiple packages have known security vulnerabilities',
          timestamp: new Date(),
          status: 'open',
          affectedComponent: 'package.json',
          recommendation: 'Update dependencies to latest secure versions',
        },
        {
          id: '2',
          type: 'threat',
          severity: 'critical',
          title: 'Suspicious API Access',
          description: 'Multiple failed login attempts detected',
          timestamp: new Date(),
          status: 'investigating',
          affectedComponent: 'api/auth',
          recommendation: 'Implement rate limiting and IP blocking',
        },
        {
          id: '3',
          type: 'compliance',
          severity: 'medium',
          title: 'Missing Security Headers',
          description: 'Required security headers not set',
          timestamp: new Date(),
          status: 'open',
          affectedComponent: 'app/middleware.ts',
          recommendation: 'Add security headers to middleware',
        },
      ];

      setAlerts(mockAlerts);

      // Calculate metrics
      const newMetrics: SecurityMetrics = {
        totalAlerts: mockAlerts.length,
        openAlerts: mockAlerts.filter(a => a.status === 'open').length,
        criticalAlerts: mockAlerts.filter(a => a.severity === 'critical').length,
        lastScan: new Date(),
        complianceScore: 85,
      };

      setMetrics(newMetrics);

      // Log findings
      mockAlerts.forEach(alert => {
        if (alert.severity === 'critical') {
          dispatch({
            type: 'ADD_MESSAGE',
            payload: {
              id: Date.now().toString(),
              role: 'system',
              content: `Critical Security Alert: ${alert.title}`,
              timestamp: new Date(),
              severity: 'error',
              type: 'alert',
              metadata: {
                source: 'SecurityAgent',
                alertId: alert.id,
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
          content: `Security scan complete. Found ${newMetrics.totalAlerts} alerts.`,
          timestamp: new Date(),
          severity: 'info',
          type: 'log',
          metadata: {
            source: 'SecurityAgent',
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
          content: `Error during security scan: ${error}`,
          timestamp: new Date(),
          severity: 'error',
          type: 'alert',
          metadata: {
            source: 'SecurityAgent',
          },
        },
      });
    } finally {
      setIsScanning(false);
    }
  };

  React.useEffect(() => {
    scanSecurity();
  }, []);

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-5 gap-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Alerts</div>
          <div className="text-2xl font-semibold text-gray-900">{metrics.totalAlerts}</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-500">Open Alerts</div>
          <div className="text-2xl font-semibold text-red-600">{metrics.openAlerts}</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-500">Critical Alerts</div>
          <div className="text-2xl font-semibold text-red-700">{metrics.criticalAlerts}</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-500">Compliance Score</div>
          <div className="text-2xl font-semibold text-green-600">{metrics.complianceScore}%</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-500">Last Scan</div>
          <div className="text-2xl font-semibold text-gray-900">
            {metrics.lastScan.toLocaleTimeString()}
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
        <AgentMetrics module="security" timeRange={selectedTimeRange} />
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Security Alerts</h3>
            <button
              onClick={scanSecurity}
              disabled={isScanning}
              className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              {isScanning ? 'Scanning...' : 'Scan Now'}
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {alerts.map(alert => (
            <div key={alert.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        alert.severity === 'critical'
                          ? 'bg-red-500'
                          : alert.severity === 'high'
                          ? 'bg-orange-500'
                          : alert.severity === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <h4 className="font-medium text-gray-900">{alert.title}</h4>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{alert.description}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm">
                    <span className="text-gray-500">Type: {alert.type}</span>
                    <span className="text-gray-500">Component: {alert.affectedComponent}</span>
                    <span
                      className={`px-2 py-1 rounded ${
                        alert.status === 'open'
                          ? 'bg-red-100 text-red-700'
                          : alert.status === 'investigating'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {alert.timestamp.toLocaleTimeString()}
                </div>
              </div>
              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Recommendation:</span> {alert.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 