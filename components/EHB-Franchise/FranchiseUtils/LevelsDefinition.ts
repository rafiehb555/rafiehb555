export interface LevelRequirement {
  minDailyOrders: number;
  minDeliveryVolume: number;
  minComplaintResolutionRate: number;
  minSQL: number;
  territorySize: string;
  maxComplaints: number;
}

export interface LevelBenefit {
  commissionRate: number;
  serviceAccess: string[];
  supportLevel: string;
  marketingBudget: number;
  trainingAccess: string[];
}

export const LEVEL_REQUIREMENTS: Record<number, LevelRequirement> = {
  1: {
    minDailyOrders: 10,
    minDeliveryVolume: 50,
    minComplaintResolutionRate: 0.95,
    minSQL: 1,
    territorySize: 'Small Area',
    maxComplaints: 2,
  },
  2: {
    minDailyOrders: 25,
    minDeliveryVolume: 100,
    minComplaintResolutionRate: 0.96,
    minSQL: 2,
    territorySize: 'Medium Area',
    maxComplaints: 3,
  },
  // ... Add levels 3-10 with increasing requirements
};

export const LEVEL_BENEFITS: Record<number, LevelBenefit> = {
  1: {
    commissionRate: 0.15,
    serviceAccess: ['Basic Services'],
    supportLevel: 'Standard',
    marketingBudget: 1000,
    trainingAccess: ['Basic Training'],
  },
  2: {
    commissionRate: 0.18,
    serviceAccess: ['Basic Services', 'Premium Services'],
    supportLevel: 'Enhanced',
    marketingBudget: 2500,
    trainingAccess: ['Basic Training', 'Advanced Training'],
  },
  // ... Add levels 3-10 with increasing benefits
};

export const getLevelRequirements = (level: number): LevelRequirement => {
  return LEVEL_REQUIREMENTS[level] || LEVEL_REQUIREMENTS[1];
};

export const getLevelBenefits = (level: number): LevelBenefit => {
  return LEVEL_BENEFITS[level] || LEVEL_BENEFITS[1];
};
