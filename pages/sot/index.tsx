import React from 'react';
import { FiRobot, FiMessageSquare, FiSettings } from 'react-icons/fi';
import Link from 'next/link';

interface SystemCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  features: string[];
}

const systems: SystemCard[] = [
  {
    title: 'EHB AI Assistant',
    description: 'Your personal AI assistant for tasks and automation',
    icon: <FiRobot className="w-8 h-8" />,
    href: '/sot/agent',
    color: 'from-blue-500 to-blue-600',
    features: ['Task Management', 'Command History', 'Scheduled Jobs', 'System Integration'],
  },
  {
    title: 'EHB Chat System',
    description: 'AI-powered chat support and auto-replies',
    icon: <FiMessageSquare className="w-8 h-8" />,
    href: '/sot/chat',
    color: 'from-purple-500 to-purple-600',
    features: ['Auto-Responses', 'User Support', 'SQL Integration', 'Profile Analysis'],
  },
  {
    title: 'EHB Robot',
    description: 'Automation system for franchises and tasks',
    icon: <FiSettings className="w-8 h-8" />,
    href: '/sot/robot',
    color: 'from-green-500 to-green-600',
    features: ['SQL Auto-Checks', 'Wallet Automation', 'Booking Management', 'Task Scheduling'],
  },
];

export default function SOTPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">EHB AI Systems (SOT)</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage and interact with our AI-powered systems for assistance, chat support, and
            automated tasks.
          </p>
        </div>

        {/* System Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {systems.map(system => (
            <Link key={system.title} href={system.href} className="group block">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${system.color} p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <h2 className="text-xl font-semibold mb-1">{system.title}</h2>
                      <p className="text-blue-100 text-sm">{system.description}</p>
                    </div>
                    <div className="text-white opacity-90 group-hover:opacity-100 transition-opacity">
                      {system.icon}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <ul className="space-y-3">
                    {system.features.map(feature => (
                      <li key={feature} className="flex items-center text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Click to access</span>
                    <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* System Status */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">AI Assistant</p>
                <p className="text-sm text-gray-500">Online & Ready</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Chat System</p>
                <p className="text-sm text-gray-500">Active & Responding</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Automation Robot</p>
                <p className="text-sm text-gray-500">Running Tasks</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
