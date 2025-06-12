import React, { useState } from 'react';
import { FiPlane, FiBus, FiMap, FiHome, FiTrendingUp } from 'react-icons/fi';

interface TravelService {
  id: string;
  title: string;
  type: 'flight' | 'bus' | 'tour' | 'hotel';
  price: number;
  currency: string;
  rating: number;
  provider: string;
  sqlRequired: 'free' | 'basic' | 'normal';
}

// Mock data - replace with API calls
const mockServices: TravelService[] = [
  {
    id: '1',
    title: 'Premium Flight Package',
    type: 'flight',
    price: 299,
    currency: 'USD',
    rating: 4.5,
    provider: 'SkyWings Airlines',
    sqlRequired: 'basic',
  },
  {
    id: '2',
    title: 'City Tour Package',
    type: 'tour',
    price: 99,
    currency: 'USD',
    rating: 4.8,
    provider: 'Local Tours Co.',
    sqlRequired: 'normal',
  },
];

const typeIcons: Record<TravelService['type'], React.ReactNode> = {
  flight: <FiPlane className="w-5 h-5 text-blue-500" />,
  bus: <FiBus className="w-5 h-5 text-green-500" />,
  tour: <FiMap className="w-5 h-5 text-purple-500" />,
  hotel: <FiHome className="w-5 h-5 text-yellow-500" />,
};

export default function TravelDashboard() {
  const [services] = useState<TravelService[]>(mockServices);
  // TODO: Get user's SQL level from auth context
  const userSqlLevel = 'basic';

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Featured Travel Services</h2>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(service => (
          <div
            key={service.id}
            className={`bg-white rounded-lg border border-gray-200 p-4 ${
              service.sqlRequired === 'normal' && userSqlLevel !== 'normal' ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="mt-1">{typeIcons[service.type]}</div>
                <div>
                  <h3 className="font-medium text-gray-900">{service.title}</h3>
                  <p className="text-sm text-gray-500">{service.provider}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <FiTrendingUp className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-900">{service.rating}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-lg font-semibold text-gray-900">
                  {service.currency} {service.price}
                </p>
              </div>
              <button
                className={`px-4 py-2 rounded-lg ${
                  service.sqlRequired === 'normal' && userSqlLevel !== 'normal'
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                disabled={service.sqlRequired === 'normal' && userSqlLevel !== 'normal'}
              >
                Book Now
              </button>
            </div>

            {service.sqlRequired === 'normal' && userSqlLevel !== 'normal' && (
              <p className="text-sm text-red-600 mt-2">Requires SQL Normal level</p>
            )}
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Active Bookings</p>
          <p className="text-2xl font-semibold text-blue-600">3</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Saved Amount</p>
          <p className="text-2xl font-semibold text-green-600">$150</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Reward Points</p>
          <p className="text-2xl font-semibold text-purple-600">250</p>
        </div>
      </div>
    </div>
  );
}
