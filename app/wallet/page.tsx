'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Wallet, Transaction } from '@/lib/models/Wallet';

export default function WalletPage() {
  const { data: session } = useSession();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionAmount, setActionAmount] = useState('');
  const [selectedLoyaltyType, setSelectedLoyaltyType] = useState<string>('');

  useEffect(() => {
    fetchWallet();
  }, [session]);

  const fetchWallet = async () => {
    try {
      const response = await fetch('/api/wallet');
      if (!response.ok) {
        throw new Error('Failed to fetch wallet');
      }
      const data = await response.json();
      setWallet(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: 'lock' | 'unlock' | 'updateLoyalty' | 'create') => {
    try {
      const payload: any = { action };

      if (action === 'updateLoyalty') {
        payload.loyaltyType = selectedLoyaltyType;
      } else if (action !== 'create') {
        const amount = parseFloat(actionAmount);
        if (isNaN(amount) || amount <= 0) {
          setError('Please enter a valid amount');
          return;
        }
        payload.amount = amount;
      }

      const response = await fetch('/api/wallet', {
        method: action === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to perform action');
      }

      await fetchWallet();
      setActionAmount('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Wallet Found</h2>
          <button
            onClick={() => handleAction('create')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Wallet
          </button>
        </div>
      </div>
    );
  }

  const monthlyBonus = wallet.lockedBalance * wallet.loyaltyBonus;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h1 className="text-3xl font-bold mb-6">Your Trusty Wallet</h1>

        {/* Balance Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Available Balance</h3>
            <p className="text-3xl font-bold text-blue-600">{wallet.balance} coins</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Locked Balance</h3>
            <p className="text-3xl font-bold text-purple-600">{wallet.lockedBalance} coins</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Monthly Bonus</h3>
            <p className="text-3xl font-bold text-green-600">{monthlyBonus.toFixed(2)} coins</p>
            <p className="text-sm text-green-600 mt-1">
              {wallet.loyaltyBonus * 100}% monthly on locked balance
            </p>
          </div>
        </div>

        {/* Actions Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Wallet Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={actionAmount}
                  onChange={e => setActionAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction('lock')}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Lock Coins
                </button>
                <button
                  onClick={() => handleAction('unlock')}
                  className="flex-1 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                >
                  Unlock Coins
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lock Duration
                </label>
                <select
                  value={selectedLoyaltyType}
                  onChange={e => setSelectedLoyaltyType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select lock duration</option>
                  <option value="1yr">1 Year (0.5% monthly)</option>
                  <option value="2yr">2 Years (1.0% monthly)</option>
                  <option value="3yr">3 Years (1.1% monthly)</option>
                </select>
              </div>
              <button
                onClick={() => handleAction('updateLoyalty')}
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Update Lock Duration
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h2 className="text-xl font-bold mb-4">Transaction History</h2>
          <div className="space-y-4">
            {wallet.transactionHistory.map((transaction: Transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{transaction.type}</p>
                    <p className="text-sm text-gray-600">{transaction.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{transaction.amount} coins</p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
