import React from 'react';
import { IconType } from 'react-icons';
import { motion } from 'framer-motion';

interface QuickActionCardProps {
  name: string;
  icon: IconType;
  color: string;
  onClick?: () => void;
}

export default function QuickActionCard({
  name,
  icon: Icon,
  color,
  onClick,
}: QuickActionCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
    >
      <div className={`${color} p-2 rounded-full mr-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-sm font-medium text-gray-900">{name}</span>
    </motion.button>
  );
}
