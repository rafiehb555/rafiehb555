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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const pendingRequests = await User.find({
      sqlStatus: 'pending',
      sqlUpgradePending: { $exists: true, $ne: null },
    }).select('name email sqlLevel sqlUpgradePending sqlHistory');

    const formattedRequests = pendingRequests.map(user => {
      const latestHistory = user.sqlHistory[user.sqlHistory.length - 1];
      return {
        userId: user._id,
        name: user.name,
        email: user.email,
        currentLevel: user.sqlLevel,
        targetLevel: user.sqlUpgradePending,
        submittedAt: latestHistory?.submittedAt,
        documents: latestHistory?.documents || [],
        notes: latestHistory?.notes,
      };
    });

    return res.status(200).json({
      success: true,
      requests: formattedRequests,
    });
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
