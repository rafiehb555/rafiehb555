import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiShoppingBag,
  FiUsers,
  FiTrendingUp,
  FiSettings,
  FiHelpCircle,
  FiMessageSquare,
} from 'react-icons/fi';

interface QuickAccessCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  color: string;
}

const quickAccessCards: QuickAccessCard[] = [
  {
    id: 'gosellr',
    title: 'GoSellr',
    description: 'Start selling your products and services',
    icon: <FiShoppingBag className="w-6 h-6" />,
    url: '/gosellr',
    color: 'bg-blue-500',
  },
  {
    id: 'franchise',
    title: 'Franchise',
    description: 'Explore franchise opportunities',
    icon: <FiUsers className="w-6 h-6" />,
    url: '/ehb-franchise',
    color: 'bg-green-500',
  },
  {
    id: 'ai-marketplace',
    title: 'AI Marketplace',
    description: 'Discover AI-powered solutions',
    icon: <FiTrendingUp className="w-6 h-6" />,
    url: '/ehb-ai-market-place',
    color: 'bg-purple-500',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Manage your account settings',
    icon: <FiSettings className="w-6 h-6" />,
    url: '/settings',
    color: 'bg-gray-500',
  },
  {
    id: 'help',
    title: 'Help Center',
    description: 'Get support and guidance',
    icon: <FiHelpCircle className="w-6 h-6" />,
    url: '/help',
    color: 'bg-yellow-500',
  },
  {
    id: 'contact',
    title: 'Contact Us',
    description: 'Reach out to our team',
    icon: <FiMessageSquare className="w-6 h-6" />,
    url: '/contact',
    color: 'bg-red-500',
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

export default function QuickAccessCards() {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Access</h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {quickAccessCards.map(card => (
            <motion.div key={card.id} variants={cardVariants}>
              <Link href={card.url}>
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start">
                    <div className={`${card.color} text-white p-3 rounded-lg mr-4`}>
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{card.title}</h3>
                      <p className="text-gray-600">{card.description}</p>
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
