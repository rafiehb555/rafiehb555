import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../lib/prisma';

interface UserStats {
  directReferrals: number;
  currentLevel: number;
  bonusAmount: number;
  rankName: string;
  referralCount: number;
  totalEarnings: number;
  activeReferrals: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; data?: UserStats; error?: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    if (!session?.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        sqlProfile: true,
        directReferrals: true,
        earnings: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const currentLevel = user.sqlProfile?.level || 0;
    const directReferrals = user.directReferrals.length;
    const referralCount = directReferrals; // For now, only direct
    const activeReferrals = user.directReferrals.filter(r => r.isActive).length;
    const totalEarnings = user.earnings.reduce((sum, e) => sum + e.amount, 0);
    const bonusAmount = user.earnings
      .filter(e => e.type === 'bonus')
      .reduce((sum, e) => sum + e.amount, 0);
    const rankName = getRankName(currentLevel);

    return res.status(200).json({
      success: true,
      data: {
        directReferrals,
        currentLevel,
        bonusAmount,
        rankName,
        referralCount,
        totalEarnings,
        activeReferrals,
      },
    });
  } catch (error) {
    console.error('User stats error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

function getRankName(level: number): string {
  switch (level) {
    case 1:
      return 'Starter';
    case 2:
      return 'Builder';
    case 3:
      return 'Leader';
    case 4:
      return 'Pro';
    case 5:
      return 'Elite';
    default:
      return 'Unranked';
  }
}
