import React from 'react';
import HeaderBar from './HeaderBar';
import QuickStats from './QuickStats';
import RoleBasedCards from './RoleBasedCards';
import ServicesAccessGrid from './ServicesAccessGrid';
import TaskList from './TaskList';
import RecentTransactions from './RecentTransactions';
import PerformanceMetrics from './PerformanceMetrics';
import UserProfile from './UserProfile';
import SettingsPanel from './SettingsPanel';
import HelpCenter from './HelpCenter';
import NotificationsPanel from './NotificationsPanel';
import ActivityFeed from './ActivityFeed';

type UserRole = 'visitor' | 'user' | 'seller' | 'franchise' | 'jps' | 'admin';

interface DashboardLayoutProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    joinDate: string;
    lastLogin: string;
    sqlLevel: number;
  };
  stats: {
    coins: number;
    sqlLevel: number;
    earnings: number;
    bookings: number;
  };
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in-progress' | 'completed';
    dueDate: string;
  }>;
  transactions: Array<{
    id: string;
    type: 'credit' | 'debit' | 'refund' | 'transfer';
    amount: number;
    description: string;
    timestamp: string;
    status: 'pending' | 'completed' | 'failed';
    category?: string;
    paymentMethod?: string;
  }>;
  metrics: Array<{
    id: string;
    name: string;
    value: number;
    target: number;
    change: number;
    unit: string;
    icon: React.ElementType;
    color: string;
  }>;
  settings: Array<{
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    type: 'toggle' | 'select' | 'link';
    value: any;
    options?: Array<{ value: string; label: string }>;
    link?: string;
  }>;
  helpArticles: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    icon: React.ElementType;
    link: string;
  }>;
  notifications: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    link?: string;
  }>;
  activities: Array<{
    id: string;
    type: 'profile' | 'order' | 'payment' | 'settings' | 'message' | 'review';
    title: string;
    description: string;
    timestamp: Date;
    icon: React.ElementType;
    color: string;
    link?: string;
  }>;
}

export default function DashboardLayout({
  user,
  stats,
  tasks,
  transactions,
  metrics,
  settings,
  helpArticles,
  notifications,
  activities,
}: DashboardLayoutProps) {
  const handleTaskComplete = (taskId: string) => {
    // Handle task completion
  };

  const handleTaskStatusChange = (taskId: string, status: string) => {
    // Handle task status change
  };

  const handlePeriodChange = (period: 'daily' | 'weekly' | 'monthly') => {
    // Handle period change
  };

  const handleEditProfile = () => {
    // Handle profile edit
  };

  const handleSecuritySettings = () => {
    // Handle security settings
  };

  const handleNotificationSettings = () => {
    // Handle notification settings
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderBar user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <QuickStats {...stats} />
            <RoleBasedCards role={user.role} />
            <ServicesAccessGrid />
          </div>

          {/* Middle Column */}
          <div className="space-y-8">
            <TaskList
              tasks={tasks}
              onTaskComplete={handleTaskComplete}
              onTaskStatusChange={handleTaskStatusChange}
            />
            <RecentTransactions transactions={transactions} />
            <PerformanceMetrics
              metrics={metrics}
              period="weekly"
              onPeriodChange={handlePeriodChange}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <UserProfile
              user={user}
              onEditProfile={handleEditProfile}
              onSecuritySettings={handleSecuritySettings}
              onNotificationSettings={handleNotificationSettings}
            />
            <SettingsPanel settings={settings} onSettingChange={() => {}} />
            <HelpCenter articles={helpArticles} onSearch={() => {}} />
            <NotificationsPanel
              notifications={notifications}
              onMarkAsRead={() => {}}
              onClearAll={() => {}}
            />
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </main>
    </div>
  );
}
