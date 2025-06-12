import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { connectDB } from '../../../lib/dbConnect';
import User from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const user = await User.findById(session.user.id).select(
      'sqlLevel sqlStatus sqlIssuedBy sqlVerifiedDate sqlUpgradePending sqlHistory'
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      data: {
        currentLevel: user.sqlLevel,
        status: user.sqlStatus,
        issuedBy: user.sqlIssuedBy,
        verifiedDate: user.sqlVerifiedDate,
        pendingUpgrade: user.sqlUpgradePending,
        history: user.sqlHistory || [],
      },
    });
  } catch (error) {
    console.error('Error fetching SQL level:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
