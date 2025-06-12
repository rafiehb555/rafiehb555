import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../lib/prisma';

interface ReferralNode {
  id: string;
  name: string;
  level: number;
  children: ReferralNode[];
}

interface ReferralTreeResponse {
  success: boolean;
  data?: ReferralNode;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReferralTreeResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    if (!session?.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Recursive function to build the tree up to 10 levels
    async function buildTree(userId: string, level: number = 1): Promise<ReferralNode> {
      if (level > 10) return null;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          directReferrals: { select: { id: true } },
        },
      });
      if (!user) return null;
      const children = await Promise.all(
        user.directReferrals.map(ref => buildTree(ref.id, level + 1))
      );
      return {
        id: user.id,
        name: user.name,
        level,
        children: children.filter(Boolean),
      };
    }

    const tree = await buildTree(session.user.id, 1);
    if (!tree) {
      return res.status(404).json({ success: false, error: 'User not found or no tree' });
    }
    return res.status(200).json({ success: true, data: tree });
  } catch (error) {
    console.error('Referral tree error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
