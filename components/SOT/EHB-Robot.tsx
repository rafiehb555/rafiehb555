import React, { useState } from 'react';
import { FiPlay, FiPause, FiClock, FiCheck, FiAlertCircle } from 'react-icons/fi';

interface AutomationTask {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  lastRun: string;
  nextRun: string;
  type: 'sql' | 'wallet' | 'booking' | 'other';
}

// Mock data - replace with API calls
const mockTasks: AutomationTask[] = [
  {
    id: '1',
    name: 'SQL Level Check',
    description: 'Automatically checks and updates user SQL levels',
    status: 'active',
    lastRun: '2024-03-15T10:00:00Z',
    nextRun: '2024-03-16T10:00:00Z',
    type: 'sql',
  },
  {
    id: '2',
    name: 'Wallet Fine Check',
    description: 'Checks for overdue payments and applies fines',
    status: 'active',
    lastRun: '2024-03-15T00:00:00Z',
    nextRun: '2024-03-16T00:00:00Z',
    type: 'wallet',
  },
  {
    id: '3',
    name: 'Booking Expiry',
    description: 'Handles expired bookings and notifications',
    status: 'inactive',
    lastRun: '2024-03-14T15:00:00Z',
    nextRun: '2024-03-15T15:00:00Z',
    type: 'booking',
  },
];

const typeIcons: Record<AutomationTask['type'], React.ReactNode> = {
  sql: <FiCheck className="w-5 h-5 text-blue-500" />,
  wallet: <FiAlertCircle className="w-5 h-5 text-green-500" />,
  booking: <FiClock className="w-5 h-5 text-purple-500" />,
  other: <FiClock className="w-5 h-5 text-gray-500" />,
};

export default function EHBRobot() {
  const [tasks, setTasks] = useState<AutomationTask[]>(mockTasks);
  const [isTriggering, setIsTriggering] = useState<string | null>(null);

  const handleStatusToggle = async (taskId: string) => {
    try {
      // TODO: Implement API call to toggle task status
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId
            ? {
                ...task,
                status: task.status === 'active' ? 'inactive' : 'active',
              }
            : task
        )
      );
    } catch (error) {
      console.error('Failed to toggle task status:', error);
    }
  };

  const handleTriggerNow = async (taskId: string) => {
    setIsTriggering(taskId);
    try {
      // TODO: Implement API call to trigger task
      console.log(`Triggering task ${taskId}`);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update last run time
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId
            ? {
                ...task,
                lastRun: new Date().toISOString(),
              }
            : task
        )
      );
    } catch (error) {
      console.error('Failed to trigger task:', error);
    } finally {
      setIsTriggering(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900">Automation Robot</h2>
        <p className="text-gray-600 mt-2">
          Manage automated tasks for SQL checks, wallet fines, and booking management.
        </p>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="mt-1">{typeIcons[task.type]}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{task.name}</h3>
                  <p className="text-gray-600 mt-1">{task.description}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div>
                      <p className="text-sm text-gray-500">Last Run</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(task.lastRun).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Next Run</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(task.nextRun).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleTriggerNow(task.id)}
                  disabled={isTriggering === task.id}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isTriggering === task.id ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Running...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <FiPlay className="w-4 h-4 mr-2" />
                      Trigger Now
                    </div>
                  )}
                </button>
                <button
                  onClick={() => handleStatusToggle(task.id)}
                  className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                    task.status === 'active'
                      ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                      : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                  }`}
                >
                  {task.status === 'active' ? (
                    <div className="flex items-center">
                      <FiPause className="w-4 h-4 mr-2" />
                      Pause
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <FiPlay className="w-4 h-4 mr-2" />
                      Activate
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div>
                <p className="font-medium text-gray-900">SQL Automation</p>
                <p className="text-sm text-gray-500">Running normally</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div>
                <p className="font-medium text-gray-900">Wallet Automation</p>
                <p className="text-sm text-gray-500">Running normally</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div>
                <p className="font-medium text-gray-900">Booking Automation</p>
                <p className="text-sm text-gray-500">Paused</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
