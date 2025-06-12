import { useState } from 'react';
import { FiBook, FiClock, FiBookmark, FiTrendingUp } from 'react-icons/fi';

interface ReadingHistory {
  id: string;
  bookTitle: string;
  author: string;
  lastRead: string;
  progress: number;
  timeSpent: number;
  lastPage: number;
  totalPages: number;
  category: string;
}

export default function ReadingHistory() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all');

  // Mock data - replace with API call
  const readingHistory: ReadingHistory[] = [
    {
      id: '1',
      bookTitle: 'Introduction to Computer Science',
      author: 'John Smith',
      lastRead: '2024-02-20',
      progress: 75,
      timeSpent: 120,
      lastPage: 150,
      totalPages: 200,
      category: 'Computer Science',
    },
    {
      id: '2',
      bookTitle: 'Advanced Data Structures',
      author: 'Sarah Johnson',
      lastRead: '2024-02-19',
      progress: 30,
      timeSpent: 45,
      lastPage: 60,
      totalPages: 200,
      category: 'Computer Science',
    },
  ];

  const timeframes = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  const filteredHistory = readingHistory.filter(book => {
    // TODO: Implement timeframe filtering
    return true;
  });

  const totalTimeSpent = filteredHistory.reduce((acc, book) => acc + book.timeSpent, 0);
  const averageProgress =
    filteredHistory.reduce((acc, book) => acc + book.progress, 0) / filteredHistory.length;

  return (
    <div className="p-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiBook className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Books in Progress</dt>
                  <dd className="text-lg font-medium text-gray-900">{filteredHistory.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiClock className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Reading Time</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Math.round(totalTimeSpent / 60)} hours
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiTrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Progress</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Math.round(averageProgress)}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiBookmark className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Last Read</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {filteredHistory[0]?.lastRead || 'N/A'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeframe Filter */}
      <div className="mb-6">
        <div className="flex space-x-4">
          {timeframes.map(timeframe => (
            <button
              key={timeframe.value}
              onClick={() => setSelectedTimeframe(timeframe.value)}
              className={`
                px-4 py-2 text-sm font-medium rounded-md
                ${
                  selectedTimeframe === timeframe.value
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              {timeframe.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reading History List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredHistory.map(book => (
            <li key={book.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiBook className="h-5 w-5 text-gray-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{book.bookTitle}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{book.author}</span>
                        <span className="mx-2">•</span>
                        <span>{book.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-900">{book.progress}%</span>
                      <span className="mx-1">complete</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Page {book.lastPage} of {book.totalPages}
                    </div>
                    <div className="text-sm text-gray-500">Last read: {book.lastRead}</div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${book.progress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
