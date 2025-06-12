import React from 'react';
import { FiAward, FiTrendingUp, FiAlertCircle, FiCheck } from 'react-icons/fi';

interface SQLTier {
  level: number;
  name: string;
  referralAccess: string;
  maxLevels: number;
  bonusCap: number;
  features: string[];
}

// Mock data - replace with API calls
const sqlTiers: SQLTier[] = [
  {
    level: 0,
    name: 'Free',
    referralAccess: 'None',
    maxLevels: 0,
    bonusCap: 0,
    features: ['Basic platform access', 'View-only mode'],
  },
  {
    level: 1,
    name: 'Basic',
    referralAccess: '1 Level',
    maxLevels: 2,
    bonusCap: 10,
    features: ['Direct referrals', 'Basic commission structure', 'Limited earning potential'],
  },
  {
    level: 2,
    name: 'Normal',
    referralAccess: '2 Levels',
    maxLevels: 5,
    bonusCap: 50,
    features: ['Extended referral network', 'Higher commission rates', 'Basic analytics'],
  },
  {
    level: 3,
    name: 'High',
    referralAccess: '3 Levels',
    maxLevels: 8,
    bonusCap: 300,
    features: [
      'Deep referral network',
      'Premium commission rates',
      'Advanced analytics',
      'Priority support',
    ],
  },
  {
    level: 4,
    name: 'VIP',
    referralAccess: 'Full Access',
    maxLevels: Infinity,
    bonusCap: Infinity,
    features: [
      'Unlimited referral levels',
      'Maximum commission rates',
      'Premium analytics',
      'VIP support',
      'Exclusive features',
    ],
  },
];

export default function SQLCommissionBreakdown() {
  const currentSQL = 2; // Mock current SQL level

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">SQL Commission Structure</h2>
        <div className="flex items-center space-x-2">
          <FiAward className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-500">Earning Potential</span>
        </div>
      </div>

      {/* SQL Tiers */}
      <div className="space-y-4">
        {sqlTiers.map(tier => (
          <div
            key={tier.level}
            className={`p-4 rounded-lg border ${
              tier.level === currentSQL ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-gray-900">{tier.name}</span>
                {tier.level === currentSQL && (
                  <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                    Current Level
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Max Bonus Cap</p>
                <p className="text-lg font-semibold text-gray-900">
                  {tier.bonusCap === Infinity ? 'Unlimited' : `$${tier.bonusCap}`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-600">Referral Access</p>
                <p className="text-sm font-medium text-gray-900">{tier.referralAccess}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Max Levels</p>
                <p className="text-sm font-medium text-gray-900">
                  {tier.maxLevels === Infinity ? 'Unlimited' : tier.maxLevels}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Features</p>
              <ul className="space-y-1">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <FiCheck className="w-4 h-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade Prompt */}
      {currentSQL < 4 && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-start">
            <FiAlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Upgrade Your SQL Level</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Increase your earning potential by upgrading to the next SQL level. Higher levels
                unlock more referral levels and higher commission caps.
              </p>
              <button className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Commission Rates */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Commission Rates by Level</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Direct Referral
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Indirect Referral
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team Bonus
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sqlTiers.map(tier => (
                <tr key={tier.level}>
                  <td className="px-4 py-2 text-sm text-gray-900">{tier.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {tier.level === 0 ? '-' : `${5 + tier.level}%`}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {tier.level <= 1 ? '-' : `${2 + tier.level}%`}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {tier.level <= 2 ? '-' : `${1 + tier.level}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
