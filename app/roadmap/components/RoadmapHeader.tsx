import { CompanyInfo } from '../types';

interface RoadmapHeaderProps {
  companyInfo: CompanyInfo;
}

export default function RoadmapHeader({ companyInfo }: RoadmapHeaderProps) {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{companyInfo.name}</h1>
            <p className="mt-1 text-lg text-gray-600">{companyInfo.description}</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Founded: {companyInfo.founded}
              </div>
              <div className="text-sm text-gray-500">
                HQ: {companyInfo.headquarters}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Departments</h2>
            <div className="mt-2 space-y-2">
              {companyInfo.departments.map((dept) => (
                <div key={dept.id} className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-medium text-gray-900">{dept.name}</h3>
                  <p className="text-sm text-gray-600">{dept.description}</p>
                  <div className="mt-1 text-xs text-gray-500">
                    Head: {dept.head} • Team Size: {dept.teamSize}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">Tech Stack</h2>
            <div className="mt-2 space-y-2">
              {companyInfo.techStack.map((tech) => (
                <div key={tech.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{tech.name}</h3>
                      <p className="text-sm text-gray-600">{tech.description}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {tech.category}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Version: {tech.version}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 