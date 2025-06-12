import React, { useState } from 'react';
import { FiSearch, FiFilter, FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  rating: number;
  reviews: number;
  shop: string;
  category: string;
  tags: string[];
  sqlRequired: 'free' | 'basic' | 'normal' | 'high';
  image: string;
  stock: number;
  discount?: number;
}

// Mock data - replace with API calls
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Laptop',
    description: 'High-performance laptop with latest specifications',
    price: 999,
    currency: 'USD',
    rating: 4.8,
    reviews: 128,
    shop: 'Tech Haven',
    category: 'Electronics',
    tags: ['laptop', 'electronics', 'gaming'],
    sqlRequired: 'normal',
    image: '/products/laptop.jpg',
    stock: 15,
    discount: 10,
  },
  {
    id: '2',
    name: 'Designer Watch',
    description: 'Luxury timepiece with premium materials',
    price: 299,
    currency: 'USD',
    rating: 4.9,
    reviews: 89,
    shop: 'Luxury Timepieces',
    category: 'Fashion',
    tags: ['watch', 'accessories', 'luxury'],
    sqlRequired: 'basic',
    image: '/products/watch.jpg',
    stock: 8,
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

const sqlLevels = ['All', 'free', 'basic', 'normal', 'high'];

export default function ProductListing() {
  const [products] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSqlLevel, setSelectedSqlLevel] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSqlLevel = selectedSqlLevel === 'All' || product.sqlRequired === selectedSqlLevel;
    return matchesSearch && matchesCategory && matchesSqlLevel;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return b.reviews - a.reviews;
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
                placeholder="Search products..."
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
              <option value="popularity">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map(product => (
          <div
            key={product.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              {product.discount && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                  -{product.discount}%
                </div>
              )}
              <button className="absolute top-2 left-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                <FiHeart className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{product.shop}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  SQL {product.sqlRequired}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <FiStar className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-gray-500">({product.reviews})</span>
                </div>
                <span className="text-sm text-gray-500">In Stock: {product.stock}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-gray-900">
                    {product.currency} {product.price}
                  </span>
                  {product.discount && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      {product.currency} {Math.round(product.price * (1 + product.discount / 100))}
                    </span>
                  )}
                </div>
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  <FiShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
