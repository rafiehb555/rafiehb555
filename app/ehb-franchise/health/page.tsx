import React from 'react';
import {
  ServiceCategory,
  FranchiseType,
} from '../../../../components/EHB-Franchise/FranchiseUtils/FranchiseTypes';
import { FranchiseDetailsTemplate } from '../../../../components/EHB-Franchise/FranchiseDetailsTemplate';

export default function HealthFranchisePage() {
  const franchiseData = {
    category: ServiceCategory.HEALTH,
    name: 'Health Services Franchise',
    description: 'Join our comprehensive healthcare and medical services network',
    benefits: [
      'Access to advanced medical technology',
      'Comprehensive healthcare training',
      'Established medical protocols',
      'Professional medical support',
      'Quality assurance systems',
      'Regular medical updates',
    ],
    requirements: [
      'Medical facility requirements',
      'Qualified medical staff',
      'Healthcare experience',
      'Valid medical licenses',
      'Quality standards compliance',
      'Adequate medical infrastructure',
    ],
    rewards: [
      'Healthcare revenue sharing',
      'Medical equipment support',
      'Staff training programs',
      'Medical supplies network',
      'Healthcare marketing support',
      'Medical research access',
    ],
    franchiseTypes: [
      {
        type: FranchiseType.SUB,
        description: 'Local healthcare center',
        investment: '$100,000 - $200,000',
      },
      {
        type: FranchiseType.MASTER,
        description: 'Regional healthcare network',
        investment: '$200,000 - $400,000',
      },
      {
        type: FranchiseType.CORPORATE,
        description: 'National healthcare system',
        investment: '$400,000 - $1,000,000',
      },
    ],
    bookingEnabled: false,
  };

  return <FranchiseDetailsTemplate {...franchiseData} />;
}
