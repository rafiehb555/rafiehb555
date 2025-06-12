import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiClock } from 'react-icons/fi';
import { SQLLevel } from './SQLLevelBadge';

interface UpgradeStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'in-progress';
  link?: string;
}

interface SQLUpgradeStepsProps {
  currentLevel: SQLLevel;
  targetLevel: SQLLevel;
  steps: UpgradeStep[];
  onStepClick?: (stepId: string) => void;
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

export default function SQLUpgradeSteps({
  currentLevel,
  targetLevel,
  steps,
  onStepClick,
  className = '',
}: SQLUpgradeStepsProps) {
  const config = levelConfig[currentLevel];

  const getStepIcon = (status: UpgradeStep['status']) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <FiClock className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <FiAlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepStatusColor = (status: UpgradeStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'in-progress':
        return 'bg-blue-50 border-blue-200';
      case 'pending':
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">Upgrade to {config.nextLevel} Level</h3>
        <p className="mt-1 text-sm text-gray-500">
          Complete the following steps to upgrade your SQL level
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`
              relative p-4 rounded-lg border
              ${getStepStatusColor(step.status)}
              ${step.link ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
            `}
            onClick={() => step.link && onStepClick?.(step.id)}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">{getStepIcon(step.status)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900">{step.title}</h4>
                <p className="mt-1 text-sm text-gray-500">{step.description}</p>
              </div>
              {step.link && (
                <div className="flex-shrink-0">
                  <span className="text-sm font-medium text-blue-600">
                    {step.status === 'completed' ? 'View' : 'Start'}
                  </span>
                </div>
              )}
            </div>

            {index < steps.length - 1 && (
              <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900">Important Notes:</h4>
        <ul className="mt-2 space-y-2 text-sm text-gray-500">
          <li>• All steps must be completed in order</li>
          <li>• Some steps may require additional verification</li>
          <li>• Your progress will be saved automatically</li>
          <li>• Contact support if you need assistance</li>
        </ul>
      </div>
    </div>
  );
}
