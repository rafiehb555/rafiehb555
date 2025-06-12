// Franchise earning and validator logic

export interface FranchiseEarningsResult {
  earningRatio: number; // 1.0 (full) or 0.3 (reduced)
  validatorEligible: boolean;
  loyaltyBonusPercent: number; // e.g. 0.005, 0.01, 0.011
}

export interface FranchiseInput {
  walletBalance: number;
  lockedAmount: number;
  lockDuration: number; // in months
}

const VALIDATOR_THRESHOLD = 10000; // EHBGC required for validator

export function calculateFranchiseEarnings(input: FranchiseInput): FranchiseEarningsResult {
  const { walletBalance, lockedAmount, lockDuration } = input;

  // Earning ratio logic (70/30 rule)
  const requiredBalance = 1000; // Example: 1000 EHBGC required for full earnings
  const earningRatio = walletBalance >= requiredBalance ? 1.0 : 0.3;

  // Validator eligibility
  const validatorEligible = walletBalance >= VALIDATOR_THRESHOLD;

  // Loyalty bonus logic
  let loyaltyBonusPercent = 0;
  if (lockedAmount >= 10000 && lockDuration >= 36) {
    loyaltyBonusPercent = 0.011; // 1.1% for 3 years
  } else if (lockedAmount >= 5000 && lockDuration >= 12) {
    loyaltyBonusPercent = 0.01; // 1.0% for 1 year
  } else if (lockedAmount >= 1000 && lockDuration >= 6) {
    loyaltyBonusPercent = 0.005; // 0.5% for 6 months
  }

  return {
    earningRatio,
    validatorEligible,
    loyaltyBonusPercent,
  };
}

export const calculateLoyaltyDiscount = (coinLock: number): number => {
  if (coinLock >= 10000) return 0.15; // 15% discount
  if (coinLock >= 5000) return 0.1; // 10% discount
  if (coinLock >= 1000) return 0.05; // 5% discount
  return 0; // No discount
};
