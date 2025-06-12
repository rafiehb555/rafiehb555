import React from 'react';
import { IconType } from 'react-icons';
import { motion } from 'framer-motion';

interface StatsCardProps {
  name: string;
  value: string;
  change: string;
  icon: IconType;
  color: string;
}

export default function StatsCard({ name, value, change, icon: Icon, color }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{name}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-full`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4">
        <span className="text-sm font-medium text-green-600">{change}</span>
        <span className="text-sm text-gray-600"> from last month</span>
      </div>
    </motion.div>
  );
}
