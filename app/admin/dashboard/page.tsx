import { Suspense } from 'react';
import {
  FaUsers,
  FaShoppingCart,
  FaCalendarCheck,
  FaCoins,
  FaStore,
  FaCheckCircle,
} from 'react-icons/fa';
import MetricsCards from '@/components/admin/MetricsCards';
import SQLLevelManager from '@/components/admin/SQLLevelManager';
import KYCApprovals from '@/components/admin/KYCApprovals';

// Mock data for demonstration
const mockMetrics = {
  totalUsers: 1250,
  totalSales: 45000,
  totalBookings: 320,
  totalEHBGC: 15000,
  activeFranchises: 25,
  sqlVerifiedUsers: 850,
  userChange: 12,
  salesChange: 8,
  bookingChange: 15,
  ehbgcChange: 20,
  franchiseChange: 5,
  sqlChange: 10,
};

const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    currentLevel: 3,
    requestedLevel: 4,
    status: 'pending' as const,
    type: 'tutor' as const,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    currentLevel: 2,
    status: 'verified' as const,
    type: 'doctor' as const,
  },
  // Add more mock users as needed
];

const mockKYCRequests = [
  {
    id: '1',
    userId: '1',
    name: 'John Doe',
    email: 'john@example.com',
    type: 'tutor' as const,
    documents: [
      {
        id: '1',
        type: 'ID Card',
        url: '/mock/id-card.jpg',
      },
      {
        id: '2',
        type: 'Certificate',
        url: '/mock/certificate.jpg',
      },
    ],
    status: 'pending' as const,
    submittedAt: '2024-03-15T10:00:00Z',
  },
  // Add more mock KYC requests as needed
];

export default function AdminDashboard() {
  const handleLevelChange = async (userId: string, newLevel: number) => {
    // Implement level change logic
    console.log('Changing level for user', userId, 'to', newLevel);
  };

  const handleKYCApprove = async (requestId: string) => {
    // Implement KYC approval logic
    console.log('Approving KYC request', requestId);
  };

  const handleKYCReject = async (requestId: string, reason: string) => {
    // Implement KYC rejection logic
    console.log('Rejecting KYC request', requestId, 'with reason:', reason);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

          {/* Metrics Overview */}
          <div className="mb-8">
            <Suspense fallback={<div>Loading metrics...</div>}>
              <MetricsCards {...mockMetrics} />
            </Suspense>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SQL Level Management */}
            <div>
              <Suspense fallback={<div>Loading SQL level manager...</div>}>
                <SQLLevelManager users={mockUsers} onLevelChange={handleLevelChange} />
              </Suspense>
            </div>

            {/* KYC Approvals */}
            <div>
              <Suspense fallback={<div>Loading KYC approvals...</div>}>
                <KYCApprovals
                  requests={mockKYCRequests}
                  onApprove={handleKYCApprove}
                  onReject={handleKYCReject}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
