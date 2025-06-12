import React from 'react';
import { ServiceCategory, FranchiseType } from '../FranchiseUtils/FranchiseTypes';
import { FRANCHISE_TYPES, FRANCHISE_CONSTANTS } from '../FranchiseUtils/Constants';

interface FeaturedFranchise {
  id: string;
  name: string;
  category: ServiceCategory;
  type: FranchiseType;
  description: string;
  investment: string;
  location: string;
  rating: number;
  imageUrl: string;
}

export const FeaturedFranchises: React.FC = () => {
  const featuredFranchises: FeaturedFranchise[] = [
    {
      id: '1',
      name: 'GoSellr Express',
      category: ServiceCategory.GOSELLR,
      type: FranchiseType.SUB,
      description: 'Leading e-commerce and delivery solutions provider',
      investment: '$50,000 - $100,000',
      location: 'Multiple Locations',
      rating: 4.8,
      imageUrl: '/images/franchises/gosellr-express.jpg',
    },
    {
      id: '2',
      name: 'HealthCare Plus',
      category: ServiceCategory.HEALTH,
      type: FranchiseType.MASTER,
      description: 'Comprehensive healthcare and medical services network',
      investment: '$100,000 - $200,000',
      location: 'North America',
      rating: 4.9,
      imageUrl: '/images/franchises/healthcare-plus.jpg',
    },
    {
      id: '3',
      name: 'Legal Solutions Pro',
      category: ServiceCategory.LAW,
      type: FranchiseType.CORPORATE,
      description: 'Professional legal consultation and services network',
      investment: '$200,000 - $500,000',
      location: 'Global',
      rating: 4.7,
      imageUrl: '/images/franchises/legal-solutions.jpg',
    },
  ];

  const getFranchiseTypeLabel = (type: FranchiseType) => {
    return FRANCHISE_TYPES[type] || type;
  };

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Franchise Opportunities</h2>
          <p className="mt-4 text-lg text-gray-600">
            Discover our most successful and promising franchise opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredFranchises.map(franchise => (
            <div
              key={franchise.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48">
                <img
                  src={franchise.imageUrl}
                  alt={franchise.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-blue-600">
                  {getFranchiseTypeLabel(franchise.type)}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{franchise.name}</h3>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-gray-600">{franchise.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{franchise.description}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-700">
                    <span className="font-medium w-24">Investment:</span>
                    <span>{franchise.investment}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="font-medium w-24">Location:</span>
                    <span>{franchise.location}</span>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Learn More
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-white border-2 border-blue-600 text-blue-600 py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">
            View All Franchises
          </button>
        </div>
      </div>
    </div>
  );
};
