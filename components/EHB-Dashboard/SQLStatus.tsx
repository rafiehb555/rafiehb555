import React from 'react';
import { FiAward, FiArrowUp, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface SQLTier {
  level: number;
  name: string;
  description: string;
  benefits: string[];
  requiredCoins: number;
  isCurrent: boolean;
  isLocked: boolean;
}

interface SQLStatusProps {
  currentLevel: number;
  progress: number;
  tiers: SQLTier[];
  onUpgrade: (level: number) => void;
}

export default function SQLStatus({ currentLevel, progress, tiers, onUpgrade }: SQLStatusProps) {
  const currentTier = tiers.find(tier => tier.level === currentLevel);
  const nextTier = tiers.find(tier => tier.level === currentLevel + 1);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">SQL Status</h2>
        <div className="flex items-center space-x-2">
          <FiAward className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-medium text-gray-900">Level {currentLevel}</span>
        </div>
      </div>

      {currentTier && (
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4">
          <div className="flex items-start space-x-4">
            <div className="bg-yellow-500 rounded-lg p-2">
              <FiAward className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">{currentTier.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{currentTier.description}</p>
              <div className="mt-3 space-y-2">
                {currentTier.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <FiCheck className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {nextTier && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Next Level</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Progress:</span>
              <span className="text-sm font-medium text-gray-900">{progress}%</span>
            </div>
          </div>

          <div className="bg-gray-100 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="bg-yellow-500 h-2 rounded-full"
            />
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start space-x-4">
              <div className="bg-gray-200 rounded-lg p-2">
                <FiArrowUp className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{nextTier.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{nextTier.description}</p>
                <div className="mt-3">
                  <button
                    onClick={() => onUpgrade(nextTier.level)}
                    disabled={nextTier.isLocked}
                    className={`w-full py-2 px-4 rounded-lg text-sm font-medium ${
                      nextTier.isLocked
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    }`}
                  >
                    {nextTier.isLocked
                      ? `Locked (${nextTier.requiredCoins} Coins Required)`
                      : 'Upgrade Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">All Tiers</h3>
        <div className="space-y-3">
          {tiers.map(tier => (
            <motion.div
              key={tier.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-lg ${
                tier.isCurrent ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{tier.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{tier.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{tier.requiredCoins} Coins</p>
                  {tier.isCurrent && <p className="text-xs text-yellow-600 mt-1">Current Level</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
