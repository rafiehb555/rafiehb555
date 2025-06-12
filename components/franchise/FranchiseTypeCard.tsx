import React from 'react';
import { FiArrowRight } from 'react-icons/fi';

interface FranchiseTypeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  sqlLevel: number;
  incomePotential: string;
  areaManagement: string;
  verificationPower: string;
  onApply: () => void;
}

export default function FranchiseTypeCard({
  title,
  description,
  icon,
  sqlLevel,
  incomePotential,
  areaManagement,
  verificationPower,
  onApply,
}: FranchiseTypeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            {icon}
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mt-1">
              SQL Level {sqlLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-6">{description}</p>

      {/* Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-start">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">Income Potential</p>
            <p className="text-sm text-gray-600">{incomePotential}</p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">Area Management</p>
            <p className="text-sm text-gray-600">{areaManagement}</p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">Verification Power</p>
            <p className="text-sm text-gray-600">{verificationPower}</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onApply}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Apply for Franchise
        <FiArrowRight className="ml-2 -mr-1 h-4 w-4" />
      </button>
    </div>
  );
}
