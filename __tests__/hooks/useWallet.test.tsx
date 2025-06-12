import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWallet } from '@/hooks/useWallet';
import { api } from '@/lib/api';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/api');
jest.mock('@/lib/prisma');

describe('useWallet', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should fetch wallet balance', async () => {
    const mockBalance = { balance: 1000 };
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockBalance });

    const { result } = renderHook(() => useWallet(), { wrapper });

    expect(result.current.isLoadingBalance).toBe(true);

    await act(async () => {
      await result.current.getBalance.refetch();
    });

    expect(result.current.balance).toEqual(mockBalance.balance);
    expect(result.current.isLoadingBalance).toBe(false);
  });

  it('should create a transaction', async () => {
    const mockTransaction = {
      id: 'tx1',
      amount: 100,
      type: 'deposit',
      status: 'completed',
      description: 'Test deposit',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (api.post as jest.Mock).mockResolvedValueOnce({ data: mockTransaction });

    const { result } = renderHook(() => useWallet(), { wrapper });

    await act(async () => {
      await result.current.createTransaction.mutateAsync({
        amount: 100,
        type: 'deposit',
        description: 'Test deposit',
      });
    });

    expect(result.current.createTransaction.isSuccess).toBe(true);
    expect(api.post).toHaveBeenCalledWith('/api/wallet/transactions', {
      amount: 100,
      type: 'deposit',
      description: 'Test deposit',
    });
  });

  it('should fetch transaction history', async () => {
    const mockHistory = {
      transactions: [
        {
          id: 'tx1',
          amount: 100,
          type: 'deposit',
          status: 'completed',
          description: 'Test deposit',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      hasMore: false,
    };

    (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockHistory.transactions);
    (prisma.transaction.count as jest.Mock).mockResolvedValue(1);

    const { result } = renderHook(() => useWallet(), { wrapper });

    await act(async () => {
      await result.current.getTransactionHistory.refetch();
    });

    expect(result.current.getTransactionHistory.data).toEqual(mockHistory);
    expect(result.current.getTransactionHistory.isLoading).toBe(false);
  });
});
