import React from 'react';
import { FiBell, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export default function NotificationsPanel({
  notifications,
  onMarkAsRead,
  onClearAll,
}: NotificationsPanelProps) {
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <FiAlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <FiAlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FiInfo className="w-5 h-5 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FiBell className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {notifications.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-4 hover:bg-gray-50 transition-colors ${
              !notification.read ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <button
                    onClick={() => onMarkAsRead(notification.id)}
                    className={`text-xs font-medium ${
                      notification.read ? 'text-gray-500' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    {notification.read ? 'Read' : 'Mark as read'}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">{notification.timestamp}</p>
                  {notification.link && (
                    <a
                      href={notification.link}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      View Details
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <FiBell className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="mt-4 text-gray-500">No notifications</p>
        </div>
      )}
    </div>
  );
}
