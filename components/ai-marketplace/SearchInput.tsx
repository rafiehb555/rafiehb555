import React, { useState, useRef } from 'react';
import { FiSearch, FiMic, FiUpload, FiFilter, FiX } from 'react-icons/fi';
import { SQLLevel } from '@/types/marketplace';

interface SearchInputProps {
  value: string;
  onChange: (query: string) => void;
  onVoiceClick: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isListening: boolean;
  suggestions: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedSqlLevel: SQLLevel;
  onSqlLevelChange: (level: SQLLevel) => void;
}

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'ai', name: 'AI Services' },
  { id: 'data', name: 'Data Analysis' },
  { id: 'automation', name: 'Automation' },
  { id: 'consulting', name: 'Consulting' },
];

const sqlLevels: SQLLevel[] = ['free', 'basic', 'premium', 'enterprise'];

export default function SearchInput({
  value,
  onChange,
  onVoiceClick,
  onFileUpload,
  isListening,
  suggestions,
  selectedCategory,
  onCategoryChange,
  selectedSqlLevel,
  onSqlLevelChange,
}: SearchInputProps) {
  const [showFilters, setShowFilters] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex-1 flex items-center px-4">
          <FiSearch className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Search for AI services..."
            className="flex-1 py-3 px-3 focus:outline-none"
          />
          {value && (
            <button onClick={() => onChange('')} className="p-1 hover:bg-gray-100 rounded-full">
              <FiX className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        <div className="flex items-center border-l border-gray-200">
          <button
            onClick={onVoiceClick}
            className={`p-3 hover:bg-gray-50 ${isListening ? 'text-blue-500' : 'text-gray-400'}`}
          >
            <FiMic className="w-5 h-5" />
          </button>

          <button onClick={handleFileClick} className="p-3 hover:bg-gray-50 text-gray-400">
            <FiUpload className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-3 hover:bg-gray-50 text-gray-400"
          >
            <FiFilter className="w-5 h-5" />
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileUpload}
          className="hidden"
          accept="image/*,application/pdf,video/*,audio/*"
        />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onChange(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={e => onCategoryChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SQL Level</label>
              <select
                value={selectedSqlLevel}
                onChange={e => onSqlLevelChange(e.target.value as SQLLevel)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      )}
    </div>
  );
}
