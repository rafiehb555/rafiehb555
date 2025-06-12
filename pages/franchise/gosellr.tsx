import React, { useState } from 'react';
import { FiCheck, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import FranchiseTypeCard from '@/components/franchise/FranchiseTypeCard';
import JPSCheckModal from '@/components/franchise/JPSCheckModal';
import { useSession } from 'next-auth/react';

type FranchiseType = 'sub' | 'master' | 'corporate';

interface FranchiseTypeInfo {
  id: FranchiseType;
  title: string;
  description: string;
  icon: React.ReactNode;
  sqlLevel: number;
  incomePotential: string;
  areaManagement: string;
  verificationPower: string;
}

const franchiseTypes: FranchiseTypeInfo[] = [
  {
    id: 'sub',
    title: 'Sub-Franchise',
    description: 'Start with a single location and grow through 10 levels.',
    icon: <FiCheck className="w-6 h-6" />,
    sqlLevel: 2,
    incomePotential: '$5,000 - $15,000 monthly',
    areaManagement: 'Single location',
    verificationPower: 'Can verify up to 3 services',
  },
  {
    id: 'master',
    title: 'Master Franchise',
    description: 'Manage multiple locations in a specific region.',
    icon: <FiCheck className="w-6 h-6" />,
    sqlLevel: 3,
    incomePotential: '$20,000 - $50,000 monthly',
    areaManagement: 'Regional management',
    verificationPower: 'Can verify up to 10 services',
  },
  {
    id: 'corporate',
    title: 'Corporate Franchise',
    description: 'Full control over multiple regions with maximum benefits.',
    icon: <FiCheck className="w-6 h-6" />,
    sqlLevel: 4,
    incomePotential: '$50,000+ monthly',
    areaManagement: 'Multiple regions',
    verificationPower: 'Unlimited service verification',
  },
];

export default function GoSellrFranchisePage() {
  const { data: session } = useSession();
  const [showJPSCheck, setShowJPSCheck] = useState(false);
  const [selectedType, setSelectedType] = useState<FranchiseType | null>(null);

  const handleApply = (type: FranchiseType) => {
    setSelectedType(type);
    setShowJPSCheck(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">GoSellr Franchise Opportunities</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join our network of successful franchises and build your business with EHB's proven
            system.
          </p>
        </div>

        {/* Franchise Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {franchiseTypes.map(type => (
            <FranchiseTypeCard
              key={type.id}
              title={type.title}
              description={type.description}
              icon={type.icon}
              sqlLevel={type.sqlLevel}
              incomePotential={type.incomePotential}
              areaManagement={type.areaManagement}
              verificationPower={type.verificationPower}
              onApply={() => handleApply(type.id)}
            />
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Coming Soon to EHB</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {['Education', 'Health', 'Legal'].map(service => (
              <div
                key={service}
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{service} Franchise</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    Coming Soon
                  </span>
                </div>
                <p className="text-gray-600">
                  {service} franchise opportunities will be available soon. Stay tuned for updates.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* JPS Check Modal */}
      <JPSCheckModal
        isOpen={showJPSCheck}
        onClose={() => setShowJPSCheck(false)}
        franchiseType={selectedType}
      />
    </div>
  );
}
