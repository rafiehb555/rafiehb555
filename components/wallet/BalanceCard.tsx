import React from 'react';

interface BalanceCardProps {
  mainBalance: number;
  loyaltyBalance: number;
  lockedEHBGC: number;
}

export default function BalanceCard({
  mainBalance,
  loyaltyBalance,
  lockedEHBGC,
}: BalanceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
      <h2 className="text-lg font-semibold mb-2">Wallet Balances</h2>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Main Wallet</span>
          <span className="font-bold text-indigo-600">{mainBalance} EHBGC</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Loyalty Coins</span>
          <span className="font-bold text-yellow-500">{loyaltyBalance} LC</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Locked EHBGC</span>
          <span className="font-bold text-gray-500">{lockedEHBGC} EHBGC</span>
        </div>
      </div>
    </div>
  );
}
