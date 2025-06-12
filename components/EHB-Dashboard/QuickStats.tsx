import React from 'react';
import { FiDollarSign, FiTrendingUp, FiCalendar, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface QuickStatsProps {
  coins: number;
  sqlLevel: number;
  earnings: number;
  bookings: number;
}

export default function QuickStats({ coins, sqlLevel, earnings, bookings }: QuickStatsProps) {
  const stats = [
    {
      id: 1,
      name: 'EHB Coins',
      value: coins.toLocaleString(),
      icon: FiDollarSign,
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      id: 2,
      name: 'SQL Level',
      value: `Level ${sqlLevel}`,
      icon: FiStar,
      color: 'bg-green-100 text-green-800',
    },
    {
      id: 3,
      name: 'Total Earnings',
      value: `$${earnings.toLocaleString()}`,
      icon: FiTrendingUp,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      id: 4,
      name: 'Active Bookings',
      value: bookings.toLocaleString(),
      icon: FiCalendar,
      color: 'bg-purple-100 text-purple-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map(stat => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-full`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
