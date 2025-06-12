import React, { useState } from 'react';
import { FiCalendar, FiUser, FiFileText, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

interface MedicalRecord {
  id: string;
  type: 'consultation' | 'procedure' | 'prescription' | 'vaccination';
  date: string;
  provider: string;
  description: string;
  sqlImpact: number;
  status: 'completed' | 'scheduled' | 'cancelled';
  attachments?: {
    name: string;
    url: string;
  }[];
}

interface SQLProgress {
  current: number;
  next: number;
  history: {
    date: string;
    points: number;
    reason: string;
  }[];
}

// Mock data - replace with API calls
const mockRecords: MedicalRecord[] = [
  {
    id: '1',
    type: 'consultation',
    date: '2024-03-01',
    provider: 'Dr. Sarah Johnson',
    description: 'Regular checkup and health assessment',
    sqlImpact: 10,
    status: 'completed',
    attachments: [
      {
        name: 'Consultation Notes',
        url: '/records/consult-notes.pdf',
      },
    ],
  },
  {
    id: '2',
    type: 'vaccination',
    date: '2024-02-15',
    provider: 'Central Health Clinic',
    description: 'Annual flu vaccination',
    sqlImpact: 5,
    status: 'completed',
  },
];

const mockSQLProgress: SQLProgress = {
  current: 75,
  next: 100,
  history: [
    {
      date: '2024-03-01',
      points: 10,
      reason: 'Regular checkup completed',
    },
    {
      date: '2024-02-15',
      points: 5,
      reason: 'Vaccination received',
    },
  ],
};

export default function MedicalHistory() {
  const [records] = useState<MedicalRecord[]>(mockRecords);
  const [sqlProgress] = useState<SQLProgress>(mockSQLProgress);
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredRecords = records.filter(record => {
    return selectedType === 'all' || record.type === selectedType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'scheduled':
        return 'text-blue-600 bg-blue-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return <FiUser className="w-4 h-4" />;
      case 'procedure':
        return <FiFileText className="w-4 h-4" />;
      case 'prescription':
        return <FiFileText className="w-4 h-4" />;
      case 'vaccination':
        return <FiAlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Medical History</h2>
        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Records</option>
          <option value="consultation">Consultations</option>
          <option value="procedure">Procedures</option>
          <option value="prescription">Prescriptions</option>
          <option value="vaccination">Vaccinations</option>
        </select>
      </div>

      {/* SQL Progress */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-blue-900">SQL Progress</h3>
          <div className="flex items-center space-x-2">
            <FiTrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-blue-700">
              {sqlProgress.current} / {sqlProgress.next} points
            </span>
          </div>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${(sqlProgress.current / sqlProgress.next) * 100}%` }}
          />
        </div>
        <div className="mt-4 space-y-2">
          {sqlProgress.history.map((entry, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <FiCalendar className="w-4 h-4 text-blue-500" />
                <span className="text-blue-700">{entry.reason}</span>
              </div>
              <span className="text-blue-900">+{entry.points} points</span>
            </div>
          ))}
        </div>
      </div>

      {/* Medical Records */}
      <div className="space-y-4">
        {filteredRecords.map(record => (
          <div
            key={record.id}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  {getTypeIcon(record.type)}
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">{record.type}</h3>
                </div>
                <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FiCalendar className="w-4 h-4 mr-1" />
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                  <span>•</span>
                  <span>{record.provider}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    record.status
                  )}`}
                >
                  {record.status}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  +{record.sqlImpact} SQL
                </span>
              </div>
            </div>

            <p className="mt-4 text-gray-600">{record.description}</p>

            {record.attachments && record.attachments.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments</h4>
                <div className="space-y-2">
                  {record.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <FiFileText className="w-4 h-4" />
                      <span>{attachment.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
