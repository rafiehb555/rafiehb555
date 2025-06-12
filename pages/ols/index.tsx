import React from 'react';
import { FiUser, FiFileText, FiUpload, FiMessageSquare } from 'react-icons/fi';
import OLSDashboard from '../../components/ols/OLSDashboard';
import LawyerDirectory from '../../components/ols/LawyerDirectory';
import LegalBooking from '../../components/ols/LegalBooking';

interface ServiceCard {
  title: string;
  description: string;
  icon: React.ReactElement;
  link: string;
  color: string;
  sqlRequired: 'free' | 'basic' | 'normal' | 'high';
}

const serviceCards: ServiceCard[] = [
  {
    title: 'Hire a Lawyer',
    description: 'Find and book verified legal professionals',
    icon: <FiUser className="w-6 h-6" />,
    link: '/ols/lawyers',
    color: 'bg-blue-500',
    sqlRequired: 'basic',
  },
  {
    title: 'View My Cases',
    description: 'Track your legal proceedings and documents',
    icon: <FiFileText className="w-6 h-6" />,
    link: '/ols/cases',
    color: 'bg-green-500',
    sqlRequired: 'basic',
  },
  {
    title: 'Upload Documents',
    description: 'Securely share legal documents with your lawyer',
    icon: <FiUpload className="w-6 h-6" />,
    link: '/ols/upload',
    color: 'bg-purple-500',
    sqlRequired: 'normal',
  },
  {
    title: 'Legal Help via AI',
    description: 'Get instant answers to legal questions',
    icon: <FiMessageSquare className="w-6 h-6" />,
    link: '/ols/ai-help',
    color: 'bg-yellow-500',
    sqlRequired: 'free',
  },
];

export default function OLSPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Online Law Services</h1>
        <p className="text-gray-600 mt-2">
          Access legal services and connect with verified lawyers
        </p>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {serviceCards.map(card => (
          <a
            key={card.title}
            href={card.link}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div
              className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}
            >
              {card.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
            <p className="text-gray-600 mt-2">{card.description}</p>
            <div className="mt-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                SQL {card.sqlRequired}
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Main Components */}
      <div className="space-y-6">
        <OLSDashboard />
        <LawyerDirectory />
        <LegalBooking />
      </div>
    </div>
  );
}
