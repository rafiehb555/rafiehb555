import React, { useState } from 'react';
import { FiActivity, FiHeart, FiThermometer, FiAlertCircle } from 'react-icons/fi';

interface HealthMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  status: 'normal' | 'warning' | 'critical';
}

interface HealthTip {
  id: string;
  title: string;
  description: string;
  category: 'general' | 'diet' | 'exercise' | 'mental';
}

// Mock data - replace with API calls
const mockMetrics: HealthMetric[] = [
  {
    id: '1',
    name: 'Heart Rate',
    value: '72',
    unit: 'bpm',
    icon: <FiHeart className="w-5 h-5" />,
    status: 'normal',
  },
  {
    id: '2',
    name: 'Blood Pressure',
    value: '120/80',
    unit: 'mmHg',
    icon: <FiActivity className="w-5 h-5" />,
    status: 'normal',
  },
  {
    id: '3',
    name: 'Temperature',
    value: '36.6',
    unit: '°C',
    icon: <FiThermometer className="w-5 h-5" />,
    status: 'normal',
  },
];

const mockTips: HealthTip[] = [
  {
    id: '1',
    title: 'Stay Hydrated',
    description: 'Drink at least 8 glasses of water daily for optimal health.',
    category: 'general',
  },
  {
    id: '2',
    title: 'Regular Exercise',
    description: 'Aim for 30 minutes of moderate exercise 5 days a week.',
    category: 'exercise',
  },
];

export default function HealthDashboard() {
  const [metrics] = useState<HealthMetric[]>(mockMetrics);
  const [tips] = useState<HealthTip[]>(mockTips);
  const [userSqlLevel] = useState<'free' | 'basic' | 'normal'>('normal');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'critical':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Health Dashboard</h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          SQL Level: {userSqlLevel}
        </span>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map(metric => (
          <div key={metric.id} className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4">
            <div className={`${getStatusColor(metric.status)} p-3 rounded-lg`}>{metric.icon}</div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">{metric.name}</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {metric.value}
                <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Health Tips */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">AI Health Tips</h3>
        <div className="space-y-4">
          {tips.map(tip => (
            <div key={tip.id} className="bg-blue-50 rounded-lg p-4 flex items-start space-x-3">
              <FiAlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">{tip.title}</h4>
                <p className="text-blue-700 mt-1">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Book Checkup
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
          Upload Report
        </button>
      </div>
    </div>
  );
}
