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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = (await getSession({ req })) as Session | null;

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check if user is admin or requesting their own logs
  const isAdmin = session.user.role === 'admin';
  const isOwnLogs = req.query.userId === session.user.id;

  if (!isAdmin && !isOwnLogs) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'Missing user ID' });
    }

    const user = await User.findById(userId).select(
      'sqlHistory sqlLevel sqlStatus sqlVerifiedDate sqlIssuedBy'
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Format SQL history for response
    const formattedHistory = user.sqlHistory.map(entry => ({
      fromLevel: entry.fromLevel,
      toLevel: entry.toLevel,
      status: entry.status,
      submittedAt: entry.submittedAt,
      notes: entry.notes,
      documents: entry.documents || [],
    }));

    return res.status(200).json({
      success: true,
      data: {
        currentLevel: user.sqlLevel,
        currentStatus: user.sqlStatus,
        lastVerified: user.sqlVerifiedDate,
        lastVerifiedBy: user.sqlIssuedBy,
        history: formattedHistory,
      },
    });
  } catch (error) {
    console.error('Error fetching SQL history:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
