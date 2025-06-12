import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { connectDB } from '../../../lib/dbConnect';
import User from '../../../models/User';

interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = (await getSession({ req })) as Session | null;

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check if user is admin
  const isAdmin = session.user.role === 'admin';
  if (!isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { userId, newLevel } = req.body;

    if (!userId || !newLevel) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update JPS status if applicable
    if (newLevel >= 2) {
      // TODO: Update JPS status through JPS API
      console.log('Updating JPS status for user:', userId);
    }

    // Update wallet permissions
    if (newLevel >= 3) {
      // TODO: Update wallet permissions through Wallet API
      console.log('Updating wallet permissions for user:', userId);
    }

    // Update franchise eligibility
    if (newLevel >= 4) {
      // TODO: Update franchise eligibility through Franchise API
      console.log('Updating franchise eligibility for user:', userId);
    }

    // Update user's SQL level in the database
    await User.findByIdAndUpdate(userId, {
      sqlLevel: newLevel,
      sqlStatus: 'approved',
      sqlUpgradePending: null,
      sqlVerifiedDate: new Date(),
      sqlIssuedBy: session.user.name,
    });

    return res.status(200).json({
      success: true,
      message: 'Cross-system updates completed successfully',
    });
  } catch (error) {
    console.error('Error processing cross-system updates:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
