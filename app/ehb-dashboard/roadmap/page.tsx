import React from 'react';
import { FiCheck, FiClock, FiAlertCircle } from 'react-icons/fi';

type ModuleStatus = 'completed' | 'in-progress' | 'planned';

interface Module {
  name: string;
  description: string;
  status: ModuleStatus;
  features: string[];
}

const modules: Module[] = [
  {
    name: 'Security',
    description: 'Platform Security & Access Control',
    status: 'completed',
    features: [
      'Rate Limiting',
      'API Key Authentication',
      'SQL Level Validation',
      'Route Protection',
      'Error Boundaries',
    ],
  },
  {
    name: 'GoSellr',
    description: 'E-Commerce & Delivery Flow',
    status: 'completed',
    features: [
      'Product Management',
      'Order Processing',
      'Delivery Tracking',
      'Payment Integration',
    ],
  },
  {
    name: 'WMS',
    description: 'Doctor Booking & Medical Flow',
    status: 'in-progress',
    features: [
      'Doctor Profiles',
      'Appointment Booking',
      'Medical Records',
      'Prescription Management',
    ],
  },
  {
    name: 'OLS',
    description: 'Lawyer Hiring & Legal Consultations',
    status: 'planned',
    features: ['Lawyer Profiles', 'Case Management', 'Document Upload', 'Video Consultations'],
  },
  {
    name: 'OBS',
    description: 'Book Store + Study Pool',
    status: 'planned',
    features: ['Book Catalog', 'Study Groups', 'Resource Sharing', 'Progress Tracking'],
  },
  {
    name: 'AGTS',
    description: 'Travel Booking & Franchise Listing',
    status: 'planned',
    features: ['Travel Packages', 'Franchise Directory', 'Booking System', 'Reviews & Ratings'],
  },
  {
    name: 'HPS',
    description: 'Education, Courses, Exams',
    status: 'planned',
    features: ['Course Catalog', 'Exam Platform', 'Progress Tracking', 'Certification'],
  },
  {
    name: 'JPS',
    description: 'Job Profiles & AI-Based Matching',
    status: 'planned',
    features: ['Job Listings', 'AI Matching', 'Resume Builder', 'Interview Scheduling'],
  },
  {
    name: 'SOT',
    description: 'AI Agent, Chat, Robot Services',
    status: 'planned',
    features: ['AI Chatbot', 'Task Automation', 'Service Integration', 'Analytics'],
  },
  {
    name: 'Developer Tools',
    description: 'Development & Monitoring',
    status: 'completed',
    features: ['Module Logs', 'Git Sync Status', 'Commit History', 'Error Tracking'],
  },
];

const statusIcons: Record<ModuleStatus, React.ReactElement> = {
  completed: <FiCheck className="w-5 h-5 text-green-500" />,
  'in-progress': <FiClock className="w-5 h-5 text-yellow-500" />,
  planned: <FiAlertCircle className="w-5 h-5 text-blue-500" />,
};

const statusColors: Record<ModuleStatus, string> = {
  completed: 'bg-green-100 text-green-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  planned: 'bg-blue-100 text-blue-800',
};

export default function RoadmapPage() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">EHB Development Roadmap</h1>
        <p className="text-gray-600 mt-2">
          Track the progress of our platform's development and upcoming features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map(module => (
          <div key={module.name} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{module.name}</h2>
                <p className="text-gray-600">{module.description}</p>
              </div>
              <div
                className={`px-3 py-1 rounded-full ${statusColors[module.status]} flex items-center`}
              >
                {statusIcons[module.status]}
                <span className="ml-2 text-sm font-medium capitalize">{module.status}</span>
              </div>
            </div>

            <div className="space-y-3">
              {module.features.map((feature, index) => (
                <div key={index} className="flex items-center text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
