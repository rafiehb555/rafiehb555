import React from 'react';
import { FiBell, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface User {
  name: string;
  role: 'visitor' | 'user' | 'seller' | 'franchise' | 'jps' | 'admin';
  avatar?: string;
  sqlLevel: number;
}

interface HeaderBarProps {
  user?: User;
  onLogout?: () => void;
}

export default function HeaderBar({ user, onLogout }: HeaderBarProps) {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);

  const notifications = [
    { id: 1, message: 'New order received', time: '2 minutes ago' },
    { id: 2, message: 'SQL level upgrade available', time: '1 hour ago' },
    { id: 3, message: 'Franchise application approved', time: '1 day ago' },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-blue-600">EHB Dashboard</h1>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FiBell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200"
                >
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Notifications</h3>
                    <div className="space-y-2">
                      {notifications.map(notification => (
                        <div
                          key={notification.id}
                          className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                        >
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  <span className="text-sm font-medium">{user.name}</span>
                </button>

                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200"
                  >
                    <div className="p-2">
                      <button className="w-full flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <FiSettings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </button>
                      <button
                        onClick={onLogout}
                        className="w-full flex items-center space-x-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
