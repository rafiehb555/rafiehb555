import { prisma } from '@/lib/prisma';
import type { CreateTransactionRequest, TransactionResponse, WalletBalance } from '@/types/api';
import type { CoinLock, Transaction } from '@prisma/client';

export class WalletService {
  static async getBalance(userId: string): Promise<WalletBalance> {
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: {
        coinLocks: {
          where: {
            status: 'active',
          },
        },
      },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const lockedBalance = wallet.coinLocks.reduce(
      (total: number, lock: CoinLock) => total + Number(lock.amount),
      0
    );

    return {
      balance: Number(wallet.balance),
      lockedBalance,
      availableBalance: Number(wallet.balance) - lockedBalance,
      lastUpdated: wallet.updatedAt.toISOString(),
    };
  }

  static async createTransaction(
    userId: string,
    data: CreateTransactionRequest
  ): Promise<TransactionResponse> {
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Check if user has sufficient balance for withdrawal
    if (data.type === 'withdrawal' && Number(wallet.balance) < data.amount) {
      throw new Error('Insufficient balance');
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type: data.type.toUpperCase(),
        amount: data.amount,
        status: 'PENDING',
        description: data.description,
      },
    });

    // Update wallet balance
    const newBalance =
      data.type === 'deposit'
        ? Number(wallet.balance) + data.amount
        : Number(wallet.balance) - data.amount;

    await prisma.wallet.update({
      where: { userId },
      data: { balance: newBalance },
    });

    return {
      id: transaction.id,
      type: data.type,
      amount: data.amount,
      status: 'pending',
      description: data.description,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    };
  }

  static async getTransactionHistory(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.transaction.count({
        where: { userId },
      }),
    ]);

    return {
      transactions: transactions.map((t: Transaction) => ({
        id: t.id,
        type: t.type.toLowerCase() as 'deposit' | 'withdrawal',
        amount: Number(t.amount),
        status: t.status.toLowerCase() as 'pending' | 'completed' | 'failed',
        description: t.description,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      })),
      total,
      page,
      limit,
      hasMore: skip + transactions.length < total,
    };
  }
}
