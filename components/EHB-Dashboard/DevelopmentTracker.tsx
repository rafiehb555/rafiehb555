import React from 'react';
import { FiCheck, FiClock, FiAlertCircle, FiPlus } from 'react-icons/fi';

type TaskStatus = 'completed' | 'in-progress' | 'planned';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  module: string;
  assignee: string;
  dueDate: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Implement GoSellr Product Management',
    description: 'Create product listing, editing, and management features',
    status: 'completed',
    module: 'GoSellr',
    assignee: 'John Doe',
    dueDate: '2024-03-15',
  },
  {
    id: '2',
    title: 'WMS Doctor Booking System',
    description: 'Develop appointment scheduling and management system',
    status: 'in-progress',
    module: 'WMS',
    assignee: 'Jane Smith',
    dueDate: '2024-03-30',
  },
  {
    id: '3',
    title: 'OLS Document Management',
    description: 'Create secure document upload and storage system',
    status: 'planned',
    module: 'OLS',
    assignee: 'Mike Johnson',
    dueDate: '2024-04-15',
  },
];

const statusIcons: Record<TaskStatus, React.ReactElement> = {
  completed: <FiCheck className="w-5 h-5 text-green-500" />,
  'in-progress': <FiClock className="w-5 h-5 text-yellow-500" />,
  planned: <FiAlertCircle className="w-5 h-5 text-blue-500" />,
};

const statusColors: Record<TaskStatus, string> = {
  completed: 'bg-green-100 text-green-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  planned: 'bg-blue-100 text-blue-800',
};

export default function DevelopmentTracker() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Development Tasks</h2>
        <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          <FiPlus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockTasks.map(task => (
          <div key={task.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Module: {task.module}</span>
                  <span>Assignee: {task.assignee}</span>
                  <span>Due: {task.dueDate}</span>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full ${statusColors[task.status]} flex items-center`}
              >
                {statusIcons[task.status]}
                <span className="ml-2 text-sm font-medium capitalize">{task.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
