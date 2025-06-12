import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface DataPoint {
  date: string;
  value: number;
}

interface ActivityChartProps {
  title: string;
  data: DataPoint[];
  period: 'daily' | 'weekly' | 'monthly';
  onPeriodChange: (period: 'daily' | 'weekly' | 'monthly') => void;
  valuePrefix?: string;
  valueSuffix?: string;
  change: number;
}

export default function ActivityChart({
  title,
  data,
  period,
  onPeriodChange,
  valuePrefix = '',
  valueSuffix = '',
  change,
}: ActivityChartProps) {
  const periods = [
    { id: 'daily', label: 'Today' },
    { id: 'weekly', label: 'This Week' },
    { id: 'monthly', label: 'This Month' },
  ];

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-semibold text-gray-900">
              {valuePrefix}
              {data[data.length - 1]?.value.toLocaleString()}
              {valueSuffix}
            </span>
            <div
              className={`flex items-center ml-4 text-sm font-medium ${
                change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {change >= 0 ? (
                <FiTrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <FiTrendingDown className="w-4 h-4 mr-1" />
              )}
              {Math.abs(change)}%
            </div>
          </div>
        </div>
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

      <div className="relative h-64">
        {data.length > 0 ? (
          <div className="absolute inset-0">
            <svg
              className="w-full h-full"
              preserveAspectRatio="none"
              viewBox={`0 0 ${data.length * 50} 200`}
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={data
                  .map((point, index) => {
                    const x = index * 50;
                    const y = 200 - ((point.value - minValue) / range) * 180;
                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
              />
              <path
                d={`${data
                  .map((point, index) => {
                    const x = index * 50;
                    const y = 200 - ((point.value - minValue) / range) * 180;
                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                  })
                  .join(' ')} L ${(data.length - 1) * 50} 200 L 0 200 Z`}
                fill="url(#gradient)"
              />
            </svg>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-4 text-xs text-gray-500">
        {data.map((point, index) => (
          <div key={index} className="flex flex-col items-center">
            <span>{point.date}</span>
            <span className="mt-1">
              {valuePrefix}
              {point.value.toLocaleString()}
              {valueSuffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
