import React, { useState, useEffect } from 'react';
import { FiDownload, FiFileText, FiUser, FiTag } from 'react-icons/fi';

interface StudyResource {
  id: string;
  title: string;
  type: string;
  provider: string;
  sqlLevel: string;
  downloadUrl: string;
  tags: string[];
}

export default function OBSStudyPool() {
  const [resources, setResources] = useState<StudyResource[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const resourceTypes = ['all', 'exercises', 'guides', 'notes', 'practice-tests'];
  const sqlLevels = ['all', 'beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    // TODO: Implement API call to fetch study resources
    const fetchResources = async () => {
      try {
        // Simulated API call
        const response = await fetch('/api/obs/study-pool');
        const data = await response.json();
        setResources(data);
      } catch (error) {
        console.error('Error fetching study resources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filteredResources = resources.filter(resource => {
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesLevel = selectedLevel === 'all' || resource.sqlLevel === selectedLevel;
    return matchesType && matchesLevel;
  });

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Study Pool</h2>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type</label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            >
              {resourceTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">SQL Level</label>
            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            >
              {sqlLevels.map(level => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resources List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResources.map(resource => (
            <div
              key={resource.id}
              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <FiFileText className="h-5 w-5 text-indigo-500" />
                    <h3 className="text-lg font-medium text-gray-900">{resource.title}</h3>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <FiUser className="h-4 w-4 mr-1" />
                    <span>{resource.provider}</span>
                    <span className="mx-2">•</span>
                    <FiTag className="h-4 w-4 mr-1" />
                    <span className="capitalize">{resource.type.replace('-', ' ')}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {resource.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href={resource.downloadUrl}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiDownload className="h-4 w-4 mr-1" />
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredResources.length === 0 && (
        <div className="text-center py-12">
          <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No resources found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}
