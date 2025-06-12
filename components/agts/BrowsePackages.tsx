import React, { useState } from 'react';
import { FiFilter, FiStar, FiMapPin, FiDollarSign } from 'react-icons/fi';

interface TravelPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  rating: number;
  region: string;
  duration: string;
  hotelRating: number;
  sqlRequired: 'free' | 'basic' | 'normal';
}

// Mock data - replace with API calls
const mockPackages: TravelPackage[] = [
  {
    id: '1',
    title: 'European Adventure',
    description: 'Explore the best of Europe with our curated tour package',
    price: 1999,
    currency: 'USD',
    rating: 4.8,
    region: 'Europe',
    duration: '10 days',
    hotelRating: 4,
    sqlRequired: 'normal',
  },
  {
    id: '2',
    title: 'Asian Discovery',
    description: 'Experience the rich culture and beauty of Asia',
    price: 1499,
    currency: 'USD',
    rating: 4.6,
    region: 'Asia',
    duration: '7 days',
    hotelRating: 3,
    sqlRequired: 'basic',
  },
];

interface Filters {
  region: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  hotelRating: number;
  sqlLevel: string;
}

export default function BrowsePackages() {
  const [packages] = useState<TravelPackage[]>(mockPackages);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    region: '',
    minPrice: 0,
    maxPrice: 5000,
    minRating: 0,
    hotelRating: 0,
    sqlLevel: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredPackages = packages.filter(pkg => {
    return (
      (!filters.region || pkg.region === filters.region) &&
      pkg.price >= filters.minPrice &&
      pkg.price <= filters.maxPrice &&
      pkg.rating >= filters.minRating &&
      pkg.hotelRating >= filters.hotelRating &&
      (!filters.sqlLevel || pkg.sqlRequired === filters.sqlLevel)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Travel Packages</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <FiFilter className="w-5 h-5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                Region
              </label>
              <select
                id="region"
                name="region"
                value={filters.region}
                onChange={handleFilterChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Regions</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="Americas">Americas</option>
                <option value="Africa">Africa</option>
              </select>
            </div>
            <div>
              <label htmlFor="minRating" className="block text-sm font-medium text-gray-700">
                Minimum Rating
              </label>
              <select
                id="minRating"
                name="minRating"
                value={filters.minRating}
                onChange={handleFilterChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">Any Rating</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>
            <div>
              <label htmlFor="hotelRating" className="block text-sm font-medium text-gray-700">
                Hotel Rating
              </label>
              <select
                id="hotelRating"
                name="hotelRating"
                value={filters.hotelRating}
                onChange={handleFilterChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">Any Hotel</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPackages.map(pkg => (
          <div
            key={pkg.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{pkg.title}</h3>
                <p className="text-gray-600 mt-1">{pkg.description}</p>
              </div>
              <div className="flex items-center space-x-1">
                <FiStar className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-900">{pkg.rating}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <FiMapPin className="w-4 h-4 mr-1" />
                {pkg.region}
              </div>
              <div className="flex items-center">
                <FiDollarSign className="w-4 h-4 mr-1" />
                {pkg.currency} {pkg.price}
              </div>
              <div>{pkg.duration}</div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-500">Hotel Rating:</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < pkg.hotelRating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
