import React from 'react';
import { FiActivity } from 'react-icons/fi';

interface AgentActivityIndicatorProps {
  currentFile: string;
  isActive: boolean;
}

export default function AgentActivityIndicator({
  currentFile,
  isActive,
}: AgentActivityIndicatorProps) {
  if (!isActive) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-center space-x-2">
        <div className="animate-pulse">
          <FiActivity className="h-5 w-5 text-indigo-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Agent Active</p>
          <p className="text-xs text-gray-500 truncate max-w-xs">Working on: {currentFile}</p>
        </div>
      </div>
    </div>
  );
}
