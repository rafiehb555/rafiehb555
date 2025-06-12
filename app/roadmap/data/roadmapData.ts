import { RoadmapData } from '../types';

export const roadmapData: RoadmapData = {
  companyInfo: {
    name: 'EHB Technologies',
    description: 'Empowering businesses with innovative technology solutions',
    foundedYear: 2023,
    headquarters: 'Dubai, UAE',
    departments: [
      { name: 'Engineering', size: 50 },
      { name: 'Product', size: 20 },
      { name: 'Design', size: 15 },
      { name: 'Marketing', size: 10 },
      { name: 'Sales', size: 25 }
    ],
    techStack: [
      { name: 'Next.js', version: '14.1.0' },
      { name: 'React', version: '18.2.0' },
      { name: 'TypeScript', version: '5.0.0' },
      { name: 'Node.js', version: '20.0.0' },
      { name: 'PostgreSQL', version: '15.0' },
      { name: 'Redis', version: '7.0' },
      { name: 'Docker', version: '24.0' },
      { name: 'AWS', version: 'Latest' }
    ]
  },
  modules: [
    {
      id: 'core-platform',
      name: 'Core Platform',
      description: 'Foundation of EHB Technologies platform',
      status: 'in-progress',
      priority: 'high',
      progress: 75,
      team: ['Platform Team', 'Infrastructure Team'],
      dependencies: [],
      features: [
        {
          id: 'auth-system',
          name: 'Authentication System',
          description: 'Secure user authentication and authorization',
          status: 'completed',
          priority: 'high',
          progress: 100,
          team: ['Security Team'],
          dependencies: [],
          apiEndpoints: [
            {
              path: '/api/auth/login',
              method: 'POST',
              description: 'User login endpoint',
              status: 'completed'
            },
            {
              path: '/api/auth/register',
              method: 'POST',
              description: 'User registration endpoint',
              status: 'completed'
            }
          ],
          businessRules: [
            {
              name: 'Password Policy',
              description: 'Enforce strong password requirements',
              category: 'Security',
              status: 'completed'
            }
          ]
        },
        {
          id: 'user-management',
          name: 'User Management',
          description: 'Comprehensive user profile and settings management',
          status: 'in-progress',
          priority: 'high',
          progress: 60,
          team: ['Platform Team'],
          dependencies: ['auth-system'],
          apiEndpoints: [
            {
              path: '/api/users/profile',
              method: 'GET',
              description: 'Get user profile',
              status: 'completed'
            },
            {
              path: '/api/users/settings',
              method: 'PUT',
              description: 'Update user settings',
              status: 'in-progress'
            }
          ]
        }
      ]
    },
    {
      id: 'ehb-wallet',
      name: 'EHB Wallet',
      description: 'Digital wallet and payment processing system',
      status: 'planned',
      priority: 'high',
      progress: 20,
      team: ['Payment Team', 'Security Team'],
      dependencies: ['core-platform'],
      features: [
        {
          id: 'payment-processing',
          name: 'Payment Processing',
          description: 'Secure payment processing and transaction management',
          status: 'planned',
          priority: 'high',
          progress: 0,
          team: ['Payment Team'],
          dependencies: [],
          apiEndpoints: [
            {
              path: '/api/payments/process',
              method: 'POST',
              description: 'Process payment transaction',
              status: 'planned'
            }
          ],
          businessRules: [
            {
              name: 'Transaction Limits',
              description: 'Define transaction limits and restrictions',
              category: 'Compliance',
              status: 'planned'
            }
          ]
        }
      ]
    },
    {
      id: 'ehb-ai-marketplace',
      name: 'EHB AI Marketplace',
      description: 'AI-powered marketplace for digital products and services',
      status: 'planned',
      priority: 'medium',
      progress: 10,
      team: ['AI Team', 'Marketplace Team'],
      dependencies: ['core-platform'],
      features: [
        {
          id: 'ai-integration',
          name: 'AI Integration',
          description: 'Integrate AI capabilities into marketplace',
          status: 'planned',
          priority: 'medium',
          progress: 0,
          team: ['AI Team'],
          dependencies: []
        }
      ]
    }
  ],
  timeline: [
    {
      id: 'phase1',
      title: 'Phase 1: Foundation',
      description: 'Establish core platform and basic features',
      date: '2024-01-01',
      type: 'milestone',
      status: 'completed',
      dependencies: []
    },
    {
      id: 'phase2',
      title: 'Phase 2: Expansion',
      description: 'Launch EHB Wallet and payment features',
      date: '2024-04-01',
      type: 'milestone',
      status: 'in-progress',
      dependencies: ['phase1']
    },
    {
      id: 'phase3',
      title: 'Phase 3: Innovation',
      description: 'Introduce AI Marketplace and advanced features',
      date: '2024-07-01',
      type: 'milestone',
      status: 'planned',
      dependencies: ['phase2']
    }
  ],
  status: {
    overall: 'in-progress',
    modules: {
      completed: 1,
      inProgress: 1,
      planned: 1
    },
    features: {
      completed: 1,
      inProgress: 2,
      planned: 2
    },
    timeline: {
      completed: 1,
      inProgress: 1,
      planned: 1
    }
  }
}; 