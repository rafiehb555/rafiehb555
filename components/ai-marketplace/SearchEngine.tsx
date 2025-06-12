import React, { useState } from 'react';
import { FiSearch, FiMic, FiUpload, FiFilter } from 'react-icons/fi';
import { SQLLevel } from '@/types/marketplace';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';
import NoResultsFound from './NoResultsFound';
import { getSearchSuggestions } from '@/lib/ai-marketplace/searchSuggestions';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  sqlLevel: SQLLevel;
}

export default function SearchEngine() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSqlLevel, setSelectedSqlLevel] = useState<SQLLevel>('free');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get suggestions
    const newSuggestions = await getSearchSuggestions(query);
    setSuggestions(newSuggestions);

    // TODO: Implement actual search results
    setResults([]);
    setIsLoading(false);
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // TODO: Implement voice input
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: Implement file upload
      console.log('File selected:', file.name);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <SearchInput
        value={searchQuery}
        onChange={handleSearch}
        onVoiceClick={handleVoiceInput}
        onFileUpload={handleFileUpload}
        isListening={isListening}
        suggestions={suggestions}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedSqlLevel={selectedSqlLevel}
        onSqlLevelChange={setSelectedSqlLevel}
      />

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <SearchResults results={results} userSqlLevel={selectedSqlLevel} />
        ) : (
          <NoResultsFound query={searchQuery} />
        )}
      </div>
    </div>
  );
}
