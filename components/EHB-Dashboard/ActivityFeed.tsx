import React from 'react';
import {
  FiUser,
  FiShoppingCart,
  FiDollarSign,
  FiSettings,
  FiMessageSquare,
  FiStar,
} from 'react-icons/fi';
import { motion } from 'framer-motion';

interface Activity {
  id: string;
  type: 'profile' | 'order' | 'payment' | 'settings' | 'message' | 'review';
  title: string;
  description: string;
  timestamp: Date;
  icon: React.ElementType;
  color: string;
  link?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'profile':
        return <FiUser className="w-5 h-5" />;
      case 'order':
        return <FiShoppingCart className="w-5 h-5" />;
      case 'payment':
        return <FiDollarSign className="w-5 h-5" />;
      case 'settings':
        return <FiSettings className="w-5 h-5" />;
      case 'message':
        return <FiMessageSquare className="w-5 h-5" />;
      case 'review':
        return <FiStar className="w-5 h-5" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        <a href="/activity" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          View all
        </a>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative pl-8"
          >
            <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
              <div className={`text-${activity.color}-500`}>{getActivityIcon(activity.type)}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                <span className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{activity.description}</p>
              {activity.link && (
                <a
                  href={activity.link}
                  className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View details
                </a>
              )}
            </div>
          </motion.div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <FiUser className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="mt-4 text-gray-500">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
}
