import React, { useState } from 'react';
import { ServiceCategory, FranchiseType } from '../FranchiseUtils/FranchiseTypes';
import { AI_SEARCH_CONSTANTS } from '../FranchiseUtils/Constants';

interface FilterSearchPanelProps {
  onSearch: (query: string, filters: SearchFilters) => void;
}

interface SearchFilters {
  category?: ServiceCategory;
  type?: FranchiseType;
  location?: string;
  minSQL?: number;
  status?: string;
}

export const FilterSearchPanel: React.FC<FilterSearchPanelProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);

  const handleSearch = () => {
    if (searchQuery.length >= AI_SEARCH_CONSTANTS.MIN_SEARCH_LENGTH) {
      onSearch(searchQuery, filters);
    }
  };

  const handleVoiceSearch = async () => {
    try {
      setIsVoiceSearch(true);
      // TODO: Implement voice recognition
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.start();

      recognition.onresult = event => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        handleSearch();
      };

      recognition.onerror = event => {
        console.error('Voice recognition error:', event.error);
        setIsVoiceSearch(false);
      };

      recognition.onend = () => {
        setIsVoiceSearch(false);
      };
    } catch (error) {
      console.error('Voice search not supported:', error);
      setIsVoiceSearch(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col space-y-4">
        {/* Search Bar */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search franchises..."
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleVoiceSearch}
            className={`p-2 rounded-lg ${isVoiceSearch ? 'bg-red-500' : 'bg-blue-500'} text-white`}
            disabled={isVoiceSearch}
          >
            {isVoiceSearch ? 'Listening...' : '🎤'}
          </button>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Category Filter */}
          <select
            value={filters.category || ''}
            onChange={e => setFilters({ ...filters, category: e.target.value as ServiceCategory })}
            className="p-2 border rounded-lg"
          >
            <option value="">All Categories</option>
            {Object.values(ServiceCategory).map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={filters.type || ''}
            onChange={e => setFilters({ ...filters, type: e.target.value as FranchiseType })}
            className="p-2 border rounded-lg"
          >
            <option value="">All Types</option>
            {Object.values(FranchiseType).map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Location Filter */}
          <input
            type="text"
            value={filters.location || ''}
            onChange={e => setFilters({ ...filters, location: e.target.value })}
            placeholder="Location"
            className="p-2 border rounded-lg"
          />

          {/* SQL Filter */}
          <select
            value={filters.minSQL || ''}
            onChange={e => setFilters({ ...filters, minSQL: Number(e.target.value) })}
            className="p-2 border rounded-lg"
          >
            <option value="">Min SQL</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(sql => (
              <option key={sql} value={sql}>
                SQL {sql}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status || ''}
            onChange={e => setFilters({ ...filters, status: e.target.value })}
            className="p-2 border rounded-lg"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>
    </div>
  );
};
