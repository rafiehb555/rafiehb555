import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import type { CreateTransactionRequest, TransactionResponse } from '@/types/api';

export function useWallet() {
  const queryClient = useQueryClient();

  // Get wallet balance
  const { data: balance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: async () => {
      const response = await api.get('/api/wallet/balance');
      return response.data;
    },
  });

  // Get transactions
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['wallet', 'transactions'],
    queryFn: async () => {
      const response = await api.get('/api/wallet/transactions');
      return response.data;
    },
  });

  // Create transaction
  const createTransaction = useMutation({
    mutationFn: async (data: CreateTransactionRequest) => {
      const response = await api.post('/api/wallet/transactions', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      toast.success('Transaction completed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Transaction failed');
    },
  });

  // Get transaction history
  const getTransactionHistory = useQuery({
    queryKey: ['wallet', 'history'],
    queryFn: async () => {
      const response = await api.get('/api/wallet/transactions/history');
      return response.data;
    },
  });

  return {
    balance,
    transactions,
    isLoadingBalance,
    isLoadingTransactions,
    createTransaction,
    getTransactionHistory,
  };
}
