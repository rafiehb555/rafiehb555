import React, { useState } from 'react';
import { FiSend, FiUser, FiDollarSign, FiAlertCircle } from 'react-icons/fi';

interface TransferHistory {
  id: string;
  recipient: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

// Mock data - replace with API call
const mockTransferHistory: TransferHistory[] = [
  {
    id: '1',
    recipient: 'user123',
    amount: 100,
    date: '2024-03-15T10:30:00Z',
    status: 'completed',
  },
  {
    id: '2',
    recipient: 'user456',
    amount: 50,
    date: '2024-03-14T15:45:00Z',
    status: 'completed',
  },
];

export default function WalletTransfer() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleTransfer = async () => {
    if (!recipient || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter valid recipient and amount');
      return;
    }

    setIsTransferring(true);
    try {
      // TODO: Implement API call to transfer coins
      console.log(`Transferring ${amount} coins to ${recipient}`);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Transfer successful!');
      setRecipient('');
      setAmount('');
      setNote('');
    } catch (error) {
      alert('Transfer failed. Please try again.');
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Transfer Coins</h2>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {showHistory ? 'Hide History' : 'Show History'}
        </button>
      </div>

      {/* Transfer Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-10 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full pl-10 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-2 text-gray-500">EHBGC</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add a note to your transfer"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleTransfer}
            disabled={isTransferring}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <FiSend className="w-4 h-4 mr-2" />
            {isTransferring ? 'Transferring...' : 'Transfer Coins'}
          </button>
        </div>
      </div>

      {/* Transfer History */}
      {showHistory && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Transfer History</h3>
          <div className="space-y-4">
            {mockTransferHistory.map(transfer => (
              <div
                key={transfer.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">To: {transfer.recipient}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transfer.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">-{transfer.amount} EHBGC</p>
                  <p className="text-sm text-green-600 capitalize">{transfer.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <FiAlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Important</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Transfers are irreversible. Please double-check the recipient username and amount
              before confirming.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
