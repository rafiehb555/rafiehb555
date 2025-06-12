import React from 'react';
import DashboardLayout from '@/components/EHB-Dashboard/DashboardLayout';
import { FiDollarSign, FiShoppingCart, FiUsers, FiStar } from 'react-icons/fi';

// Mock data for demonstration
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'seller' as const,
  avatar: '/avatars/john.jpg',
  joinDate: '2024-01-01',
  lastLogin: '2024-03-15',
  sqlLevel: 3,
};

const mockStats = {
  coins: 1500,
  sqlLevel: 3,
  earnings: 2500,
  bookings: 12,
};

const mockTasks = [
  {
    id: '1',
    title: 'Complete profile verification',
    description: 'Upload required documents for verification',
    priority: 'high' as const,
    status: 'pending' as const,
    dueDate: '2024-03-20',
  },
  {
    id: '2',
    title: 'Update service listings',
    description: 'Add new services and update prices',
    priority: 'medium' as const,
    status: 'in-progress' as const,
    dueDate: '2024-03-25',
  },
];

const mockTransactions = [
  {
    id: '1',
    type: 'credit' as const,
    amount: 500,
    description: 'Service payment received',
    timestamp: '2024-03-15T10:30:00Z',
    status: 'completed' as const,
    category: 'Service',
    paymentMethod: 'Credit Card',
  },
  {
    id: '2',
    type: 'debit' as const,
    amount: 100,
    description: 'Platform fee',
    timestamp: '2024-03-14T15:45:00Z',
    status: 'completed' as const,
    category: 'Fee',
    paymentMethod: 'Wallet',
  },
];

const mockMetrics = [
  {
    id: '1',
    name: 'Revenue',
    value: 2500,
    target: 3000,
    change: 15,
    unit: '$',
    icon: FiDollarSign,
    color: 'green',
  },
  {
    id: '2',
    name: 'Orders',
    value: 12,
    target: 15,
    change: -5,
    unit: '',
    icon: FiShoppingCart,
    color: 'blue',
  },
  {
    id: '3',
    name: 'Customers',
    value: 45,
    target: 50,
    change: 10,
    unit: '',
    icon: FiUsers,
    color: 'purple',
  },
  {
    id: '4',
    name: 'Rating',
    value: 4.8,
    target: 5,
    change: 0.2,
    unit: '/5',
    icon: FiStar,
    color: 'yellow',
  },
];

const mockSettings = [
  {
    id: '1',
    name: 'Email Notifications',
    description: 'Receive email updates about your account',
    icon: FiDollarSign,
    type: 'toggle' as const,
    value: true,
  },
  {
    id: '2',
    name: 'Language',
    description: 'Choose your preferred language',
    icon: FiDollarSign,
    type: 'select' as const,
    value: 'en',
    options: [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Spanish' },
      { value: 'fr', label: 'French' },
    ],
  },
];

const mockHelpArticles = [
  {
    id: '1',
    title: 'Getting Started',
    description: 'Learn the basics of using the platform',
    category: 'Basics',
    icon: FiDollarSign,
    link: '/help/getting-started',
  },
  {
    id: '2',
    title: 'Account Settings',
    description: 'Manage your account preferences',
    category: 'Account',
    icon: FiDollarSign,
    link: '/help/account-settings',
  },
];

const mockNotifications = [
  {
    id: '1',
    type: 'success' as const,
    title: 'Payment Received',
    message: 'Your payment of $500 has been processed',
    timestamp: '2024-03-15T10:30:00Z',
    read: false,
    link: '/transactions/1',
  },
  {
    id: '2',
    type: 'info' as const,
    title: 'Profile Update',
    message: 'Your profile has been successfully updated',
    timestamp: '2024-03-14T15:45:00Z',
    read: true,
  },
];

const mockActivities = [
  {
    id: '1',
    type: 'payment' as const,
    title: 'Payment Received',
    description: 'Received payment for service #123',
    timestamp: new Date('2024-03-15T10:30:00Z'),
    icon: FiDollarSign,
    color: 'green',
    link: '/transactions/1',
  },
  {
    id: '2',
    type: 'order' as const,
    title: 'New Order',
    description: 'Received new order #456',
    timestamp: new Date('2024-03-14T15:45:00Z'),
    icon: FiShoppingCart,
    color: 'blue',
    link: '/orders/456',
  },
];

export default function DashboardPage() {
  return (
    <DashboardLayout
      user={mockUser}
      stats={mockStats}
      tasks={mockTasks}
      transactions={mockTransactions}
      metrics={mockMetrics}
      settings={mockSettings}
      helpArticles={mockHelpArticles}
      notifications={mockNotifications}
      activities={mockActivities}
    />
  );
}
