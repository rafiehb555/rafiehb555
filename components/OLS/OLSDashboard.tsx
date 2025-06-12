import React, { useState } from 'react';
import {
  FiUser,
  FiFileText,
  FiUpload,
  FiMessageSquare,
  FiCalendar,
  FiDollarSign,
} from 'react-icons/fi';

interface LegalService {
  id: string;
  title: string;
  type: 'consultation' | 'document' | 'case';
  status: 'active' | 'pending' | 'completed';
  lawyer: string;
  date: string;
  sqlImpact: number;
}

// Mock data - replace with API calls
const mockServices: LegalService[] = [
  {
    id: '1',
    title: 'Property Dispute Consultation',
    type: 'consultation',
    status: 'active',
    lawyer: 'John Smith',
    date: '2024-03-15',
    sqlImpact: 15,
  },
  {
    id: '2',
    title: 'Contract Review',
    type: 'document',
    status: 'pending',
    lawyer: 'Sarah Johnson',
    date: '2024-03-20',
    sqlImpact: 10,
  },
];

export default function OLSDashboard() {
  const [services] = useState<LegalService[]>(mockServices);
  const [userSqlLevel] = useState<'free' | 'basic' | 'normal' | 'high'>('basic');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'completed':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Legal Services Overview</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">SQL Level:</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {userSqlLevel}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <FiCalendar className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-sm text-blue-600">Active Cases</p>
              <p className="text-xl font-semibold text-blue-900">
                {services.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <FiDollarSign className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-sm text-green-600">SQL Earned</p>
              <p className="text-xl font-semibold text-green-900">
                {services.reduce((sum, service) => sum + service.sqlImpact, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <FiUser className="w-6 h-6 text-purple-500" />
            <div>
              <p className="text-sm text-purple-600">Assigned Lawyers</p>
              <p className="text-xl font-semibold text-purple-900">
                {new Set(services.map(s => s.lawyer)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Services */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Active Services</h3>
        <div className="space-y-4">
          {services.map(service => (
            <div
              key={service.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{service.title}</h4>
                  <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiUser className="w-4 h-4 mr-1" />
                      {service.lawyer}
                    </div>
                    <div className="flex items-center">
                      <FiCalendar className="w-4 h-4 mr-1" />
                      {new Date(service.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      service.status
                    )}`}
                  >
                    {service.status}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    +{service.sqlImpact} SQL
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="flex items-center justify-center space-x-2 bg-blue-50 text-blue-700 rounded-lg p-4 hover:bg-blue-100 transition-colors">
          <FiUser className="w-5 h-5" />
          <span>Find Lawyer</span>
        </button>
        <button className="flex items-center justify-center space-x-2 bg-green-50 text-green-700 rounded-lg p-4 hover:bg-green-100 transition-colors">
          <FiFileText className="w-5 h-5" />
          <span>View Cases</span>
        </button>
        <button className="flex items-center justify-center space-x-2 bg-purple-50 text-purple-700 rounded-lg p-4 hover:bg-purple-100 transition-colors">
          <FiUpload className="w-5 h-5" />
          <span>Upload Documents</span>
        </button>
        <button className="flex items-center justify-center space-x-2 bg-yellow-50 text-yellow-700 rounded-lg p-4 hover:bg-yellow-100 transition-colors">
          <FiMessageSquare className="w-5 h-5" />
          <span>AI Legal Help</span>
        </button>
      </div>
    </div>
  );
}
