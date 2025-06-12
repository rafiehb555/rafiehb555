import React, { useState } from 'react';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiCalendar } from 'react-icons/fi';

interface IncomeSource {
  name: string;
  amount: number;
  currency: string;
  trend: number;
  period: 'daily' | 'weekly' | 'monthly';
}

interface IncomeSummary {
  total: number;
  currency: string;
  sources: IncomeSource[];
  period: 'daily' | 'weekly' | 'monthly';
}

// Mock data - replace with API calls
const mockIncome: IncomeSummary = {
  total: 1250,
  currency: 'USD',
  period: 'daily',
  sources: [
    {
      name: 'SQL Bonus',
      amount: 500,
      currency: 'USD',
      trend: 15,
      period: 'daily',
    },
    {
      name: 'Product Commissions',
      amount: 300,
      currency: 'USD',
      trend: -5,
      period: 'daily',
    },
    {
      name: 'Service Cuts',
      amount: 250,
      currency: 'USD',
      trend: 8,
      period: 'daily',
    },
    {
      name: 'Franchise Income',
      amount: 200,
      currency: 'USD',
      trend: 12,
      period: 'daily',
    },
  ],
};

export default function IncomeSummary() {
  const [income] = useState<IncomeSummary>(mockIncome);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const getTrendColor = (trend: number) => {
    return trend >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const getTrendIcon = (trend: number) => {
    return trend >= 0 ? (
      <FiTrendingUp className="w-4 h-4" />
    ) : (
      <FiTrendingDown className="w-4 h-4" />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Income Summary</h2>
        <div className="flex space-x-2">
          {(['daily', 'weekly', 'monthly'] as const).map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                selectedPeriod === period
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Total Income */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Income</p>
            <p className="text-3xl font-bold text-gray-900">
              {income.currency} {income.total}
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <FiDollarSign className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Income Sources */}
      <div className="space-y-4">
        {income.sources.map(source => (
          <div
            key={source.name}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">{source.name}</p>
              <p className="text-lg font-semibold text-gray-900">
                {source.currency} {source.amount}
              </p>
            </div>
            <div className={`flex items-center space-x-1 ${getTrendColor(source.trend)}`}>
              {getTrendIcon(source.trend)}
              <span className="text-sm font-medium">{Math.abs(source.trend)}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Income Chart Placeholder */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">Income Trend</h3>
          <FiCalendar className="w-5 h-5 text-gray-400" />
        </div>
        <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-sm text-gray-500">Chart visualization will be added here</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-600">Highest Earning Source</p>
          <p className="text-lg font-semibold text-green-900">SQL Bonus</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600">Fastest Growing</p>
          <p className="text-lg font-semibold text-blue-900">Franchise Income</p>
        </div>
      </div>
    </div>
  );
}
