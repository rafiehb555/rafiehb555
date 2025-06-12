import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../lib/prisma';
import { checkSQLLevel, sqlLevelConfigs } from '../checkSQLLevel';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  getSession: jest.fn(),
}));

// Mock prisma
jest.mock('../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    sqlLevelCheck: {
      create: jest.fn(),
    },
  },
}));

describe('checkSQLLevel Middleware', () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      method: 'GET',
      url: '/api/test',
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    (getSession as jest.Mock).mockResolvedValue(null);

    const middleware = checkSQLLevel(sqlLevelConfigs.basic);
    await middleware(mockReq as NextApiRequest, mockRes as NextApiResponse, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'Authentication required',
    });
  });

  it('should return 404 if user is not found', async () => {
    (getSession as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const middleware = checkSQLLevel(sqlLevelConfigs.basic);
    await middleware(mockReq as NextApiRequest, mockRes as NextApiResponse, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'User not found',
    });
  });

  it('should return 403 if user does not meet SQL level requirement', async () => {
    (getSession as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      sqlProfile: { level: 0, isActive: true },
      wallet: { balance: 0 },
      coinLocks: [],
    });

    const middleware = checkSQLLevel(sqlLevelConfigs.basic);
    await middleware(mockReq as NextApiRequest, mockRes as NextApiResponse, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'SQL level 1 required (current: 0)',
      requiredLevel: 1,
      currentLevel: 0,
    });
  });

  it('should pass if user meets all requirements', async () => {
    (getSession as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      sqlProfile: { level: 2, isActive: true },
      wallet: { balance: 2000 },
      coinLocks: [{ id: '1', status: 'active' }],
    });

    const middleware = checkSQLLevel(sqlLevelConfigs.intermediate);
    await middleware(mockReq as NextApiRequest, mockRes as NextApiResponse, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(prisma.sqlLevelCheck.create).toHaveBeenCalledWith({
      data: {
        userId: '1',
        requiredLevel: 2,
        currentLevel: 2,
        passed: true,
        endpoint: '/api/test',
        method: 'GET',
      },
    });
  });

  it('should check wallet balance for premium levels', async () => {
    (getSession as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      sqlProfile: { level: 4, isActive: true },
      wallet: { balance: 1000 },
      coinLocks: [{ id: '1', status: 'active' }],
    });

    const middleware = checkSQLLevel(sqlLevelConfigs.premium);
    await middleware(mockReq as NextApiRequest, mockRes as NextApiResponse, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'Minimum wallet balance of 5000 required',
      requiredBalance: 5000,
      currentBalance: 1000,
    });
  });
});
