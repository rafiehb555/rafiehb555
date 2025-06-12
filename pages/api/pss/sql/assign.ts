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

interface SQLAssignmentCriteria {
  documentCompleteness: number; // 0-100
  jpsPerformance?: number; // 0-100 (optional)
  edrTestScore?: number; // 0-100 (optional)
  hasPenalties: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = (await getSession({ req })) as Session | null;

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Only admin or system can trigger SQL assignment
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

    const { userId, criteria } = req.body as { userId: string; criteria: SQLAssignmentCriteria };

    if (!userId || !criteria) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate SQL level based on criteria
    let newLevel = 0; // Default to Free level

    // Basic level requirements
    if (
      criteria.documentCompleteness >= 60 &&
      criteria.verificationStatus === 'verified' &&
      !criteria.hasPenalties
    ) {
      newLevel = 1; // Basic level
    }

    // Normal level requirements
    if (
      criteria.documentCompleteness >= 80 &&
      criteria.verificationStatus === 'verified' &&
      !criteria.hasPenalties &&
      (criteria.jpsPerformance || 0) >= 70
    ) {
      newLevel = 2; // Normal level
    }

    // High level requirements
    if (
      criteria.documentCompleteness >= 90 &&
      criteria.verificationStatus === 'verified' &&
      !criteria.hasPenalties &&
      (criteria.jpsPerformance || 0) >= 85 &&
      (criteria.edrTestScore || 0) >= 80
    ) {
      newLevel = 3; // High level
    }

    // VIP level requirements
    if (
      criteria.documentCompleteness === 100 &&
      criteria.verificationStatus === 'verified' &&
      !criteria.hasPenalties &&
      (criteria.jpsPerformance || 0) >= 95 &&
      (criteria.edrTestScore || 0) >= 90
    ) {
      newLevel = 4; // VIP level
    }

    // Update user's SQL level
    const oldLevel = user.sqlLevel;
    await User.findByIdAndUpdate(userId, {
      sqlLevel: newLevel,
      sqlStatus: 'approved',
      sqlVerifiedDate: new Date(),
      sqlIssuedBy: isAdmin ? session.user.name : 'system',
    });

    // Add to SQL history
    await User.findByIdAndUpdate(userId, {
      $push: {
        sqlHistory: {
          fromLevel: oldLevel,
          toLevel: newLevel,
          status: 'approved',
          submittedAt: new Date(),
          notes: 'Auto-assigned based on verification criteria',
        },
      },
    });

    // TODO: Trigger cross-system updates
    // - Update JPS job eligibility
    // - Update GoSellr seller status
    // - Update Wallet permissions
    // - Update Franchise access

    return res.status(200).json({
      success: true,
      message: 'SQL level assigned successfully',
      data: {
        userId,
        oldLevel,
        newLevel,
        criteria,
      },
    });
  } catch (error) {
    console.error('Error assigning SQL level:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
