import React from 'react';
import Link from 'next/link';
import { ServiceCategory } from '../FranchiseUtils/FranchiseTypes';
import { FRANCHISE_CONSTANTS } from '../FranchiseUtils/Constants';

interface ServiceCard {
  category: ServiceCategory;
  name: string;
  status: 'active' | 'coming-soon';
  bookingEnabled: boolean;
  link: string;
  description: string;
  minInvestment: string;
  maxInvestment: string;
}

export const FranchiseServiceGrid: React.FC = () => {
  const services: ServiceCard[] = [
    {
      category: ServiceCategory.GOSELLR,
      name: 'GoSellr',
      status: 'active',
      bookingEnabled: true,
      link: '/ehb-franchise/gosellr',
      description: 'E-commerce and delivery solutions franchise',
      minInvestment: '$50,000',
      maxInvestment: '$100,000',
    },
    {
      category: ServiceCategory.HEALTH,
      name: 'Health Services',
      status: 'coming-soon',
      bookingEnabled: false,
      link: '/ehb-franchise/health',
      description: 'Healthcare and medical services franchise',
      minInvestment: '$100,000',
      maxInvestment: '$200,000',
    },
    {
      category: ServiceCategory.LAW,
      name: 'Legal Services',
      status: 'coming-soon',
      bookingEnabled: false,
      link: '/ehb-franchise/law',
      description: 'Legal consultation and services franchise',
      minInvestment: '$150,000',
      maxInvestment: '$300,000',
    },
    {
      category: ServiceCategory.EDUCATION,
      name: 'Education Services',
      status: 'coming-soon',
      bookingEnabled: false,
      link: '/ehb-franchise/education',
      description: 'Educational services and learning center franchise',
      minInvestment: '$80,000',
      maxInvestment: '$150,000',
    },
    {
      category: ServiceCategory.TRAVEL,
      name: 'Travel Services',
      status: 'coming-soon',
      bookingEnabled: false,
      link: '/ehb-franchise/travel',
      description: 'Travel and tourism services franchise',
      minInvestment: '$70,000',
      maxInvestment: '$120,000',
    },
    {
      category: ServiceCategory.BOOKS,
      name: 'Book Services',
      status: 'coming-soon',
      bookingEnabled: false,
      link: '/ehb-franchise/books',
      description: 'Book retail and library services franchise',
      minInvestment: '$40,000',
      maxInvestment: '$80,000',
    },
  ];

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Available Franchise Opportunities</h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose from our range of franchise opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(service => (
            <div
              key={service.category}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      service.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {service.status === 'active' ? 'Active' : 'Coming Soon'}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{service.description}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-700">
                    <span className="font-medium w-24">Investment:</span>
                    <span>
                      {service.minInvestment} - {service.maxInvestment}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="font-medium w-24">SQL Level:</span>
                    <span>
                      {FRANCHISE_CONSTANTS.SERVICE_CATEGORIES[service.category].minSQL} -{' '}
                      {FRANCHISE_CONSTANTS.SERVICE_CATEGORIES[service.category].maxSQL}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-4">
                  {service.bookingEnabled ? (
                    <Link
                      href={`${service.link}/booking`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Book Now
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="flex-1 bg-gray-100 text-gray-400 text-center py-2 px-4 rounded-lg cursor-not-allowed"
                    >
                      Booking Coming Soon
                    </button>
                  )}
                  <Link
                    href={service.link}
                    className="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
