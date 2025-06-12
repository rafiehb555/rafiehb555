import { useState } from 'react';
import { FiTrendingUp, FiUsers, FiDollarSign, FiMapPin } from 'react-icons/fi';

interface FranchiseData {
  name: string;
  type: 'master' | 'sub';
  location: string;
  totalEarnings: number;
  activeSubFranchises?: number;
  performance: {
    rating: number;
    totalOrders: number;
    completionRate: number;
  };
}

export default function EMOFranchisePanel() {
  const [franchiseData] = useState<FranchiseData>({
    name: 'EHB Franchise - Main Branch',
    type: 'master',
    location: 'New York, USA',
    totalEarnings: 25000,
    activeSubFranchises: 5,
    performance: {
      rating: 4.5,
      totalOrders: 150,
      completionRate: 95,
    },
  });

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Franchise Overview</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              franchiseData.type === 'master'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {franchiseData.type === 'master' ? 'Master Franchise' : 'Sub Franchise'}
          </span>
        </div>
      </div>
      <div className="border-t border-gray-200 px-5 py-5">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Location</dt>
            <dd className="mt-1 text-sm text-gray-900 flex items-center">
              <FiMapPin className="h-4 w-4 mr-1 text-gray-400" />
              {franchiseData.location}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Total Earnings</dt>
            <dd className="mt-1 text-sm text-gray-900 flex items-center">
              <FiDollarSign className="h-4 w-4 mr-1 text-gray-400" />${franchiseData.totalEarnings}
            </dd>
          </div>
          {franchiseData.type === 'master' && (
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Active Sub-Franchises</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <FiUsers className="h-4 w-4 mr-1 text-gray-400" />
                {franchiseData.activeSubFranchises}
              </dd>
            </div>
          )}
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Performance Rating</dt>
            <dd className="mt-1 text-sm text-gray-900 flex items-center">
              <FiTrendingUp className="h-4 w-4 mr-1 text-gray-400" />
              {franchiseData.performance.rating}/5
            </dd>
          </div>
        </dl>
      </div>
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Total Orders</h4>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {franchiseData.performance.totalOrders}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Completion Rate</h4>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {franchiseData.performance.completionRate}%
            </p>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
        <div className="text-sm">
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
            View detailed franchise report
          </a>
        </div>
      </div>
    </div>
  );
}
