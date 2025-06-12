import React from 'react';
import {
  ServiceCategory,
  FranchiseType,
} from '../../../../components/EHB-Franchise/FranchiseUtils/FranchiseTypes';
import { FranchiseDetailsTemplate } from '../../../../components/EHB-Franchise/FranchiseDetailsTemplate';

export default function LawFranchisePage() {
  const franchiseData = {
    category: ServiceCategory.LAW,
    name: 'Legal Services Franchise',
    description: 'Join our professional legal consultation and services network',
    benefits: [
      'Access to legal technology platform',
      'Comprehensive legal training',
      'Established legal protocols',
      'Professional legal support',
      'Quality assurance systems',
      'Regular legal updates',
    ],
    requirements: [
      'Legal practice requirements',
      'Qualified legal staff',
      'Legal experience',
      'Valid legal licenses',
      'Quality standards compliance',
      'Adequate legal infrastructure',
    ],
    rewards: [
      'Legal services revenue sharing',
      'Legal software support',
      'Staff training programs',
      'Legal resources network',
      'Legal marketing support',
      'Legal research access',
    ],
    franchiseTypes: [
      {
        type: FranchiseType.SUB,
        description: 'Local legal practice',
        investment: '$150,000 - $300,000',
      },
      {
        type: FranchiseType.MASTER,
        description: 'Regional legal network',
        investment: '$300,000 - $600,000',
      },
      {
        type: FranchiseType.CORPORATE,
        description: 'National legal system',
        investment: '$600,000 - $1,500,000',
      },
    ],
    bookingEnabled: false,
  };

  return <FranchiseDetailsTemplate {...franchiseData} />;
}
