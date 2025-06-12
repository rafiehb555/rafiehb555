import React, { useState } from 'react';
import { FiSearch, FiMic, FiFilter } from 'react-icons/fi';
import { SQLLevel } from '@/types/marketplace';

interface MarketplaceHeaderProps {
  onSearch: (query: string) => void;
  onRegionChange: (region: string) => void;
  onSqlLevelChange: (level: SQLLevel) => void;
}

const regions = [
  { value: 'global', label: 'Global' },
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'eu', label: 'European Union' },
  { value: 'asia', label: 'Asia Pacific' },
];

const sqlLevels: { value: SQLLevel; label: string }[] = [
  { value: 'free', label: 'Free' },
  { value: 'basic', label: 'Basic' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'vip', label: 'VIP' },
];

export default function MarketplaceHeader({
  onSearch,
  onRegionChange,
  onSqlLevelChange,
}: MarketplaceHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // TODO: Implement voice input logic
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">EHB AI Marketplace</h1>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2 rounded-lg ${isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}
          >
            <FiMic />
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
          <select
            onChange={e => onRegionChange(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {regions.map(region => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">SQL Level</label>
          <select
            onChange={e => onSqlLevelChange(e.target.value as SQLLevel)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {sqlLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
