import React, { useState } from 'react';
import WalletTabs from '../../components/wallet/WalletTabs';
import BalanceCard from '../../components/wallet/BalanceCard';
import WalletTransactionList from '../../components/wallet/WalletTransactionList';
import CoinLockForm from '../../components/wallet/CoinLockForm';
import SyncBadge from '../../components/wallet/SyncBadge';

// Mock data for demonstration
const mockTransactions = [
  { id: '1', date: '2024-06-01', type: 'Deposit', amount: 100, reference: 'Order #123' },
  { id: '2', date: '2024-06-02', type: 'Withdrawal', amount: -50, reference: 'Service Fee' },
];

export default function WalletDashboard() {
  const [tab, setTab] = useState<'balance' | 'transactions' | 'lock'>('balance');

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">EHB Wallet Overview</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <WalletTabs activeTab={tab} onTabChange={setTab} />
          {tab === 'balance' && (
            <BalanceCard mainBalance={123} loyaltyBalance={80} lockedEHBGC={500} />
          )}
          {tab === 'transactions' && (
            <WalletTransactionList
              transactions={mockTransactions}
              page={1}
              total={2}
              pageSize={10}
            />
          )}
          {tab === 'lock' && <CoinLockForm onLock={() => {}} />}
        </div>
        <div className="w-full md:w-64 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Wallet Info</h2>
          <div className="space-y-2">
            <p>
              Wallet Level: <span className="font-semibold">Verified</span>
            </p>
            <p>
              SQL Status: <span className="font-semibold">Active</span>
            </p>
            <p>
              Last Sync: <span className="font-semibold">Just now</span>
            </p>
            <p>
              Loyalty Reward: <span className="font-semibold">10 EHBGC</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
