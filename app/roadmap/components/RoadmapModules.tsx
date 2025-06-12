import { Module, RoadmapStatus } from '../types';

interface RoadmapModulesProps {
  modules: Module[];
  status: RoadmapStatus;
}

export default function RoadmapModules({ modules, status }: RoadmapModulesProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (module: Module) => {
    const totalItems = module.features.length + module.apiEndpoints.length + module.businessRules.length;
    const completedItems = [
      ...module.features,
      ...module.apiEndpoints,
      ...module.businessRules
    ].filter(item => item.status === 'completed').length;
    
    return Math.round((completedItems / totalItems) * 100);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Modules</h2>
      
      <div className="space-y-6">
        {modules.map((module) => (
          <div key={module.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{module.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{module.description}</p>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(module.status)}`}>
                {module.status}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{getProgressPercentage(module)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${getProgressPercentage(module)}%` }}
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Features</span>
                <div className="mt-1 font-medium text-gray-900">
                  {module.features.length}
                </div>
              </div>
              <div>
                <span className="text-gray-500">APIs</span>
                <div className="mt-1 font-medium text-gray-900">
                  {module.apiEndpoints.length}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Rules</span>
                <div className="mt-1 font-medium text-gray-900">
                  {module.businessRules.length}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="text-gray-500">
                {module.startDate} - {module.endDate}
              </div>
              <button className="text-blue-600 hover:text-blue-800">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 