import React, { useState } from 'react';
import { FiLock, FiUnlock, FiClock, FiTrendingUp, FiInfo } from 'react-icons/fi';

interface LockTerm {
  duration: number;
  bonus: number;
  minAmount: number;
  maxAmount: number;
}

interface CoinLock {
  amount: number;
  term: number;
  startDate: string;
  endDate: string;
  bonus: number;
  status: 'active' | 'expired' | 'pending';
}

// Mock data - replace with API calls
const lockTerms: LockTerm[] = [
  {
    duration: 1,
    bonus: 0.5,
    minAmount: 1000,
    maxAmount: 10000,
  },
  {
    duration: 2,
    bonus: 0.8,
    minAmount: 2000,
    maxAmount: 20000,
  },
  {
    duration: 3,
    bonus: 1.1,
    minAmount: 3000,
    maxAmount: 30000,
  },
];

const mockLock: CoinLock = {
  amount: 5000,
  term: 2,
  startDate: '2024-01-01',
  endDate: '2026-01-01',
  bonus: 0.8,
  status: 'active',
};

export default function CoinLockBonus() {
  const [selectedTerm, setSelectedTerm] = useState<number>(1);
  const [lockAmount, setLockAmount] = useState<number>(1000);
  const [currentLock] = useState<CoinLock>(mockLock);

  const selectedTermData = lockTerms.find(term => term.duration === selectedTerm);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (selectedTermData) {
      setLockAmount(
        Math.min(Math.max(value, selectedTermData.minAmount), selectedTermData.maxAmount)
      );
    }
  };

  const calculateBonus = () => {
    if (!selectedTermData) return 0;
    return (lockAmount * selectedTermData.bonus) / 100;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Coin Lock Bonus</h2>
        <div className="flex items-center space-x-2">
          <FiInfo className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-500">Loyalty Rewards</span>
        </div>
      </div>

      {/* Current Lock Status */}
      {currentLock && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Current Lock</p>
              <p className="text-lg font-semibold text-blue-900">{currentLock.amount} EHBGC</p>
              <p className="text-sm text-blue-600">{currentLock.bonus}% Bonus Rate</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600">Lock Period</p>
              <p className="text-sm text-blue-900">
                {currentLock.startDate} - {currentLock.endDate}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <FiClock className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-blue-600">
              {currentLock.term} Year{currentLock.term > 1 ? 's' : ''} Lock
            </span>
          </div>
        </div>
      )}

      {/* New Lock Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Lock Term</label>
          <div className="grid grid-cols-3 gap-4">
            {lockTerms.map(term => (
              <button
                key={term.duration}
                onClick={() => setSelectedTerm(term.duration)}
                className={`p-4 rounded-lg border ${
                  selectedTerm === term.duration
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {term.duration} Year{term.duration > 1 ? 's' : ''}
                  </span>
                  <FiLock className="w-4 h-4 text-gray-400" />
                </div>
                <p className="mt-1 text-sm text-gray-500">{term.bonus}% Bonus</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lock Amount (EHBGC)
          </label>
          <div className="relative">
            <input
              type="number"
              value={lockAmount}
              onChange={handleAmountChange}
              min={selectedTermData?.minAmount}
              max={selectedTermData?.maxAmount}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute right-3 top-2 text-sm text-gray-500">EHBGC</div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Min: {selectedTermData?.minAmount} | Max: {selectedTermData?.maxAmount}
          </p>
        </div>

        {/* Bonus Preview */}
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Estimated Bonus</p>
              <p className="text-lg font-semibold text-green-900">{calculateBonus()} EHBGC</p>
            </div>
            <FiTrendingUp className="w-6 h-6 text-green-500" />
          </div>
        </div>

        {/* Lock Button */}
        <button className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Lock Coins
        </button>
      </div>

      {/* Auto Mint Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Auto Mint Information</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Bonuses are automatically minted to your wallet</li>
          <li>• Minting occurs at the end of each lock period</li>
          <li>• Early withdrawal forfeits bonus rewards</li>
          <li>• Maximum lock amount increases with SQL level</li>
        </ul>
      </div>
    </div>
  );
}
