import React from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiUser, FiShield, FiInfo } from 'react-icons/fi';
import { SQLLevel } from './SQLLevelBadge';
import SQLLevelBadge from './SQLLevelBadge';

interface SQLUserInfoProps {
  currentLevel: SQLLevel;
  issuedBy: string;
  issuedAt: string;
  expiryDate?: string;
  verificationStatus: 'verified' | 'pending' | 'expired';
  benefits: string[];
  className?: string;
}

const levelConfig = {
  0: {
    name: 'Free',
    color: 'gray',
    description: 'No verification required',
  },
  1: {
    name: 'Basic',
    color: 'blue',
    description: 'PSS (KYC + Documents) verified',
  },
  2: {
    name: 'Normal',
    color: 'yellow',
    description: 'PSS + EDR (Skill Test) verified',
  },
  3: {
    name: 'High',
    color: 'orange',
    description: 'Normal + EMO/Live Check verified',
  },
  4: {
    name: 'VIP',
    color: 'green',
    description: 'Full chain + income/trust verified',
  },
};

export default function SQLUserInfo({
  currentLevel,
  issuedBy,
  issuedAt,
  expiryDate,
  verificationStatus,
  benefits,
  className = '',
}: SQLUserInfoProps) {
  const config = levelConfig[currentLevel];

  const getStatusColor = (status: SQLUserInfoProps['verificationStatus']) => {
    switch (status) {
      case 'verified':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'expired':
        return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-gray-900">SQL Level Information</h2>
          <p className="text-sm text-gray-500">{config.description}</p>
        </div>
        <SQLLevelBadge level={currentLevel} size="lg" animated />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 bg-white rounded-lg border"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FiUser className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Issued By</p>
              <p className="text-sm text-gray-500">{issuedBy}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-4 bg-white rounded-lg border"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FiCalendar className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Issued Date</p>
              <p className="text-sm text-gray-500">{new Date(issuedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </motion.div>

        {expiryDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="p-4 bg-white rounded-lg border"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiCalendar className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Expiry Date</p>
                <p className="text-sm text-gray-500">{new Date(expiryDate).toLocaleDateString()}</p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="p-4 bg-white rounded-lg border"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FiShield className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Verification Status</p>
              <p className={`text-sm ${getStatusColor(verificationStatus)}`}>
                {verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Level Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start space-x-3 p-4 bg-white rounded-lg border"
            >
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiInfo className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-sm text-gray-600">{benefit}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
