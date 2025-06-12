import React from 'react';
import { FiUsers, FiTrendingUp, FiDollarSign, FiLock, FiAward } from 'react-icons/fi';
import AffiliateDashboard from '../../components/am/AffiliateDashboard';
import ReferralTree from '../../components/am/ReferralTree';
import IncomeSummary from '../../components/am/IncomeSummary';
import CoinLockBonus from '../../components/am/CoinLockBonus';
import SQLCommissionBreakdown from '../../components/am/SQLCommissionBreakdown';

interface ServiceCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
  sqlRequired: number;
}

const serviceCards: ServiceCard[] = [
  {
    title: 'Affiliate Dashboard',
    description: 'Track your referrals and earnings',
    icon: <FiUsers className="w-6 h-6" />,
    link: '#dashboard',
    color: 'bg-blue-500',
    sqlRequired: 1,
  },
  {
    title: 'Referral Tree',
    description: 'View your network structure',
    icon: <FiTrendingUp className="w-6 h-6" />,
    link: '#tree',
    color: 'bg-green-500',
    sqlRequired: 2,
  },
  {
    title: 'Income Summary',
    description: 'Track your earnings and bonuses',
    icon: <FiDollarSign className="w-6 h-6" />,
    link: '#income',
    color: 'bg-purple-500',
    sqlRequired: 1,
  },
  {
    title: 'Coin Lock Bonus',
    description: 'Earn extra with EHBGC',
    icon: <FiLock className="w-6 h-6" />,
    link: '#coin-lock',
    color: 'bg-yellow-500',
    sqlRequired: 2,
  },
  {
    title: 'SQL Commission',
    description: 'View earning potential by level',
    icon: <FiAward className="w-6 h-6" />,
    link: '#commission',
    color: 'bg-red-500',
    sqlRequired: 1,
  },
];

export default function AMPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Affiliate & MLM Program</h1>
        <p className="text-gray-600 mt-2">
          Earn passive income through referrals and network growth
        </p>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceCards.map(card => (
          <a
            key={card.title}
            href={card.link}
            className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className={`${card.color} p-3 rounded-lg text-white`}>{card.icon}</div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{card.title}</h2>
                <p className="text-gray-600">{card.description}</p>
                <span className="inline-block mt-2 text-sm text-gray-500">
                  SQL {card.sqlRequired}+ Required
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Main Components */}
      <div className="space-y-6">
        <AffiliateDashboard />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReferralTree />
          <IncomeSummary />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CoinLockBonus />
          <SQLCommissionBreakdown />
        </div>
      </div>
    </div>
  );
}
