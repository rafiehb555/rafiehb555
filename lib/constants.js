export const COMPANY_NAME = 'EHB Technologies';
export const COMPANY_SLOGAN = '700+ Services in One Super-App';

export const MODULES = {
  GOSELLR: {
    name: 'GoSellr',
    description: 'E-commerce platform for businesses',
    icon: '🛍️',
    color: 'bg-blue-500',
    path: '/gosellr',
  },
  EDR: {
    name: 'EDR',
    description: 'Education & Digital Resources',
    icon: '📚',
    color: 'bg-green-500',
    path: '/edr',
  },
  EMO: {
    name: 'EMO',
    description: 'Health & Medical Services',
    icon: '🏥',
    color: 'bg-red-500',
    path: '/emo',
  },
  JPS: {
    name: 'JPS',
    description: 'Justice & Public Services',
    icon: '⚖️',
    color: 'bg-purple-500',
    path: '/jps',
  },
  PSS: {
    name: 'PSS',
    description: 'Public Safety System',
    icon: '🛡️',
    color: 'bg-yellow-500',
    path: '/pss',
  },
  FRANCHISE: {
    name: 'Franchise',
    description: 'Business Expansion Platform',
    icon: '🏢',
    color: 'bg-indigo-500',
    path: '/franchise',
  },
  WALLET: {
    name: 'Trusty Wallet',
    description: 'Secure Digital Transactions',
    icon: '💳',
    color: 'bg-pink-500',
    path: '/wallet',
  },
  AI: {
    name: 'AI Assistant',
    description: 'Smart Support System',
    icon: '🤖',
    color: 'bg-gray-500',
    path: '/ai',
  },
};

export const NAVIGATION_ITEMS = Object.values(MODULES).map(module => ({
  name: module.name,
  path: module.path,
}));
