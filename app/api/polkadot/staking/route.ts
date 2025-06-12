import { NextRequest, NextResponse } from 'next/server';
import { initPolkadotAPI } from '../../../../lib/polkadot/config';
import { PolkadotStaking } from '../../../../lib/polkadot/staking';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const action = searchParams.get('action');
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const api = await initPolkadotAPI();
    const staking = new PolkadotStaking(api);

    switch (action) {
      case 'info':
        const stakingInfo = await staking.getStakingInfo(address);
        return NextResponse.json({ stakingInfo });

      case 'validator':
        const validatorInfo = await staking.getValidatorInfo(address);
        return NextResponse.json({ validatorInfo });

      case 'active-validators':
        const activeValidators = await staking.getActiveValidators();
        return NextResponse.json({ activeValidators });

      case 'rewards':
        const eraCount = parseInt(searchParams.get('eraCount') || '10');
        const rewardsHistory = await staking.getRewardsHistory(address, eraCount);
        return NextResponse.json({ rewardsHistory });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Polkadot Staking API Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
