import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../lib/prisma';

interface SQLLevelConfig {
  minLevel: number;
  requireActive?: boolean;
  requireLoyaltyLock?: boolean;
}

export function sqlLevelAuth(config: SQLLevelConfig) {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    try {
      const session = await getSession({ req });
      if (!session?.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          sqlProfile: true,
          coinLocks: {
            where: {
              status: 'active',
              endDate: {
                gt: new Date(),
              },
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      const currentLevel = user.sqlProfile?.level || 0;
      const hasLoyaltyLock = user.coinLocks.length > 0;
      const isActive = user.sqlProfile?.isActive || false;

      // Check minimum SQL level
      if (currentLevel < config.minLevel) {
        return res.status(403).json({
          success: false,
          error: `SQL level ${config.minLevel} required (current: ${currentLevel})`,
        });
      }

      // Check active status if required
      if (config.requireActive && !isActive) {
        return res.status(403).json({
          success: false,
          error: 'Account must be active to access this feature',
        });
      }

      // Check loyalty lock if required
      if (config.requireLoyaltyLock && !hasLoyaltyLock) {
        return res.status(403).json({
          success: false,
          error: 'Active loyalty lock required',
        });
      }

      // Add user info to request
      req.user = user;
      next();
    } catch (error) {
      console.error('SQL level validation error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };
}

// Export common configurations
export const sqlLevelConfigs = {
  basic: {
    minLevel: 1,
    requireActive: true,
  },
  intermediate: {
    minLevel: 2,
    requireActive: true,
    requireLoyaltyLock: true,
  },
  advanced: {
    minLevel: 3,
    requireActive: true,
    requireLoyaltyLock: true,
  },
  premium: {
    minLevel: 4,
    requireActive: true,
    requireLoyaltyLock: true,
  },
  elite: {
    minLevel: 5,
    requireActive: true,
    requireLoyaltyLock: true,
  },
};
