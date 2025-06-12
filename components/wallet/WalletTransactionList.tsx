import React from 'react';

interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  reference: string;
}

interface WalletTransactionListProps {
  transactions: Transaction[];
  page: number;
  total: number;
  pageSize: number;
}

export default function WalletTransactionList({
  transactions,
  page,
  total,
  pageSize,
}: WalletTransactionListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-2">Transaction History</h2>
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="text-left py-2">Date</th>
            <th className="text-left py-2">Type</th>
            <th className="text-left py-2">Amount</th>
            <th className="text-left py-2">Reference</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center text-gray-400 py-4">
                No transactions found.
              </td>
            </tr>
          ) : (
            transactions.map(txn => (
              <tr key={txn.id} className="border-t">
                <td className="py-2">{txn.date}</td>
                <td className="py-2">{txn.type}</td>
                <td className="py-2">{txn.amount}</td>
                <td className="py-2">{txn.reference}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Pagination Placeholder */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-gray-500">
          Page {page} of {Math.ceil(total / pageSize)}
        </span>
        {/* Add pagination controls here if needed */}
      </div>
    </div>
  );
}
