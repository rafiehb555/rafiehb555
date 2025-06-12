import React from 'react';
import { FiUser, FiCheckCircle, FiAward, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';

export type SQLLevel = 0 | 1 | 2 | 3 | 4;

interface SQLLevelBadgeProps {
  level: SQLLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const levelConfig = {
  0: {
    name: 'Free',
    color: 'gray',
    icon: FiUser,
    description: 'No verification',
  },
  1: {
    name: 'Basic',
    color: 'blue',
    icon: FiCheckCircle,
    description: 'PSS (KYC + Documents)',
  },
  2: {
    name: 'Normal',
    color: 'yellow',
    icon: FiAward,
    description: 'PSS + EDR (Skill Test)',
  },
  3: {
    name: 'High',
    color: 'orange',
    icon: FiStar,
    description: 'Normal + EMO/Live Check',
  },
  4: {
    name: 'VIP',
    color: 'green',
    icon: FiAward,
    description: 'Full chain + income/trust',
  },
};

const sizeConfig = {
  sm: {
    container: 'px-2 py-1 text-xs',
    icon: 'w-3 h-3',
    label: 'text-xs',
  },
  md: {
    container: 'px-3 py-1.5 text-sm',
    icon: 'w-4 h-4',
    label: 'text-sm',
  },
  lg: {
    container: 'px-4 py-2 text-base',
    icon: 'w-5 h-5',
    label: 'text-base',
  },
};

export default function SQLLevelBadge({
  level,
  size = 'md',
  showLabel = true,
  animated = false,
  className = '',
}: SQLLevelBadgeProps) {
  const config = levelConfig[level];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  const badgeContent = (
    <div
      className={`
        inline-flex items-center space-x-1.5
        bg-${config.color}-50
        text-${config.color}-700
        border border-${config.color}-200
        rounded-full
        ${sizeStyles.container}
        ${className}
      `}
    >
      <Icon className={`${sizeStyles.icon} text-${config.color}-500`} />
      {showLabel && <span className={`font-medium ${sizeStyles.label}`}>{config.name}</span>}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.05 }}
        className="inline-block"
      >
        {badgeContent}
      </motion.div>
    );
  }

  return badgeContent;
}
