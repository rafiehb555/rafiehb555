import React from 'react';
import { FiLock } from 'react-icons/fi';
import { SQLLevel } from '@/types/marketplace';
import { matchUserLevel } from '@/lib/ai-marketplace/matchUserLevel';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  sqlLevel: SQLLevel;
}

interface SearchResultsProps {
  results: SearchResult[];
  userSqlLevel: SQLLevel;
}

export default function SearchResults({ results, userSqlLevel }: SearchResultsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map(result => {
        const hasAccess = matchUserLevel(userSqlLevel, result.sqlLevel);

        return (
          <div
            key={result.id}
            className={`bg-white rounded-lg shadow-sm border ${
              hasAccess ? 'border-gray-200' : 'border-red-200'
            } p-4`}
          >
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{result.title}</h3>
              {!hasAccess && (
                <div className="flex items-center text-red-500">
                  <FiLock className="w-4 h-4 mr-1" />
                  <span className="text-sm">SQL {result.sqlLevel}</span>
                </div>
              )}
            </div>

            <div className="mt-2">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {result.category}
              </span>
            </div>

            <p className="mt-2 text-gray-600 line-clamp-2">{result.description}</p>

            {!hasAccess && (
              <div className="mt-4 p-3 bg-red-50 rounded-md">
                <p className="text-sm text-red-600">
                  Upgrade your SQL level to access this service
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
