import React from 'react';
import { FiPlus, FiLock, FiGift, FiSettings, FiHelpCircle, FiMessageSquare } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface Action {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  link: string;
  disabled?: boolean;
}

interface QuickActionsProps {
  userRole: 'visitor' | 'user' | 'seller' | 'franchise' | 'jps' | 'admin';
}

export default function QuickActions({ userRole }: QuickActionsProps) {
  const getActions = (role: QuickActionsProps['userRole']): Action[] => {
    const commonActions: Action[] = [
      {
        id: 'help',
        name: 'Get Help',
        description: 'Contact support or view FAQs',
        icon: FiHelpCircle,
        color: 'bg-purple-100 text-purple-800',
        link: '/support',
      },
      {
        id: 'feedback',
        name: 'Send Feedback',
        description: 'Share your thoughts with us',
        icon: FiMessageSquare,
        color: 'bg-blue-100 text-blue-800',
        link: '/feedback',
      },
    ];

    const roleSpecificActions: Record<QuickActionsProps['userRole'], Action[]> = {
      visitor: [
        {
          id: 'register',
          name: 'Create Account',
          description: 'Join EHB Technologies',
          icon: FiPlus,
          color: 'bg-green-100 text-green-800',
          link: '/register',
        },
      ],
      user: [
        {
          id: 'lock-coins',
          name: 'Lock Coins',
          description: 'Lock your coins for rewards',
          icon: FiLock,
          color: 'bg-yellow-100 text-yellow-800',
          link: '/ehb-wallet/lock',
        },
        {
          id: 'rewards',
          name: 'View Rewards',
          description: 'Check your loyalty rewards',
          icon: FiGift,
          color: 'bg-pink-100 text-pink-800',
          link: '/rewards',
        },
      ],
      seller: [
        {
          id: 'add-product',
          name: 'Add Product',
          description: 'List a new product',
          icon: FiPlus,
          color: 'bg-green-100 text-green-800',
          link: '/seller/products/new',
        },
        {
          id: 'settings',
          name: 'Store Settings',
          description: 'Manage your store',
          icon: FiSettings,
          color: 'bg-gray-100 text-gray-800',
          link: '/seller/settings',
        },
      ],
      franchise: [
        {
          id: 'analytics',
          name: 'View Analytics',
          description: 'Check franchise performance',
          icon: FiSettings,
          color: 'bg-indigo-100 text-indigo-800',
          link: '/franchise/analytics',
        },
      ],
      jps: [
        {
          id: 'verify',
          name: 'Verify Seller',
          description: 'Review seller applications',
          icon: FiSettings,
          color: 'bg-blue-100 text-blue-800',
          link: '/jps/verify',
        },
      ],
      admin: [
        {
          id: 'dashboard',
          name: 'Admin Dashboard',
          description: 'Manage platform settings',
          icon: FiSettings,
          color: 'bg-red-100 text-red-800',
          link: '/admin',
        },
      ],
    };

    return [...commonActions, ...(roleSpecificActions[role] || [])];
  };

  const actions = getActions(userRole);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <motion.a
            key={action.id}
            href={action.disabled ? undefined : action.link}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
              action.disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`${action.color} p-2 rounded-lg`}>
                <action.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">{action.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{action.description}</p>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
