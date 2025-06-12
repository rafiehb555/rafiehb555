import React from 'react';
import { FiCheck, FiClock, FiAlertCircle, FiXCircle } from 'react-icons/fi';
import { roadmapData } from '@/app/roadmap/data/roadmapData';
import { Module } from '@/app/roadmap/types';

const statusIcons: Record<Module['status'], React.ReactElement> = {
  completed: <FiCheck className="w-5 h-5 text-green-500" />, // ✅
  'in-progress': <FiClock className="w-5 h-5 text-yellow-500" />, // 🟡
  planned: <FiAlertCircle className="w-5 h-5 text-blue-500" />, // ℹ️
  error: <FiXCircle className="w-5 h-5 text-red-500" />, // ❌
};

const statusColors: Record<Module['status'], string> = {
  completed: 'bg-green-100 text-green-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  planned: 'bg-blue-100 text-blue-800',
  error: 'bg-red-100 text-red-800',
};

export default function RoadmapPage() {
  const modules = roadmapData.modules;
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">EHB Development Roadmap</h1>
        <p className="text-gray-600 mt-2">
          Track the progress of our platform's development and upcoming features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map(module => (
          <div key={module.name} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{module.name}</h2>
                <p className="text-gray-600">{module.description}</p>
              </div>
              <div
                className={`px-3 py-1 rounded-full ${statusColors[module.status]} flex items-center`}
              >
                {statusIcons[module.status]}
                <span className="ml-2 text-sm font-medium capitalize">{module.status}</span>
                {module.status === 'completed' && <span className="ml-2">✅</span>}
                {module.status === 'in-progress' && <span className="ml-2">🟡</span>}
                {module.status === 'error' && <span className="ml-2">❌</span>}
              </div>
            </div>
            {module.status === 'error' && module.error && (
              <div className="mb-2 text-red-600 text-sm flex items-center">
                <FiXCircle className="mr-1" /> {module.error}
              </div>
            )}
            <div className="space-y-3">
              {module.features.map((feature, index) => (
                <div key={index} className="flex items-center text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3" />
                  {typeof feature === 'string' ? feature : feature.name}
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500">Progress: {module.progress}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

