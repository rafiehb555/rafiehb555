import React from 'react';
import { FiBook, FiCalendar, FiUsers, FiTrendingUp } from 'react-icons/fi';
import HPSDashboard from '@/components/hps/HPSDashboard';
import LectureManager from '@/components/hps/LectureManager';
import StudentProgress from '@/components/hps/StudentProgress';

interface ServiceCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const serviceCards: ServiceCard[] = [
  {
    title: 'Enroll in Class',
    description: 'Join our AI-powered education program',
    icon: <FiBook className="w-6 h-6" />,
    href: '/hps/enroll',
    color: 'bg-blue-500',
  },
  {
    title: 'Daily Lectures',
    description: 'Track your 45-minute daily learning sessions',
    icon: <FiCalendar className="w-6 h-6" />,
    href: '/hps/lectures',
    color: 'bg-green-500',
  },
  {
    title: 'My Teachers',
    description: 'Connect with your mentors and track progress',
    icon: <FiUsers className="w-6 h-6" />,
    href: '/hps/teachers',
    color: 'bg-purple-500',
  },
  {
    title: 'SQL Boost',
    description: 'Get personalized upgrade suggestions',
    icon: <FiTrendingUp className="w-6 h-6" />,
    href: '/hps/sql-boost',
    color: 'bg-yellow-500',
  },
];

export default function HPSPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Human Performance System</h1>
        <p className="text-gray-600 mt-2">
          AI-powered education platform for continuous learning and skill development. Required
          service for SQL Normal+ level users.
        </p>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {serviceCards.map(card => (
          <a
            key={card.title}
            href={card.href}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div
              className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}
            >
              {card.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
            <p className="text-gray-600 mt-1">{card.description}</p>
          </a>
        ))}
      </div>

      {/* Main Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <HPSDashboard />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <StudentProgress />
        </div>
      </div>

      {/* Lecture Manager (for teachers) */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <LectureManager />
      </div>
    </div>
  );
}
