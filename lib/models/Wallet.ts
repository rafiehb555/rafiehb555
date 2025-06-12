import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

const WalletSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  lockedBalance: { type: Number, default: 0 },
  lockedAmount: { type: Number, default: 0 },
  lockDuration: { type: Number, default: 0 },
  lockStartDate: { type: Date },
  sqlLevel: { type: String },
  transactions: [
    {
      type: { type: String, enum: ['credit', 'debit', 'lock', 'unlock', 'withdrawal', 'order'] },
      amount: Number,
      description: String,
      status: { type: String, enum: ['pending', 'completed', 'failed'] },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  coinLock: { type: Number, default: 0 },
});

export interface Wallet {
  _id: ObjectId;
  userId: string;
  balance: number;
  lockedBalance: number;
  lockedAmount: number;
  lockDuration: number;
  lockStartDate?: Date;
  sqlLevel: string;
  transactions: Transaction[];
  createdAt: Date;
  updatedAt: Date;
  isLocked?: () => boolean;
  coinLock: number;
}

export interface Transaction {
  _id: ObjectId;
  type: 'credit' | 'debit' | 'lock' | 'unlock' | 'withdrawal' | 'order';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface CreateWalletInput {
  userId: string;
  sqlLevel?: string;
}

export interface UpdateWalletInput {
  balance?: number;
  lockedBalance?: number;
  lockedAmount?: number;
  lockDuration?: number;
  lockStartDate?: Date;
  sqlLevel?: string;
}

WalletSchema.methods.isLocked = function (): boolean {
  if (!this.lockStartDate || !this.lockDuration || this.lockedAmount <= 0) return false;
  const now = new Date();
  const unlockDate = new Date(this.lockStartDate);
  unlockDate.setMonth(unlockDate.getMonth() + this.lockDuration);
  return now < unlockDate;
};

export default mongoose.models.Wallet || mongoose.model('Wallet', WalletSchema);

export function calculateLoyaltyBonus(lockedBalance: number): number {
  if (lockedBalance >= 1000) return 0.1; // 10% for platinum
  if (lockedBalance >= 500) return 0.08; // 8% for gold
  if (lockedBalance >= 250) return 0.05; // 5% for silver
  return 0.03; // 3% for bronze
}

export function validateTransaction(
  wallet: Wallet,
  type: Transaction['type'],
  amount: number
): string | null {
  if (amount <= 0) {
    return 'Amount must be greater than 0';
  }

  switch (type) {
    case 'withdrawal':
      if (wallet.balance < amount) {
        return 'Insufficient balance for withdrawal';
      }
      break;
    case 'lock':
      if (wallet.balance < amount) {
        return 'Insufficient balance for locking';
      }
      break;
    case 'unlock':
      if (wallet.lockedBalance < amount) {
        return 'Insufficient locked balance for unlocking';
      }
      break;
    case 'order':
      if (wallet.balance < amount) {
        return 'Insufficient balance for order';
      }
      break;
  }

  return null;
}
