import React from 'react';
import { motion } from 'framer-motion';

interface ActivityCardProps {
  message: string;
  time: string;
  type: 'order' | 'user' | 'payment' | 'alert';
}

const typeColors = {
  order: 'bg-blue-500',
  user: 'bg-green-500',
  payment: 'bg-purple-500',
  alert: 'bg-red-500',
};

export default function ActivityCard({ message, time, type }: ActivityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between p-4 rounded-lg border border-gray-100"
    >
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full ${typeColors[type]} mr-3`} />
        <span className="text-sm text-gray-900">{message}</span>
      </div>
      <span className="text-sm text-gray-500">{time}</span>
    </motion.div>
  );
}
