import React from 'react';
import { FiTrendingUp, FiUsers, FiShoppingBag, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface Stat {
  id: string;
  name: string;
  value: number;
  change: number;
  icon: React.ElementType;
  color: string;
  prefix?: string;
  suffix?: string;
}

interface DashboardStatsProps {
  stats: Stat[];
  period: 'daily' | 'weekly' | 'monthly';
  onPeriodChange: (period: 'daily' | 'weekly' | 'monthly') => void;
}

export default function DashboardStats({ stats, period, onPeriodChange }: DashboardStatsProps) {
  const periods = [
    { id: 'daily', label: 'Today' },
    { id: 'weekly', label: 'This Week' },
    { id: 'monthly', label: 'This Month' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Dashboard Stats</h2>
        <div className="flex space-x-2">
          {periods.map(p => (
            <button
              key={p.id}
              onClick={() => onPeriodChange(p.id as 'daily' | 'weekly' | 'monthly')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                period === p.id ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div
                className={`flex items-center text-sm font-medium ${
                  stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                <FiTrendingUp
                  className={`w-4 h-4 mr-1 ${
                    stat.change >= 0 ? 'transform rotate-0' : 'transform rotate-180'
                  }`}
                />
                {Math.abs(stat.change)}%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {stat.prefix}
                {stat.value.toLocaleString()}
                {stat.suffix}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {stats.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No statistics available</p>
        </div>
      )}
    </div>
  );
}
