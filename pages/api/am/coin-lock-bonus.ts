import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../lib/prisma';

interface CoinLockBonus {
  lockedAmount: number;
  lockDuration: number; // in months
  bonusRate: number;
  monthlyReward: number;
  totalReward: number;
  nextRewardDate: string;
  lockStartDate: string;
  lockEndDate: string;
  status: 'active' | 'expired' | 'none';
  canUpgrade: boolean;
  upgradeOptions: {
    duration: number;
    bonusRate: number;
    additionalReward: number;
  }[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; data?: CoinLockBonus; error?: string }>
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

    // Fetch user's wallet and lock status
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        wallet: true,
        coinLocks: {
          where: {
            status: 'active',
            endDate: {
              gt: new Date(),
            },
          },
          orderBy: {
            startDate: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // If no active lock, return default structure
    if (!user.coinLocks.length) {
      return res.status(200).json({
        success: true,
        data: {
          lockedAmount: 0,
          lockDuration: 0,
          bonusRate: 0,
          monthlyReward: 0,
          totalReward: 0,
          nextRewardDate: '',
          lockStartDate: '',
          lockEndDate: '',
          status: 'none',
          canUpgrade: false,
          upgradeOptions: [
            {
              duration: 12,
              bonusRate: 0.05,
              additionalReward: 0,
            },
            {
              duration: 24,
              bonusRate: 0.08,
              additionalReward: 0,
            },
            {
              duration: 36,
              bonusRate: 0.12,
              additionalReward: 0,
            },
          ],
        },
      });
    }

    const currentLock = user.coinLocks[0];
    const now = new Date();
    const lockStartDate = currentLock.startDate;
    const lockEndDate = currentLock.endDate;
    const lockDuration = Math.ceil(
      (lockEndDate.getTime() - lockStartDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    // Calculate bonus rate based on duration
    const bonusRate = calculateBonusRate(lockDuration);
    const monthlyReward = currentLock.amount * bonusRate;
    const totalReward = monthlyReward * lockDuration;

    // Calculate next reward date
    const nextRewardDate = new Date(lockStartDate);
    nextRewardDate.setMonth(nextRewardDate.getMonth() + 1);
    while (nextRewardDate < now) {
      nextRewardDate.setMonth(nextRewardDate.getMonth() + 1);
    }

    // Calculate upgrade options
    const upgradeOptions = calculateUpgradeOptions(currentLock.amount, lockDuration);

    return res.status(200).json({
      success: true,
      data: {
        lockedAmount: currentLock.amount,
        lockDuration,
        bonusRate,
        monthlyReward,
        totalReward,
        nextRewardDate: nextRewardDate.toISOString(),
        lockStartDate: lockStartDate.toISOString(),
        lockEndDate: lockEndDate.toISOString(),
        status: 'active',
        canUpgrade: upgradeOptions.length > 0,
        upgradeOptions,
      },
    });
  } catch (error) {
    console.error('Coin lock bonus error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

function calculateBonusRate(duration: number): number {
  if (duration >= 36) return 0.12;
  if (duration >= 24) return 0.08;
  if (duration >= 12) return 0.05;
  return 0.03;
}

function calculateUpgradeOptions(currentAmount: number, currentDuration: number) {
  const options = [];

  if (currentDuration < 12) {
    options.push({
      duration: 12,
      bonusRate: 0.05,
      additionalReward: currentAmount * (0.05 - calculateBonusRate(currentDuration)) * 12,
    });
  }

  if (currentDuration < 24) {
    options.push({
      duration: 24,
      bonusRate: 0.08,
      additionalReward: currentAmount * (0.08 - calculateBonusRate(currentDuration)) * 24,
    });
  }

  if (currentDuration < 36) {
    options.push({
      duration: 36,
      bonusRate: 0.12,
      additionalReward: currentAmount * (0.12 - calculateBonusRate(currentDuration)) * 36,
    });
  }

  return options;
}
