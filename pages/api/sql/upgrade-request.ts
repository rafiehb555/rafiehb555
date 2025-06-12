import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { connectDB } from '../../../lib/dbConnect';
import User from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { targetLevel, documents, notes } = req.body;
    const userId = session.user.id;

    // Get user's current status
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user already has a pending request
    if (user.sqlStatus === 'pending') {
      return res.status(400).json({
        error: 'You already have a pending upgrade request',
      });
    }

    // Validate target level
    if (targetLevel <= user.sqlLevel) {
      return res.status(400).json({
        error: 'Target level must be higher than current level',
      });
    }

    // Check eligibility based on current level
    const eligibilityCheck = await checkEligibility(user, targetLevel);
    if (!eligibilityCheck.eligible) {
      return res.status(400).json({
        error: eligibilityCheck.reason,
      });
    }

    // Create upgrade request
    const upgradeRequest = {
      targetLevel,
      documents,
      notes,
      submittedAt: new Date(),
      status: 'pending',
    };

    // Update user with upgrade request
    await User.findByIdAndUpdate(userId, {
      sqlStatus: 'pending',
      sqlUpgradePending: targetLevel,
      $push: {
        sqlHistory: {
          fromLevel: user.sqlLevel,
          toLevel: targetLevel,
          status: 'pending',
          submittedAt: new Date(),
          documents,
          notes,
        },
      },
    });

    // TODO: Notify admin about new upgrade request
    // TODO: Send confirmation email to user

    return res.status(200).json({
      success: true,
      message: 'Upgrade request submitted successfully',
      requestId: upgradeRequest.submittedAt.getTime().toString(),
    });
  } catch (error) {
    console.error('Error processing upgrade request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function checkEligibility(user: any, targetLevel: number) {
  // SQL 0 → 1: Must complete PSS (KYC)
  if (user.sqlLevel === 0 && targetLevel === 1) {
    if (!user.pssVerified) {
      return {
        eligible: false,
        reason: 'PSS verification required for SQL level 1',
      };
    }
  }

  // SQL 1 → 2: Must pass EDR skill test
  if (user.sqlLevel === 1 && targetLevel === 2) {
    if (!user.edrPassed) {
      return {
        eligible: false,
        reason: 'EDR skill test required for SQL level 2',
      };
    }
  }

  // SQL 2 → 3: EMO confirmation or job/income proof
  if (user.sqlLevel === 2 && targetLevel === 3) {
    if (!user.emoVerified && !user.hasJobProof) {
      return {
        eligible: false,
        reason: 'EMO verification or job proof required for SQL level 3',
      };
    }
  }

  // SQL 3 → 4: Admin-reviewed / Franchise verified
  if (user.sqlLevel === 3 && targetLevel === 4) {
    if (!user.franchiseVerified) {
      return {
        eligible: false,
        reason: 'Franchise verification required for SQL level 4',
      };
    }
  }

  return { eligible: true };
}
