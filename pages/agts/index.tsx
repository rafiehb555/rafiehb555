import React from 'react';
import { FiPlane, FiBus, FiMap, FiHome, FiSearch } from 'react-icons/fi';
import TravelDashboard from '@/components/agts/TravelDashboard';
import BrowsePackages from '@/components/agts/BrowsePackages';
import ProviderDirectory from '@/components/agts/ProviderDirectory';
import BookingHistory from '@/components/agts/BookingHistory';

interface ServiceCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  sqlRequired: 'free' | 'basic' | 'normal';
}

const serviceCards: ServiceCard[] = [
  {
    title: 'Book a Flight',
    description: 'Search and book domestic and international flights',
    icon: <FiPlane className="w-6 h-6" />,
    href: '/agts/flights',
    color: 'bg-blue-500',
    sqlRequired: 'basic',
  },
  {
    title: 'Bus & Train',
    description: 'Local and intercity transportation services',
    icon: <FiBus className="w-6 h-6" />,
    href: '/agts/transport',
    color: 'bg-green-500',
    sqlRequired: 'basic',
  },
  {
    title: 'Tour Packages',
    description: 'Curated travel experiences and guided tours',
    icon: <FiMap className="w-6 h-6" />,
    href: '/agts/tours',
    color: 'bg-purple-500',
    sqlRequired: 'normal',
  },
  {
    title: 'Hotels & Stays',
    description: 'Book accommodations worldwide',
    icon: <FiHome className="w-6 h-6" />,
    href: '/agts/hotels',
    color: 'bg-yellow-500',
    sqlRequired: 'basic',
  },
];

export default function AGTSPage() {
  // TODO: Get user's SQL level from auth context
  const userSqlLevel = 'basic';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Advanced Global Traveling Services</h1>
        <p className="text-gray-600 mt-2">
          Book verified travel services from our trusted franchise partners worldwide.
        </p>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {serviceCards.map(card => (
          <a
            key={card.title}
            href={card.href}
            className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow ${
              card.sqlRequired === 'normal' && userSqlLevel !== 'normal'
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            <div
              className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}
            >
              {card.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
            <p className="text-gray-600 mt-1">{card.description}</p>
            {card.sqlRequired === 'normal' && userSqlLevel !== 'normal' && (
              <p className="text-sm text-red-600 mt-2">Requires SQL Normal level</p>
            )}
          </a>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search destinations, packages, or providers..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <FiSearch className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <TravelDashboard />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <BookingHistory />
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <BrowsePackages />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <ProviderDirectory />
        </div>
      </div>
    </div>
  );
}
