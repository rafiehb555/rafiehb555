import React, { useState } from 'react';
import { FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';

type TransactionType = 'booking' | 'reward' | 'fine' | 'transfer';

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

// Mock data - replace with API call
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'booking',
    amount: -50,
    description: 'GoSellr Franchise Booking',
    date: '2024-03-15T10:30:00Z',
    status: 'completed',
  },
  {
    id: '2',
    type: 'reward',
    amount: 25,
    description: 'Monthly Lock Reward',
    date: '2024-03-01T00:00:00Z',
    status: 'completed',
  },
  {
    id: '3',
    type: 'fine',
    amount: -100,
    description: 'Late Payment Fine',
    date: '2024-02-28T15:45:00Z',
    status: 'completed',
  },
  {
    id: '4',
    type: 'transfer',
    amount: -200,
    description: 'Transfer to User #1234',
    date: '2024-02-25T09:15:00Z',
    status: 'completed',
  },
];

const typeColors: Record<TransactionType, { bg: string; text: string }> = {
  booking: { bg: 'bg-blue-100', text: 'text-blue-800' },
  reward: { bg: 'bg-green-100', text: 'text-green-800' },
  fine: { bg: 'bg-red-100', text: 'text-red-800' },
  transfer: { bg: 'bg-purple-100', text: 'text-purple-800' },
};

export default function WalletTransactions() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState<TransactionType | 'all'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filteredTransactions = mockTransactions.filter(transaction => {
    if (selectedType !== 'all' && transaction.type !== selectedType) {
      return false;
    }
    // Add date range filtering logic here
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <FiFilter className="w-4 h-4 mr-2" />
          Filters
          {showFilters ? (
            <FiChevronUp className="w-4 h-4 ml-2" />
          ) : (
            <FiChevronDown className="w-4 h-4 ml-2" />
          )}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value as TransactionType | 'all')}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="booking">Booking</option>
              <option value="reward">Reward</option>
              <option value="fine">Fine</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.map(transaction => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  typeColors[transaction.type].bg
                }`}
              >
                <span className={`text-sm font-medium ${typeColors[transaction.type].text}`}>
                  {transaction.type.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-medium ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {transaction.amount > 0 ? '+' : ''}
                {transaction.amount} EHBGC
              </p>
              <p className="text-sm text-gray-500 capitalize">{transaction.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
