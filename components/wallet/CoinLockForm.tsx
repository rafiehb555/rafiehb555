import React, { useState } from 'react';

interface CoinLockFormProps {
  onLock: (amount: number, period: string) => void;
}

const periods = [
  { label: '1 Month', value: '1m' },
  { label: '3 Months', value: '3m' },
  { label: '6 Months', value: '6m' },
  { label: '12 Months', value: '12m' },
];

export default function CoinLockForm({ onLock }: CoinLockFormProps) {
  const [amount, setAmount] = useState(0);
  const [period, setPeriod] = useState(periods[0].value);

  return (
    <form
      className="bg-white rounded-lg shadow p-6 flex flex-col gap-4"
      onSubmit={e => {
        e.preventDefault();
        onLock(amount, period);
      }}
    >
      <h2 className="text-lg font-semibold mb-2">Lock Coins</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <input
          type="number"
          min={1}
          className="w-full border rounded px-3 py-2"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Lock Period</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={period}
          onChange={e => setPeriod(e.target.value)}
        >
          {periods.map(p => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-indigo-600 text-white rounded px-4 py-2 mt-2 hover:bg-indigo-700"
      >
        Lock Coins
      </button>
    </form>
  );
}
