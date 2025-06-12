import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiUsers, FiTrendingUp, FiBook, FiBriefcase, FiGlobe } from 'react-icons/fi';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  status: 'active' | 'coming-soon';
  category: string;
}

const services: Service[] = [
  {
    id: 'gosellr',
    name: 'GoSellr',
    description: 'Start your e-commerce journey with our powerful platform',
    icon: <FiShoppingBag className="w-6 h-6" />,
    url: '/gosellr',
    status: 'active',
    category: 'E-commerce',
  },
  {
    id: 'franchise',
    name: 'Franchise',
    description: 'Own and operate your own EHB franchise',
    icon: <FiUsers className="w-6 h-6" />,
    url: '/ehb-franchise',
    status: 'active',
    category: 'Business',
  },
  {
    id: 'ai-marketplace',
    name: 'AI Marketplace',
    description: 'Discover AI-powered solutions for your business',
    icon: <FiTrendingUp className="w-6 h-6" />,
    url: '/ehb-ai-market-place',
    status: 'active',
    category: 'Technology',
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Access quality education and training programs',
    icon: <FiBook className="w-6 h-6" />,
    url: '/education',
    status: 'coming-soon',
    category: 'Education',
  },
  {
    id: 'jps',
    name: 'JPS',
    description: 'Find your next career opportunity',
    icon: <FiBriefcase className="w-6 h-6" />,
    url: '/jps',
    status: 'active',
    category: 'Career',
  },
  {
    id: 'travel',
    name: 'Travel',
    description: 'Explore travel and tourism services',
    icon: <FiGlobe className="w-6 h-6" />,
    url: '/travel',
    status: 'coming-soon',
    category: 'Travel',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function ServicesPreview() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our comprehensive range of services designed to help you succeed in the digital
            world.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map(service => (
            <motion.div key={service.id} variants={cardVariants}>
              <Link href={service.url}>
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 h-full">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      {service.icon}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                        {service.status === 'coming-soon' && (
                          <span className="px-2 py-1 text-xs font-medium text-yellow-600 bg-yellow-50 rounded-full">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-gray-600">{service.description}</p>
                      <div className="mt-4">
                        <span className="text-sm font-medium text-blue-600">
                          {service.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
