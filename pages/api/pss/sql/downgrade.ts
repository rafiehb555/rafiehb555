import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { connectDB } from '../../../../lib/dbConnect';
import User from '../../../../models/User';

interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
  };
}

interface DowngradeReason {
  type: 'penalty' | 'kyc_expired' | 'complaint' | 'manual';
  description: string;
  penaltyAmount?: number;
  complaintId?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = (await getSession({ req })) as Session | null;

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Only admin or system can trigger SQL downgrade
  const isAdmin = session.user.role === 'admin';
  const isSystem = req.headers['x-system-token'] === process.env.SYSTEM_API_TOKEN;

  if (!isAdmin && !isSystem) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { userId, reason } = req.body as { userId: string; reason: DowngradeReason };

    if (!userId || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate new level based on reason and current level
    let newLevel = user.sqlLevel;

    switch (reason.type) {
      case 'penalty':
        // Downgrade by 1 level for penalties
        newLevel = Math.max(0, user.sqlLevel - 1);
        break;

      case 'kyc_expired':
        // Downgrade to Basic level if KYC expired
        newLevel = Math.min(user.sqlLevel, 1);
        break;

      case 'complaint':
        // Downgrade by 2 levels for serious complaints
        newLevel = Math.max(0, user.sqlLevel - 2);
        break;

      case 'manual':
        // Manual downgrade - level specified in reason
        newLevel = Math.max(0, user.sqlLevel - 1);
        break;
    }

    // Update user's SQL level
    const oldLevel = user.sqlLevel;
    await User.findByIdAndUpdate(userId, {
      sqlLevel: newLevel,
      sqlStatus: 'downgraded',
      sqlVerifiedDate: new Date(),
      sqlIssuedBy: isAdmin ? session.user.name : 'system',
    });

    // Add to SQL history
    await User.findByIdAndUpdate(userId, {
      $push: {
        sqlHistory: {
          fromLevel: oldLevel,
          toLevel: newLevel,
          status: 'downgraded',
          submittedAt: new Date(),
          notes: reason.description,
        },
      },
    });

    // If penalty, create penalty record
    if (reason.type === 'penalty' && reason.penaltyAmount) {
      // TODO: Create penalty record in penalty collection
      // TODO: Trigger wallet deduction
    }

    // TODO: Trigger cross-system updates
    // - Update JPS job eligibility
    // - Update GoSellr seller status
    // - Update Wallet permissions
    // - Update Franchise access

    return res.status(200).json({
      success: true,
      message: 'SQL level downgraded successfully',
      data: {
        userId,
        oldLevel,
        newLevel,
        reason,
      },
    });
  } catch (error) {
    console.error('Error downgrading SQL level:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
