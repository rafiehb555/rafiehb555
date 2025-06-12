import React, { useState } from 'react';
import { FiAlertTriangle, FiUser, FiDollarSign, FiCalendar } from 'react-icons/fi';

interface Penalty {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  date: string;
  status: 'pending' | 'paid' | 'cancelled';
}

// Mock data - replace with API call
const mockPenalties: Penalty[] = [
  {
    id: '1',
    userId: 'user123',
    amount: 100,
    reason: 'Late payment for GoSellr franchise',
    date: '2024-03-15T10:30:00Z',
    status: 'pending',
  },
  {
    id: '2',
    userId: 'user456',
    amount: 50,
    reason: 'Violation of community guidelines',
    date: '2024-03-14T15:45:00Z',
    status: 'paid',
  },
];

export default function WalletPenalty() {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'cancelled'>('all');

  const handleSubmit = async () => {
    if (!userId || !amount || !reason || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please fill in all fields with valid values');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement API call to create penalty
      console.log(`Creating penalty for user ${userId}`);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Penalty created successfully!');
      setUserId('');
      setAmount('');
      setReason('');
    } catch (error) {
      alert('Failed to create penalty. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (penaltyId: string, newStatus: Penalty['status']) => {
    try {
      // TODO: Implement API call to update penalty status
      console.log(`Updating penalty ${penaltyId} to ${newStatus}`);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Penalty status updated successfully!');
    } catch (error) {
      alert('Failed to update penalty status. Please try again.');
    }
  };

  const filteredPenalties = mockPenalties.filter(
    penalty => filter === 'all' || penalty.status === filter
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Penalty Management</h2>
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as typeof filter)}
            className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Penalties</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Create Penalty Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Penalty</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                placeholder="Enter user ID"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Enter penalty reason"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            <FiAlertTriangle className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Creating...' : 'Create Penalty'}
          </button>
        </div>
      </div>

      {/* Penalties List */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Penalties List</h3>
        <div className="space-y-4">
          {filteredPenalties.map(penalty => (
            <div
              key={penalty.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-gray-900">User: {penalty.userId}</p>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      penalty.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : penalty.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {penalty.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{penalty.reason}</p>
                <p className="text-sm text-gray-500 mt-1">
                  <FiCalendar className="inline w-4 h-4 mr-1" />
                  {new Date(penalty.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right ml-4">
                <p className="font-medium text-red-600">-{penalty.amount} EHBGC</p>
                {penalty.status === 'pending' && (
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleStatusUpdate(penalty.id, 'paid')}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Mark Paid
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(penalty.id, 'cancelled')}
                      className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warning Box */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <FiAlertTriangle className="h-5 w-5 text-red-400 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-red-800">Admin Only</h4>
            <p className="text-sm text-red-700 mt-1">
              This feature is restricted to administrators. Please ensure you have the necessary
              permissions before creating or modifying penalties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
