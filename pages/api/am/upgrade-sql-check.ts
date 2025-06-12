import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../lib/prisma';

interface SQLUpgradeCheck {
  eligible: boolean;
  currentLevel: number;
  targetLevel: number;
  requirements: {
    totalIncome: {
      required: number;
      current: number;
      met: boolean;
    };
    referralCount: {
      required: number;
      current: number;
      met: boolean;
    };
    loyaltyLock: {
      required: boolean;
      current: boolean;
      met: boolean;
    };
    activeMembers: {
      required: number;
      current: number;
      met: boolean;
    };
  };
  missingRequirements: string[];
  upgradeBenefits: {
    commissionIncrease: number;
    newFeatures: string[];
    bonusMultiplier: number;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; data?: SQLUpgradeCheck; error?: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const session = await getSession({ req });
    if (!session?.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    // Fetch user's data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        sqlProfile: true,
        wallet: true,
        coinLocks: {
          where: {
            status: 'active',
            endDate: {
              gt: new Date(),
            },
          },
        },
        directReferrals: {
          where: {
            isActive: true,
          },
        },
        earnings: {
          where: {
            timestamp: {
              gte: new Date(new Date().setMonth(new Date().getMonth() - 3)),
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const currentLevel = user.sqlProfile?.level || 0;
    const targetLevel = currentLevel + 1;

    // Get requirements for target level
    const requirements = getLevelRequirements(targetLevel);

    // Calculate current stats
    const totalIncome = user.earnings.reduce((sum, e) => sum + e.amount, 0);
    const activeMembers = user.directReferrals.length;
    const hasLoyaltyLock = user.coinLocks.length > 0;

    // Check if requirements are met
    const requirementsStatus = {
      totalIncome: {
        required: requirements.minIncome,
        current: totalIncome,
        met: totalIncome >= requirements.minIncome,
      },
      referralCount: {
        required: requirements.minReferrals,
        current: user.directReferrals.length,
        met: user.directReferrals.length >= requirements.minReferrals,
      },
      loyaltyLock: {
        required: requirements.requiresLoyaltyLock,
        current: hasLoyaltyLock,
        met: !requirements.requiresLoyaltyLock || hasLoyaltyLock,
      },
      activeMembers: {
        required: requirements.minActiveMembers,
        current: activeMembers,
        met: activeMembers >= requirements.minActiveMembers,
      },
    };

    // Compile missing requirements
    const missingRequirements = [];
    if (!requirementsStatus.totalIncome.met) {
      missingRequirements.push(
        `Total income of ${requirements.minIncome} required (current: ${totalIncome})`
      );
    }
    if (!requirementsStatus.referralCount.met) {
      missingRequirements.push(
        `${requirements.minReferrals} referrals required (current: ${user.directReferrals.length})`
      );
    }
    if (!requirementsStatus.loyaltyLock.met) {
      missingRequirements.push('Active loyalty lock required');
    }
    if (!requirementsStatus.activeMembers.met) {
      missingRequirements.push(
        `${requirements.minActiveMembers} active members required (current: ${activeMembers})`
      );
    }

    // Get upgrade benefits
    const upgradeBenefits = getUpgradeBenefits(targetLevel);

    return res.status(200).json({
      success: true,
      data: {
        eligible: missingRequirements.length === 0,
        currentLevel,
        targetLevel,
        requirements: requirementsStatus,
        missingRequirements,
        upgradeBenefits,
      },
    });
  } catch (error) {
    console.error('SQL upgrade check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

function getLevelRequirements(level: number) {
  const requirements = {
    1: {
      minIncome: 0,
      minReferrals: 0,
      requiresLoyaltyLock: false,
      minActiveMembers: 0,
    },
    2: {
      minIncome: 1000,
      minReferrals: 5,
      requiresLoyaltyLock: false,
      minActiveMembers: 3,
    },
    3: {
      minIncome: 5000,
      minReferrals: 10,
      requiresLoyaltyLock: true,
      minActiveMembers: 7,
    },
    4: {
      minIncome: 20000,
      minReferrals: 20,
      requiresLoyaltyLock: true,
      minActiveMembers: 15,
    },
    5: {
      minIncome: 50000,
      minReferrals: 50,
      requiresLoyaltyLock: true,
      minActiveMembers: 30,
    },
  };

  return requirements[level] || requirements[1];
}

function getUpgradeBenefits(level: number) {
  const benefits = {
    1: {
      commissionIncrease: 0,
      newFeatures: ['Basic affiliate features'],
      bonusMultiplier: 1,
    },
    2: {
      commissionIncrease: 0.05,
      newFeatures: ['Team bonuses', 'Referral tracking'],
      bonusMultiplier: 1.2,
    },
    3: {
      commissionIncrease: 0.1,
      newFeatures: ['Advanced analytics', 'Priority support'],
      bonusMultiplier: 1.5,
    },
    4: {
      commissionIncrease: 0.15,
      newFeatures: ['Custom branding', 'API access'],
      bonusMultiplier: 2,
    },
    5: {
      commissionIncrease: 0.2,
      newFeatures: ['VIP features', 'Direct support'],
      bonusMultiplier: 3,
    },
  };

  return benefits[level] || benefits[1];
}
