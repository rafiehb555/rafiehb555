import React, { useState } from 'react';
import {
  FiSearch,
  FiFilter,
  FiStar,
  FiMapPin,
  FiTrendingUp,
  FiShoppingBag,
  FiCheck,
} from 'react-icons/fi';

interface Shop {
  id: string;
  name: string;
  type: 'local' | 'franchise';
  rating: number;
  reviews: number;
  location: string;
  verified: boolean;
  sqlLevel: 'basic' | 'normal' | 'high';
  products: number;
  joined: string;
  categories: string[];
  image: string;
  description: string;
}

// Mock data - replace with API calls
const mockShops: Shop[] = [
  {
    id: '1',
    name: 'Tech Haven',
    type: 'franchise',
    rating: 4.8,
    reviews: 256,
    location: 'New York',
    verified: true,
    sqlLevel: 'high',
    products: 150,
    joined: '2023-01-15',
    categories: ['Electronics', 'Gaming', 'Accessories'],
    image: '/shops/tech-haven.jpg',
    description: 'Your one-stop shop for all tech needs. From gaming PCs to smart home devices.',
  },
  {
    id: '2',
    name: 'Local Electronics',
    type: 'local',
    rating: 4.5,
    reviews: 89,
    location: 'Los Angeles',
    verified: true,
    sqlLevel: 'normal',
    products: 75,
    joined: '2023-03-20',
    categories: ['Electronics', 'Repairs', 'Parts'],
    image: '/shops/local-electronics.jpg',
    description: 'Local electronics store with expert repair services and quality products.',
  },
];

const categories = [
  'All',
  'Electronics',
  'Fashion',
  'Home & Living',
  'Sports',
  'Books',
  'Beauty',
  'Toys',
];

const shopTypes = ['All', 'local', 'franchise'];
const sqlLevels = ['All', 'basic', 'normal', 'high'];

export default function ShopDirectory() {
  const [shops] = useState<Shop[]>(mockShops);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSqlLevel, setSelectedSqlLevel] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  const filteredShops = shops.filter(shop => {
    const matchesSearch =
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || shop.categories.includes(selectedCategory);
    const matchesType = selectedType === 'All' || shop.type === selectedType;
    const matchesSqlLevel = selectedSqlLevel === 'All' || shop.sqlLevel === selectedSqlLevel;
    return matchesSearch && matchesCategory && matchesType && matchesSqlLevel;
  });

  const sortedShops = [...filteredShops].sort((a, b) => {
    switch (sortBy) {
      case 'products':
        return b.products - a.products;
      case 'reviews':
        return b.reviews - a.reviews;
      case 'joined':
        return new Date(b.joined).getTime() - new Date(a.joined).getTime();
      default:
        return b.rating - a.rating;
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Search and Filter Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search shops..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FiFilter />
              <span>Filters</span>
            </button>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="rating">Highest Rated</option>
              <option value="products">Most Products</option>
              <option value="reviews">Most Reviews</option>
              <option value="joined">Newest</option>
            </select>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shop Type</label>
                <select
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {shopTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SQL Level</label>
                <select
                  value={selectedSqlLevel}
                  onChange={e => setSelectedSqlLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {sqlLevels.map(level => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedShops.map(shop => (
          <div
            key={shop.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img src={shop.image} alt={shop.name} className="w-full h-48 object-cover" />
              {shop.verified && (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm flex items-center">
                  <FiCheck className="w-4 h-4 mr-1" />
                  Verified
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{shop.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  SQL {shop.sqlLevel}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{shop.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <FiMapPin className="w-4 h-4 mr-1" />
                  {shop.location}
                </div>
                <div className="flex items-center">
                  <FiTrendingUp className="w-4 h-4 mr-1" />
                  {shop.type}
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FiStar className="w-4 h-4 text-yellow-400" />
                  <span className="ml-1 font-semibold">{shop.rating}</span>
                  <span className="ml-1 text-gray-500">({shop.reviews})</span>
                </div>
                <div className="flex items-center">
                  <FiShoppingBag className="w-4 h-4 mr-1" />
                  <span>{shop.products} products</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {shop.categories.map(category => (
                  <span
                    key={category}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
