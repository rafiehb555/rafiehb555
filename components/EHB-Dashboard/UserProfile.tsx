import React from 'react';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiShield,
  FiBell,
  FiLock,
} from 'react-icons/fi';
import { motion } from 'framer-motion';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  role: 'visitor' | 'user' | 'seller' | 'franchise' | 'jps' | 'admin';
  avatar?: string;
  joinDate: string;
  lastLogin: string;
}

interface UserProfileProps {
  user: User;
  onEditProfile: () => void;
  onSecuritySettings: () => void;
  onNotificationSettings: () => void;
}

export default function UserProfile({
  user,
  onEditProfile,
  onSecuritySettings,
  onNotificationSettings,
}: UserProfileProps) {
  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'jps':
        return 'bg-purple-100 text-purple-800';
      case 'franchise':
        return 'bg-blue-100 text-blue-800';
      case 'seller':
        return 'bg-green-100 text-green-800';
      case 'user':
        return 'bg-gray-100 text-gray-800';
      case 'visitor':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
        <button
          onClick={onEditProfile}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <FiEdit2 className="w-4 h-4 mr-2" />
          Edit Profile
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <FiUser className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
                {user.role}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <FiMail className="w-4 h-4 mr-2" />
                {user.email}
              </div>
              {user.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <FiPhone className="w-4 h-4 mr-2" />
                  {user.phone}
                </div>
              )}
              {user.location && (
                <div className="flex items-center text-sm text-gray-600">
                  <FiMapPin className="w-4 h-4 mr-2" />
                  {user.location}
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center space-x-4">
              <button
                onClick={onSecuritySettings}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiShield className="w-4 h-4 mr-2" />
                Security
              </button>
              <button
                onClick={onNotificationSettings}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiBell className="w-4 h-4 mr-2" />
                Notifications
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Member Since</p>
              <p className="mt-1 text-sm text-gray-900">{user.joinDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Last Login</p>
              <p className="mt-1 text-sm text-gray-900">{user.lastLogin}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiLock className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <button
              onClick={onSecuritySettings}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Enable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
