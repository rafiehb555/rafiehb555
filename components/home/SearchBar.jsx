'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('all');

  const modules = [
    { id: 'all', name: 'All Services' },
    { id: 'gosellr', name: 'GoSellr' },
    { id: 'edr', name: 'Education' },
    { id: 'emo', name: 'Health' },
    { id: 'jps', name: 'Justice' },
    { id: 'pss', name: 'Safety' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search services, products, or information..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={selectedModule}
              onChange={e => setSelectedModule(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {modules.map(module => (
                <option key={module.id} value={module.id}>
                  {module.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              // TODO: Implement search logic
              console.log('Searching:', { searchQuery, selectedModule });
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </motion.div>
    </div>
  );
}
