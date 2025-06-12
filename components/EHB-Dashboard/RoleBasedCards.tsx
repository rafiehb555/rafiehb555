import React from 'react';
import { FiShoppingBag, FiUsers, FiBriefcase, FiBook, FiMap } from 'react-icons/fi';
import { motion } from 'framer-motion';

type UserRole = 'visitor' | 'user' | 'seller' | 'franchise' | 'jps' | 'admin';

interface RoleBasedCardsProps {
  role: UserRole;
}

const roleCards: Record<
  UserRole,
  Array<{
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    link: string;
  }>
> = {
  visitor: [
    {
      id: 'register',
      title: 'Create Account',
      description: 'Join EHB to access all services',
      icon: FiUsers,
      color: 'bg-blue-100 text-blue-800',
      link: '/register',
    },
    {
      id: 'explore',
      title: 'Explore Services',
      description: 'Discover what EHB offers',
      icon: FiShoppingBag,
      color: 'bg-green-100 text-green-800',
      link: '/services',
    },
  ],
  user: [
    {
      id: 'wallet',
      title: 'My Wallet',
      description: 'Manage your EHB coins',
      icon: FiShoppingBag,
      color: 'bg-yellow-100 text-yellow-800',
      link: '/ehb-wallet',
    },
    {
      id: 'profile',
      title: 'My Profile',
      description: 'Update your information',
      icon: FiUsers,
      color: 'bg-blue-100 text-blue-800',
      link: '/profile',
    },
  ],
  seller: [
    {
      id: 'products',
      title: 'My Products',
      description: 'Manage your listings',
      icon: FiShoppingBag,
      color: 'bg-green-100 text-green-800',
      link: '/gosellr/products',
    },
    {
      id: 'orders',
      title: 'Orders',
      description: 'View and manage orders',
      icon: FiShoppingBag,
      color: 'bg-purple-100 text-purple-800',
      link: '/gosellr/orders',
    },
  ],
  franchise: [
    {
      id: 'franchise',
      title: 'My Franchise',
      description: 'Manage your franchise',
      icon: FiMap,
      color: 'bg-blue-100 text-blue-800',
      link: '/ehb-franchise',
    },
    {
      id: 'earnings',
      title: 'Earnings',
      description: 'View franchise income',
      icon: FiShoppingBag,
      color: 'bg-green-100 text-green-800',
      link: '/ehb-franchise/earnings',
    },
  ],
  jps: [
    {
      id: 'jobs',
      title: 'My Jobs',
      description: 'View job applications',
      icon: FiBriefcase,
      color: 'bg-blue-100 text-blue-800',
      link: '/jps/jobs',
    },
    {
      id: 'resume',
      title: 'Resume',
      description: 'Update your profile',
      icon: FiBook,
      color: 'bg-purple-100 text-purple-800',
      link: '/jps/resume',
    },
  ],
  admin: [
    {
      id: 'dashboard',
      title: 'Admin Dashboard',
      description: 'System overview',
      icon: FiUsers,
      color: 'bg-red-100 text-red-800',
      link: '/admin',
    },
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage all users',
      icon: FiUsers,
      color: 'bg-blue-100 text-blue-800',
      link: '/admin/users',
    },
  ],
};

export default function RoleBasedCards({ role }: RoleBasedCardsProps) {
  const cards = roleCards[role] || roleCards.visitor;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cards.map(card => (
        <motion.a
          key={card.id}
          href={card.link}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start space-x-4">
            <div className={`${card.color} p-3 rounded-lg`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
              <p className="text-gray-600 mt-1">{card.description}</p>
            </div>
          </div>
        </motion.a>
      ))}
    </div>
  );
}
