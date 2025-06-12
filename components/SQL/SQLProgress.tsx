import React from 'react';
import { motion } from 'framer-motion';
import { SQLLevel, SQLLevelBadge } from './SQLLevelBadge';

interface SQLProgressProps {
  currentLevel: SQLLevel;
  progress: number; // 0-100
  nextLevelRequirements?: {
    description: string;
    completed: boolean;
  }[];
  className?: string;
}

const levelConfig = {
  0: {
    name: 'Free',
    nextLevel: 'Basic',
    color: 'blue',
  },
  1: {
    name: 'Basic',
    nextLevel: 'Normal',
    color: 'yellow',
  },
  2: {
    name: 'Normal',
    nextLevel: 'High',
    color: 'orange',
  },
  3: {
    name: 'High',
    nextLevel: 'VIP',
    color: 'green',
  },
  4: {
    name: 'VIP',
    nextLevel: null,
    color: 'green',
  },
};

export default function SQLProgress({
  currentLevel,
  progress,
  nextLevelRequirements = [],
  className = '',
}: SQLProgressProps) {
  const config = levelConfig[currentLevel];
  const isMaxLevel = currentLevel === 4;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SQLLevelBadge level={currentLevel} size="md" />
          {!isMaxLevel && (
            <>
              <span className="text-gray-400">→</span>
              <SQLLevelBadge level={(currentLevel + 1) as SQLLevel} size="md" />
            </>
          )}
        </div>
        {!isMaxLevel && (
          <span className="text-sm font-medium text-gray-600">{progress}% Complete</span>
        )}
      </div>

      {!isMaxLevel && (
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`absolute top-0 left-0 h-full bg-${config.color}-500`}
          />
        </div>
      )}

      {nextLevelRequirements.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Requirements for {config.nextLevel} Level:
          </h4>
          <ul className="space-y-2">
            {nextLevelRequirements.map((req, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center space-x-2 text-sm"
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    req.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {req.completed ? '✓' : '○'}
                </div>
                <span className={req.completed ? 'text-gray-600' : 'text-gray-500'}>
                  {req.description}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {isMaxLevel && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            Congratulations! You've reached the highest SQL level.
          </p>
        </div>
      )}
    </div>
  );
}
