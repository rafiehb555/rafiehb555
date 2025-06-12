import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { CreateTransactionRequest, PaginationParams } from '@/types/api';
import { z } from 'zod';

// Validation schema
const transactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'BONUS']),
  description: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId: session.user.id },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.transaction.count({
        where: { userId: session.user.id },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: transactions,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Transaction list error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = transactionSchema.parse(body);

    // Get user's wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    });

    if (!wallet) {
      return NextResponse.json({ success: false, error: 'Wallet not found' }, { status: 404 });
    }

    // Check sufficient balance for withdrawals
    if (validatedData.type === 'WITHDRAWAL' && wallet.balance < validatedData.amount) {
      return NextResponse.json({ success: false, error: 'Insufficient balance' }, { status: 400 });
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        walletId: wallet.id,
        amount: validatedData.amount,
        type: validatedData.type,
        status: 'PENDING',
        description: validatedData.description,
      },
    });

    // Update wallet balance
    const balanceChange =
      validatedData.type === 'WITHDRAWAL' ? -validatedData.amount : validatedData.amount;

    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: balanceChange } },
    });

    // Update transaction status
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: 'COMPLETED' },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...transaction,
        status: 'COMPLETED',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Transaction creation error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
