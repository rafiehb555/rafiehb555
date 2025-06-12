import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiTarget, FiBarChart2 } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface Metric {
  id: string;
  name: string;
  value: number;
  target: number;
  change: number;
  unit: string;
  icon: React.ElementType;
  color: string;
}

interface PerformanceMetricsProps {
  metrics: Metric[];
  period: 'daily' | 'weekly' | 'monthly';
  onPeriodChange: (period: 'daily' | 'weekly' | 'monthly') => void;
}

export default function PerformanceMetrics({
  metrics,
  period,
  onPeriodChange,
}: PerformanceMetricsProps) {
  const periods = [
    { id: 'daily', label: 'Today' },
    { id: 'weekly', label: 'This Week' },
    { id: 'monthly', label: 'This Month' },
  ];

  const calculateProgress = (value: number, target: number) => {
    return Math.min((value / target) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Performance Metrics</h2>
        <div className="flex space-x-2">
          {periods.map(p => (
            <button
              key={p.id}
              onClick={() => onPeriodChange(p.id as 'daily' | 'weekly' | 'monthly')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                period === p.id ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div className={`${metric.color} p-3 rounded-lg`}>
                <metric.icon className="w-6 h-6" />
              </div>
              <div
                className={`flex items-center text-sm font-medium ${
                  metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {metric.change >= 0 ? (
                  <FiTrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <FiTrendingDown className="w-4 h-4 mr-1" />
                )}
                {Math.abs(metric.change)}%
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-600">{metric.name}</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {metric.value.toLocaleString()}
                {metric.unit}
              </p>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Target: {metric.target.toLocaleString()}
                  {metric.unit}
                </span>
                <span className="text-gray-900">
                  {calculateProgress(metric.value, metric.target).toFixed(1)}%
                </span>
              </div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    calculateProgress(metric.value, metric.target) >= 100
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                  }`}
                  style={{
                    width: `${calculateProgress(metric.value, metric.target)}%`,
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {metrics.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <FiBarChart2 className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="mt-4 text-gray-500">No metrics available</p>
        </div>
      )}
    </div>
  );
}
