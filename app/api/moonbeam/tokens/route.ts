import { NextRequest, NextResponse } from 'next/server';
import { MoonbeamToken, MOONBEAM_TOKENS } from '@/lib/moonbeam/tokens';
import { ethers } from 'ethers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  const tokenAddress = searchParams.get('tokenAddress');
  const address = searchParams.get('address');

  if (!tokenAddress) {
    return NextResponse.json({ error: 'Token address is required' }, { status: 400 });
  }

  try {
    const token = new MoonbeamToken(tokenAddress);

    switch (action) {
      case 'balance':
        if (!address) {
          return NextResponse.json(
            { error: 'Address is required for balance check' },
            { status: 400 }
          );
        }
        const balance = await token.getBalance(address);
        return NextResponse.json({ balance: balance.toString() });

      case 'info':
        const info = await token.getTokenInfo();
        return NextResponse.json(info);

      case 'allowance':
        const spender = searchParams.get('spender');
        if (!address || !spender) {
          return NextResponse.json(
            { error: 'Owner and spender addresses are required' },
            { status: 400 }
          );
        }
        const allowance = await token.getAllowance(address, spender);
        return NextResponse.json({ allowance: allowance.toString() });

      case 'transfers':
        const fromBlock = parseInt(searchParams.get('fromBlock') || '0');
        const toBlock = searchParams.get('toBlock') || 'latest';
        const transfers = await token.getTransferEvents(fromBlock, toBlock);
        return NextResponse.json({ transfers });

      case 'approvals':
        const fromBlockApprovals = parseInt(searchParams.get('fromBlock') || '0');
        const toBlockApprovals = searchParams.get('toBlock') || 'latest';
        const approvals = await token.getApprovalEvents(fromBlockApprovals, toBlockApprovals);
        return NextResponse.json({ approvals });

      case 'list':
        return NextResponse.json({ tokens: MOONBEAM_TOKENS });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Moonbeam token error:', error);
    return NextResponse.json({ error: 'Failed to process token request' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  const tokenAddress = searchParams.get('tokenAddress');

  if (!tokenAddress) {
    return NextResponse.json({ error: 'Token address is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const token = new MoonbeamToken(tokenAddress);

    switch (action) {
      case 'transfer':
        const { to, amount, privateKey } = body;
        if (!to || !amount || !privateKey) {
          return NextResponse.json(
            { error: 'To address, amount, and private key are required' },
            { status: 400 }
          );
        }

        const provider = new ethers.providers.JsonRpcProvider(process.env.MOONBEAM_RPC_URL);
        const signer = new ethers.Wallet(privateKey, provider);
        const tx = await token.transfer(signer, to, ethers.BigNumber.from(amount));
        return NextResponse.json({ transactionHash: tx.hash });

      case 'approve':
        const { spender, amount: approveAmount, privateKey: approveKey } = body;
        if (!spender || !approveAmount || !approveKey) {
          return NextResponse.json(
            { error: 'Spender, amount, and private key are required' },
            { status: 400 }
          );
        }

        const approveProvider = new ethers.providers.JsonRpcProvider(process.env.MOONBEAM_RPC_URL);
        const approveSigner = new ethers.Wallet(approveKey, approveProvider);
        const approveTx = await token.approve(
          approveSigner,
          spender,
          ethers.BigNumber.from(approveAmount)
        );
        return NextResponse.json({ transactionHash: approveTx.hash });

      case 'transferFrom':
        const { from, to: transferTo, amount: transferAmount, privateKey: transferKey } = body;
        if (!from || !transferTo || !transferAmount || !transferKey) {
          return NextResponse.json(
            {
              error: 'From address, to address, amount, and private key are required',
            },
            { status: 400 }
          );
        }

        const transferProvider = new ethers.providers.JsonRpcProvider(process.env.MOONBEAM_RPC_URL);
        const transferSigner = new ethers.Wallet(transferKey, transferProvider);
        const transferTx = await token.transferFrom(
          transferSigner,
          from,
          transferTo,
          ethers.BigNumber.from(transferAmount)
        );
        return NextResponse.json({ transactionHash: transferTx.hash });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Moonbeam token error:', error);
    return NextResponse.json({ error: 'Failed to process token request' }, { status: 500 });
  }
}
