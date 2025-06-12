import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../lib/prisma';

interface SQLUpgradeRequest {
  targetLevel: number;
}

interface SQLUpgradeResponse {
  success: boolean;
  currentLevel: number;
  newLevel?: number;
  requirements: {
    completed: string[];
    pending: string[];
  };
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SQLUpgradeResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      currentLevel: 0,
      requirements: {
        completed: [],
        pending: [],
      },
      message: 'Method not allowed',
    });
  }

  try {
    const session = await getSession({ req });
    if (!session?.user) {
      return res.status(401).json({
        success: false,
        currentLevel: 0,
        requirements: {
          completed: [],
          pending: [],
        },
        message: 'Unauthorized',
      });
    }

    const { targetLevel } = req.body as SQLUpgradeRequest;

    // Fetch user's current status
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        transactions: true,
        referrals: true,
        activityLogs: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        currentLevel: 0,
        requirements: {
          completed: [],
          pending: [],
        },
        message: 'User not found',
      });
    }

    // Get current SQL level
    const currentLevel = user.sqlLevel || 0;

    // Validate target level
    if (targetLevel <= currentLevel) {
      return res.status(400).json({
        success: false,
        currentLevel,
        requirements: {
          completed: [],
          pending: [],
        },
        message: 'Target level must be higher than current level',
      });
    }

    // Check requirements for upgrade
    const requirements = await checkUpgradeRequirements(user, targetLevel);
    const canUpgrade = requirements.pending.length === 0;

    if (canUpgrade) {
      // Update user's SQL level
      await prisma.user.update({
        where: { id: user.id },
        data: { sqlLevel: targetLevel },
      });

      return res.status(200).json({
        success: true,
        currentLevel,
        newLevel: targetLevel,
        requirements: {
          completed: requirements.completed,
          pending: [],
        },
        message: 'SQL level upgraded successfully',
      });
    }

    return res.status(400).json({
      success: false,
      currentLevel,
      requirements,
      message: 'Upgrade requirements not met',
    });
  } catch (error) {
    console.error('SQL upgrade error:', error);
    return res.status(500).json({
      success: false,
      currentLevel: 0,
      requirements: {
        completed: [],
        pending: [],
      },
      message: 'Internal server error',
    });
  }
}

async function checkUpgradeRequirements(user: any, targetLevel: number) {
  const completed: string[] = [];
  const pending: string[] = [];

  // Check transaction count
  const transactionCount = user.transactions.length;
  if (transactionCount >= 5) {
    completed.push('Complete 5 transactions');
  } else {
    pending.push(`Complete ${5 - transactionCount} more transactions`);
  }

  // Check activity duration
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentActivity = user.activityLogs.filter(
    (log: any) => new Date(log.timestamp) >= thirtyDaysAgo
  );
  if (recentActivity.length > 0) {
    completed.push('Maintain 30 days activity');
  } else {
    pending.push('Maintain 30 days activity');
  }

  // Check referral count
  const activeReferrals = user.referrals.filter((ref: any) => ref.isActive);
  if (activeReferrals.length >= 2) {
    completed.push('Refer 2 active users');
  } else {
    pending.push(`Refer ${2 - activeReferrals.length} more active users`);
  }

  return { completed, pending };
}
