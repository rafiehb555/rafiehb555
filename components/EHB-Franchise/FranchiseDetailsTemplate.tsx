import React from 'react';
import { ServiceCategory, FranchiseType } from './FranchiseUtils/FranchiseTypes';
import { FRANCHISE_CONSTANTS, FRANCHISE_TYPES } from './FranchiseUtils/Constants';

interface FranchiseDetailsProps {
  category: ServiceCategory;
  name: string;
  description: string;
  benefits: string[];
  requirements: string[];
  rewards: string[];
  franchiseTypes: {
    type: FranchiseType;
    description: string;
    investment: string;
  }[];
  bookingEnabled: boolean;
}

export const FranchiseDetailsTemplate: React.FC<FranchiseDetailsProps> = ({
  category,
  name,
  description,
  benefits,
  requirements,
  rewards,
  franchiseTypes,
  bookingEnabled,
}) => {
  const sqlLevels = FRANCHISE_CONSTANTS.SERVICE_CATEGORIES[category];

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{name}</h1>
          <p className="text-xl text-gray-600">{description}</p>
          {!bookingEnabled && (
            <div className="mt-4 inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
              🔒 Booking Coming Soon
            </div>
          )}
        </div>

        {/* SQL Level Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Service Quality Level (SQL) Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Minimum SQL Level:</p>
              <p className="text-xl font-semibold text-blue-600">{sqlLevels.minSQL}</p>
            </div>
            <div>
              <p className="text-gray-600">Maximum SQL Level:</p>
              <p className="text-xl font-semibold text-blue-600">{sqlLevels.maxSQL}</p>
            </div>
          </div>
        </div>

        {/* Franchise Types Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Available Franchise Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {franchiseTypes.map(type => (
              <div key={type.type} className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {FRANCHISE_TYPES[type.type]}
                </h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <p className="text-blue-600 font-semibold">Investment: {type.investment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Franchise Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                <span className="text-green-500">✓</span>
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requirements.map((requirement, index) => (
              <div key={index} className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                <span className="text-blue-500">•</span>
                <p className="text-gray-700">{requirement}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Rewards & Incentives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map((reward, index) => (
              <div key={index} className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                <span className="text-yellow-500">★</span>
                <p className="text-gray-700">{reward}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {bookingEnabled ? (
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Apply Now
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-100 text-gray-400 px-8 py-3 rounded-lg cursor-not-allowed"
            >
              Booking Coming Soon
            </button>
          )}
          <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors">
            Download Brochure
          </button>
        </div>
      </div>
    </div>
  );
};
