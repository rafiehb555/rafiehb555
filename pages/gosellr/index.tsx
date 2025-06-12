import React from 'react';
import { FiShoppingBag, FiMapPin, FiStar, FiTrendingUp } from 'react-icons/fi';
import GoSellrDashboard from '../../components/gosellr/GoSellrDashboard';
import ProductListing from '../../components/gosellr/ProductListing';
import ShopDirectory from '../../components/gosellr/ShopDirectory';

interface ServiceCard {
  title: string;
  description: string;
  icon: React.ReactElement;
  link: string;
  color: string;
  sqlRequired: 'free' | 'basic' | 'normal' | 'high';
}

const serviceCards: ServiceCard[] = [
  {
    title: 'Shop Now',
    description: 'Browse products from verified sellers',
    icon: <FiShoppingBag className="w-6 h-6" />,
    link: '/gosellr/products',
    color: 'bg-blue-500',
    sqlRequired: 'free',
  },
  {
    title: 'Nearby Sellers',
    description: 'Find local shops in your area',
    icon: <FiMapPin className="w-6 h-6" />,
    link: '/gosellr/shops',
    color: 'bg-green-500',
    sqlRequired: 'basic',
  },
  {
    title: 'Top Rated',
    description: 'Discover highly-rated products',
    icon: <FiStar className="w-6 h-6" />,
    link: '/gosellr/top-rated',
    color: 'bg-yellow-500',
    sqlRequired: 'free',
  },
  {
    title: 'Franchise Shops',
    description: 'Explore verified franchise stores',
    icon: <FiTrendingUp className="w-6 h-6" />,
    link: '/gosellr/franchise',
    color: 'bg-purple-500',
    sqlRequired: 'normal',
  },
];

export default function GoSellrPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">GoSellr Marketplace</h1>
        <p className="text-gray-600 mt-2">Shop from verified sellers and franchise stores</p>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {serviceCards.map(card => (
          <a
            key={card.title}
            href={card.link}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div
              className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}
            >
              {card.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
            <p className="text-gray-600 mt-2">{card.description}</p>
            <div className="mt-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                SQL {card.sqlRequired}
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Main Components */}
      <div className="space-y-6">
        <GoSellrDashboard />
        <ProductListing />
        <ShopDirectory />
      </div>
    </div>
  );
}
