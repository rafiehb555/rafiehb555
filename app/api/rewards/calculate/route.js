import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import RewardsPool from '../../../../contracts/rewards-pool.sol';

// SQL Level weights
const SQL_WEIGHTS = {
  Free: 0,
  Basic: 0.3,
  Normal: 0.6,
  High: 0.9,
  VIP: 1.0
};

// Franchise role modifiers
const FRANCHISE_MODIFIERS = {
  Sub: 0.02,
  Master: 0.03,
  Corporate: 0.05
};

// Loyalty multipliers
const LOYALTY_MULTIPLIERS = {
  1: 0.005, // 0.5%
  2: 0.01,  // 1.0%
  3: 0.011  // 1.1%
};

export async function POST(req) {
  try {
    const { validatorAddress, sqlLevel, franchiseRole, loyaltyYears, stakedAmount } = await req.json();

    // Validate input
    if (!validatorAddress || !sqlLevel || !franchiseRole || !stakedAmount) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Calculate base reward (5% of staked amount)
    let reward = stakedAmount * 0.05;

    // Apply SQL weight
    reward *= SQL_WEIGHTS[sqlLevel] || 0;

    // Apply franchise modifier
    reward *= (1 + (FRANCHISE_MODIFIERS[franchiseRole] || 0));

    // Apply loyalty multiplier
    reward *= (1 + (LOYALTY_MULTIPLIERS[loyaltyYears] || 0));

    // Format reward to 18 decimals (standard for most tokens)
    const formattedReward = ethers.utils.parseUnits(reward.toString(), 18);

    return NextResponse.json({
      success: true,
      data: {
        validatorAddress,
        baseReward: stakedAmount * 0.05,
        sqlWeight: SQL_WEIGHTS[sqlLevel] || 0,
        franchiseModifier: FRANCHISE_MODIFIERS[franchiseRole] || 0,
        loyaltyMultiplier: LOYALTY_MULTIPLIERS[loyaltyYears] || 0,
        finalReward: formattedReward.toString()
      }
    });

  } catch (error) {
    console.error('Error calculating reward:', error);
    return NextResponse.json(
      { error: 'Failed to calculate reward' },
      { status: 500 }
    );
  }
} 