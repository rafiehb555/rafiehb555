import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../lib/prisma';

interface SQLLevelConfig {
  minLevel: number;
  requireActive?: boolean;
  requireLoyaltyLock?: boolean;
  checkWalletBalance?: boolean;
  minWalletBalance?: number;
}

export function checkSQLLevel(config: SQLLevelConfig) {
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
          wallet: true,
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
      const walletBalance = user.wallet?.balance || 0;

      // Check minimum SQL level
      if (currentLevel < config.minLevel) {
        return res.status(403).json({
          success: false,
          error: `SQL level ${config.minLevel} required (current: ${currentLevel})`,
          requiredLevel: config.minLevel,
          currentLevel,
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

      // Check wallet balance if required
      if (config.checkWalletBalance && config.minWalletBalance) {
        if (walletBalance < config.minWalletBalance) {
          return res.status(403).json({
            success: false,
            error: `Minimum wallet balance of ${config.minWalletBalance} required`,
            requiredBalance: config.minWalletBalance,
            currentBalance: walletBalance,
          });
        }
      }

      // Add user info to request
      req.user = user;

      // Log SQL level check
      await prisma.sqlLevelCheck.create({
        data: {
          userId: user.id,
          requiredLevel: config.minLevel,
          currentLevel,
          passed: true,
          endpoint: req.url || '',
          method: req.method,
        },
      });

      next();
    } catch (error) {
      console.error('SQL level check error:', error);
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
    checkWalletBalance: true,
    minWalletBalance: 1000,
  },
  premium: {
    minLevel: 4,
    requireActive: true,
    requireLoyaltyLock: true,
    checkWalletBalance: true,
    minWalletBalance: 5000,
  },
  elite: {
    minLevel: 5,
    requireActive: true,
    requireLoyaltyLock: true,
    checkWalletBalance: true,
    minWalletBalance: 10000,
  },
};
