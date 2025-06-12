import React from 'react';
import { FiCreditCard, FiLock, FiUnlock, FiArrowUpRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface WalletOverviewProps {
  balance: number;
  lockedCoins: number;
  availableCoins: number;
  recentTransactions: Array<{
    id: string;
    type: 'lock' | 'unlock' | 'transfer';
    amount: number;
    timestamp: string;
    status: 'pending' | 'completed' | 'failed';
  }>;
}

export default function WalletOverview({
  balance,
  lockedCoins,
  availableCoins,
  recentTransactions,
}: WalletOverviewProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Trusty Wallet</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
          View History
          <FiArrowUpRight className="ml-1" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 rounded-lg p-2">
              <FiCreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900">{balance} Coins</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 rounded-lg p-2">
              <FiUnlock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">{availableCoins} Coins</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-purple-500 rounded-lg p-2">
              <FiLock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Locked</p>
              <p className="text-2xl font-bold text-gray-900">{lockedCoins} Coins</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {recentTransactions.map(transaction => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`rounded-full p-2 ${
                    transaction.type === 'lock'
                      ? 'bg-purple-100'
                      : transaction.type === 'unlock'
                        ? 'bg-green-100'
                        : 'bg-blue-100'
                  }`}
                >
                  {transaction.type === 'lock' ? (
                    <FiLock className="w-4 h-4 text-purple-600" />
                  ) : transaction.type === 'unlock' ? (
                    <FiUnlock className="w-4 h-4 text-green-600" />
                  ) : (
                    <FiArrowUpRight className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.type === 'lock'
                      ? 'Coins Locked'
                      : transaction.type === 'unlock'
                        ? 'Coins Unlocked'
                        : 'Coins Transferred'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-medium ${
                    transaction.type === 'lock'
                      ? 'text-purple-600'
                      : transaction.type === 'unlock'
                        ? 'text-green-600'
                        : 'text-blue-600'
                  }`}
                >
                  {transaction.type === 'lock' ? '-' : transaction.type === 'unlock' ? '+' : '→'}{' '}
                  {transaction.amount} Coins
                </p>
                <p
                  className={`text-xs ${
                    transaction.status === 'completed'
                      ? 'text-green-600'
                      : transaction.status === 'pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }`}
                >
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
