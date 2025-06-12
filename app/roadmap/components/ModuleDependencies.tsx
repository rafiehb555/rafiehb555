import React from 'react';
import { Module } from '../types';

interface ModuleDependenciesProps {
  module: Module;
  allModules: Module[];
}

export const ModuleDependencies: React.FC<ModuleDependenciesProps> = ({ module, allModules }) => {
  const getDependentModules = (moduleId: string) => {
    return allModules.filter(m => m.dependencies.includes(moduleId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'planned':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const dependencies = module.dependencies.map(depId => 
    allModules.find(m => m.id === depId)
  ).filter(Boolean) as Module[];

  const dependents = getDependentModules(module.id);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Module Dependencies</h3>
      
      {/* Dependencies */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Depends On</h4>
        {dependencies.length > 0 ? (
          <div className="space-y-3">
            {dependencies.map(dep => (
              <div key={dep.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium">{dep.name}</h5>
                  <p className="text-sm text-gray-600">{dep.description}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dep.status)}`}>
                    {dep.status}
                  </span>
                  <div className="w-24">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(dep.progress)}`}
                        style={{ width: `${dep.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">{dep.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No dependencies</p>
        )}
      </div>

      {/* Dependents */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Required By</h4>
        {dependents.length > 0 ? (
          <div className="space-y-3">
            {dependents.map(dep => (
              <div key={dep.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium">{dep.name}</h5>
                  <p className="text-sm text-gray-600">{dep.description}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dep.status)}`}>
                    {dep.status}
                  </span>
                  <div className="w-24">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(dep.progress)}`}
                        style={{ width: `${dep.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">{dep.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No dependents</p>
        )}
      </div>

      {/* Progress Summary */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Progress Summary</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{module.progress}%</div>
            <div className="text-sm text-gray-600">Overall Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{dependencies.length}</div>
            <div className="text-sm text-gray-600">Dependencies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{dependents.length}</div>
            <div className="text-sm text-gray-600">Dependents</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 