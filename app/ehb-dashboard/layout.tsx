import React from 'react';
import Link from 'next/link';
import {
  FiHome,
  FiShoppingBag,
  FiUsers,
  FiTrendingUp,
  FiSettings,
  FiHelpCircle,
  FiMessageSquare,
  FiBell,
  FiUser,
} from 'react-icons/fi';

const navigation = [
  { name: 'Dashboard', href: '/ehb-dashboard', icon: FiHome },
  { name: 'GoSellr', href: '/gosellr', icon: FiShoppingBag },
  { name: 'Franchise', href: '/ehb-franchise', icon: FiUsers },
  { name: 'AI Marketplace', href: '/ehb-ai-market-place', icon: FiTrendingUp },
  { name: 'Settings', href: '/settings', icon: FiSettings },
  { name: 'Help Center', href: '/help', icon: FiHelpCircle },
  { name: 'Contact', href: '/contact', icon: FiMessageSquare },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <Link href="/ehb-dashboard" className="text-xl font-bold text-blue-600">
              EHB Dashboard
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors"
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FiUser className="w-4 h-4 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Premium Member</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-full px-8">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <FiBell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <FiSettings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
