import React, { useState } from 'react';
import { FiSend, FiClock, FiCalendar, FiCheck } from 'react-icons/fi';

interface Command {
  id: string;
  command: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

interface ScheduledJob {
  id: string;
  task: string;
  schedule: string;
  nextRun: string;
}

// Mock data - replace with API calls
const mockCommands: Command[] = [
  {
    id: '1',
    command: 'Check SQL level for user123',
    timestamp: '2024-03-15T10:30:00Z',
    status: 'completed',
  },
  {
    id: '2',
    command: 'Generate monthly report',
    timestamp: '2024-03-15T09:15:00Z',
    status: 'pending',
  },
];

const mockScheduledJobs: ScheduledJob[] = [
  {
    id: '1',
    task: 'Daily SQL check',
    schedule: 'Every day at 00:00',
    nextRun: '2024-03-16T00:00:00Z',
  },
  {
    id: '2',
    task: 'Weekly report generation',
    schedule: 'Every Monday at 08:00',
    nextRun: '2024-03-18T08:00:00Z',
  },
];

export default function EHBAIAgent() {
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setIsProcessing(true);
    try {
      // TODO: Implement API call to process command
      console.log('Processing command:', command);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCommand('');
    } catch (error) {
      console.error('Failed to process command:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Command Input */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Assistant</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={command}
              onChange={e => setCommand(e.target.value)}
              placeholder="Enter a command for the AI assistant..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isProcessing || !command.trim()}
              className="absolute right-2 top-2 p-2 text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              <FiSend className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Recent Commands */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Commands</h2>
          <span className="text-sm text-gray-500">Last 24 hours</span>
        </div>
        <div className="space-y-4">
          {mockCommands.map(cmd => (
            <div
              key={cmd.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    cmd.status === 'completed'
                      ? 'bg-green-500'
                      : cmd.status === 'pending'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                />
                <div>
                  <p className="font-medium text-gray-900">{cmd.command}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(cmd.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  cmd.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : cmd.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {cmd.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Jobs */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Scheduled Jobs</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700">Add New Job</button>
        </div>
        <div className="space-y-4">
          {mockScheduledJobs.map(job => (
            <div
              key={job.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FiCalendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{job.task}</p>
                  <p className="text-sm text-gray-500">{job.schedule}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Next Run:</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(job.nextRun).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
