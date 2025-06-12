import React, { useState } from 'react';
import { FiLock, FiUnlock, FiInfo } from 'react-icons/fi';

interface LockInfo {
  lockedAmount: number;
  lockDuration: number;
  nextRewardDate: string;
  monthlyReward: number;
}

// Mock data - replace with API call
const mockLockInfo: LockInfo = {
  lockedAmount: 1000,
  lockDuration: 12,
  nextRewardDate: '2024-04-01T00:00:00Z',
  monthlyReward: 50,
};

export default function WalletLockManager() {
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('12');
  const [isLocking, setIsLocking] = useState(false);

  const handleLock = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsLocking(true);
    try {
      // TODO: Implement API call to lock coins
      console.log(`Locking ${amount} coins for ${duration} months`);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Coins locked successfully!');
      setAmount('');
    } catch (error) {
      alert('Failed to lock coins. Please try again.');
    } finally {
      setIsLocking(false);
    }
  };

  const handleUnlock = async () => {
    if (!confirm('Are you sure you want to unlock your coins? This will forfeit your rewards.')) {
      return;
    }

    try {
      // TODO: Implement API call to unlock coins
      console.log('Unlocking coins');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Coins unlocked successfully!');
    } catch (error) {
      alert('Failed to unlock coins. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Lock Manager</h2>
        <div className="flex items-center text-sm text-gray-500">
          <FiInfo className="w-4 h-4 mr-1" />
          Lock coins to earn monthly rewards
        </div>
      </div>

      {/* Current Lock Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Lock Status</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Locked Amount</p>
            <p className="text-xl font-semibold text-gray-900">{mockLockInfo.lockedAmount} EHBGC</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Lock Duration</p>
            <p className="text-xl font-semibold text-gray-900">
              {mockLockInfo.lockDuration} months
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Next Reward</p>
            <p className="text-xl font-semibold text-gray-900">
              {mockLockInfo.monthlyReward} EHBGC
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Reward Date</p>
            <p className="text-xl font-semibold text-gray-900">
              {new Date(mockLockInfo.nextRewardDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Lock New Coins */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Lock New Coins</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Lock</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-2 text-gray-500">EHBGC</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lock Duration</label>
            <select
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
              <option value="24">24 months</option>
            </select>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleLock}
              disabled={isLocking}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <FiLock className="w-4 h-4 mr-2" />
              {isLocking ? 'Locking...' : 'Lock Coins'}
            </button>
            <button
              onClick={handleUnlock}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <FiUnlock className="w-4 h-4 mr-2" />
              Unlock Coins
            </button>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">How Locking Works</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Lock your coins for 3, 6, 12, or 24 months</li>
          <li>• Earn monthly rewards based on your lock duration</li>
          <li>• Longer lock periods offer higher reward rates</li>
          <li>• Early unlocking forfeits all rewards</li>
        </ul>
      </div>
    </div>
  );
}
