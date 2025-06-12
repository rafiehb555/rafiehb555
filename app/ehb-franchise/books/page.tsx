import React from 'react';
import {
  ServiceCategory,
  FranchiseType,
} from '../../../../components/EHB-Franchise/FranchiseUtils/FranchiseTypes';
import { FranchiseDetailsTemplate } from '../../../../components/EHB-Franchise/FranchiseDetailsTemplate';

export default function BooksFranchisePage() {
  const franchiseData = {
    category: ServiceCategory.BOOKS,
    name: 'Book Services Franchise',
    description: 'Join our book retail and library services network',
    benefits: [
      'Access to book management platform',
      'Comprehensive book service training',
      'Established book service protocols',
      'Professional book service support',
      'Quality assurance systems',
      'Regular book service updates',
    ],
    requirements: [
      'Book store requirements',
      'Qualified book service staff',
      'Book industry experience',
      'Valid book service licenses',
      'Quality standards compliance',
      'Adequate book service infrastructure',
    ],
    rewards: [
      'Book services revenue sharing',
      'Book service software support',
      'Staff training programs',
      'Book resources network',
      'Book service marketing support',
      'Book service research access',
    ],
    franchiseTypes: [
      {
        type: FranchiseType.SUB,
        description: 'Local book store',
        investment: '$40,000 - $80,000',
      },
      {
        type: FranchiseType.MASTER,
        description: 'Regional book network',
        investment: '$80,000 - $150,000',
      },
      {
        type: FranchiseType.CORPORATE,
        description: 'National book system',
        investment: '$150,000 - $300,000',
      },
    ],
    bookingEnabled: false,
  };

  return <FranchiseDetailsTemplate {...franchiseData} />;
}
