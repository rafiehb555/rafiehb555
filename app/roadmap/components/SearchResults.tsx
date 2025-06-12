import { Module, Feature, ApiEndpoint, BusinessRule, TimelineEvent } from '../types';

interface SearchResult {
  type: 'module' | 'feature' | 'api' | 'rule' | 'timeline';
  item: Module | Feature | ApiEndpoint | BusinessRule | TimelineEvent;
  score: number;
  matchedFields: string[];
}

interface SearchResultsProps {
  results: SearchResult[];
}

export default function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) {
    return null;
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'module':
        return 'bg-blue-100 text-blue-800';
      case 'feature':
        return 'bg-green-100 text-green-800';
      case 'api':
        return 'bg-purple-100 text-purple-800';
      case 'rule':
        return 'bg-yellow-100 text-yellow-800';
      case 'timeline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'module':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'feature':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'api':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'rule':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'timeline':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Search Results ({results.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {results.map((result, index) => (
            <div key={index} className="p-4 hover:bg-gray-50">
              <div className="flex items-start">
                <div className={`flex-shrink-0 p-2 rounded-full ${getTypeColor(result.type)}`}>
                  {getTypeIcon(result.type)}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">
                      {result.type === 'module' && (result.item as Module).name}
                      {result.type === 'feature' && (result.item as Feature).name}
                      {result.type === 'api' && (result.item as ApiEndpoint).path}
                      {result.type === 'rule' && (result.item as BusinessRule).name}
                      {result.type === 'timeline' && (result.item as TimelineEvent).title}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {Math.round(result.score * 100)}% match
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {result.type === 'module' && (result.item as Module).description}
                    {result.type === 'feature' && (result.item as Feature).description}
                    {result.type === 'api' && (result.item as ApiEndpoint).description}
                    {result.type === 'rule' && (result.item as BusinessRule).description}
                    {result.type === 'timeline' && (result.item as TimelineEvent).description}
                  </p>
                  {result.matchedFields.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">Matched in: </span>
                      {result.matchedFields.map((field, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-2"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 