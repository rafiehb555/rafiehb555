import React, { useState } from 'react';
import { FiCheckCircle, FiMapPin, FiPhone, FiGlobe, FiStar } from 'react-icons/fi';

interface Provider {
  id: string;
  name: string;
  type: 'airline' | 'hotel' | 'tour' | 'transport';
  rating: number;
  location: string;
  contact: string;
  website: string;
  verified: boolean;
  services: string[];
  sqlRequired: 'free' | 'basic' | 'normal';
}

// Mock data - replace with API calls
const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'SkyWings Airlines',
    type: 'airline',
    rating: 4.7,
    location: 'New York, USA',
    contact: '+1 (555) 123-4567',
    website: 'www.skywings.com',
    verified: true,
    services: ['International Flights', 'Business Class', 'Lounge Access'],
    sqlRequired: 'normal',
  },
  {
    id: '2',
    name: 'Grand Hotels International',
    type: 'hotel',
    rating: 4.5,
    location: 'London, UK',
    contact: '+44 20 1234 5678',
    website: 'www.grandhotels.com',
    verified: true,
    services: ['Luxury Accommodation', 'Spa Services', 'Fine Dining'],
    sqlRequired: 'basic',
  },
];

export default function ProviderDirectory() {
  const [providers] = useState<Provider[]>(mockProviders);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProviders = providers.filter(provider => {
    const matchesType = selectedType === 'all' || provider.type === selectedType;
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h2 className="text-xl font-semibold text-gray-900">Verified Providers</h2>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            placeholder="Search providers..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="airline">Airlines</option>
            <option value="hotel">Hotels</option>
            <option value="tour">Tour Operators</option>
            <option value="transport">Transport Services</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProviders.map(provider => (
          <div
            key={provider.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                  {provider.verified && (
                    <FiCheckCircle className="w-5 h-5 text-green-500" title="Verified Provider" />
                  )}
                </div>
                <div className="flex items-center mt-1 space-x-2 text-sm text-gray-500">
                  <span className="capitalize">{provider.type}</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <FiStar className="w-4 h-4 text-yellow-500 mr-1" />
                    <span>{provider.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
                {provider.location}
              </div>
              <div className="flex items-center">
                <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
                {provider.contact}
              </div>
              <div className="flex items-center">
                <FiGlobe className="w-4 h-4 mr-2 text-gray-400" />
                <a
                  href={`https://${provider.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {provider.website}
                </a>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Services Offered:</h4>
              <div className="flex flex-wrap gap-2">
                {provider.services.map((service, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Contact Provider
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
