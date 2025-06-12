import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiX, FiLoader } from 'react-icons/fi';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'GoSellr Marketplace',
    description: 'Start selling your products and services online',
    category: 'E-commerce',
    url: '/gosellr',
  },
  {
    id: '2',
    title: 'AI Marketplace',
    description: 'Discover AI-powered solutions for your business',
    category: 'AI Services',
    url: '/ehb-ai-market-place',
  },
  {
    id: '3',
    title: 'Franchise Opportunities',
    description: 'Explore EHB franchise opportunities',
    category: 'Business',
    url: '/ehb-franchise',
  },
];

export default function AIEntrySearch() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    // Simulate API call
    setTimeout(() => {
      const filteredResults = mockSearchResults.filter(
        result =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filteredResults);
      setIsSearching(false);
    }, 500);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search for services, products, or help..."
          className="w-full px-4 py-3 pl-12 pr-10 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          {isSearching ? (
            <div className="flex items-center justify-center p-4">
              <FiLoader className="w-5 h-5 text-blue-500 animate-spin" />
              <span className="ml-2 text-gray-600">Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map(result => (
                <a
                  key={result.id}
                  href={result.url}
                  className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{result.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{result.description}</p>
                    </div>
                    <span className="ml-2 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                      {result.category}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">No results found</div>
          )}
        </motion.div>
      )}
    </div>
  );
}
