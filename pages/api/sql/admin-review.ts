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

    const { userId, action, notes } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.sqlStatus !== 'pending') {
      return res.status(400).json({ error: 'No pending upgrade request found' });
    }

    const updateData: any = {
      sqlStatus: action === 'approve' ? 'approved' : 'rejected',
      sqlUpgradePending: null,
    };

    if (action === 'approve') {
      updateData.sqlLevel = user.sqlUpgradePending;
      updateData.sqlIssuedBy = session.user.name;
      updateData.sqlVerifiedDate = new Date();
    }

    // Update the latest history entry
    const latestHistory = user.sqlHistory[user.sqlHistory.length - 1];
    if (latestHistory && latestHistory.status === 'pending') {
      latestHistory.status = action === 'approve' ? 'approved' : 'rejected';
      if (notes) {
        latestHistory.notes = notes;
      }
    }

    await User.findByIdAndUpdate(userId, updateData);

    // TODO: Send notification to user about the decision
    // TODO: If approved, trigger any necessary cross-system updates

    return res.status(200).json({
      success: true,
      message: `Upgrade request ${action}d successfully`,
    });
  } catch (error) {
    console.error('Error processing admin review:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
