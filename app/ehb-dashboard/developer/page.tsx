import React from 'react';
import { FiGitBranch, FiGitCommit, FiClock, FiAlertCircle } from 'react-icons/fi';

interface ModuleLog {
  module: string;
  status: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
}

interface Commit {
  hash: string;
  message: string;
  author: string;
  date: string;
  branch: string;
}

const mockModuleLogs: ModuleLog[] = [
  {
    module: 'AM',
    status: 'success',
    message: 'SQL level validation implemented',
    timestamp: '2024-03-20T10:30:00Z',
  },
  {
    module: 'GoSellr',
    status: 'warning',
    message: 'Payment gateway integration pending',
    timestamp: '2024-03-20T09:15:00Z',
  },
  {
    module: 'WMS',
    status: 'error',
    message: 'Doctor booking flow failed',
    timestamp: '2024-03-20T08:45:00Z',
  },
];

const mockCommits: Commit[] = [
  {
    hash: 'a1b2c3d',
    message: 'Add SQL level validation',
    author: 'John Doe',
    date: '2024-03-20T10:30:00Z',
    branch: 'main',
  },
  {
    hash: 'e4f5g6h',
    message: 'Update payment integration',
    author: 'Jane Smith',
    date: '2024-03-20T09:15:00Z',
    branch: 'feature/payments',
  },
];

const statusColors = {
  success: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-blue-100 text-blue-800',
};

const statusIcons = {
  success: <FiGitCommit className="w-5 h-5 text-green-500" />,
  error: <FiAlertCircle className="w-5 h-5 text-red-500" />,
  warning: <FiClock className="w-5 h-5 text-yellow-500" />,
  info: <FiGitBranch className="w-5 h-5 text-blue-500" />,
};

export default function DeveloperDashboard() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Developer Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Monitor module status, Git sync, and development progress.
        </p>
      </div>

      {/* Module Logs */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Module Logs</h2>
        <div className="space-y-4">
          {mockModuleLogs.map((log, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${statusColors[log.status]} flex items-start space-x-4`}
            >
              <div className="flex-shrink-0">{statusIcons[log.status]}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{log.module}</h3>
                  <span className="text-sm">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <p className="mt-1 text-sm">{log.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Git Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Git Status</h2>
        <div className="space-y-4">
          {mockCommits.map(commit => (
            <div key={commit.hash} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FiGitCommit className="w-5 h-5 text-gray-400" />
                  <span className="font-mono text-sm text-gray-600">{commit.hash}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(commit.date).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-gray-900">{commit.message}</p>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span>{commit.author}</span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <FiGitBranch className="w-4 h-4 mr-1" />
                  {commit.branch}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
