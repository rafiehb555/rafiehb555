import { NextRequest, NextResponse } from 'next/server';
import {
  initMoonbeamProvider,
  getBalance,
  getNetworkInfo,
  getGasPrice,
  getTransactionReceipt,
  getBlockInfo,
} from '../../../lib/moonbeam/config';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const action = searchParams.get('action');
    const address = searchParams.get('address');
    const txHash = searchParams.get('txHash');
    const blockNumber = searchParams.get('blockNumber');

    const provider = initMoonbeamProvider();

    switch (action) {
      case 'network':
        const networkInfo = await getNetworkInfo(provider);
        return NextResponse.json({ networkInfo });

      case 'balance':
        if (!address) {
          return NextResponse.json({ error: 'Address is required' }, { status: 400 });
        }
        const balance = await getBalance(provider, address);
        return NextResponse.json({ balance: balance.toString() });

      case 'gas':
        const gasPrice = await getGasPrice(provider);
        return NextResponse.json({ gasPrice: gasPrice.toString() });

      case 'transaction':
        if (!txHash) {
          return NextResponse.json({ error: 'Transaction hash is required' }, { status: 400 });
        }
        const receipt = await getTransactionReceipt(provider, txHash);
        return NextResponse.json({ receipt });

      case 'block':
        if (!blockNumber) {
          return NextResponse.json({ error: 'Block number is required' }, { status: 400 });
        }
        const block = await getBlockInfo(provider, parseInt(blockNumber));
        return NextResponse.json({ block });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Moonbeam API Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
