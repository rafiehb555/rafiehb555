import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../lib/prisma';

interface ActivityLog {
  type: string;
  timestamp: Date;
  details: string;
}

interface SQLProgressResponse {
  currentLevel: number;
  progress: {
    transactions: {
      current: number;
      required: number;
      percentage: number;
    };
    activity: {
      current: number;
      required: number;
      percentage: number;
    };
    referrals: {
      current: number;
      required: number;
      percentage: number;
    };
  };
  recentActivity: {
    type: string;
    timestamp: string;
    details: string;
  }[];
  nextLevelRequirements: {
    level: number;
    requirements: {
      name: string;
      status: 'completed' | 'in-progress' | 'pending';
      progress: number;
    }[];
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SQLProgressResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      currentLevel: 0,
      progress: {
        transactions: { current: 0, required: 0, percentage: 0 },
        activity: { current: 0, required: 0, percentage: 0 },
        referrals: { current: 0, required: 0, percentage: 0 },
      },
      recentActivity: [],
      nextLevelRequirements: {
        level: 0,
        requirements: [],
      },
    });
  }

  try {
    const session = await getSession({ req });
    if (!session?.user) {
      return res.status(401).json({
        currentLevel: 0,
        progress: {
          transactions: { current: 0, required: 0, percentage: 0 },
          activity: { current: 0, required: 0, percentage: 0 },
          referrals: { current: 0, required: 0, percentage: 0 },
        },
        recentActivity: [],
        nextLevelRequirements: {
          level: 0,
          requirements: [],
        },
      });
    }

    // Fetch user's progress data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        activityLogs: {
          orderBy: { timestamp: 'desc' },
          take: 5,
        },
        referrals: {
          where: { isActive: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        currentLevel: 0,
        progress: {
          transactions: { current: 0, required: 0, percentage: 0 },
          activity: { current: 0, required: 0, percentage: 0 },
          referrals: { current: 0, required: 0, percentage: 0 },
        },
        recentActivity: [],
        nextLevelRequirements: {
          level: 0,
          requirements: [],
        },
      });
    }

    const currentLevel = user.sqlLevel || 0;
    const nextLevel: number = currentLevel + 1;

    // Calculate progress for each requirement
    const transactionProgress = {
      current: user.transactions.length,
      required: 5,
      percentage: Math.min((user.transactions.length / 5) * 100, 100),
    };

    const activityProgress = {
      current: user.activityLogs.length,
      required: 30,
      percentage: Math.min((user.activityLogs.length / 30) * 100, 100),
    };

    const referralProgress = {
      current: user.referrals.length,
      required: 2,
      percentage: Math.min((user.referrals.length / 2) * 100, 100),
    };

    // Format recent activity
    const recentActivity = user.activityLogs.map((log: ActivityLog) => ({
      type: log.type,
      timestamp: log.timestamp.toISOString(),
      details: log.details,
    }));

    // Define next level requirements
    const nextLevelRequirements: SQLProgressResponse['nextLevelRequirements'] = {
      level: nextLevel,
      requirements: [
        {
          name: 'Complete Transactions',
          status: transactionProgress.percentage === 100 ? 'completed' : 'in-progress',
          progress: transactionProgress.percentage,
        },
        {
          name: 'Maintain Activity',
          status: activityProgress.percentage === 100 ? 'completed' : 'in-progress',
          progress: activityProgress.percentage,
        },
        {
          name: 'Active Referrals',
          status: referralProgress.percentage === 100 ? 'completed' : 'in-progress',
          progress: referralProgress.percentage,
        },
      ],
    };

    return res.status(200).json({
      currentLevel,
      progress: {
        transactions: transactionProgress,
        activity: activityProgress,
        referrals: referralProgress,
      },
      recentActivity,
      nextLevelRequirements,
    });
  } catch (error) {
    console.error('SQL progress error:', error);
    return res.status(500).json({
      currentLevel: 0,
      progress: {
        transactions: { current: 0, required: 0, percentage: 0 },
        activity: { current: 0, required: 0, percentage: 0 },
        referrals: { current: 0, required: 0, percentage: 0 },
      },
      recentActivity: [],
      nextLevelRequirements: {
        level: 0,
        requirements: [],
      },
    });
  }
}
