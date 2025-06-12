import React from 'react';
import { FiSearch, FiFilter, FiDownload } from 'react-icons/fi';

interface DevelopmentStatus {
  totalModules: number;
  completedModules: number;
  inProgressModules: number;
  missingModules: number;
  overallProgress: number;
}

interface OverviewHeaderProps {
  viewMode: 'admin' | 'public';
  onViewModeChange: (mode: 'admin' | 'public') => void;
  developmentStatus: DevelopmentStatus;
}

export default function OverviewHeader({
  viewMode,
  onViewModeChange,
  developmentStatus,
}: OverviewHeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Title and View Mode Toggle */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">EHB Development Dashboard</h1>
          <p className="text-gray-600 mt-1">AI-Powered Project Overview & Management</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onViewModeChange(viewMode === 'admin' ? 'public' : 'admin')}
            className={`px-4 py-2 rounded-md ${
              viewMode === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {viewMode === 'admin' ? 'Admin View' : 'Public View'}
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <FiDownload className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search modules, components, or files..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <button className="p-2 text-gray-600 hover:text-gray-900">
          <FiFilter className="w-5 h-5" />
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-blue-800">Total Modules</div>
          <div className="text-2xl font-bold text-blue-900">{developmentStatus.totalModules}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-green-800">Completed</div>
          <div className="text-2xl font-bold text-green-900">
            {developmentStatus.completedModules}
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-yellow-800">In Progress</div>
          <div className="text-2xl font-bold text-yellow-900">
            {developmentStatus.inProgressModules}
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-red-800">Missing</div>
          <div className="text-2xl font-bold text-red-900">{developmentStatus.missingModules}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-purple-800">Overall Progress</div>
          <div className="text-2xl font-bold text-purple-900">
            {developmentStatus.overallProgress}%
          </div>
        </div>
      </div>
    </div>
  );
}
