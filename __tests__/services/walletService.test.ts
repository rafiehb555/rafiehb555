import { WalletService } from '@/services/walletService';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    wallet: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe('WalletService', () => {
  const mockUserId = 'user123';
  const mockWallet = {
    id: 'wallet123',
    userId: mockUserId,
    balance: 1000,
    coinLocks: [
      { id: 'lock1', amount: 200, status: 'active' },
      { id: 'lock2', amount: 300, status: 'active' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBalance', () => {
    it('should return wallet balance with locked amount', async () => {
      (prisma.wallet.findUnique as jest.Mock).mockResolvedValue(mockWallet);

      const result = await WalletService.getBalance(mockUserId);

      expect(result).toEqual({
        balance: 1000,
        lockedBalance: 500,
        availableBalance: 500,
        lastUpdated: mockWallet.updatedAt.toISOString(),
      });
    });

    it('should throw error if wallet not found', async () => {
      (prisma.wallet.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(WalletService.getBalance(mockUserId)).rejects.toThrow('Wallet not found');
    });
  });

  describe('createTransaction', () => {
    const mockTransaction = {
      id: 'tx123',
      type: 'DEPOSIT',
      amount: 100,
      status: 'PENDING',
      description: 'Test deposit',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create deposit transaction', async () => {
      (prisma.wallet.findUnique as jest.Mock).mockResolvedValue(mockWallet);
      (prisma.transaction.create as jest.Mock).mockResolvedValue(mockTransaction);

      const result = await WalletService.createTransaction(mockUserId, {
        type: 'deposit',
        amount: 100,
        description: 'Test deposit',
      });

      expect(result).toEqual({
        id: 'tx123',
        type: 'deposit',
        amount: 100,
        status: 'pending',
        description: 'Test deposit',
        createdAt: mockTransaction.createdAt.toISOString(),
        updatedAt: mockTransaction.updatedAt.toISOString(),
      });

      expect(prisma.wallet.update).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        data: { balance: 1100 },
      });
    });

    it('should throw error if wallet not found', async () => {
      (prisma.wallet.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        WalletService.createTransaction(mockUserId, {
          type: 'deposit',
          amount: 100,
        })
      ).rejects.toThrow('Wallet not found');
    });

    it('should throw error if insufficient balance for withdrawal', async () => {
      (prisma.wallet.findUnique as jest.Mock).mockResolvedValue(mockWallet);

      await expect(
        WalletService.createTransaction(mockUserId, {
          type: 'withdrawal',
          amount: 2000,
        })
      ).rejects.toThrow('Insufficient balance');
    });
  });

  describe('getTransactionHistory', () => {
    const mockTransactions = [
      {
        id: 'tx1',
        type: 'DEPOSIT',
        amount: 100,
        status: 'COMPLETED',
        description: 'Test deposit',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'tx2',
        type: 'WITHDRAWAL',
        amount: 50,
        status: 'COMPLETED',
        description: 'Test withdrawal',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return paginated transaction history', async () => {
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);
      (prisma.transaction.count as jest.Mock).mockResolvedValue(2);

      const result = await WalletService.getTransactionHistory(mockUserId, 1, 10);

      expect(result).toEqual({
        transactions: mockTransactions.map(t => ({
          id: t.id,
          type: t.type.toLowerCase(),
          amount: Number(t.amount),
          status: t.status.toLowerCase(),
          description: t.description,
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.updatedAt.toISOString(),
        })),
        total: 2,
        page: 1,
        limit: 10,
        hasMore: false,
      });
    });
  });
});
