import React from 'react';
import { FiArrowUpRight, FiArrowDownLeft, FiDollarSign, FiCreditCard } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface Transaction {
  id: string;
  type: 'credit' | 'debit' | 'refund' | 'transfer';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  category?: string;
  paymentMethod?: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'credit':
        return <FiArrowDownLeft className="w-5 h-5 text-green-500" />;
      case 'debit':
        return <FiArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'refund':
        return <FiArrowDownLeft className="w-5 h-5 text-blue-500" />;
      case 'transfer':
        return <FiArrowUpRight className="w-5 h-5 text-purple-500" />;
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
    }
  };

  const getAmountColor = (type: Transaction['type']) => {
    switch (type) {
      case 'credit':
      case 'refund':
        return 'text-green-600';
      case 'debit':
      case 'transfer':
        return 'text-red-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
        <a href="/transactions" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          View All
        </a>
      </div>

      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">{getTransactionIcon(transaction.type)}</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-gray-500">{transaction.timestamp}</p>
                    {transaction.category && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                        {transaction.category}
                      </span>
                    )}
                    {transaction.paymentMethod && (
                      <div className="flex items-center text-xs text-gray-500">
                        <FiCreditCard className="w-3 h-3 mr-1" />
                        {transaction.paymentMethod}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-sm font-medium ${getAmountColor(transaction.type)}`}>
                  {transaction.type === 'credit' || transaction.type === 'refund' ? '+' : '-'}$
                  {transaction.amount.toLocaleString()}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}
                >
                  {transaction.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <FiDollarSign className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="mt-4 text-gray-500">No recent transactions</p>
        </div>
      )}
    </div>
  );
}
