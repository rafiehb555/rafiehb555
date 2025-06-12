import { User, Wallet, Transaction, SQLProfile, CoinLock } from '@prisma/client';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Wallet Types
export interface WalletResponse {
  balance: number;
  currency: string;
  recentTransactions: Transaction[];
}

export interface TransactionResponse {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// SQL Types
export interface SQLProfileResponse {
  level: number;
  isActive: boolean;
  lastUpgraded?: Date;
  requirements: {
    totalIncome: number;
    referralCount: number;
    loyaltyLock: boolean;
  };
}

export interface SQLUpgradeResponse {
  eligible: boolean;
  currentLevel: number;
  targetLevel: number;
  requirements: {
    totalIncome: number;
    referralCount: number;
    loyaltyLock: boolean;
  };
  missingRequirements: string[];
}

// Coin Lock Types
export interface CoinLockResponse {
  id: string;
  amount: number;
  duration: number;
  startDate: Date;
  endDate: Date;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  bonusRate: number;
  monthlyReward: number;
  totalReward: number;
  nextRewardDate: Date;
}

// User Types
export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  sqlProfile?: SQLProfileResponse;
  wallet?: WalletResponse;
  activeCoinLocks?: CoinLockResponse[];
}

// API Request Types
export interface CreateTransactionRequest {
  type: 'deposit' | 'withdrawal';
  amount: number;
  description?: string;
}

export interface CreateCoinLockRequest {
  amount: number;
  duration: number;
}

export interface SQLUpgradeRequest {
  targetLevel: number;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface WalletBalance {
  balance: number;
  lockedBalance: number;
  availableBalance: number;
  lastUpdated: string;
}

export interface TransactionHistory {
  transactions: TransactionResponse[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
