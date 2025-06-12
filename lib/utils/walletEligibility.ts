import { Wallet } from '@/lib/models/Wallet';
import dbConnect from '@/lib/mongodb';
import Wallet from '@/lib/models/Wallet';

export interface EligibilityCheck {
  isEligible: boolean;
  reason?: string;
  requiredLevel?: string;
}

export interface ModuleRequirements {
  minBalance: number;
  minLockedBalance: number;
  requiredLoyaltyType?: string;
}

export const MODULE_REQUIREMENTS: Record<string, ModuleRequirements> = {
  gosellr: {
    minBalance: 100,
    minLockedBalance: 50,
    requiredLoyaltyType: 'bronze',
  },
  emo: {
    minBalance: 200,
    minLockedBalance: 100,
    requiredLoyaltyType: 'silver',
  },
  edr: {
    minBalance: 150,
    minLockedBalance: 75,
    requiredLoyaltyType: 'bronze',
  },
  jps: {
    minBalance: 300,
    minLockedBalance: 150,
    requiredLoyaltyType: 'gold',
  },
  pss: {
    minBalance: 500,
    minLockedBalance: 250,
    requiredLoyaltyType: 'platinum',
  },
};

export async function checkModuleEligibility(
  userId: string,
  moduleName: string
): Promise<EligibilityCheck> {
  try {
    const response = await fetch(`/api/wallet/eligibility?module=${moduleName}`);
    if (!response.ok) {
      throw new Error('Failed to check eligibility');
    }
    return await response.json();
  } catch (error) {
    console.error('Error checking eligibility:', error);
    return {
      isEligible: false,
      reason: 'Failed to check eligibility',
    };
  }
}

export function getModuleRequirements(moduleName: string): ModuleRequirements | null {
  return MODULE_REQUIREMENTS[moduleName] || null;
}

export function calculateMonthlyBonus(wallet: Wallet): number {
  const baseRate = 0.05; // 5% base rate
  const loyaltyMultiplier =
    {
      bronze: 1,
      silver: 1.2,
      gold: 1.5,
      platinum: 2,
    }[wallet.loyaltyType] || 1;

  return wallet.lockedBalance * baseRate * loyaltyMultiplier;
}

export function isWalletActive(wallet: Wallet): boolean {
  return wallet.balance > 0 || wallet.lockedBalance > 0;
}

export async function checkWalletEligibility(userId: string, requiredBalance: number) {
  await dbConnect();
  const wallet = await Wallet.findOne({ userId });
  if (!wallet || wallet.balance < requiredBalance) {
    throw new Error('Insufficient wallet balance.');
  }
  return true;
}

export function getRequiredSqlLevel(moduleName: string): string {
  const requirements: Record<string, string> = {
    gosellr: 'Basic',
    emo: 'Intermediate',
    edr: 'Advanced',
    franchise: 'Expert',
  };
  return requirements[moduleName] || 'Basic';
}

export function checkSqlLevel(wallet: Wallet, requiredLevel: string): boolean {
  const levels = ['Basic', 'Intermediate', 'Advanced', 'Expert'];
  const walletLevelIndex = levels.indexOf(wallet.sqlLevel);
  const requiredLevelIndex = levels.indexOf(requiredLevel);
  return walletLevelIndex >= requiredLevelIndex;
}
