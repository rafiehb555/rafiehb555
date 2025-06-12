import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import SQLLevelBadge from '../../components/SQL/SQLLevelBadge';
import SQLProgress from '../../components/SQL/SQLProgress';
import SQLUpgradeSteps from '../../components/SQL/SQLUpgradeSteps';
import SQLUserInfo from '../../components/SQL/SQLUserInfo';
import SQLApplyDialog from '../../components/SQL/SQLApplyDialog';
import { SQLLevel } from '../../components/SQL/SQLLevelBadge';

// Mock data - replace with actual data from your backend
const mockUserData = {
  currentLevel: 1 as SQLLevel,
  issuedBy: 'PSS Verification Team',
  issuedAt: '2024-01-15',
  expiryDate: '2025-01-15',
  verificationStatus: 'verified' as const,
  benefits: [
    'Access to basic marketplace features',
    'Ability to list products and services',
    'Basic customer support',
    'Standard transaction limits',
  ],
  progress: 60,
  nextLevelRequirements: [
    {
      description: 'Complete EDR Skill Test',
      completed: true,
    },
    {
      description: 'Pass Professional Assessment',
      completed: false,
    },
    {
      description: 'Submit Work Portfolio',
      completed: false,
    },
  ],
};

const upgradeSteps = [
  {
    id: 'pss',
    title: 'PSS Verification',
    description: 'Complete KYC and document verification',
    status: 'completed' as const,
    link: '/pss',
  },
  {
    id: 'edr',
    title: 'EDR Skill Test',
    description: 'Take the professional skill assessment',
    status: 'in-progress' as const,
    link: '/edr',
  },
  {
    id: 'emo',
    title: 'EMO Verification',
    description: 'Schedule live verification interview',
    status: 'pending' as const,
    link: '/emo',
  },
];

export default function SQLPage() {
  const router = useRouter();
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);

  const handleStepClick = (stepId: string) => {
    const step = upgradeSteps.find(s => s.id === stepId);
    if (step?.link) {
      router.push(step.link);
    }
  };

  const handleApplySubmit = async (data: { documents: File[]; notes: string }) => {
    // TODO: Implement actual submission logic
    console.log('Submitting application:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Service Quality Level</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your verification level and access
              </p>
            </div>
            <button
              onClick={() => setIsApplyDialogOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply for Upgrade
              <FiArrowRight className="ml-2 -mr-1 h-4 w-4" />
            </button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SQLUserInfo
                  currentLevel={mockUserData.currentLevel}
                  issuedBy={mockUserData.issuedBy}
                  issuedAt={mockUserData.issuedAt}
                  expiryDate={mockUserData.expiryDate}
                  verificationStatus={mockUserData.verificationStatus}
                  benefits={mockUserData.benefits}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <SQLProgress
                  currentLevel={mockUserData.currentLevel}
                  progress={mockUserData.progress}
                  nextLevelRequirements={mockUserData.nextLevelRequirements}
                />
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <SQLUpgradeSteps
                  currentLevel={mockUserData.currentLevel}
                  targetLevel={(mockUserData.currentLevel + 1) as SQLLevel}
                  steps={upgradeSteps}
                  onStepClick={handleStepClick}
                />
              </motion.div>
            </div>
          </div>

          {/* Apply Dialog */}
          <SQLApplyDialog
            isOpen={isApplyDialogOpen}
            onClose={() => setIsApplyDialogOpen(false)}
            currentLevel={mockUserData.currentLevel}
            targetLevel={(mockUserData.currentLevel + 1) as SQLLevel}
            onSubmit={handleApplySubmit}
          />
        </div>
      </div>
    </div>
  );
}
