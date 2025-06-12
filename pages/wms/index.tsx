import React from 'react';
import { FiUser, FiPackage, FiFileText, FiAlertTriangle } from 'react-icons/fi';
import HealthDashboard from '@/components/wms/HealthDashboard';
import BookDoctor from '@/components/wms/BookDoctor';
import HospitalDirectory from '@/components/wms/HospitalDirectory';
import LabReports from '@/components/wms/LabReports';
import MedicalHistory from '@/components/wms/MedicalHistory';

interface ServiceCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  sqlRequired: 'free' | 'basic' | 'normal';
}

const services: ServiceCard[] = [
  {
    title: 'Book Doctor',
    description: 'Schedule appointments with verified specialists',
    icon: <FiUser className="w-6 h-6" />,
    href: '/wms/book',
    color: 'bg-blue-500',
    sqlRequired: 'normal',
  },
  {
    title: 'Order Medicine',
    description: 'Get prescriptions and order medicines online',
    icon: <FiPackage className="w-6 h-6" />,
    href: '/wms/medicine',
    color: 'bg-green-500',
    sqlRequired: 'basic',
  },
  {
    title: 'Upload Report',
    description: 'Share and analyze your medical reports',
    icon: <FiFileText className="w-6 h-6" />,
    href: '/wms/reports',
    color: 'bg-purple-500',
    sqlRequired: 'basic',
  },
  {
    title: 'Emergency Help',
    description: '24/7 emergency assistance and support',
    icon: <FiAlertTriangle className="w-6 h-6" />,
    href: '/wms/emergency',
    color: 'bg-red-500',
    sqlRequired: 'free',
  },
];

export default function WMSPage() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">World Medical Services</h1>
        <p className="text-gray-600 mt-2">
          Access verified healthcare services and manage your medical needs.
        </p>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map(service => (
          <a
            key={service.title}
            href={service.href}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div
              className={`${service.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}
            >
              {service.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
            <p className="text-gray-600 mt-1">{service.description}</p>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="px-2 py-1 bg-gray-100 rounded-full">SQL {service.sqlRequired}</span>
            </div>
          </a>
        ))}
      </div>

      {/* Main Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <HealthDashboard />
          <BookDoctor />
        </div>
        <div className="space-y-6">
          <HospitalDirectory />
          <LabReports />
          <MedicalHistory />
        </div>
      </div>
    </div>
  );
}
