import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import {
  Wallet,
  Transaction,
  calculateLoyaltyBonus,
  validateTransaction,
} from '@/lib/models/Wallet';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const wallet = await db
      .collection('wallets')
      .findOne({ userId: new ObjectId(session.user.id) });

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    return NextResponse.json(wallet);
  } catch (error) {
    console.error('Wallet fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if wallet already exists
    const existingWallet = await db
      .collection('wallets')
      .findOne({ userId: new ObjectId(session.user.id) });

    if (existingWallet) {
      return NextResponse.json({ error: 'Wallet already exists' }, { status: 400 });
    }

    // Create new wallet
    const newWallet: Wallet = {
      userId: new ObjectId(session.user.id),
      balance: 0,
      lockedBalance: 0,
      loyaltyType: null,
      loyaltyBonus: 0,
      transactionHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('wallets').insertOne(newWallet);

    return NextResponse.json(
      { message: 'Wallet created successfully', walletId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Wallet creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, amount, loyaltyType } = await req.json();
    const client = await clientPromise;
    const db = client.db();

    const wallet = await db
      .collection('wallets')
      .findOne({ userId: new ObjectId(session.user.id) });

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    let updateData: any = {};
    let transaction: Transaction | null = null;

    switch (action) {
      case 'lock':
        if (!validateTransaction('lock', amount, wallet.balance, wallet.lockedBalance)) {
          return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
        }
        updateData = {
          balance: wallet.balance - amount,
          lockedBalance: wallet.lockedBalance + amount,
        };
        transaction = {
          id: new ObjectId().toString(),
          type: 'lock',
          amount,
          description: 'Locked coins',
          timestamp: new Date(),
          status: 'completed',
        };
        break;

      case 'unlock':
        if (!validateTransaction('unlock', amount, wallet.balance, wallet.lockedBalance)) {
          return NextResponse.json({ error: 'Insufficient locked balance' }, { status: 400 });
        }
        updateData = {
          balance: wallet.balance + amount,
          lockedBalance: wallet.lockedBalance - amount,
        };
        transaction = {
          id: new ObjectId().toString(),
          type: 'unlock',
          amount,
          description: 'Unlocked coins',
          timestamp: new Date(),
          status: 'completed',
        };
        break;

      case 'updateLoyalty':
        if (!loyaltyType) {
          return NextResponse.json({ error: 'Loyalty type is required' }, { status: 400 });
        }
        const bonus = calculateLoyaltyBonus(loyaltyType);
        updateData = {
          loyaltyType,
          loyaltyBonus: bonus,
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Add transaction to history if exists
    if (transaction) {
      updateData.transactionHistory = [...wallet.transactionHistory, transaction];
    }

    // Update wallet
    const result = await db.collection('wallets').updateOne(
      { userId: new ObjectId(session.user.id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Wallet updated successfully' });
  } catch (error) {
    console.error('Wallet update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
