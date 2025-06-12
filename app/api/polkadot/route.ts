import { NextRequest, NextResponse } from 'next/server';
import {
  initPolkadotAPI,
  getBalance,
  getStakingInfo,
  getValidatorInfo,
} from '../../../lib/polkadot/config';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const address = searchParams.get('address');
    const action = searchParams.get('action');

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const api = await initPolkadotAPI();

    switch (action) {
      case 'balance':
        const balance = await getBalance(api, address);
        return NextResponse.json({ balance: balance.toString() });

      case 'staking':
        const stakingInfo = await getStakingInfo(api, address);
        return NextResponse.json({ stakingInfo });

      case 'validator':
        const validatorInfo = await getValidatorInfo(api, address);
        return NextResponse.json({ validatorInfo });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Polkadot API Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
