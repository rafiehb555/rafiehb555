import { useState } from 'react';
import { FiSearch, FiFilter, FiBook, FiStar, FiLock } from 'react-icons/fi';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  rating: number;
  price: number;
  isPremium: boolean;
  requiredSqlLevel: number;
  coverImage: string;
  description: string;
}

export default function BookList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSqlLevel, setSelectedSqlLevel] = useState<string>('all');

  // Mock data - replace with API call
  const books: Book[] = [
    {
      id: '1',
      title: 'Introduction to Computer Science',
      author: 'John Smith',
      category: 'Computer Science',
      rating: 4.5,
      price: 29.99,
      isPremium: false,
      requiredSqlLevel: 1,
      coverImage: '/images/books/cs-intro.jpg',
      description: 'A comprehensive introduction to computer science concepts and programming.',
    },
    {
      id: '2',
      title: 'Advanced Data Structures',
      author: 'Sarah Johnson',
      category: 'Computer Science',
      rating: 4.8,
      price: 49.99,
      isPremium: true,
      requiredSqlLevel: 2,
      coverImage: '/images/books/data-structures.jpg',
      description: 'Deep dive into advanced data structures and algorithms.',
    },
  ];

  const categories = ['all', 'Computer Science', 'Mathematics', 'Physics', 'Business'];
  const sqlLevels = ['all', '1', '2', '3', '4'];

  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    const matchesSqlLevel =
      selectedSqlLevel === 'all' || book.requiredSqlLevel.toString() === selectedSqlLevel;
    return matchesSearch && matchesCategory && matchesSqlLevel;
  });

  return (
    <div className="p-6">
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search books by title or author..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FiFilter className="h-5 w-5 text-gray-400" />
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedSqlLevel}
              onChange={e => setSelectedSqlLevel(e.target.value)}
            >
              {sqlLevels.map(level => (
                <option key={level} value={level}>
                  {level === 'all' ? 'All SQL Levels' : `SQL Level ${level}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBooks.map(book => (
          <div
            key={book.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FiBook className="h-6 w-6 text-indigo-600" />
                  <h3 className="ml-2 text-lg font-medium text-gray-900">{book.title}</h3>
                </div>
                <span className="flex items-center text-yellow-400">
                  <FiStar className="h-5 w-5" />
                  <span className="ml-1 text-sm font-medium text-gray-900">{book.rating}</span>
                </span>
              </div>
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-500">by {book.author}</p>
                <p className="text-sm text-gray-500">{book.category}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{book.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-semibold text-gray-900">${book.price}</span>
                  <div className="flex items-center space-x-2">
                    {book.isPremium && (
                      <span className="flex items-center text-indigo-600">
                        <FiLock className="h-4 w-4 mr-1" />
                        <span className="text-sm">Premium</span>
                      </span>
                    )}
                    <span className="text-sm text-gray-500">SQL {book.requiredSqlLevel}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <button
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => {
                    /* Handle book selection */
                  }}
                >
                  {book.isPremium ? 'Purchase' : 'Read Now'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
