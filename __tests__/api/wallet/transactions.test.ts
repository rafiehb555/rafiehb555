import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { GET, POST } from '@/app/api/wallet/transactions/route';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  prisma: {
    transaction: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('Wallet Transactions API', () => {
  const mockUser = {
    id: 'user1',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockTransactions = [
    {
      id: 'tx1',
      type: 'deposit',
      amount: 100,
      description: 'Test deposit',
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/wallet/transactions', () => {
    it('should return 401 if not authenticated', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);

      const request = new NextRequest('http://localhost/api/wallet/transactions');
      const response = await GET(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toEqual({ success: false, error: 'Authentication required' });
    });

    it('should return paginated transactions', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({ user: mockUser });
      (prisma.transaction.findMany as jest.Mock).mockResolvedValueOnce(mockTransactions);

      const request = new NextRequest('http://localhost/api/wallet/transactions');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({
        success: true,
        data: {
          transactions: mockTransactions,
          total: mockTransactions.length,
          page: 1,
          limit: 10,
          hasMore: false,
        },
      });
    });
  });

  describe('POST /api/wallet/transactions', () => {
    it('should create a deposit transaction', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({ user: mockUser });
      (prisma.transaction.create as jest.Mock).mockResolvedValueOnce(mockTransactions[0]);

      const request = new NextRequest('http://localhost/api/wallet/transactions', {
        method: 'POST',
        body: JSON.stringify({
          type: 'deposit',
          amount: 100,
          description: 'Test deposit',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({
        success: true,
        data: mockTransactions[0],
      });
    });

    it('should validate transaction data', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({ user: mockUser });

      const request = new NextRequest('http://localhost/api/wallet/transactions', {
        method: 'POST',
        body: JSON.stringify({
          type: 'invalid',
          amount: -100,
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toEqual({
        success: false,
        error: 'Invalid transaction data',
      });
    });
  });
});
