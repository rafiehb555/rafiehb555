import React from 'react';
import { FiCheck, FiClock, FiAlertCircle, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  category?: string;
}

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (id: string) => void;
  onTaskStatusChange: (id: string, status: Task['status']) => void;
}

export default function TaskList({ tasks, onTaskComplete, onTaskStatusChange }: TaskListProps) {
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <FiCheck className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <FiClock className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <FiAlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
        <button
          onClick={() => {
            /* Handle new task */
          }}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          New Task
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start space-x-3">
              <button
                onClick={() => onTaskComplete(task.id)}
                className={`flex-shrink-0 mt-1 p-1 rounded-full ${
                  task.status === 'completed'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
                }`}
              >
                <FiCheck className="w-5 h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-sm font-medium ${
                      task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {task.category && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                        {task.category}
                      </span>
                    )}
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
                {task.description && (
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                )}
                {task.dueDate && (
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <FiClock className="w-4 h-4 mr-1" />
                    Due: {task.dueDate}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <FiCheck className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="mt-4 text-gray-500">No tasks</p>
        </div>
      )}
    </div>
  );
}
