import React from 'react';
import OverviewHeader from './OverviewHeader';
import ModuleCardGrid from './ModuleCardGrid';
import RoadmapCard from './RoadmapCard';
import StatusTracker from './StatusTracker';
import AIAnalysisPanel from './AIAnalysisPanel';
import ReportGenerator from './ReportGenerator';
import Legend from './Legend';

interface ModuleStatus {
  name: string;
  status: 'complete' | 'in-progress' | 'missing';
  progress: number;
  missingFiles: string[];
  lastUpdated: string;
}

interface DevelopmentStatus {
  totalModules: number;
  completedModules: number;
  inProgressModules: number;
  missingModules: number;
  overallProgress: number;
}

export default function DevelopmentPage() {
  const [viewMode, setViewMode] = React.useState<'admin' | 'public'>('admin');
  const [selectedModule, setSelectedModule] = React.useState<string | null>(null);
  const [showMissingDialog, setShowMissingDialog] = React.useState(false);
  const [developmentStatus, setDevelopmentStatus] = React.useState<DevelopmentStatus>({
    totalModules: 20,
    completedModules: 8,
    inProgressModules: 7,
    missingModules: 5,
    overallProgress: 40,
  });

  // Mock data for modules
  const modules: ModuleStatus[] = [
    {
      name: 'PSS',
      status: 'complete',
      progress: 100,
      missingFiles: [],
      lastUpdated: '2024-03-20',
    },
    {
      name: 'EDR',
      status: 'in-progress',
      progress: 75,
      missingFiles: ['ExamResult.ts'],
      lastUpdated: '2024-03-19',
    },
    {
      name: 'EMO',
      status: 'in-progress',
      progress: 60,
      missingFiles: ['BusinessDashboard.tsx'],
      lastUpdated: '2024-03-18',
    },
    // Add more modules...
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <OverviewHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          developmentStatus={developmentStatus}
        />

        {/* Main Content Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Module Grid */}
          <div className="lg:col-span-2 space-y-8">
            <ModuleCardGrid
              modules={modules}
              onModuleSelect={setSelectedModule}
              viewMode={viewMode}
            />
            <RoadmapCard />
          </div>

          {/* Right Column - Status & Analysis */}
          <div className="space-y-8">
            <StatusTracker status={developmentStatus} />
            <AIAnalysisPanel modules={modules} onAddMissing={() => setShowMissingDialog(true)} />
            <ReportGenerator />
            <Legend />
          </div>
        </div>

        {/* Missing Module Dialog */}
        {showMissingDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Add Missing Module</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Module Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter module name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Module Type</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option>Service</option>
                    <option>Component</option>
                    <option>API</option>
                    <option>Model</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowMissingDialog(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
