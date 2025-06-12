import React from 'react';
import BalanceCard from './BalanceCard';
import WalletTransactionList from './WalletTransactionList';
import CoinLockForm from './CoinLockForm';
import SyncBadge from './SyncBadge';

const mockTransactions = [
  { id: '1', date: '2024-06-01', type: 'Deposit', amount: 100, reference: 'Order #123' },
  { id: '2', date: '2024-06-02', type: 'Withdrawal', amount: -50, reference: 'Service Fee' },
];

interface WalletTabsProps {
  activeTab: 'balance' | 'transactions' | 'lock';
  onTabChange: (tab: 'balance' | 'transactions' | 'lock') => void;
}

export default function WalletTabs({ activeTab, onTabChange }: WalletTabsProps) {
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'balance' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => onTabChange('balance')}
        >
          Balance
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'transactions' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => onTabChange('transactions')}
        >
          Transactions
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'lock' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => onTabChange('lock')}
        >
          Lock Coins
        </button>
        <div className="ml-auto flex items-center">
          <SyncBadge status="synced" />
        </div>
      </div>
      {activeTab === 'balance' && (
        <BalanceCard mainBalance={1000} loyaltyBalance={150} lockedEHBGC={500} />
      )}
      {activeTab === 'transactions' && (
        <WalletTransactionList transactions={mockTransactions} page={1} total={2} pageSize={10} />
      )}
      {activeTab === 'lock' && <CoinLockForm onLock={() => {}} />}
    </div>
  );
}
