import React from 'react';
import {
  ServiceCategory,
  FranchiseType,
} from '../../../../components/EHB-Franchise/FranchiseUtils/FranchiseTypes';
import { FranchiseDetailsTemplate } from '../../../../components/EHB-Franchise/FranchiseDetailsTemplate';

export default function TravelFranchisePage() {
  const franchiseData = {
    category: ServiceCategory.TRAVEL,
    name: 'Travel Services Franchise',
    description: 'Join our travel and tourism services network',
    benefits: [
      'Access to travel booking platform',
      'Comprehensive travel training',
      'Established travel protocols',
      'Professional travel support',
      'Quality assurance systems',
      'Regular travel updates',
    ],
    requirements: [
      'Travel agency requirements',
      'Qualified travel staff',
      'Travel industry experience',
      'Valid travel licenses',
      'Quality standards compliance',
      'Adequate travel infrastructure',
    ],
    rewards: [
      'Travel services revenue sharing',
      'Travel software support',
      'Staff training programs',
      'Travel resources network',
      'Travel marketing support',
      'Travel research access',
    ],
    franchiseTypes: [
      {
        type: FranchiseType.SUB,
        description: 'Local travel agency',
        investment: '$70,000 - $120,000',
      },
      {
        type: FranchiseType.MASTER,
        description: 'Regional travel network',
        investment: '$120,000 - $250,000',
      },
      {
        type: FranchiseType.CORPORATE,
        description: 'National travel system',
        investment: '$250,000 - $600,000',
      },
    ],
    bookingEnabled: false,
  };

  return <FranchiseDetailsTemplate {...franchiseData} />;
}
