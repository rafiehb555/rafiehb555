import React from 'react';
import {
  ServiceCategory,
  FranchiseType,
} from '../../../../components/EHB-Franchise/FranchiseUtils/FranchiseTypes';
import { FranchiseDetailsTemplate } from '../../../../components/EHB-Franchise/FranchiseDetailsTemplate';

export default function GoSellrFranchisePage() {
  const franchiseData = {
    category: ServiceCategory.GOSELLR,
    name: 'GoSellr Franchise',
    description: 'Join the leading e-commerce and delivery solutions network',
    benefits: [
      'Established brand recognition and market presence',
      'Comprehensive training and support system',
      'Access to advanced technology platform',
      'Marketing and promotional support',
      'Dedicated account management',
      'Regular performance analytics and insights',
    ],
    requirements: [
      'Minimum investment of $50,000',
      'Business experience preferred',
      'Strong local market knowledge',
      'Commitment to service quality',
      'Valid business license',
      'Adequate infrastructure',
    ],
    rewards: [
      'Revenue sharing model',
      'Performance-based incentives',
      'Exclusive territory rights',
      'Priority support access',
      'Regular training updates',
      'Networking opportunities',
    ],
    franchiseTypes: [
      {
        type: FranchiseType.SUB,
        description: 'Local franchise with essential features',
        investment: '$50,000 - $100,000',
      },
      {
        type: FranchiseType.MASTER,
        description: 'Regional franchise with enhanced capabilities',
        investment: '$100,000 - $200,000',
      },
      {
        type: FranchiseType.CORPORATE,
        description: 'National franchise with full capabilities',
        investment: '$200,000 - $500,000',
      },
    ],
    bookingEnabled: true,
  };

  return <FranchiseDetailsTemplate {...franchiseData} />;
}
