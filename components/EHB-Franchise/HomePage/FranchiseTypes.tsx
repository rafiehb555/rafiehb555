import React from 'react';
import { FranchiseType } from '../FranchiseUtils/FranchiseTypes';

interface FranchiseTypeCardProps {
  type: FranchiseType;
  title: string;
  description: string;
  features: string[];
  onClick: () => void;
}

const FranchiseTypeCard: React.FC<FranchiseTypeCardProps> = ({
  type,
  title,
  description,
  features,
  onClick,
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
      onClick={onClick}
    >
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-700">
            <span className="mr-2">✓</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const FranchiseTypes: React.FC = () => {
  const franchiseTypes = [
    {
      type: FranchiseType.SUB,
      title: 'Sub Franchise',
      description: 'Start your journey with a local territory franchise',
      features: [
        '10 Levels of Growth',
        'Local Territory Management',
        'Direct Customer Interaction',
        'Performance-Based Upgrades',
      ],
    },
    {
      type: FranchiseType.MASTER,
      title: 'Master Franchise',
      description: 'Manage multiple sub-franchises in your region',
      features: [
        'Up to 25 Sub-Franchises',
        'Regional Control',
        'Higher Revenue Potential',
        'Advanced Management Tools',
      ],
    },
    {
      type: FranchiseType.CORPORATE,
      title: 'Corporate Franchise',
      description: 'Lead the national franchise network',
      features: [
        'National Operations',
        'Full System Access',
        'Maximum Revenue Potential',
        'Strategic Decision Making',
      ],
    },
  ];

  const handleTypeClick = (type: FranchiseType) => {
    // TODO: Implement navigation to respective franchise type page
    console.log(`Selected franchise type: ${type}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {franchiseTypes.map(type => (
        <FranchiseTypeCard
          key={type.type}
          type={type.type}
          title={type.title}
          description={type.description}
          features={type.features}
          onClick={() => handleTypeClick(type.type)}
        />
      ))}
    </div>
  );
};
