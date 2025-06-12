import React, { useState } from 'react';
import { FiBook, FiClock, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

interface EnrollmentStatus {
  isEnrolled: boolean;
  currentClass: string;
  nextLecture: string;
  attendance: number;
}

interface SQLStatus {
  currentLevel: string;
  nextLevel: string;
  progress: number;
  requirements: string[];
}

// Mock data - replace with API calls
const mockEnrollment: EnrollmentStatus = {
  isEnrolled: true,
  currentClass: 'AI Fundamentals',
  nextLecture: '2024-03-16T10:00:00Z',
  attendance: 85,
};

const mockSQLStatus: SQLStatus = {
  currentLevel: 'Basic',
  nextLevel: 'Normal',
  progress: 65,
  requirements: ['Complete 30 daily lectures', 'Maintain 80% attendance', 'Pass final assessment'],
};

export default function HPSDashboard() {
  const [enrollment] = useState<EnrollmentStatus>(mockEnrollment);
  const [sqlStatus] = useState<SQLStatus>(mockSQLStatus);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">My Education Dashboard</h2>

      {/* Enrollment Status */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <FiBook className="w-5 h-5 text-blue-500" />
          <div>
            <p className="font-medium text-gray-900">Current Class</p>
            <p className="text-sm text-gray-600">{enrollment.currentClass}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Next Lecture</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(enrollment.nextLecture).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Attendance</p>
            <p className="text-sm font-medium text-gray-900">{enrollment.attendance}%</p>
          </div>
        </div>
      </div>

      {/* SQL Level Progress */}
      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <FiTrendingUp className="w-5 h-5 text-green-500" />
          <div>
            <p className="font-medium text-gray-900">SQL Level Progress</p>
            <p className="text-sm text-gray-600">
              {sqlStatus.currentLevel} → {sqlStatus.nextLevel}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Progress to {sqlStatus.nextLevel}</span>
            <span className="text-sm font-medium text-gray-900">{sqlStatus.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${sqlStatus.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-yellow-50 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <FiAlertCircle className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="font-medium text-gray-900">Requirements for Next Level</p>
            <p className="text-sm text-gray-600">Complete these to advance</p>
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {sqlStatus.requirements.map((requirement, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2" />
              {requirement}
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Join Today's Lecture
        </button>
        <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
          View Schedule
        </button>
      </div>
    </div>
  );
}
