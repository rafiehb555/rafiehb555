import React from 'react';
import { FiArrowUpRight, FiArrowDownLeft, FiGift, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface Activity {
  id: string;
  type: 'credit' | 'debit' | 'reward' | 'lock';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'credit':
        return <FiArrowDownLeft className="w-5 h-5 text-green-500" />;
      case 'debit':
        return <FiArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'reward':
        return <FiGift className="w-5 h-5 text-purple-500" />;
      case 'lock':
        return <FiLock className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        <a
          href="/ehb-wallet/transactions"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All
        </a>
      </div>

      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`text-sm font-medium ${
                    activity.type === 'credit' || activity.type === 'reward'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {activity.type === 'credit' || activity.type === 'reward' ? '+' : '-'}
                  {activity.amount.toLocaleString()}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}
                >
                  {activity.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No recent activities</p>
        </div>
      )}
    </div>
  );
}
