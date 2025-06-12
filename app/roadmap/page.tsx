'use client';

import { useState } from 'react';
import RoadmapHeader from './components/RoadmapHeader';
import RoadmapTimeline from './components/RoadmapTimeline';
import RoadmapModules from './components/RoadmapModules';
import RoadmapSearch from './components/RoadmapSearch';
import SearchResults from './components/SearchResults';
import { initialRoadmapData } from './data/roadmapData';
import { RoadmapData } from './types';

export default function RoadmapPage() {
  const [roadmapData] = useState<RoadmapData>(initialRoadmapData);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoadmapHeader companyInfo={roadmapData.companyInfo} />
        
        <RoadmapSearch
          data={roadmapData}
          onSearchResults={setSearchResults}
        />

        {searchResults.length > 0 ? (
          <SearchResults results={searchResults} />
        ) : (
          <>
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Timeline</h2>
              <RoadmapTimeline
                events={roadmapData.timeline}
                status={roadmapData.status}
              />
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Modules</h2>
              <RoadmapModules
                modules={roadmapData.modules}
                status={roadmapData.status}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
} 