import React, { useState } from 'react';
import { FiCalendar, FiCheck, FiX, FiTrendingUp } from 'react-icons/fi';

interface LectureAttendance {
  date: string;
  status: 'attended' | 'missed' | 'upcoming';
  title: string;
  type: 'video' | 'audio' | 'ai';
}

interface ProgressStats {
  totalLectures: number;
  attended: number;
  missed: number;
  upcoming: number;
  streak: number;
}

// Mock data - replace with API calls
const mockAttendance: LectureAttendance[] = [
  {
    date: '2024-03-15T10:00:00Z',
    status: 'attended',
    title: 'Introduction to AI',
    type: 'video',
  },
  {
    date: '2024-03-14T10:00:00Z',
    status: 'missed',
    title: 'Machine Learning Basics',
    type: 'ai',
  },
  {
    date: '2024-03-16T10:00:00Z',
    status: 'upcoming',
    title: 'Deep Learning Fundamentals',
    type: 'video',
  },
];

const mockStats: ProgressStats = {
  totalLectures: 30,
  attended: 25,
  missed: 3,
  upcoming: 2,
  streak: 5,
};

export default function StudentProgress() {
  const [attendance] = useState<LectureAttendance[]>(mockAttendance);
  const [stats] = useState<ProgressStats>(mockStats);

  const getStatusColor = (status: LectureAttendance['status']) => {
    switch (status) {
      case 'attended':
        return 'bg-green-100 text-green-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: LectureAttendance['status']) => {
    switch (status) {
      case 'attended':
        return <FiCheck className="w-4 h-4" />;
      case 'missed':
        return <FiX className="w-4 h-4" />;
      case 'upcoming':
        return <FiCalendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">My Progress</h2>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Total Lectures</p>
          <p className="text-2xl font-semibold text-gray-900">{stats.totalLectures}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Attended</p>
          <p className="text-2xl font-semibold text-green-600">{stats.attended}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Missed</p>
          <p className="text-2xl font-semibold text-red-600">{stats.missed}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Current Streak</p>
          <p className="text-2xl font-semibold text-blue-600">{stats.streak} days</p>
        </div>
      </div>

      {/* Attendance Calendar */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Lectures</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View Calendar
          </button>
        </div>
        <div className="space-y-3">
          {attendance.map((lecture, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${getStatusColor(lecture.status)}`}>
                  {getStatusIcon(lecture.status)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{lecture.title}</p>
                  <p className="text-sm text-gray-500">{new Date(lecture.date).toLocaleString()}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lecture.status)}`}
              >
                {lecture.status.charAt(0).toUpperCase() + lecture.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-900">Overall Progress</h3>
          <span className="text-sm font-medium text-gray-500">
            {Math.round((stats.attended / stats.totalLectures) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${(stats.attended / stats.totalLectures) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {stats.totalLectures - stats.attended} lectures remaining
        </p>
      </div>
    </div>
  );
}
