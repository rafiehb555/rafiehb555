import React from 'react';
import { FiCheckCircle, FiClock, FiAlertCircle, FiExternalLink } from 'react-icons/fi';

interface Module {
  id: string;
  name: string;
  description: string;
  status: 'complete' | 'in-progress' | 'missing';
  progress: number;
  lastUpdated: string;
  category: string;
  dependencies: string[];
  url?: string;
}

interface ModuleCardGridProps {
  modules: Module[];
  onModuleClick: (moduleId: string) => void;
}

export default function ModuleCardGrid({ modules, onModuleClick }: ModuleCardGridProps) {
  const getStatusIcon = (status: Module['status']) => {
    switch (status) {
      case 'complete':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <FiClock className="w-5 h-5 text-yellow-500" />;
      case 'missing':
        return <FiAlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: Module['status']) => {
    switch (status) {
      case 'complete':
        return 'bg-green-50 text-green-700';
      case 'in-progress':
        return 'bg-yellow-50 text-yellow-700';
      case 'missing':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map(module => (
        <div
          key={module.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{module.name}</h3>
                <p className="text-sm text-gray-600">{module.description}</p>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(module.status)}`}
              >
                {getStatusIcon(module.status)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{module.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getProgressColor(module.progress)}`}
                  style={{ width: `${module.progress}%` }}
                />
              </div>
            </div>

            {/* Dependencies */}
            {module.dependencies.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Dependencies</h4>
                <div className="flex flex-wrap gap-2">
                  {module.dependencies.map(dep => (
                    <span
                      key={dep}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500">
                Last updated: {new Date(module.lastUpdated).toLocaleDateString()}
              </span>
              <div className="flex gap-2">
                {module.url && (
                  <a
                    href={module.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiExternalLink className="w-5 h-5" />
                  </a>
                )}
                <button
                  onClick={() => onModuleClick(module.id)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
