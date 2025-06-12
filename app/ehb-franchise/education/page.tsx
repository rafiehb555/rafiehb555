import React from 'react';
import {
  ServiceCategory,
  FranchiseType,
} from '../../../../components/EHB-Franchise/FranchiseUtils/FranchiseTypes';
import { FranchiseDetailsTemplate } from '../../../../components/EHB-Franchise/FranchiseDetailsTemplate';

export default function EducationFranchisePage() {
  const franchiseData = {
    category: ServiceCategory.EDUCATION,
    name: 'Education Services Franchise',
    description: 'Join our educational services and learning center network',
    benefits: [
      'Access to educational technology platform',
      'Comprehensive teaching methodology',
      'Established curriculum',
      'Professional educational support',
      'Quality assurance systems',
      'Regular educational updates',
    ],
    requirements: [
      'Educational facility requirements',
      'Qualified teaching staff',
      'Educational experience',
      'Valid educational licenses',
      'Quality standards compliance',
      'Adequate educational infrastructure',
    ],
    rewards: [
      'Education services revenue sharing',
      'Educational software support',
      'Staff training programs',
      'Educational resources network',
      'Education marketing support',
      'Educational research access',
    ],
    franchiseTypes: [
      {
        type: FranchiseType.SUB,
        description: 'Local learning center',
        investment: '$80,000 - $150,000',
      },
      {
        type: FranchiseType.MASTER,
        description: 'Regional education network',
        investment: '$150,000 - $300,000',
      },
      {
        type: FranchiseType.CORPORATE,
        description: 'National education system',
        investment: '$300,000 - $800,000',
      },
    ],
    bookingEnabled: false,
  };

  return <FranchiseDetailsTemplate {...franchiseData} />;
}
