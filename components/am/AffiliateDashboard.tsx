import React, { useState } from 'react';
import { FiUsers, FiLink, FiCopy, FiCheck, FiAlertCircle } from 'react-icons/fi';

interface ReferralStats {
  direct: number;
  indirect: number;
  total: number;
  active: number;
  sqlLevels: {
    [key: number]: number;
  };
}

// Mock data - replace with API calls
const mockStats: ReferralStats = {
  direct: 12,
  indirect: 45,
  total: 57,
  active: 38,
  sqlLevels: {
    1: 15,
    2: 8,
    3: 5,
    4: 2,
    5: 1,
  },
};

export default function AffiliateDashboard() {
  const [stats] = useState<ReferralStats>(mockStats);
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://ehb.com/ref/123456';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Affiliate Dashboard</h2>

      {/* Referral Link */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Referral Link</label>
        <div className="flex">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {copied ? <FiCheck className="w-5 h-5" /> : <FiCopy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Direct Referrals</p>
              <p className="text-2xl font-semibold text-blue-900">{stats.direct}</p>
            </div>
            <FiUsers className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Indirect Referrals</p>
              <p className="text-2xl font-semibold text-green-900">{stats.indirect}</p>
            </div>
            <FiUsers className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Total Network</p>
              <p className="text-2xl font-semibold text-purple-900">{stats.total}</p>
            </div>
            <FiUsers className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Active Members</p>
              <p className="text-2xl font-semibold text-yellow-900">{stats.active}</p>
            </div>
            <FiUsers className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* SQL Level Distribution */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">SQL Level Distribution</h3>
        <div className="space-y-4">
          {Object.entries(stats.sqlLevels).map(([level, count]) => (
            <div key={level} className="flex items-center">
              <div className="w-24">
                <span className="text-sm font-medium text-gray-600">SQL {level}</span>
              </div>
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  />
                </div>
              </div>
              <div className="w-16 text-right">
                <span className="text-sm text-gray-600">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Alert */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <div className="flex items-start">
          <FiAlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Upgrade Your SQL Level</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Increase your earning potential by upgrading your SQL level. Higher levels unlock more
              referral levels and higher commission caps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
