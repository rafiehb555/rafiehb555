import React from 'react';
import { FiShoppingBag, FiUsers, FiBook, FiMap, FiDollarSign, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  link: string;
  status: 'active' | 'coming-soon';
}

const services: Service[] = [
  {
    id: 'gosellr',
    name: 'GoSellr',
    description: 'E-Commerce & Delivery Platform',
    icon: FiShoppingBag,
    color: 'bg-blue-100 text-blue-800',
    link: '/gosellr',
    status: 'active',
  },
  {
    id: 'wms',
    name: 'WMS',
    description: 'Doctor Booking & Medical Services',
    icon: FiUsers,
    color: 'bg-green-100 text-green-800',
    link: '/wms',
    status: 'active',
  },
  {
    id: 'ols',
    name: 'OLS',
    description: 'Lawyer Hiring & Legal Services',
    icon: FiBook,
    color: 'bg-purple-100 text-purple-800',
    link: '/ols',
    status: 'active',
  },
  {
    id: 'obs',
    name: 'OBS',
    description: 'Book Store & Study Pool',
    icon: FiBook,
    color: 'bg-yellow-100 text-yellow-800',
    link: '/obs',
    status: 'active',
  },
  {
    id: 'agts',
    name: 'AGTS',
    description: 'Travel Booking & Franchise',
    icon: FiMap,
    color: 'bg-red-100 text-red-800',
    link: '/agts',
    status: 'active',
  },
  {
    id: 'marketplace',
    name: 'EHB Marketplace',
    description: 'AI-Powered Service Discovery',
    icon: FiSearch,
    color: 'bg-indigo-100 text-indigo-800',
    link: '/ehb-ai-market-place',
    status: 'active',
  },
  {
    id: 'wallet',
    name: 'EHB Wallet',
    description: 'Digital Wallet & Transactions',
    icon: FiDollarSign,
    color: 'bg-green-100 text-green-800',
    link: '/ehb-wallet',
    status: 'active',
  },
  {
    id: 'franchise',
    name: 'Franchise',
    description: 'Franchise Management System',
    icon: FiMap,
    color: 'bg-blue-100 text-blue-800',
    link: '/ehb-franchise',
    status: 'active',
  },
];

export default function ServicesAccessGrid() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Available Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <motion.a
            key={service.id}
            href={service.link}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <div className={`${service.color} p-3 rounded-lg`}>
                <service.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  {service.status === 'coming-soon' && (
                    <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-1">{service.description}</p>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
