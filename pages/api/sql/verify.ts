import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../lib/prisma';

interface SQLVerificationResponse {
  sqlLevel: number;
  status: 'verified' | 'pending' | 'rejected';
  requirements: {
    pss: boolean;
    edr: boolean;
    kyc: boolean;
  };
  nextLevel?: {
    level: number;
    requirements: string[];
  };
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SQLVerificationResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      sqlLevel: 0,
      status: 'rejected',
      requirements: {
        pss: false,
        edr: false,
        kyc: false,
      },
      message: 'Method not allowed',
    });
  }

  try {
    const session = await getSession({ req });
    if (!session?.user) {
      return res.status(401).json({
        sqlLevel: 0,
        status: 'rejected',
        requirements: {
          pss: false,
          edr: false,
          kyc: false,
        },
        message: 'Unauthorized',
      });
    }

    // Fetch user's PSS and EDR status
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        pssProfile: true,
        edrProfile: true,
        kycProfile: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        sqlLevel: 0,
        status: 'rejected',
        requirements: {
          pss: false,
          edr: false,
          kyc: false,
        },
        message: 'User not found',
      });
    }

    // Check requirements for current SQL level
    const requirements = {
      pss: user.pssProfile?.isVerified || false,
      edr: user.edrProfile?.isVerified || false,
      kyc: user.kycProfile?.isVerified || false,
    };

    // Determine SQL level based on requirements
    let sqlLevel = 0;
    let status: 'verified' | 'pending' | 'rejected' = 'pending';
    let nextLevel;

    if (requirements.pss && requirements.edr && requirements.kyc) {
      sqlLevel = 1;
      status = 'verified';
      nextLevel = {
        level: 2,
        requirements: [
          'Complete 5 transactions',
          'Maintain 30 days activity',
          'Refer 2 active users',
        ],
      };
    }

    return res.status(200).json({
      sqlLevel,
      status,
      requirements,
      nextLevel,
      message:
        status === 'verified'
          ? 'SQL level verified successfully'
          : 'Pending verification requirements',
    });
  } catch (error) {
    console.error('SQL verification error:', error);
    return res.status(500).json({
      sqlLevel: 0,
      status: 'rejected',
      requirements: {
        pss: false,
        edr: false,
        kyc: false,
      },
      message: 'Internal server error',
    });
  }
}
