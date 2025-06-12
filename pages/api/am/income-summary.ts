import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../lib/prisma';

interface IncomeSummary {
  totalEarnings: number;
  sources: {
    direct: {
      amount: number;
      trend: number;
      period: string;
    };
    indirect: {
      amount: number;
      trend: number;
      period: string;
    };
    team: {
      amount: number;
      trend: number;
      period: string;
    };
  };
  monthlyBreakdown: {
    month: string;
    direct: number;
    indirect: number;
    team: number;
    total: number;
  }[];
  recentTransactions: {
    id: string;
    type: string;
    amount: number;
    timestamp: string;
    details: string;
  }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<IncomeSummary>) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      totalEarnings: 0,
      sources: {
        direct: { amount: 0, trend: 0, period: 'month' },
        indirect: { amount: 0, trend: 0, period: 'month' },
        team: { amount: 0, trend: 0, period: 'month' },
      },
      monthlyBreakdown: [],
      recentTransactions: [],
    });
  }

  try {
    const session = await getSession({ req });
    if (!session?.user) {
      return res.status(401).json({
        totalEarnings: 0,
        sources: {
          direct: { amount: 0, trend: 0, period: 'month' },
          indirect: { amount: 0, trend: 0, period: 'month' },
          team: { amount: 0, trend: 0, period: 'month' },
        },
        monthlyBreakdown: [],
        recentTransactions: [],
      });
    }

    // Fetch user's earnings data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        earnings: {
          orderBy: { timestamp: 'desc' },
          take: 50,
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        totalEarnings: 0,
        sources: {
          direct: { amount: 0, trend: 0, period: 'month' },
          indirect: { amount: 0, trend: 0, period: 'month' },
          team: { amount: 0, trend: 0, period: 'month' },
        },
        monthlyBreakdown: [],
        recentTransactions: [],
      });
    }

    // Calculate current month's earnings
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const currentMonthEarnings = user.earnings.filter(e => e.timestamp >= startOfMonth);
    const lastMonthEarnings = user.earnings.filter(
      e => e.timestamp >= startOfLastMonth && e.timestamp < startOfMonth
    );

    // Calculate earnings by source
    const calculateSourceEarnings = (earnings: any[]) => {
      const direct = earnings
        .filter(e => e.type === 'direct')
        .reduce((sum, e) => sum + e.amount, 0);
      const indirect = earnings
        .filter(e => e.type === 'indirect')
        .reduce((sum, e) => sum + e.amount, 0);
      const team = earnings.filter(e => e.type === 'team').reduce((sum, e) => sum + e.amount, 0);

      return { direct, indirect, team };
    };

    const currentMonth = calculateSourceEarnings(currentMonthEarnings);
    const lastMonth = calculateSourceEarnings(lastMonthEarnings);

    // Calculate trends
    const calculateTrend = (current: number, last: number) => {
      if (last === 0) return 100;
      return ((current - last) / last) * 100;
    };

    const sources = {
      direct: {
        amount: currentMonth.direct,
        trend: calculateTrend(currentMonth.direct, lastMonth.direct),
        period: 'month',
      },
      indirect: {
        amount: currentMonth.indirect,
        trend: calculateTrend(currentMonth.indirect, lastMonth.indirect),
        period: 'month',
      },
      team: {
        amount: currentMonth.team,
        trend: calculateTrend(currentMonth.team, lastMonth.team),
        period: 'month',
      },
    };

    // Calculate monthly breakdown for the last 6 months
    const monthlyBreakdown = Array.from({ length: 6 }, (_, i) => {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthEarnings = user.earnings.filter(
        e => e.timestamp >= monthStart && e.timestamp <= monthEnd
      );

      const { direct, indirect, team } = calculateSourceEarnings(monthEarnings);
      const total = direct + indirect + team;

      return {
        month: monthStart.toLocaleString('default', { month: 'short', year: 'numeric' }),
        direct,
        indirect,
        team,
        total,
      };
    }).reverse();

    // Format recent transactions
    const recentTransactions = user.earnings.slice(0, 10).map(earning => ({
      id: earning.id,
      type: earning.type,
      amount: earning.amount,
      timestamp: earning.timestamp.toISOString(),
      details: earning.details,
    }));

    return res.status(200).json({
      totalEarnings: currentMonth.direct + currentMonth.indirect + currentMonth.team,
      sources,
      monthlyBreakdown,
      recentTransactions,
    });
  } catch (error) {
    console.error('Income summary error:', error);
    return res.status(500).json({
      totalEarnings: 0,
      sources: {
        direct: { amount: 0, trend: 0, period: 'month' },
        indirect: { amount: 0, trend: 0, period: 'month' },
        team: { amount: 0, trend: 0, period: 'month' },
      },
      monthlyBreakdown: [],
      recentTransactions: [],
    });
  }
}
