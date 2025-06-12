import React, { useState } from 'react';
import {
  FiShoppingBag,
  FiMapPin,
  FiTrendingUp,
  FiStar,
  FiPackage,
  FiDollarSign,
} from 'react-icons/fi';

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  rating: number;
  shop: string;
  category: string;
  sqlRequired: 'free' | 'basic' | 'normal' | 'high';
  image: string;
}

interface Shop {
  id: string;
  name: string;
  type: 'local' | 'franchise';
  rating: number;
  location: string;
  verified: boolean;
  sqlLevel: 'basic' | 'normal' | 'high';
}

// Mock data - replace with API calls
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Laptop',
    price: 999,
    currency: 'USD',
    rating: 4.8,
    shop: 'Tech Haven',
    category: 'Electronics',
    sqlRequired: 'normal',
    image: '/products/laptop.jpg',
  },
  {
    id: '2',
    name: 'Designer Watch',
    price: 299,
    currency: 'USD',
    rating: 4.9,
    shop: 'Luxury Timepieces',
    category: 'Fashion',
    sqlRequired: 'basic',
    image: '/products/watch.jpg',
  },
];

const mockShops: Shop[] = [
  {
    id: '1',
    name: 'Tech Haven',
    type: 'franchise',
    rating: 4.8,
    location: 'New York',
    verified: true,
    sqlLevel: 'high',
  },
  {
    id: '2',
    name: 'Local Electronics',
    type: 'local',
    rating: 4.5,
    location: 'Los Angeles',
    verified: true,
    sqlLevel: 'normal',
  },
];

export default function GoSellrDashboard() {
  const [products] = useState<Product[]>(mockProducts);
  const [shops] = useState<Shop[]>(mockShops);
  const [userSqlLevel] = useState<'free' | 'basic' | 'normal' | 'high'>('basic');

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Marketplace Overview</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">SQL Level:</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {userSqlLevel}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <FiShoppingBag className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-sm text-blue-600">Active Orders</p>
              <p className="text-xl font-semibold text-blue-900">3</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <FiDollarSign className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-sm text-green-600">Total Spent</p>
              <p className="text-xl font-semibold text-green-900">$1,299</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <FiStar className="w-6 h-6 text-purple-500" />
            <div>
              <p className="text-sm text-purple-600">SQL Earned</p>
              <p className="text-xl font-semibold text-purple-900">150</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended for You</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg mb-4">
                <img src={product.image} alt={product.name} className="object-cover rounded-lg" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">{product.name}</h4>
              <p className="text-gray-600">{product.shop}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-semibold text-gray-900">
                  {product.currency} {product.price}
                </span>
                <span className="flex items-center text-yellow-400">
                  <FiStar className="w-4 h-4" />
                  <span className="ml-1 text-sm">{product.rating}</span>
                </span>
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  SQL {product.sqlRequired}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby Shops */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Nearby Shops</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shops.map(shop => (
            <div
              key={shop.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-semibold text-gray-900">{shop.name}</h4>
                    {shop.verified && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiMapPin className="w-4 h-4 mr-1" />
                      {shop.location}
                    </div>
                    <div className="flex items-center">
                      <FiTrendingUp className="w-4 h-4 mr-1" />
                      {shop.type}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <FiStar className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">{shop.rating}</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  SQL {shop.sqlLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="flex items-center justify-center space-x-2 bg-blue-50 text-blue-700 rounded-lg p-4 hover:bg-blue-100 transition-colors">
          <FiShoppingBag className="w-5 h-5" />
          <span>Browse Products</span>
        </button>
        <button className="flex items-center justify-center space-x-2 bg-green-50 text-green-700 rounded-lg p-4 hover:bg-green-100 transition-colors">
          <FiMapPin className="w-5 h-5" />
          <span>Find Shops</span>
        </button>
        <button className="flex items-center justify-center space-x-2 bg-purple-50 text-purple-700 rounded-lg p-4 hover:bg-purple-100 transition-colors">
          <FiPackage className="w-5 h-5" />
          <span>Track Orders</span>
        </button>
        <button className="flex items-center justify-center space-x-2 bg-yellow-50 text-yellow-700 rounded-lg p-4 hover:bg-yellow-100 transition-colors">
          <FiStar className="w-5 h-5" />
          <span>Top Rated</span>
        </button>
      </div>
    </div>
  );
}
