import React from 'react';
import { useAIAgent } from '../context/AIAgentContext';

interface AgentLog {
  id: string;
  timestamp: Date;
  type: 'info' | 'warning' | 'error' | 'success';
  agent: string;
  message: string;
  module?: string;
  details?: {
    file?: string;
    line?: number;
    code?: string;
    suggestion?: string;
  };
}

export function AgentLogPanel() {
  const { state } = useAIAgent();
  const [logs, setLogs] = React.useState<AgentLog[]>([]);
  const [filter, setFilter] = React.useState<'all' | 'error' | 'warning' | 'success'>('all');

  // Filter logs based on selected type
  const filteredLogs = logs.filter(log => 
    filter === 'all' ? true : log.type === filter
  );

  // Get status color based on log type
  const getStatusColor = (type: AgentLog['type']) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Get status icon based on log type
  const getStatusIcon = (type: AgentLog['type']) => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Agent Logs</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-1 text-xs rounded ${
              filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('error')}
            className={`px-2 py-1 text-xs rounded ${
              filter === 'error' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Errors
          </button>
          <button
            onClick={() => setFilter('warning')}
            className={`px-2 py-1 text-xs rounded ${
              filter === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Warnings
          </button>
          <button
            onClick={() => setFilter('success')}
            className={`px-2 py-1 text-xs rounded ${
              filter === 'success' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Success
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto">
        {filteredLogs.map(log => (
          <div
            key={log.id}
            className={`p-3 rounded-lg border ${getStatusColor(log.type)}`}
          >
            <div className="flex items-start space-x-2">
              <span className="text-lg">{getStatusIcon(log.type)}</span>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{log.agent}</span>
                    {log.module && (
                      <span className="text-sm ml-2 opacity-75">
                        [{log.module}]
                      </span>
                    )}
                  </div>
                  <span className="text-xs opacity-75">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm mt-1">{log.message}</p>
                {log.details && (
                  <div className="mt-2 text-xs bg-white bg-opacity-50 p-2 rounded">
                    {log.details.file && (
                      <p className="font-mono">
                        File: {log.details.file}
                        {log.details.line && `:${log.details.line}`}
                      </p>
                    )}
                    {log.details.code && (
                      <pre className="mt-1 font-mono bg-gray-50 p-1 rounded">
                        {log.details.code}
                      </pre>
                    )}
                    {log.details.suggestion && (
                      <p className="mt-1 text-blue-600">
                        Suggestion: {log.details.suggestion}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 