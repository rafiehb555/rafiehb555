import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

interface ModuleStatus {
  name: string;
  status: 'complete' | 'in-progress' | 'missing';
  progress: number;
  missingFiles: string[];
  lastUpdated: string;
}

interface AIAnalysisPanelProps {
  modules: ModuleStatus[];
  onAddMissing: () => void;
}

interface AnalysisAlert {
  type: 'error' | 'warning' | 'info';
  message: string;
  module: string;
  priority: 'high' | 'medium' | 'low';
}

export default function AIAnalysisPanel({ modules, onAddMissing }: AIAnalysisPanelProps) {
  const [alerts, setAlerts] = React.useState<AnalysisAlert[]>([]);

  React.useEffect(() => {
    // Generate alerts based on module status
    const newAlerts: AnalysisAlert[] = [];

    modules.forEach(module => {
      // Check for missing files
      if (module.missingFiles.length > 0) {
        newAlerts.push({
          type: 'error',
          message: `Missing ${module.missingFiles.length} file(s)`,
          module: module.name,
          priority: 'high',
        });
      }

      // Check for low progress
      if (module.progress < 30 && module.status === 'in-progress') {
        newAlerts.push({
          type: 'warning',
          message: 'Low progress rate detected',
          module: module.name,
          priority: 'medium',
        });
      }

      // Check for outdated modules
      const lastUpdated = new Date(module.lastUpdated);
      const now = new Date();
      const daysSinceUpdate = Math.floor(
        (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceUpdate > 7) {
        newAlerts.push({
          type: 'warning',
          message: `No updates in ${daysSinceUpdate} days`,
          module: module.name,
          priority: 'medium',
        });
      }
    });

    setAlerts(newAlerts);
  }, [modules]);

  const getAlertIcon = (type: AnalysisAlert['type']) => {
    switch (type) {
      case 'error':
        return <FiAlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <FiAlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <FiInfo className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getAlertColor = (type: AnalysisAlert['type']) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">AI Analysis</h2>
        <button onClick={onAddMissing} className="text-sm text-blue-600 hover:text-blue-800">
          Add Missing
        </button>
      </div>

      {alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{alert.module}</div>
                  <div className="text-sm text-gray-600">{alert.message}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FiCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">No issues detected</p>
        </div>
      )}

      {/* AI Suggestions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">AI Suggestions</h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <FiInfo className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
            <span className="text-sm text-gray-600">
              Consider implementing automated testing for completed modules
            </span>
          </li>
          <li className="flex items-start">
            <FiInfo className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
            <span className="text-sm text-gray-600">
              Update documentation for recently completed features
            </span>
          </li>
          <li className="flex items-start">
            <FiInfo className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
            <span className="text-sm text-gray-600">
              Review security measures for payment-related modules
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
